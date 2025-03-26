import { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

const DropDown = ({
  header,
  list,
  onChange,
}: {
  header: string;
  list: any;
  onChange: (selected: string, selected_id: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(header);
  return (
    <View className="">
      <TouchableOpacity
        className="w-full rounded-2xl border bg-orange-400"
        onPress={() => setIsOpen(!isOpen)}>
        <Text className="px-3 py-2 text-lg">{selected}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View className="mb-4 mt-2 rounded-2xl border border-black bg-orange-400">
          {list.map((element: any) => (
            <TouchableOpacity
              key={element.id}
              className="w-full"
              onPress={() => {
                onChange(element.name, element.id);
                setSelected(element.name);
                setIsOpen(false);
              }}>
              <Text className="px-3 py-2 text-lg">{element.name}</Text>
              {element.id !== list[list.length - 1].id && (
                <View className="h-[1px] w-full bg-gray-300" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropDown;
