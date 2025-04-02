import { NormalizationMode, setNormalizationMode as setNorMode } from 'expo-audio-capture';
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
        { id: 0, name: 'Recording' },
        { id: 1, name: 'Capture' },
      ]
    : [{ id: 0, name: 'Recording' }];

const enum enumModes {
  One_Zone,
  Three_Zone,
  Five_Zone,
  Line,
  Rainbow_Line,
  Raindrop,
}
type NormalizationModeArray = { id: NormalizationMode; name: string };
const normalizationModes: NormalizationModeArray[] = [
  { id: 'default', name: 'Default' },
  { id: 'log', name: 'Logarithmic' },
  { id: 'adaptive', name: 'Adaptive' },
];

// Define a mapping from enum mode keys to their names and specific codes
const modes = {
  [enumModes.One_Zone]: { name: 'One Zone', code: 5 },
  [enumModes.Three_Zone]: { name: 'Three Zones', code: 4 },
  [enumModes.Five_Zone]: { name: 'Five Zones', code: 9 },
  [enumModes.Raindrop]: { name: 'Raindrops', code: 6 },
  [enumModes.Line]: { name: 'Line', code: 7 },
  [enumModes.Rainbow_Line]: { name: 'Rainbow Line', code: 8 },
};

const modesArray = [
  { id: enumModes.One_Zone, name: 'One Zone' },
  { id: enumModes.Three_Zone, name: 'Three Zones' },
  { id: enumModes.Five_Zone, name: 'Five Zones' },
  { id: enumModes.Raindrop, name: 'Raindrops' },
  { id: enumModes.Line, name: 'Line' },
  { id: enumModes.Rainbow_Line, name: 'Rainbow Line' },
];

