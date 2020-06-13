import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import storage from '@react-native-firebase/storage';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default class AllTab extends React.Component {
  state = {
    loading: false,
    data: [],
    filteredData: [],
    searchTxt: '',
    refreshing: false,
  };

  componentDidMount() {
    this._handleGetData();
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._handleGetData();
    wait(2000).then(() => this.setState({refreshing: false}));
  }

  _handleGetData = async () => {
    this.setState({loading: true});
    this.unsubscribe = database()
      .ref(`/Comics/`)
      .on('value', snapshot => {
        let items = [];
        if (snapshot) {
          snapshot.forEach(element => {
            let item = {
              _key: element.key,
              comicName: element.val().comicName,
              comicChapter: element.val().comicChapter,
              comicGenre: element.val().comicGenre,
              comicImg: element.val().image,
            };
            items.push(item);
          });
        }
        this.setState({data: items, loading: false});
      });
  };

  _handleSearch = searchTxt => {
    this.setState({loading: true});
    const filteredData = this.state.data.filter(item => {
      const itemData = `${item.comicName.toUpperCase()}`;
      const textData = searchTxt.toUpperCase();
      return itemData.startsWith(textData);
    });
    console.log(filteredData);

    this.setState({
      filteredData: filteredData,
      loading: false,
      searchTxt: searchTxt,
    });
  };

  _beforeDeleteComic = (key, image) => {
    Alert.alert(
      'Delete Alert !',
      'Are you sure delete this comic ?',
      [
        {
          text: 'Cancel',
          // onPress: () => this.setState({loading: false}),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => this.removeItem(key, image),
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
      });
  };

  removeItem = async (key, image) => {
    this.setState({loading: true});
    let imageUrl = image
      .substring(image.indexOf('o/') + 2, image.indexOf('?'))
      .replace('%2F', '/');

    try {
      await database()
        .ref(`/Comics/`)
        .child(key)
        .remove();
      await storage()
        .ref()
        .child(imageUrl)
        .delete()
        .then(
          () =>
            Alert.alert(
              'Messenger !!',
              'Delete Comic Successfully',
              [
                {
                  text: 'OK',
                  onPress: () => this.setState({loading: false}),
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
    } catch (error) {
      console.log(error);
    }
  };

  _handleSelectAction = (
    comicName,
    comicChapter,
    comicGenre,
    comicImg,
    _key,
  ) => {
    Alert.alert(
      'ALERT !!!',
      'Select Action',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete this comic',
          onPress: () => this._beforeDeleteComic(_key, comicImg),
        },
        {
          text: 'Update this comic',
          onPress: () =>
            this.props.navigation.navigate('UpdateComicScreen', {
              cName: comicName,
              cChapter: comicChapter,
              cGenre: comicGenre,
              img: comicImg,
              _key: _key,
            }),
        },
      ],
      {cancelable: true},
    );
  };

  render() {
    const {data, filteredData} = this.state;
    if (this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <Icon
            style={styles.searchIcon}
            name="image-search-outline"
            size={25}
            color="#FF9966"
          />
          <TextInput
            style={styles.input}
            // value={this.state.searchTxt}
            placeholder={'Type comic name..'}
            onChangeText={text => this._handleSearch(text)}
            value={this.state.searchTxt}
          />
        </View>

        <FlatList
          data={filteredData && filteredData.length > 0 ? filteredData : data}
          keyExtractor={item => item._key}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          renderItem={({item}) => {
            return (
              <View style={styles.dataContainer}>
                <Image
                  source={{
                    uri: item.comicImg,
                  }}
                  style={styles.imgData}
                />
                <View style={styles.contentShows}>
                  <View style={styles.contentShowsTxt}>
                    <Text style={styles.txtName}>{item.comicName}</Text>
                    <Text style={styles.txtChapter}>
                      Chapter {item.comicChapter}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      this._handleSelectAction(
                        item.comicName,
                        item.comicChapter,
                        item.comicGenre,
                        item.comicImg,
                        item._key,
                      )
                    }
                    underlayColor="#FF9966"
                    style={styles.contentShowsIcon}>
                    <View>
                      <Icon name="update" size={25} color="#666" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          style={styles.flatList}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#FF9966',
    borderWidth: 1,
    width: '95%',
    marginTop: 10,
    padding: 1,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    fontFamily: 'PTSerif-Regular',
    fontSize: 16,
    color: '#FF9966',
  },
  flatList: {
    marginTop: '3%',
  },
  dataContainer: {
    padding: 5,
    alignItems: 'center',
  },
  imgData: {
    width: 155,
    height: 120,
    borderRadius: 5,
    marginBottom: 5,
  },
  txtName: {
    fontFamily: 'PTSerif-Bold',
    fontSize: 12,
    color: '#666',
  },
  txtChapter: {
    fontFamily: 'PTSerif-Regular',
    color: '#666',
    fontSize: 10,
  },
  contentShows: {
    flexDirection: 'row',
    width: 155,
    marginLeft: 5,
  },
  contentShowsTxt: {
    flex: 3,
  },
  contentShowsIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
