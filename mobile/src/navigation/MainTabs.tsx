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
  return <Text style={{ fontSize: 20 }}>{name === 'Feed' ? '📜' : name === 'Journey' ? '📅' : name === 'Groups' ? '👥' : name === 'Companion' ? '🐧' : '⚙️'}</Text>;
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => <TabIcon name={route.name} />,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Feed" component={FeedStack} options={{ title: 'Feed' }} />
      <Tab.Screen name="Journey" component={JourneyScreen} />
      <Tab.Screen name="Groups" component={GroupsStack} />
      <Tab.Screen name="Companion" component={CompanionStack} options={{ title: 'Companion' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