export default function MusicModeScreen() {
  const setSocket = useWebSocketStore((state) => state.setSocket);
  const socket = useWebSocketStore((state) => state.socket);
  const ip = useWebSocketStore((state) => state.ip);
  const secure = useWebSocketStore((state) => state.secure);

  const [isRecording, setIsRecording] = useState(false);
  const [capture, setCapture] = useState(false);

  const [mode, setMode] = useState<enumModes>(enumModes.Line);
  const [audioMode, setAudioMode] = useState('Capture');
  const [normalizationMode, setNormalizationMode] = useState<NormalizationMode>('default');

  const [sensitivity, setSensitivity] = useState(100);
  const [pulseDecay, setPulseDecay] = useState(5);
  const [brightness, setBrightness] = useState(50);
  const [ledStart, setLedStart] = useState(0);
  const [rainbowSpeed, setRainbowSpeed] = useState(100);
  const [waveWidth, setWaveWidth] = useState(100);
  const [sensitivityLOW, setSensitivityLOW] = useState(100);
  const [sensitivityMID, setSensitivityMID] = useState(100);
  const [sensitivityHIGH, setSensitivityHIGH] = useState(100);
  const [audioTrashHold, setAudioTrashHold] = useState(3000);
  const [maxDrops, setMaxDrops] = useState(15);
  const [dropSpeed, setDropSpeed] = useState(0.1);
  const [dropInterval, setDropInterval] = useState(100);
  const [centerZone, setCenterZone] = useState(20);
  const [dropWidth, setDropWidth] = useState(8);
  const [fadeStyle, setFadeStyle] = useState(1);

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
    // console.log(type);
    const message = JSON.stringify({
      command: 'parameterChange',
      name: type,
      value,
    });
    sendMessage(message);
  };

  const sendMessage = (message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error('WebSocket is not connected');
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
      // if (data.mid > 50 || data.low > 50 || data.high > 50)
      //   console.log(`Sent: low: ${data.low}, mid: ${data.mid}, high: ${data.high}`);
      // sendMessage(message);
    } catch (error) {
      console.error('Error handling FFT data:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-800 p-4">
      <ScrollView>
        <View className="mb-8 flex-row justify-between">
          <Text className="text-2xl font-bold text-white">Music Visualization Mode</Text>
          <TouchableOpacity onPress={() => setSocket(connectWebSocket(ip, secure))}>
            <Image source={icons.refresh} className="h-10 w-12" resizeMode="contain" />
            {/*<Image source={{uri: "@/assets/icons/refresh_img.png"}} className="w-12 h-10" resizeMode="cover" />*/}
          </TouchableOpacity>
        </View>

        {/* Select mode */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between">
            <Text className="mb-2 mt-4 text-lg font-semibold text-white ">Select Mode</Text>
            <CustomCheckbox
              label="Detailed"
              isChecked={detailedConfiguration}
              onChange={(checked) => setDetailedConfiguration(checked)}
            />
          </View>

          <View>
            <>
              <Text className="mb-2 ml-4 text-base font-semibold text-white">LED Strip Mode</Text>
              <DropDown
                header="Select mode"
                list={modesArray}
                onChange={(_, selected_id) => {
                  setMode(selected_id);
                  sendMode(selected_id);
                }}
              />
            </>
            <>
              <Text className="mb-2 ml-4 mt-8 text-base font-semibold text-white">
                Select Recording Mode
              </Text>
              <DropDown
                header={audioMode || 'Select mode'}
                list={captureMods}
                onChange={(selected) => {
                  setAudioMode(selected);
                }}
              />
            </>
            <>
              <Text className="mb-2 ml-4 mt-8 text-base font-semibold text-white">
                Select normalization mode
              </Text>
              <DropDown
                header="Default"
                list={normalizationModes}
                onChange={(_, selected_id) => {
                  console.log(selected_id);
                  // @ts-ignore
                  setNorMode(selected_id);
                  // @ts-ignore
                  setNormalizationMode(selected_id);
                }}
              />
            </>
          </View>
        </View>

        {audioMode === 'Capture' && (
          <View>
            <View className="mt-4">
              <Button
                title={capture ? 'Stop Capture' : 'Start Capture'}
                onPress={capture ? stopAudioCapture : startAudioCapture}
              />
            </View>
          </View>
        )}

        {audioMode === 'Recording' && (
          <View>
            <View className="mt-8">
              <Button
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
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
            }}
            onSlidingComplete={setBrightness}
            isPercent
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
            }}
            onSlidingComplete={setSensitivity}
            isPercent
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
              }}
              onSlidingComplete={setPulseDecay}
              isPercent
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
                }}
                onSlidingComplete={setRainbowSpeed}
                isPercent
              />
              <CustomSlider
                containerStyle="mt-8"
                title={parameters[enumParameters.WaveWidth].name}
                minimumValue={parameters[enumParameters.WaveWidth].min}
                maximumValue={parameters[enumParameters.WaveWidth].max}
                value={waveWidth}
                onValueChange={(value) => {
                  sendParameter(enumParameters.WaveWidth, value);
                }}
                onSlidingComplete={setWaveWidth}
                isPercent
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
              }}
              onSlidingComplete={setLedStart}
            />
          )}

          {mode === enumModes.Raindrop && (
            <>
              <Text className="mb-2 ml-4 mt-8 text-base font-semibold text-white">Fade Style</Text>
              <DropDown
                header="Select Style"
                list={parameters[enumParameters.FadeStyle].options}
                onChange={(_, selected_id) => {
                  setFadeStyle(selected_id);
                  sendParameter(enumParameters.FadeStyle, selected_id);
                }}
              />

              <CustomSlider
                title={parameters[enumParameters.MaxDrops].name}
                minimumValue={parameters[enumParameters.MaxDrops].min}
                maximumValue={parameters[enumParameters.MaxDrops].max}
                step={1}
                value={maxDrops}
                containerStyle="mt-8"
                onValueChange={(val) => sendParameter(enumParameters.MaxDrops, val)}
                onSlidingComplete={setMaxDrops}
              />

              <CustomSlider
                title={parameters[enumParameters.DropSpeed].name}
                minimumValue={parameters[enumParameters.DropSpeed].min}
                maximumValue={parameters[enumParameters.DropSpeed].max}
                step={0.01}
                value={dropSpeed}
                containerStyle="mt-8"
                onValueChange={(val) => sendParameter(enumParameters.DropSpeed, val)}
                onSlidingComplete={setDropSpeed}
              />

              <CustomSlider
                title={parameters[enumParameters.DropInterval].name}
                minimumValue={parameters[enumParameters.DropInterval].min}
                maximumValue={parameters[enumParameters.DropInterval].max}
                step={10}
                value={dropInterval}
                containerStyle="mt-8"
                onValueChange={(val) => sendParameter(enumParameters.DropInterval, val)}
                onSlidingComplete={setDropInterval}
              />

              <CustomSlider
                title={parameters[enumParameters.CenterZone].name}
                minimumValue={parameters[enumParameters.CenterZone].min}
                maximumValue={parameters[enumParameters.CenterZone].max}
                step={1}
                value={centerZone}
                containerStyle="mt-8"
                onValueChange={(val) => sendParameter(enumParameters.CenterZone, val)}
                onSlidingComplete={setCenterZone}
              />

              <CustomSlider
                title={parameters[enumParameters.DropWidth].name}
                minimumValue={parameters[enumParameters.DropWidth].min}
                maximumValue={parameters[enumParameters.DropWidth].max}
                step={1}
                value={dropWidth}
                containerStyle="mt-8"
                onValueChange={(val) => sendParameter(enumParameters.DropWidth, val)}
                onSlidingComplete={setDropWidth}
              />
            </>
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
                }}
                onSlidingComplete={setSensitivityLOW}
                isPercent
              />
              <CustomSlider
                title={parameters[enumParameters.SensitivityMID].name}
                minimumValue={parameters[enumParameters.SensitivityMID].min}
                maximumValue={parameters[enumParameters.SensitivityMID].max}
                value={sensitivityMID}
                containerStyle="mt-8"
                onValueChange={(value) => {
                  sendParameter(enumParameters.SensitivityMID, value / 100);
                }}
                onSlidingComplete={setSensitivityMID}
                isPercent
              />
              <CustomSlider
                title={parameters[enumParameters.SensitivityHIGH].name}
                minimumValue={parameters[enumParameters.SensitivityHIGH].min}
                maximumValue={parameters[enumParameters.SensitivityHIGH].max}
                value={sensitivityHIGH}
                containerStyle="mt-8"
                onValueChange={(value) => {
                  sendParameter(enumParameters.SensitivityHIGH, value / 100);
                }}
                onSlidingComplete={setSensitivityHIGH}
                isPercent
              />

              <CustomSlider
                title={parameters[enumParameters.AudioTrashHold].name}
                minimumValue={parameters[enumParameters.AudioTrashHold].min}
                maximumValue={parameters[enumParameters.AudioTrashHold].max}
                value={audioTrashHold}
                containerStyle="mt-8"
                onValueChange={(value) => {
                  sendParameter(enumParameters.AudioTrashHold, value);
                }}
                onSlidingComplete={setAudioTrashHold}
              />
            </>
          )}
          <View className="mb-16" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
