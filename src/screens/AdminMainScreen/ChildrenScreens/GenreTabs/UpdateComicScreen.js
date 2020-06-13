import React, {useState, useEffect, useInput} from 'react';
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

function UpdateComicScreen({route, navigation}) {
  //Get old data
  const {cName, cChapter, cGenre, img, _key} = route.params;
  // const {cChapter} = route.params;
  // const {cGenre} = route.params;
  // const {img} = route.params;
  // const {_key} = route.params;

  //Set new data
  const [comicName, setNewComicName] = useState(cName);
  const [comicChapter, setNewComicChapter] = useState(cChapter);
  const [comicGenre, setNewComicGenre] = useState(cGenre);
  const [image, setNewImage] = useState(img);

  //Upload new image or keep old image
  const [isUpNewImage, setIsUpNewImage] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('image: ' + image);

  const pickImage = () => {
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
        setNewImage(response);
        setIsUpNewImage(true);
      }
    });
  };

  const uploadNewImgToStorage = () => {
    setLoading(true);
    if (isUpNewImage) {
      let fileName = Math.random()
        .toString(16)
        .slice(2);
      console.log(fileName);

      let ext;
      if (Platform.OS === 'ios') {
        ext = image.uri.split('.').pop();
      } else {
        ext = image.fileName.split('.').pop();
      }

      const uploadTask = storage()
        .ref(`coverImages/${fileName}.${ext}`)
        .putFile(image.uri);

      //After upload new image to storage - Delete old image
      deleteOldImageOnStorage();

      let response = new Promise((resolve, reject) => {
        uploadTask.on(
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

      response
        .then(result => updateNewDataToDB(result))
        .then(() =>
          Alert.alert(
            'Messenger !!',
            'Update Comic Successfully',
            [
              {
                text: 'OK',
                onPress: () => setLoading(false),
                style: 'cancel',
              },
            ],
            {cancelable: false},
          ),
        )
        .then(() => navigation.goBack());
      setIsUpNewImage(false);
    } else {
      console.log('isUpNewImage: ' + isUpNewImage);
      updateNewDataToDBWithoutNewImage();
    }
  };

  const deleteOldImageOnStorage = async () => {
    //After upload new image to storage - Delete old image
    console.log('deleteOldImageOnStorage: ' + img);

    let imageUrl = img
      .substring(img.indexOf('o/') + 2, img.indexOf('?'))
      .replace('%2F', '/');

    await storage()
      .ref()
      .child(imageUrl)
      .delete();
    //======//
  };

  const updateNewDataToDBWithoutNewImage = () => {
    const ref = database()
      .ref(`/Comics/`)
      .child(_key);
    ref
      .set({
        comicName,
        comicChapter,
        comicGenre,
        image,
      })
      .then(() =>
        Alert.alert(
          'Messenger !!',
          'Update Comic Successfully',
          [
            {
              text: 'OK',
              onPress: () => setLoading(false),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        ),
      )
      .then(() => navigation.goBack());
  };

  const updateNewDataToDB = async image => {
    const ref = database()
      .ref(`/Comics/`)
      .child(_key);
    ref.set({
      comicName,
      comicChapter,
      comicGenre,
      image,
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    // <View>
    //   <Text>Update Screen Test</Text>
    //   <Button title="Go to All... again" onPress={() => navigation.goBack()} />
    // </View>

    <KeyboardAwareScrollView
      resetScrollToCoords={{x: 0, y: 0}}
      contentContainerStyle={styles.container}
      scrollEnabled={false}>
      <Text style={styles.txtWelcome}>Update Comic</Text>

      <TouchableOpacity onPress={() => pickImage()}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: image.uri ? image.uri : image,
            }}
            style={styles.avatar}
            // resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <View>
        <TextInput
          value={comicName}
          returnKeyType="done"
          style={styles.input}
          placeholder="Enter Comic Name"
          placeholderTextColor="#555"
          onChangeText={comicName => setNewComicName(comicName)}
        />

        <TextInput
          value={comicChapter}
          returnKeyType="done"
          style={styles.input}
          placeholder="Enter Comic Chapter Number"
          placeholderTextColor="#555"
          keyboardType={'number-pad'}
          onChangeText={comicChapter => setNewComicChapter(comicChapter)}
        />

        <TextInput
          returnKeyType="done"
          style={styles.input}
          placeholder="Enter Comic Genre"
          placeholderTextColor="#555"
          value={comicGenre}
          onChangeText={comicGenre => setNewComicGenre(comicGenre)}
        />
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => uploadNewImgToStorage()}
          style={styles.btnUpload}>
          <Text style={styles.txtBtnUpload}>Update Comic</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.btnUpload}
          onPress={() => navigation.goBack()}>
          <Text style={styles.txtBtnUpload}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={{height: 130}} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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

export default UpdateComicScreen;
