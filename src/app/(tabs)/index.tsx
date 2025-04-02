import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ColorPicker from 'react-native-wheel-color-picker';

import DropDown from '@/components/DropDown';
import InputField from '@/components/InputField';
import CustomSlider from '@/components/Slider';
import { icons } from '@/constants';
import { enumParameters, parameters } from '@/constants/Parameters';
import { connectWebSocket } from '@/scripts/web_socket';
import { useWebSocketStore } from '@/store';
import CustomCheckbox from '@/components/CustomCheckbox';

const enum enumModes {
  Static = 0,
  Flicker = 1,
  Rainbow = 2,
  Strobe = 3,
}

const modes = [
  { id: enumModes.Static, name: 'Статик' },
  { id: enumModes.Flicker, name: 'Мерцание' },
  { id: enumModes.Rainbow, name: 'Радуга' },
  { id: enumModes.Strobe, name: 'Стробоскоп' },
];

const Home = () => {
  const [brightness, setBrightness] = useState(50);
  const [changeSpeed, setChangeSpeed] = useState(10);
  const [rainbowSpeed, setRainbowSpeed] = useState(100);
  const [waveWidth, setWaveWidth] = useState(100);
  const [flickerSpeed, setFlickerSpeed] = useState(5);
  const [strobeFrequency, setStrobeFrequency] = useState(100);
  const [color, setColor] = useState('');
  const [mode, setMode] = useState<enumModes>(enumModes.Static);
  const [socketIP, setSocketIP] = useState('192.168.85.51');

  const setSocket = useWebSocketStore((state) => state.setSocket);
  const socket = useWebSocketStore((state) => state.socket);
  const setIP = useWebSocketStore((state) => state.setIP);
  const secure = useWebSocketStore((state) => state.secure);
  const setSecure = useWebSocketStore((state) => state.setSecure);

  const hexToRGB = (hex: string) => {
    // Remove the '#' symbol if it exists
    hex = hex.replace(/^#/, '');

    // Convert the string into separate RGB components
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
  };

  const sendColorChange = (newColor?: any) => {
    const { r, g, b } = hexToRGB(newColor || color);
    const message = JSON.stringify({
      command: 'changeColor',
      color: { r, g, b },
    });

    sendMessage(message);
  };

  const sendMode = (mode: number) => {
    // console.log(mode);
    const message = JSON.stringify({
      command: 'changeMode',
      mode,
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

  const sendParameter = (type: enumParameters, value: number) => {
    // console.log(type);
    const message = JSON.stringify({
      command: 'parameterChange',
      name: type,
      value,
    });
    sendMessage(message);
  };

  return (
    <SafeAreaView className="bg-gray-800">
      <ScrollView>
        <View className="p-4">
          <View className="mb-8 flex-row justify-between">
            <Text className="text-2xl font-bold text-white">LED Strip Control</Text>
            <TouchableOpacity onPress={() => setSocket(connectWebSocket(socketIP, secure))}>
              <Image source={icons.refresh} className="h-10 w-12" resizeMode="contain" />
              {/*<Image source={{uri: "@/assets/icons/refresh_img.png"}} className="w-12 h-10" resizeMode="cover" />*/}
            </TouchableOpacity>
          </View>

          <View>
            <View className="flex-row items-center justify-between">
              <Text className="mb-2 mt-4 text-lg font-semibold text-white ">IP address or domain</Text>
              <CustomCheckbox
                label="Secure"
                isChecked={secure}
                onChange={(checked) => setSecure(checked)}
              />
            </View>
            <InputField
              // label="IP address or domain"
              placeholder="192.168.85.51"
              value={socketIP}
              containerStyle="bg-orange-400 border-0 "
              inputStyle="p-3"
              labelStyle="text-white ml-2 text-lg"
              // keyboardType="numeric"
              onChangeText={(ip) => {
                setSocketIP(ip);
                setIP(ip);
              }}
            />
          </View>
          {/* Dropdown select */}
          <View className="mb-8">
            <Text className="mb-4 mt-4 text-lg font-semibold text-white">Operating Modes</Text>
            <DropDown
              header="Select mode"
              list={modes}
              onChange={(_selected, selected_id) => {
                setMode(selected_id);
                sendMode(selected_id);
              }}
            />
          </View>

          {/* Индивидуальный выбор цвета */}
          <View className="h-[70vh] w-full flex-1">
            <Text className="mb-2 text-lg font-semibold text-white">Select Color</Text>
            <ColorPicker
              thumbSize={50}
              sliderSize={50}
              swatches={false}
              onColorChange={(color) => {
                sendColorChange(color);
              }}
              // onColorChangeComplete = {(value) =s> setColor(value)}
              useNativeLayout
              color={color}
            />
            <View className="my-6 flex-row justify-between">
              {['#FF0004', '#005401', '#2D1FC6', '#EDCE04', '#D1670A', '#D309E5', '#FFFFFF'].map(
                (newColor) => (
                  <TouchableOpacity
                    key={newColor}
                    className="h-12 w-12 rounded-full"
                    style={{ backgroundColor: `${newColor}` }}
                    onPress={() => {
                      if (color === newColor) {
                        const colorValue = parseInt(newColor.replace('#', ''), 16);
                        const newValue = Math.max(colorValue - 1, 0);
                        // Convert back to hexadecimal format
                        setColor(`#${newValue.toString(16).padStart(6, '0').toUpperCase()}`);
                        // setColor(`${newColor}`);
                      } else setColor(`${newColor}`);
                      // sendColorChange(color);
                    }}
                  />
                )
              )}
            </View>
          </View>

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

          <CustomSlider
            title={parameters[enumParameters.ChangeSpeed].name}
            minimumValue={parameters[enumParameters.ChangeSpeed].min}
            maximumValue={parameters[enumParameters.ChangeSpeed].max}
            containerStyle="mt-8"
            step={1}
            value={changeSpeed}
            onValueChange={(value) => {
              sendParameter(enumParameters.ChangeSpeed, value / 100);
            }}
            onSlidingComplete={setChangeSpeed}
            isPercent
          />

          <View className="mb-4">
            {mode === enumModes.Flicker && (
              <CustomSlider
                containerStyle="mt-8"
                title={parameters[enumParameters.FlickerSpeed].name}
                minimumValue={parameters[enumParameters.FlickerSpeed].min}
                maximumValue={parameters[enumParameters.FlickerSpeed].max}
                value={flickerSpeed}
                onValueChange={(value) => {
                  sendParameter(enumParameters.FlickerSpeed, value / 100);
                }}
                onSlidingComplete={setFlickerSpeed}
                isPercent
              />
            )}

            {mode === enumModes.Rainbow && (
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

            {mode === enumModes.Strobe && (
              <CustomSlider
                containerStyle="mt-8"
                title={parameters[enumParameters.StrobeFrequency].name}
                minimumValue={parameters[enumParameters.StrobeFrequency].min}
                maximumValue={parameters[enumParameters.StrobeFrequency].max}
                value={strobeFrequency}
                onValueChange={(value) => {
                  sendParameter(enumParameters.StrobeFrequency, value / 10);
                }}
                onSlidingComplete={setStrobeFrequency}
                isPercent
              />
            )}
          </View>
          <View className="mb-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
