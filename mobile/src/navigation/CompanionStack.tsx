import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MySpaceScreen from '../screens/MySpaceScreen';
import PenguinCircleScreen from '../screens/PenguinCircleScreen';
import PeerMatchChatScreen from '../screens/PeerMatchChatScreen';

const Stack = createNativeStackNavigator();

export default function CompanionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MySpaceHome" component={MySpaceScreen} options={{ title: 'My Space' }} />
      <Stack.Screen name="PenguinCircle" component={PenguinCircleScreen} options={{ title: 'Penguin Circle' }} />
      <Stack.Screen name="PeerMatchChat" component={PeerMatchChatScreen} options={{ title: 'Peer Chat' }} />
    </Stack.Navigator>
  );
}
