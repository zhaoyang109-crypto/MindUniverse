import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CategorySelectScreen from '../screens/CategorySelectScreen';
import AssessmentIntroScreen from '../screens/AssessmentIntroScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import ChatScreen from '../screens/ChatScreen';
import JournalScreen from '../screens/JournalScreen';
import ExerciseListScreen from '../screens/ExerciseListScreen';
import ExercisePlayerScreen from '../screens/ExercisePlayerScreen';
import AssessmentListScreen from '../screens/AssessmentListScreen';
import BlindBoxScreen from '../screens/BlindBoxScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CategorySelect" component={CategorySelectScreen} />
        <Stack.Screen name="AssessmentIntro" component={AssessmentIntroScreen} />
        <Stack.Screen name="Assessment" component={AssessmentScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
        <Stack.Screen name="ExercisePlayer" component={ExercisePlayerScreen} />
        <Stack.Screen name="AssessmentList" component={AssessmentListScreen} />
        <Stack.Screen name="BlindBox" component={BlindBoxScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
