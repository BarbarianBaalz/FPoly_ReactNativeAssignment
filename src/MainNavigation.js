import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SupportScreen from './screens/SupportScreen';

import AdminMainScreen from './screens/AdminMainScreen/AdminMainScreen';

import {connect} from 'react-redux';
import {setStatus} from './components/redux/userAction';
import {bindActionCreators} from 'redux';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

export class MainNavigation extends Component {
  componentDidMount() {
    this._handleUserInfo();
  }

  _handleUserInfo = async () => {
    this.unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setStatus(true);
      } else {
        //Signed out
        this.props.setStatus(false);
      }
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <NavigationContainer>
        {this.props.isLoggedIn ? (
          <AdminMainScreen />
        ) : (
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="LoginScreen">
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="SupportScreen" component={SupportScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({setStatus}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainNavigation);
