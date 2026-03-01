import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanionScreen from '../screens/CompanionScreen';
import PenguinCircleScreen from '../screens/PenguinCircleScreen';

const Stack = createNativeStackNavigator();

export default function CompanionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CompanionHome" component={CompanionScreen} options={{ title: 'Penguin Companion' }} />
      <Stack.Screen name="PenguinCircle" component={PenguinCircleScreen} options={{ title: 'Penguin Circle' }} />
    </Stack.Navigator>
  );
}
