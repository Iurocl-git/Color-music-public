import React, { useState } from 'react';
import { Platform, View, Text, TouchableOpacity, Image, Button, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomCheckbox from '@/components/CustomCheckbox';
import DropDown from '@/components/DropDown';
import CustomSlider from '@/components/Slider';
import { icons } from '@/constants';
import { enumParameters, parameters } from '@/constants/Parameters';
import AudioCapture from '@/scripts/AudioCapture';
import { connectWebSocket } from '@/scripts/web_socket';
import { useWebSocketStore } from '@/store';

const captureMods =
  Platform.OS !== 'ios'
    ? [
        { id: 0, name: 'Запись' },
        { id: 1, name: 'Захват' },
      ]
    : [{ id: 0, name: 'Запись' }];
const enum enumModes {
  One_Zone,
  Three_Zone,
  Five_Zone,
  Line,
  Rainbow_Line,
  Raindrop,
}

const modes = {
  [enumModes.One_Zone]: { name: 'Одна зона', code: 5 },
  [enumModes.Three_Zone]: { name: 'Три зоны', code: 4 },
  [enumModes.Five_Zone]: { name: 'Пять зон', code: 9 },
  [enumModes.Raindrop]: { name: 'Капли', code: 6 },
  [enumModes.Line]: { name: 'Линия', code: 7 },
  [enumModes.Rainbow_Line]: { name: 'Линия радуга', code: 8 },
};

const modesArray = [
  { id: enumModes.One_Zone, name: 'Одна зона' },
  { id: enumModes.Three_Zone, name: 'Три зоны' },
  { id: enumModes.Five_Zone, name: 'Пять зон' },
  { id: enumModes.Raindrop, name: 'Капли' },
  { id: enumModes.Line, name: 'Линия' },
  { id: enumModes.Rainbow_Line, name: 'Линия радуга' },
];

export default function MusicModeScreen() {
  const setSocket = useWebSocketStore((state) => state.setSocket);
  const socket = useWebSocketStore((state) => state.socket);
  const ip = useWebSocketStore((state) => state.ip);

  const [isRecording, setIsRecording] = useState(false);
  const [capture, setCapture] = useState(false);

  const [mode, setMode] = useState<enumModes>(enumModes.Line);
  const [audioMode, setAudioMode] = useState('Захват');

  const [sensitivity, setSensitivity] = useState(100);
  const [pulseDecay, setPulseDecay] = useState(5);
  const [brightness, setBrightness] = useState(50);
  const [ledStart, setLedStart] = useState(0);
  const [rainbowSpeed, setRainbowSpeed] = useState(100);
  const [waveWidth, setWaveWidth] = useState(100);
  const [sensitivityLOW, setSensitivityLOW] = useState(100);
  const [sensitivityMID, setSensitivityMID] = useState(100);
  const [sensitivityHIGH, setSensitivityHIGH] = useState(100);

  const [detailedConfiguration, setDetailedConfiguration] = useState(false);

  const startAudioCapture = async () => {
    try {
      setCapture(true);
      AudioCapture.startCapture(handleFFTData, ip, 8888);
    } catch (error) {
      console.error(error);
    }
  };

  const stopAudioCapture = async () => {
    try {
      AudioCapture.stopCapture();

      setCapture(false);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMode = (mode: enumModes) => {
    const message = JSON.stringify({
      command: 'changeMode',
      mode: modes[mode].code,
    });
    sendMessage(message);
  };

  const sendParameter = (type: enumParameters, value: number) => {
    // const parameter = value;
    // const valueS = parameter.toString();
    const message = JSON.stringify({
      command: 'parameterChange',
      name: parameters[type].name,
      value,
    });
    sendMessage(message);
  };

  const sendMessage = (message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error('WebSocket не подключен');
    }
  };

  const handleFFTData = (data: { low: number; mid: number; high: number }) => {
    try {
      // const { low, mid, high } = data;
      // const message = JSON.stringify({
      //   command: "audio",
      //   LFA: low,
      //   MFA: mid,
      //   HFA: high,
      // });
      // console.log(data);
      // if (data.mid > 50) console.log(data.mid);
      // sendMessage(message);
    } catch (error) {
      console.error('Error handling FFT data:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-800 p-4">
      <ScrollView>
        <View className="mb-8 flex-row justify-between">
          <Text className="text-2xl font-bold text-white">Режим светомузыки</Text>
          <TouchableOpacity onPress={() => setSocket(connectWebSocket(ip))}>
            <Image source={icons.refresh} className="h-10 w-12" resizeMode="contain" />
            {/*<Image source={{uri: "@/assets/icons/refresh_img.png"}} className="w-12 h-10" resizeMode="cover" />*/}
          </TouchableOpacity>
        </View>

        {/* Выбор режима */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between">
            <Text className="mb-2 mt-4 text-lg font-semibold text-white ">Выберите режим</Text>
            <CustomCheckbox
              label="Detailed"
              isChecked={detailedConfiguration}
              onChange={(checked) => setDetailedConfiguration(checked)}
            />
          </View>

          <View>
            <Text className="mb-2 ml-4 text-base font-semibold text-white">Режим ленты</Text>
            <DropDown
              header="Select mode"
              list={modesArray}
              onChange={(_, selected_id) => {
                setMode(selected_id);
                sendMode(selected_id);
              }}
            />
            <Text className="mb-2 ml-4 mt-8 text-base font-semibold text-white">
              Выберите режим записи
            </Text>

            <DropDown
              header={audioMode || 'Select mode'}
              list={captureMods}
              onChange={(selected) => {
                setAudioMode(selected);
              }}
            />
          </View>
        </View>

        {audioMode === 'Захват' && (
          <View>
            <View className="mt-4">
              <Button
                title={capture ? 'Остановить захват' : 'Начать захват'}
                onPress={capture ? stopAudioCapture : startAudioCapture}
              />
            </View>
          </View>
        )}

        {audioMode === 'Запись' && (
          <View>
            <View className="mt-8">
              <Button
                title={isRecording ? 'Остановить запись' : 'Начать запись'}
                onPress={isRecording ? () => setIsRecording(false) : () => setIsRecording(true)}
              />
            </View>
          </View>
        )}

        {/* Управление */}
        <View className="mt-8">
          <CustomSlider
            title={parameters[enumParameters.Brightness].name}
            minimumValue={parameters[enumParameters.Brightness].min}
            maximumValue={parameters[enumParameters.Brightness].max}
            containerStyle="mt-8"
            step={1}
            value={brightness}
            onValueChange={(value) => {
              sendParameter(enumParameters.Brightness, value);
              setBrightness(value);
            }}
          />
          {/* Управление чувствительностью */}
          <CustomSlider
            title={parameters[enumParameters.Sensitivity].name}
            minimumValue={parameters[enumParameters.Sensitivity].min}
            maximumValue={parameters[enumParameters.Sensitivity].max}
            value={Math.round(sensitivity)}
            // value={sensitivity}
            step={0.5}
            containerStyle="mt-8"
            onValueChange={(value) => {
              sendParameter(enumParameters.Sensitivity, value / 100);
              setSensitivity(value);
            }}
          />
          {(mode === enumModes.One_Zone ||
            mode === enumModes.Three_Zone ||
            mode === enumModes.Five_Zone) && (
            <CustomSlider
              title={parameters[enumParameters.PulseDecay].name}
              minimumValue={parameters[enumParameters.PulseDecay].min}
              maximumValue={parameters[enumParameters.PulseDecay].max}
              value={pulseDecay}
              step={1}
              lowerLimit={5}
              containerStyle="mt-8"
              onValueChange={(value) => {
                sendParameter(enumParameters.PulseDecay, 1 - value / 100);
                setPulseDecay(value);
              }}
            />
          )}

          {mode === enumModes.Rainbow_Line && (
            <>
              <CustomSlider
                containerStyle="mt-8"
                title={parameters[enumParameters.RainbowSpeed].name}
                minimumValue={parameters[enumParameters.RainbowSpeed].min}
                maximumValue={parameters[enumParameters.RainbowSpeed].max}
                value={rainbowSpeed}
                onValueChange={(value) => {
                  sendParameter(enumParameters.RainbowSpeed, value / 100);
                  setRainbowSpeed(value);
                }}
              />
              <CustomSlider
                containerStyle="mt-8"
                title={parameters[enumParameters.WaveWidth].name}
                minimumValue={parameters[enumParameters.WaveWidth].min}
                maximumValue={parameters[enumParameters.WaveWidth].max}
                value={waveWidth}
                onValueChange={(value) => {
                  sendParameter(enumParameters.WaveWidth, value);
                  setWaveWidth(value);
                }}
              />
            </>
          )}

          {(mode === enumModes.Three_Zone ||
            mode === enumModes.Five_Zone ||
            mode === enumModes.Line ||
            mode === enumModes.Rainbow_Line) && (
            <CustomSlider
              title={parameters[enumParameters.LedStart].name}
              minimumValue={parameters[enumParameters.LedStart].min}
              maximumValue={parameters[enumParameters.LedStart].max}
              value={ledStart}
              containerStyle="mt-8"
              onValueChange={(value) => {
                sendParameter(enumParameters.LedStart, value);
                setLedStart(value);
              }}
            />
          )}

          {detailedConfiguration && (
            <>
              <CustomSlider
                title={parameters[enumParameters.SensitivityLOW].name}
                minimumValue={parameters[enumParameters.SensitivityLOW].min}
                maximumValue={parameters[enumParameters.SensitivityLOW].max}
                value={sensitivityLOW}
                containerStyle="mt-8"
                onValueChange={(value) => {
                  sendParameter(enumParameters.SensitivityLOW, value / 100);
                  setSensitivityLOW(value);
                }}
              />
              <CustomSlider
                title={parameters[enumParameters.SensitivityMID].name}
                minimumValue={parameters[enumParameters.SensitivityMID].min}
                maximumValue={parameters[enumParameters.SensitivityMID].max}
                value={sensitivityMID}
                containerStyle="mt-8"
                onValueChange={(value) => {
                  sendParameter(enumParameters.SensitivityMID, value / 100);
                  setSensitivityMID(value);
                }}
              />
              <CustomSlider
                title={parameters[enumParameters.SensitivityHIGH].name}
                minimumValue={parameters[enumParameters.SensitivityHIGH].min}
                maximumValue={parameters[enumParameters.SensitivityHIGH].max}
                value={sensitivityHIGH}
                containerStyle="mt-8"
                onValueChange={(value) => {
                  sendParameter(enumParameters.SensitivityHIGH, value / 100);
                  setSensitivityHIGH(value);
                }}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
