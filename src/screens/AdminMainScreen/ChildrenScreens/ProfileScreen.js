import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  AccessToken,
  GraphRequestManager,
  GraphRequest,
} from 'react-native-fbsdk';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ProfileScreen extends React.Component {
  state = {user: null, profile_pic: '', loading: false};
  componentDidMount() {
    this._handleGetUserInfo();
  }

  _handleGetUserInfo = async () => {
    this.setState({loading: true});
    const user = auth().currentUser;
    if (user) {
      this.setState({user});

      AccessToken.getCurrentAccessToken().then(data => {
        {
          const processRequest = new GraphRequest(
            '/me?fields=name,picture.type(large)',
            null,
            this.get_Response_Info,
          );
          // Start the graph request.
          new GraphRequestManager().addRequest(processRequest).start();
          this.setState({loading: false});
        }
      });
    }
  };

  get_Response_Info = (error, result) => {
    if (error) {
      console.log(error);
    } else {
      this.setState({profile_pic: result.picture.data.url});
    }
  };

  logoutUser = () => {
    Alert.alert(
      'Oops !!',
      'Are you sure to log out?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this._handleLogOut()},
      ],
      {cancelable: false},
    );
  };

  _handleLogOut = async () => {
    this.setState({loading: true});
    await auth()
      .signOut()
      .then(() => {
        setTimeout(function() {}, 2000);
      });
    this.setState({loading: false});
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }
    const {user, profile_pic} = this.state;
    return (
      // <View style={styles.container}>
      //   <Text>Your </Text>

      //   <Button title="Logout" onPress={this.logoutUser} />
      // </View>

      <View style={styles.container}>
        <View style={styles.headerIconContainer}>
          <TouchableOpacity>
            <Icons
              name="bell-ring"
              size={30}
              color="#999"
              style={{marginRight: 10}}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Icons name="settings" size={30} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={styles.inforContainer}>
          <View style={styles.imgContainer}>
            <Image style={styles.inforImage} source={{uri: profile_pic}} />
          </View>
          <View style={styles.inforDetailContainer}>
            <Text style={styles.txtInforName}>
              {(user && user.displayName) || 'No Name'}
            </Text>
            <Text style={styles.txtInforEmail}> {user && user.email} </Text>
          </View>
        </View>

        <View style={styles.cpContainer}>
          <View style={styles.coinInforContainer}>
            <View style={styles.coinContainer}>
              <Image
                source={require('../../../assets/icons/coin-icon.png')}
                style={styles.ImageIconStyle}
              />
            </View>

            <View style={styles.txtCoinContainer}>
              <Text style={styles.myCoinTxt}>My Coin</Text>
              <Text style={styles.myCoinNumber}>0</Text>
            </View>
          </View>

          <View style={styles.coinInforContainer}>
            <View style={styles.coinContainer}>
              <Image
                source={require('../../../assets/icons/point-icon.png')}
                style={styles.ImageIconStyle}
              />
            </View>

            <View style={styles.txtCoinContainer}>
              <Text style={styles.myCoinTxt1}>My Point</Text>
              <Text style={styles.myCoinNumber}>0</Text>
            </View>
          </View>
        </View>
        <View style={styles.logOut}>
          <TouchableOpacity onPress={this.logoutUser}>
            <Text style={styles.txtSignOut}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#666',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    padding: 5,
    marginRight: 5,
  },
  inforContainer: {
    margin: 10,
    flexDirection: 'row',
  },
  imgContainer: {},
  inforImage: {
    borderColor: '#FFF',
    borderRadius: 60,
    height: 60,
    width: 60,
  },
  inforDetailContainer: {
    alignItems: 'flex-start',
    marginLeft: 10,
    marginTop: 11,
  },
  txtInforName: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'PTSerif-Bold',
  },
  txtInforEmail: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: -3,
    fontFamily: 'PTSerif-Italic',
  },
  cpContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'center',
  },
  coinInforContainer: {
    backgroundColor: '#333',
    height: 100,
    width: 150,
    borderRadius: 10,
    margin: 5,
    flexDirection: 'row',
  },
  coinContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 60,
  },
  ImageIconStyle: {
    height: 50,
    width: 50,
  },
  txtCoinContainer: {
    width: 90,
    alignContent: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  myCoinTxt: {
    fontFamily: 'Chewy',
    color: '#e3bb1c',
    fontSize: 18,
  },
  myCoinTxt1: {
    fontFamily: 'Chewy',
    color: '#E67E22',
    fontSize: 18,
  },
  myCoinNumber: {
    fontFamily: 'Chewy',
    color: '#FFF',
    fontSize: 20,
  },
  logOut: {
    borderRadius: 5,
    borderColor: '#FFF',
    width: '90%',
    height: '7.5%',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  txtSignOut: {
    fontFamily: 'PTSerif-Regular',
    color: '#FFF',
    fontSize: 20,
  },
});
