import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
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
  onSlidingComplete,
  containerStyle, // Style for the outermost container
  sliderClassName, // New prop for slider specific classes
  isPercent = false,
}: {
  title: string;
  minimumValue: number;
  maximumValue: number;
  value: number;
  step?: number;
  lowerLimit?: number;
  upperLimit?: number;
  onValueChange: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  containerStyle?: string;
  sliderClassName?: string; // Pass Tailwind classes for the slider itself
  isPercent?: boolean;
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value); // Sync with external value changes
  }, [value]);

  return (
    // Apply containerStyle to the outermost View
    <View className={'pb-10 pt-10' + containerStyle}>
      {/* Title */}
      <Text className="mb-4 text-base text-white">{title}</Text>
      {/* Labels container */}
      <View className="mb-2 flex-row items-start justify-between px-2">
        {/* Minimum value label */}
        <Text className="text-sm font-semibold text-white">
          {minimumValue} {isPercent ? '%' : ''}
        </Text>
        {/* Current value label */}
        <Text className="translate-x-2 text-sm font-semibold text-white">
          {Number.isInteger(currentValue) ? currentValue : currentValue.toFixed(2)}{' '}
          {isPercent ? '%' : ''}
        </Text>
        {/* Maximum value label */}
        <Text className="translate-x-1 text-sm font-semibold text-white">
          {maximumValue} {isPercent ? '%' : ''}
        </Text>
      </View>
      {/* Apply sliderClassName to the Slider component */}
      <Slider
        className={sliderClassName}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        minimumTrackTintColor="#FFFFFF"
        lowerLimit={lowerLimit ?? minimumValue}
        upperLimit={upperLimit ?? maximumValue}
        onValueChange={(val) => {
          setCurrentValue(val);
          onValueChange(val);
        }}
        onSlidingComplete={(val) => {
          if (onSlidingComplete) onSlidingComplete(val);
        }}
      />
    </View>
  );
};

export default CustomSlider;

