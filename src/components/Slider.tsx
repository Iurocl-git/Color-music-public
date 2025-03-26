import Slider from '@react-native-community/slider';
import { View, Text } from 'react-native';

const CustomSlider = ({
  title,
  minimumValue,
  maximumValue,
  value,
  step = 1,
  lowerLimit,
  upperLimit,
  onValueChange,
  containerStyle,
}: {
  title: string;
  minimumValue: number;
  maximumValue: number;
  value: number;
  step?: number;
  lowerLimit?: number;
  upperLimit?: number;
  onValueChange: (value: number) => void;
  containerStyle?: string;
}) => {
  return (
    <View className={containerStyle}>
      <Text className="mb-4 text-base text-white">{title}</Text>
      <View className="mb-2 flex-row items-start justify-between px-2">
        <Text className="text-sm font-semibold text-white">{minimumValue}%</Text>
        <Text className="translate-x-2 text-sm font-semibold text-white">{value}%</Text>
        <Text className="translate-x-1 text-sm font-semibold text-white">{maximumValue}%</Text>
      </View>
      <Slider
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        minimumTrackTintColor="#FFFFFF"
        lowerLimit={lowerLimit ? lowerLimit : minimumValue}
        upperLimit={upperLimit ? upperLimit : maximumValue}
        onValueChange={(value) => onValueChange(value)}
      />
    </View>
  );
};

export default CustomSlider;
