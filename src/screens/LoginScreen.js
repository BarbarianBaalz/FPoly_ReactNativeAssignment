import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-community/google-signin';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setStatus} from '../components/redux/userAction';
import {LoginManager, AccessToken} from 'react-native-fbsdk';

export class LoginScreen extends React.Component {
  state = {
    email: '',
    password: '',
    loading: false,
  };

  componentDidMount() {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '304777424999-c69fvpmi6prglcfcdfsnisiklhtruqv7.apps.googleusercontent.com', // required
    });
  }

  _handleGGLogin = async () => {
    this.setState({loading: true});
    try {
      const {accessToken, idToken} = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await auth().signInWithCredential(credential);
      this.props.setStatus(true);
      this.setState({loading: false});
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
    }
  };

  _handleFbLogin = async () => {
    try {
      this.setState({loading: true});
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }
      const credential = auth.FacebookAuthProvider.credential(data.accessToken);
      await auth().signInWithCredential(credential);
      this.props.setStatus(true);
      this.setState({loading: false});
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
    }
  };

  _handleTextInputChange = field => value => {
    this.setState({
      [field]: value,
    });
  };
  _handleLogin = async (mail, pass) => {
    try {
      this.setState({loading: true});
      let user = await auth()
        .signInWithEmailAndPassword(mail, pass)
        .then(() => {
          Alert.alert(
            'Yeahhh !!',
            'Login Successfully',
            [
              {
                text: 'OK',
                onPress: () => console.log('Success'),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        });
      console.log(user);
      this.props.setStatus(true);
      this.setState({loading: false});
    } catch (e) {
      console.log('Error: ' + e.messenger);
      this.setState({loading: false});
    }
  };
  _handlePressRegister = () => {
    this.props.navigation.navigate('SignUpScreen');
  };

  _handlePressForgotPassword = () => {
    console.log('Forgot your password...');
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} />
        </View>
      );
    }
    // const {item} = this.props.route.params;
    const Divider = props => {
      return (
        <View {...props}>
          <View style={styles.circle}>
            <ImageBackground
              style={styles.arrow_down}
              source={require('../assets/icons/arrow-down-icon.png')}
            />
          </View>
        </View>
      );
    };

    const DividerBottom = props => {
      return (
        <View {...props}>
          <View style={styles.line} />
        </View>
      );
    };

    const {email, password} = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <ImageBackground
            blurRadius={1.5}
            source={require('../assets/image/backgroundHeader.jpg')}
            style={styles.containerHeader}>
            <ImageBackground
              source={require('../assets/image/logoHeader.png')}
              style={{height: 150, width: 200}}
            />

            <TextInput
              returnKeyType="done"
              style={styles.input}
              placeholder="Enter email"
              placeholderTextColor="#FFF"
              value={email}
              keyboardType="email-address"
              textContentType="emailAddress"
              onChangeText={this._handleTextInputChange('email')}
            />

            <TextInput
              returnKeyType="done"
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#FFF"
              value={password}
              onChangeText={this._handleTextInputChange('password')}
              secureTextEntry={true}
              textContentType="password"
            />

            <View style={styles.btnContainer}>
              {/* SIGN IN Button  */}
              <TouchableOpacity
                style={styles.LockStyle}
                activeOpacity={0.5}
                onPress={() => this._handleLogin(email, password)}>
                <Image
                  source={require('../assets/icons/lock-icon.png')}
                  //Image Style
                  style={styles.ImageIconStyle}
                />
                <Text style={styles.TextStyle}> SIGN IN </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <Divider style={styles.dividerTop} />

          <View style={styles.txtSupportContainer}>
            <Text
              style={styles.txtSignUp2}
              onPress={this._handlePressForgotPassword}>
              FORGOT PASSWORD ?
            </Text>

            <TouchableOpacity
              style={styles.PlusStyle}
              activeOpacity={0.5}
              onPress={this._handlePressRegister}>
              <Image
                source={require('../assets/icons/plus-icon.png')}
                //Image Style
                style={styles.ImageIconStyle}
              />
              <View style={styles.SeparatorLine} />
              <Text style={styles.TextStyle}> CREATE AN ACCOUNT </Text>
            </TouchableOpacity>
          </View>

          <DividerBottom style={styles.divider} />

          {/* Social login button */}
          <View style={styles.sectionSocialLoginContainer}>
            {/* Facebook button login  */}
            <TouchableOpacity
              style={styles.FacebookStyle}
              activeOpacity={0.5}
              onPress={this._handleFbLogin}>
              <Image
                source={{
                  uri:
                    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/facebook.png',
                }}
                //or use image in directory like this
                //source={require('./Images/facebook.png')}
                //Image Style
                style={styles.ImageIconStyle}
              />
              <View style={styles.SeparatorLine} />
              <Text style={styles.TextStyle}> SIGN IN WITH FACEBOOK </Text>
            </TouchableOpacity>

            <View style={{}} />

            {/* Google button login  */}
            <TouchableOpacity
              onPress={this._handleGGLogin}
              style={styles.GooglePlusStyle}
              activeOpacity={0.5}>
              <Image
                source={require('../assets/icons/google-icon.png')}
                //Image Style
                style={styles.ImageIconStyle}
              />
              <View style={styles.SeparatorLine} />
              <Text style={styles.TextStyle}> SIGN IN WITH GOOGLE </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  input: {
    width: '90%',
    padding: 10,
    marginBottom: 10,
    borderBottomColor: '#FFF',
    borderBottomWidth: 1,
    color: '#FFF',
    fontFamily: 'PTSerif-Regular',
    fontSize: 15,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: '#FF6600',
    padding: 8,
    width: '100%',
  },
  btnTxt: {
    fontSize: 15,
    textAlign: 'center',
    color: '#FFF',
  },
  txtSupportContainer: {
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  txtSignUp2: {
    color: '#999',
    margin: 10,
    fontFamily: 'PTSerif-Bold',
  },
  line: {
    height: 1,
    backgroundColor: '#999',
    flex: 2,
  },
  dividerTop: {
    flexDirection: 'row',
    height: 20,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -9,
  },
  divider: {
    flexDirection: 'row',
    height: 5,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionSocialLoginContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtnLoginSocial: {
    fontSize: 15,
    color: '#FFF',
  },
  arrow_down: {
    height: 23,
    width: 23,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: '#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LockStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    height: 40,
    width: '90%',
    borderRadius: 5,
    margin: 5,
    justifyContent: 'center',
    borderWidth: 2 / 10,
  },
  PlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20891d',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    width: 220,
    borderRadius: 5,
    margin: 5,
  },
  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc4e41',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    width: 220,
    borderRadius: 5,
    margin: 5,
  },
  FacebookStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#485a96',
    borderWidth: 0.5,
    borderColor: '#fff',
    height: 40,
    width: 220,
    borderRadius: 5,
    margin: 5,
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
  TextStyle: {
    color: '#fff',
    marginLeft: 5,
    fontFamily: 'PTSerif-Bold',
    fontSize: 12,
  },
  SeparatorLine: {
    backgroundColor: '#fff',
    width: 1,
    height: 40,
  },
});

const mapStateToProps = state => ({
  isLoggedIn: state,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({setStatus}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen);
