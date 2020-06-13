import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import UpdateComicScreen from './UpdateComicScreen';
import AllTab from './AllTab';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="AllTab">
      <Stack.Screen name="AllTab" component={AllTab} />
      <Stack.Screen name="UpdateComicScreen" component={UpdateComicScreen} />
    </Stack.Navigator>
  );
};

export default App;
