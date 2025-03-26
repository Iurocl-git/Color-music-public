import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInputProps,
} from 'react-native';

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  pointerEvents,
  disabled = false,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      behavior="padding">
      <TouchableWithoutFeedback disabled={disabled} onPress={Keyboard.dismiss}>
        <View className="my-2 w-full">
          {label && (
            <Text className={`font-JakartaSemiBold mb-3 text-lg ${labelStyle}`}>{label}</Text>
          )}
          <View
            className={` focus:border-primary-500 relative flex flex-row items-center justify-start rounded-full border border-neutral-100 bg-neutral-100  ${containerStyle}`}>
            {icon && <Image source={icon} className={`ml-4 h-6 w-6 ${iconStyle}`} />}
            <TextInput
              className={`font-JakartaSemiBold flex-1 rounded-full p-4 text-left text-[15px] ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

declare interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: any;
  secureTextEntry?: boolean;
  labelStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  iconStyle?: string;
  className?: string;
  disabled?: boolean;
}

export default InputField;
