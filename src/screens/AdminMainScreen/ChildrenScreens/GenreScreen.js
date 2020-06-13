import React, {Component} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AllTab from './GenreTabs/GenreChildNavigation';
import MangaTab from './GenreTabs/MangaTab';

const Tab = createMaterialTopTabNavigator();

export default class GenreScreen extends Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="All" component={AllTab} />
        <Tab.Screen name="Manga" component={MangaTab} />
      </Tab.Navigator>
    );
  }
}
