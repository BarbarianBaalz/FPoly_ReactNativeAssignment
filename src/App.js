/* https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {Component} from 'react';
import MainNavigation from './MainNavigation';
import {Provider} from 'react-redux';
import UserReducer from './components/redux/userReducer';
import {createStore} from 'redux';
console.disableYellowBox = true;
const store = createStore(UserReducer, false);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainNavigation />
      </Provider>
    );
  }
}
