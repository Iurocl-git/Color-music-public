package expo.modules.audiocapture;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;
//import com.iurocl.Colormusic.R; // Убедитесь, что используете правильный путь к вашему пакету

//import com.iurocl.Colormusic.MainActivity;

public class MediaProjectionService extends Service {
    public static final String CHANNEL_ID = "MediaProjectionServiceChannel";

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startForegroundService();
        return START_NOT_STICKY;
    }

    private void startForegroundService() {
        Intent notificationIntent = new Intent(this, MainActivity.class); // Замените на вашу основную активность
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this,
            0,
            notificationIntent,
            PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
        );

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Захват экрана")
                .setContentText("Захват экрана запущен")
                .setSmallIcon(R.mipmap.ic_launcher) // Убедитесь, что иконка существует в mipmap
                .setContentIntent(pendingIntent)
                .build();

        startForeground(1, notification);
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}
