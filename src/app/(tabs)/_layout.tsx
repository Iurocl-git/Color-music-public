import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Image } from 'react-native';
import '~/global.css';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { icons } from '@/constants';
import { connectWebSocket } from '@/scripts/web_socket';
import { useWebSocketStore } from '@/store';

export default function TabLayout() {
  const setSocket = useWebSocketStore((state) => state.setSocket);
  const socket = useWebSocketStore((state) => state.socket);

  useEffect(() => {
    // Connect to the WebSocket server when the component loads

    const new_socket = connectWebSocket();
    setSocket(new_socket);

    // Close the WebSocket connection when the component unmounts
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        tabBarStyle: {
          backgroundColor: '#1F2937',
          height: 60,
          // borderTopWidth: 0,
          paddingBottom: 5,
          borderColor: '#37425f',
          // elevation: 20,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Static Colors',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="musicModem"
        options={{
          title: 'Color Music Mode',
          tabBarIcon: ({ color }) => (
            <Image source={icons.music} style={{ width: 24, height: 24, tintColor: color }} />
          ),
        }}
      />
    </Tabs>
  );
}
