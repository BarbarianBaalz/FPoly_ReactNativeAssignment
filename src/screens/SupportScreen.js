import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

export default class SupportScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Don't remember password?</Text>
        <TextInput style={styles.input} placeholder="Type your email" />

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => this.props.navigation.navigate('LoginScreen')}>
            <Text style={styles.btnTxt}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              alert('Check your email and following the tutorial')
            }>
            <Text style={styles.btnTxt}>Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E90FF',
  },
  welcome: {
    fontSize: 40,
    textAlign: 'center',
    margin: 10,
    fontFamily: 'Bitter-Bold',
    color: '#FFF',
    marginTop: -80,
    marginBottom: 80,
  },
  input: {
    width: '90%',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  btn: {
    backgroundColor: '#FF6600',
    padding: 15,
    width: '48%',
  },
  btnTxt: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFF',
  },
  txtSupportContainer: {
    width: '90%',
    marginTop: 20,
    alignItems: 'flex-end',
  },
  txtSignUp: {
    color: '#FFF',
  },
  txtSignUp2: {
    marginTop: 10,
    color: '#FFF',
  },
});
