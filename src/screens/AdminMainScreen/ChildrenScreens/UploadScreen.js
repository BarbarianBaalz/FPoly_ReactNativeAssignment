import React from 'react';
import {
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default class App extends React.Component {
  state = {
    comicName: '',
    comicChapter: '',
    comicGenre: '',
    imageData: null,
    data: null,
    curItem: null,
    loading: false,
  };

  componentWillUnmounted() {
    this.unsubscribe2();
  }

  _handleUploadImgToStorage = () => {
    this.setState({loading: true});
    const {imageData} = this.state;
    let fileName = Math.random()
      .toString(16)
      .slice(2);

    let ext;
    if (Platform.OS === 'android') {
      ext = imageData.uri.split('.').pop();
    } else {
      ext = imageData.fileName.split('.').pop();
    }

    const uploadTask = storage()
      .ref(`coverImages/${fileName}.${ext}`)
      .putFile(imageData.uri);
    let response = new Promise((resolve, reject) => {
      this.unsubscribe2 = uploadTask.on(
        'state_changed',
        snapshot => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        error => {
          reject(error.message);
        },
        complete => {
          complete.ref.getDownloadURL().then(function(downloadURL) {
            resolve(downloadURL);
          });
        },
      );
    });
    response.then(result => this._handleUploadToDB(result));
  };

  chooseImage = () => {
    const options = {
      title: 'Select Comic Cover Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          imageData: response,
        });
      }
    });
  };
  _onChooseImage() {
    console.log(this.state.isCoverOrIsContent);
  }
  _handleUploadToDB = image => {
    const {comicName, comicChapter, comicGenre} = this.state;
    const ref = database().ref(`/Comics`);
    ref
      .push({
        comicName,
        comicChapter,
        comicGenre,
        image,
      })
      .then(
        () => this.setState({loading: false}),
        Alert.alert(
          'Wowwww !!!',
          'Upload successfully',
          [
            {
              text: 'OK',
              // onPress: () => this.setState({loading: false}),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        ),
        this.setState({
          comicName: '',
          comicChapter: '',
          comicGenre: '',
          imageData: null,
        }),
      );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }
    const {comicName, comicChapter, comicGenre, imageData} = this.state;
    return (
      <KeyboardAwareScrollView
        // style={{backgroundColor: '#4c69a5'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={false}>
        <Text style={styles.txtWelcome}>Upload New Comic</Text>

        <TouchableOpacity onPress={this.chooseImage}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: imageData
                  ? imageData.uri
                  : 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081',
              }}
              style={styles.avatar}
              // resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <View>
          <TextInput
            returnKeyType="done"
            style={styles.input}
            placeholder="Enter Comic Name"
            placeholderTextColor="#555"
            onChangeText={comicName => this.setState({comicName})}
            value={comicName}
          />

          <TextInput
            returnKeyType="done"
            style={styles.input}
            placeholder="Enter Comic Chapter Number"
            placeholderTextColor="#555"
            keyboardType={'number-pad'}
            value={comicChapter}
            onChangeText={comicChapter => this.setState({comicChapter})}
          />

          <TextInput
            returnKeyType="done"
            style={styles.input}
            placeholder="Enter Comic Genre"
            placeholderTextColor="#555"
            value={comicGenre}
            onChangeText={comicGenre => this.setState({comicGenre})}
          />
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnUpload}
            onPress={this._handleUploadImgToStorage}>
            <Text style={styles.txtBtnUpload}>Upload Comic</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 160}} />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#F5FCFF',
    // backgroundColor: '#4c69a5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtWelcome: {
    fontFamily: 'Chewy',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 100,
    color: '#FF9966',
  },
  avatarContainer: {
    marginTop: 20,
    borderColor: '#FF9966',
    borderWidth: 1.5 / PixelRatio.get(),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 6,
  },
  avatar: {
    borderRadius: 6,
    width: 119,
    height: 130,
  },
  txtCoverImage: {
    textAlign: 'center',
    fontFamily: 'PTSerif-Regular',
    color: '#ff8040',
  },
  input: {
    width: 300,
    padding: 10,
    marginBottom: 10,
    borderBottomColor: '#ff8040',
    borderBottomWidth: 1,
    color: '#ff8040',
    fontFamily: 'PTSerif-Regular',
    fontSize: 15,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  btnContainer: {
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#ff8040',
    borderWidth: 0.65,
    borderRadius: 5,
  },
  txtBtnUpload: {
    fontSize: 18,
    fontFamily: 'PTSerif-Bold',
    padding: 5,
    color: '#ff8040',
  },
});
