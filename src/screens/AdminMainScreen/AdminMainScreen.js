import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from './ChildrenScreens/HomeScreen';
import GenreScreen from './ChildrenScreens/GenreScreen';
import LibraryScreen from './ChildrenScreens/LibraryScreen';
import UploadScreen from './ChildrenScreens/UploadScreen';
import ProfileScreen from './ChildrenScreens/ProfileScreen';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const AdminMainScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Genre') {
            iconName = 'layers';
          } else if (route.name === 'Library') {
            iconName = 'bookmark';
          } else if (route.name === 'Upload') {
            iconName = 'upload';
          } else {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Genre" component={GenreScreen} />
      <Tab.Screen name="Library" component={LibraryScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AdminMainScreen;
