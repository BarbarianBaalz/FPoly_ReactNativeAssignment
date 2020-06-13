import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';

export default class SignupScreen extends Component {
  state = {
    email: '',
    password: '',
  };

  _handlePressGoToLogin = () => {
    this.props.navigation.navigate('LoginScreen');
  };

  _handlePressSignUp = async (mail, pass) => {
    try {
      let user = await auth()
        .createUserWithEmailAndPassword(mail, pass)
        .then(() => {
          Alert.alert(
            'Oh My God !!',
            'Sign Up Successfully',
            [
              {
                text: 'OK',
                onPress: () => this.props.navigation.navigate('LoginScreen'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        });
      console.log(user);
    } catch (e) {
      console.log('Error: ' + e.messenger);
    }
  };

  render() {
    const {email, password} = this.state;

    const Divider = props => {
      return (
        <View {...props}>
          <View style={styles.line} />
          <Text style={styles.txtOr}>Or</Text>
          <View style={styles.line} />
        </View>
      );
    };

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Register !</Text>

        <TextInput
          returnKeyType="done"
          style={styles.input}
          placeholder="Your email"
          value={email}
          textContentType="emailAddress"
          keyboardType="email-address"
          onChangeText={email => this.setState({email})}
        />
        <TextInput
          returnKeyType="done"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={password => this.setState({password})}
          secureTextEntry
        />

        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => this._handlePressSignUp(email, password)}
            style={styles.btn}>
            <Text style={styles.btnTxt}>Register</Text>
          </TouchableOpacity>

          <Divider style={styles.divider} />

          <TouchableOpacity onPress={this._handlePressGoToLogin}>
            <Text style={styles.goToLoginTxt}>Login now !</Text>
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
    marginTop: -50,
    marginBottom: 80,
  },
  input: {
    width: '90%',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
  },
  btnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginTop: 30,
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
  goToLoginTxt: {
    color: '#FFF',
    fontSize: 30,
  },
  line: {
    height: 1,
    backgroundColor: '#FFF',
    flex: 2,
  },
  txtOr: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 20,
  },
  divider: {
    marginTop: 10,
    flexDirection: 'row',
    height: 40,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
