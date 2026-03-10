import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import FeedStack from './FeedStack';
import JourneyScreen from '../screens/JourneyScreen';
import GroupsStack from './GroupsStack';
import CompanionStack from './CompanionStack';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    Feed: '📜',
    Journey: '📅',
    Groups: '👥',
    'My Space': '🫶',
    Profile: '⚙️',
  };
  return <Text style={{ fontSize: 20 }}>{icons[name] ?? '•'}</Text>;
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => <TabIcon name={route.name} />,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Journey" component={JourneyScreen} />
      <Tab.Screen name="Groups" component={GroupsStack} />
      <Tab.Screen name="My Space" component={CompanionStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
