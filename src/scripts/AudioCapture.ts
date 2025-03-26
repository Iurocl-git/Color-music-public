// AudioCapture.ts
import * as AudioCaptureModule from 'expo-audio-capture';

type FFTData = {
  low: number;
  mid: number;
  high: number;
};

/**
 * Начинает захват аудио и подписывается на события FFTData.
 * @param {Function} onFFTData - Функция-обработчик для данных FFT.
 * @param {string} ip - IP-адрес для отправки UDP-пакетов.
 * @param {number} [port=8888] - Порт для отправки UDP-пакетов.
 * @returns {() => void} - Функция для отмены подписки.
 */
const startCapture = (
  onFFTData: (data: FFTData) => void,
  ip: string,
  port: number = 8888
): (() => void) => {
  try {
    // Устанавливаем конфигурацию UDP
    AudioCaptureModule.setUdpConfig(ip, port);

    // Добавляем слушатель FFT данных
    AudioCaptureModule.addFftDataListener(onFFTData);

    // Начинаем захват
    AudioCaptureModule.startCapture();

    // Возвращаем функцию для отмены подписки
    return () => {
      AudioCaptureModule.removeFftDataListener(onFFTData);
    };
  } catch (error) {
    console.error('Ошибка при запуске захвата:', error);
    throw error;
  }
};

/**
 * Останавливает захват аудио и удаляет все слушатели событий FFTData.
 */
const stopCapture = (): void => {
  try {
    AudioCaptureModule.stopCapture();
  } catch (error) {
    console.error('Ошибка при остановке захвата:', error);
  }
};

export default {
  startCapture,
  stopCapture,
};
