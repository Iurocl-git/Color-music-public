import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomCheckbox = ({
  label,
  isChecked,
  onChange,
  containerStyle,
}: {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  containerStyle?: object;
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => onChange(!isChecked)}
      activeOpacity={0.8}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    // backgroundColor: "#000",
  },
  checked: {
    // backgroundColor: "#00FF00",
  },
  checkmark: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default CustomCheckbox;
