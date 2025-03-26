package expo.modules.audiocapture

import android.app.Activity;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioPlaybackCaptureConfiguration;
import android.media.AudioRecord;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.util.Log;

import android.os.Handler;
import android.os.Looper;

// import org.jtransforms.fft.DoubleFFT_1D;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

import android.content.Intent;

@RequiresApi(api = Build.VERSION_CODES.Q)
public class AudioCaptureModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final int REQUEST_CODE = 1001;
    private Promise permissionPromise;
    private MediaProjectionManager projectionManager;
    private MediaProjection mediaProjection;
    private AudioRecord recorder;
    private Thread recordingThread;
    private boolean isRecording = false;
    private ReactApplicationContext reactContext;
    private static final String TAG = "AudioCaptureModule";

    private DatagramSocket udpSocket;
    private InetAddress ipAddress;
    private int udpPort = 8888; // Порт по умолчанию

    // Добавим переменную для нормализации
    private double maxAmplitude = 1000.0;
    private double lowMaxAmplitude = 1.0;   // Максимальная амплитуда для низких частот
    private double midMaxAmplitude = 1.0;   // Максимальная амплитуда для средних частот
    private double highMaxAmplitude = 1.0;
    private int fhtSize = 1024;
    private double[] previousData = new double[fhtSize];

    public AudioCaptureModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        projectionManager = (MediaProjectionManager) reactContext.getSystemService(ReactApplicationContext.MEDIA_PROJECTION_SERVICE);
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "AudioCapture";
    }

    // Метод для установки IP и порта через WebSocket
    @ReactMethod
    public void setUdpConfig(String ip, int port) {
        try {
            ipAddress = InetAddress.getByName(ip);
            udpPort = port;
            Log.d(TAG, "UDP Config set: IP = " + ip + ", Port = " + port);
        } catch (Exception e) {
            Log.e(TAG, "Invalid IP or Port", e);
        }
    }

    @ReactMethod
    public void requestCapturePermission(Promise promise) {
        if (getCurrentActivity() == null) {
            promise.reject("Activity doesn't exist");
            return;
        }

        permissionPromise = promise;
        Intent intent = projectionManager.createScreenCaptureIntent();
        getCurrentActivity().startActivityForResult(intent, REQUEST_CODE);
    }

    @ReactMethod
    public void startCapture(String ip, int port) {
        if (mediaProjection == null) {
            Log.e(TAG, "MediaProjection is null");
            return;
        }

        setUdpConfig(ip, port);

        AudioPlaybackCaptureConfiguration config = new AudioPlaybackCaptureConfiguration.Builder(mediaProjection)
                .addMatchingUsage(AudioAttributes.USAGE_MEDIA)
                .build();

        int bufferSize = fhtSize * 2; // PCM_16BIT, 2 байта на сэмпл

        recorder = new AudioRecord.Builder()
                .setAudioFormat(new AudioFormat.Builder()
                        .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                        .setSampleRate(44100) // Частота дискретизации 44.1 кГц
                        .setChannelMask(AudioFormat.CHANNEL_IN_MONO)
                        .build())
                .setBufferSizeInBytes(fhtSize)
                .setAudioPlaybackCaptureConfig(config)
                .build();

        recorder.startRecording();
        isRecording = true;

        recordingThread = new Thread(() -> readAudioData(bufferSize, fhtSize), "AudioRecorder Thread");
        recordingThread.start();
    }

    @ReactMethod
    public void stopCapture() {
        if (recorder != null) {
            isRecording = false;
            recorder.stop();
            recorder.release();
            recorder = null;
            recordingThread = null;
        }
    }

    private void readAudioData(int bufferSize, int fhtSize) {
        short[] audioBuffer = new short[bufferSize / 2]; // PCM_16BIT, 2 байта на сэмпл
        int readSamples;

        while (isRecording) {
            readSamples = recorder.read(audioBuffer, 0, audioBuffer.length);
            if (readSamples > 0) {
                double[] currentData = new double[fhtSize];
                for (int i = 0; i < fhtSize; i++) {
                    if (i < readSamples) {
                        currentData[i] = audioBuffer[i];
                    } else {
                        currentData[i] = 0.0;
                    }
                }

                double[] combinedData = new double[fhtSize * 2];
                System.arraycopy(previousData, 0, combinedData, 0, fhtSize);
                System.arraycopy(currentData, 0, combinedData, fhtSize, fhtSize);

                performFHT(combinedData);

                System.arraycopy(currentData, 0, previousData, 0, fhtSize);

                double[] magnitudes = new double[combinedData.length / 2];
                for (int i = 0; i < combinedData.length / 2; i++) {
                    magnitudes[i] = Math.abs(combinedData[i]);
                }

                double lowSum = 0;
                double midSum = 0;
                double highSum = 0;
                double freqResolution = 44100.0 / combinedData.length;

                for (int i = 0; i < fhtSize / 2; i++) {
                    double freq = i * freqResolution;
                    if (freq >= 20 && freq < 250) {
                        lowSum += magnitudes[i];
                    } else if (freq >= 250 && freq < 2000) {
                        midSum += magnitudes[i];
                    } else if (freq >= 2000 && freq <= 20000) {
                        highSum += magnitudes[i];
                    }
                }

                int normalizedLow = (int) Math.min(255, (lowSum / 230 / 64654) * 255 ); // 43103
                int normalizedMid = (int) Math.min(255, (midSum / 1750 / 8427) * 255 ); // 5618
                int normalizedHigh = (int) Math.min(255, (highSum / 18000 / 1351) * 255 ); // 901

                String amplitudeData = "{ \"low\": " + normalizedLow + ", \"mid\": " + normalizedMid + ", \"sum\": " + lowMaxAmplitude / 230 + ", \"high\": " + normalizedHigh + " }";
                sendEvent(reactContext, "FFTData", amplitudeData);

                // Отправка аудиоданных по UDP
                if (ipAddress != null) {
                    sendUdpData(normalizedLow, normalizedMid, normalizedHigh);
                }

                try {
                    Thread.sleep(5);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private void sendUdpData(int low, int mid, int high) {
        try {
            String message = "low:" + low + ", mid:" + mid + ", high:" + high;
            byte[] data = message.getBytes();
            DatagramPacket packet = new DatagramPacket(data, data.length, ipAddress, udpPort);
            udpSocket = new DatagramSocket();
            udpSocket.send(packet);
            udpSocket.close();
        } catch (Exception e) {
            Log.e(TAG, "Error sending UDP packet", e);
        }
    }

    private void performFHT(double[] data) {
        // Реализация алгоритма FHT (оставлена без изменений)
        int n = data.length;
        int n2 = n / 2;
        int j = 0;
        for (int i = 1; i < n - 1; i++) {
            int k = n2;
            while (j >= k) {
                j -= k;
                k /= 2;
            }
            j += k;
            if (i < j) {
                double temp = data[i];
                data[i] = data[j];
                data[j] = temp;
            }
        }
        int step;
        for (step = 1; step < n; step <<= 1) {
            double theta = Math.PI / step;
            double wtemp = Math.sin(0.5 * theta);
            double wpr = -2.0 * wtemp * wtemp;
            double wpi = Math.sin(theta);
            double wr = 1.0;
            double wi = 0.0;
            for (int m = 0; m < step; m++) {
                for (int i = m; i < n; i += (step << 1)) {
                    int j1 = i + step;
                    double tempr = wr * data[j1];
                    double tempi = wi * data[j1];
                    data[j1] = data[i] - tempr;
                    data[i] += tempr;
                }
                double wtemp2 = wr;
                wr = wtemp2 * wpr - wi * wpi + wr;
                wi = wi * wpr + wtemp2 * wpi + wi;
            }
        }
    }

    private void sendEvent(ReactApplicationContext reactContext, String eventName, String data) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, data);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                Intent serviceIntent = new Intent(getReactApplicationContext(), MediaProjectionService.class);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    getReactApplicationContext().startForegroundService(serviceIntent);
                } else {
                    getReactApplicationContext().startService(serviceIntent);
                }
                new Handler(Looper.getMainLooper()).postDelayed(() -> {
                    Log.d(TAG, "Obtaining MediaProjection");
                    mediaProjection = projectionManager.getMediaProjection(resultCode, data);
                    permissionPromise.resolve(true);
                }, 1000);
            } else {
                permissionPromise.reject("Permission denied");
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        // Не используется в данном случае
    }
}
