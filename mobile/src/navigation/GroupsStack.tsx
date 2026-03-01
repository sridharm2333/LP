import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsScreen from '../screens/GroupsScreen';
import GroupFeedScreen from '../screens/GroupFeedScreen';

const Stack = createNativeStackNavigator();

export default function GroupsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GroupsList" component={GroupsScreen} options={{ title: 'Groups' }} />
      <Stack.Screen name="GroupFeed" component={GroupFeedScreen} />
    </Stack.Navigator>
  );
}
