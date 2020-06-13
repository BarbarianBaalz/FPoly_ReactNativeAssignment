import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';

export default class HomeScreen extends Component {
  state = {
    comicName: '',
    comicChapter: '',
    comicImg: null,
    curItem: null,
    data: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      images: [
        'https://i.pinimg.com/564x/68/c5/a4/68c5a4a6722e77d1c1065494a7b15cd4.jpg',
        'https://i.pinimg.com/564x/17/97/74/179774fbdb4c6d59deaa39eb2ebee98f.jpg',
        //require('./assets/images/girl.jpg'),          // Local image
      ],
    };
  }

  componentWillUnmounted() {
    this.unsubscribe();
  }

  componentDidMount() {
    this._handleGetData();
  }

  _handleGetData = async () => {
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
              comicImg: element.val().image,
            };
            items.push(item);
          });
        }
        this.setState({data: items});
      });
  };

  render() {
    const {data} = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.slide_container}>
          <SliderBox
            ImageComponent={FastImage}
            images={this.state.images}
            sliderBoxHeight={220}
            onCurrentImagePressed={index =>
              console.warn(`image ${index} pressed`)
            }
            inactiveDotColor="#90A4AE"
            paginationBoxVerticalPadding={20}
            paddingVertical={0}
            autoplay
            circleLoop
            resizeMethod={'resize'}
            resizeMode={'cover'}
            // eslint-disable-next-line react-native/no-inline-styles
            paginationBoxStyle={{
              position: 'absolute',
              bottom: 0,
              padding: 0,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}
            dotColor="#FF9966"
            // eslint-disable-next-line react-native/no-inline-styles
            dotStyle={{
              width: 6,
              height: 6,
              borderRadius: 5,
              marginHorizontal: 0,
              padding: 0,
              margin: 45,
              backgroundColor: '#FFF',
            }}
            ImageComponentStyle={{}}
            imageLoadingColor="#FF9966"
          />
        </View>

        <View style={styles.body_container}>
          <View style={styles.header_icon_container}>
            <View style={styles.icon_container}>
              <Image
                source={require('../../../assets/icons/ranking-icon.png')}
                //Image Style
                style={styles.ImageIconStyle}
              />
              <Text style={styles.header_icon_Title}>Ranking</Text>
            </View>

            <View style={styles.icon_container}>
              <Image
                source={require('../../../assets/icons/daily-icon.png')}
                //Image Style
                style={styles.ImageIconStyle}
              />
              <Text style={styles.header_icon_Title}>Daily</Text>
            </View>

            <View style={styles.icon_container}>
              <Image
                source={require('../../../assets/icons/news-icon.png')}
                //Image Style
                style={styles.ImageIconStyle}
              />
              <Text style={styles.header_icon_Title}>News</Text>
            </View>

            <View style={styles.icon_container}>
              <Image
                source={require('../../../assets/icons/discover-icon.png')}
                //Image Style
                style={styles.ImageIconStyle}
              />
              <Text style={styles.header_icon_Title}>Discover</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title_news}>New Update</Text>

        <FlatList
          data={data}
          keyExtractor={item => item.key}
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
                  {/* <TouchableOpacity
                    underlayColor="#FF9966"
                    style={styles.contentShowsIcon}>
                    <View>
                      <Icon name="update" size={25} color="#BDBDBD" />
                    </View>
                  </TouchableOpacity> */}
                </View>
              </View>
            );
          }}
          style={styles.flatList}
        />
      </ScrollView>
    );
  }
}

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: window.width,
    height: window.height,
    backgroundColor: '#4e4e4e',
  },
  slide_container: {
    height: 230,
  },
  body_container: {
    borderRadius: window.width,
    width: window.width * 2,
    height: window.width * 2,
    marginLeft: -(window.width / 2),
    position: 'absolute',
    top: 170,
    overflow: 'hidden',
    backgroundColor: '#4e4e4e',
  },
  header_icon_container: {
    marginTop: '6%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: '40%',
  },
  icon_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageIconStyle: {
    height: 40,
    width: 40,
  },
  header_icon_Title: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'PTSerif-Bold',
  },
  title_news: {
    fontFamily: 'Chewy',
    fontSize: 24,
    color: '#FF9955',
    marginTop: '15%',
    marginLeft: '5%',
  },
  flatList: {
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
  dataContainer: {
    flex: 1,
    padding: 5,
    width: '41%',
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
    color: '#BDBDBD',
  },
  txtChapter: {
    fontFamily: 'PTSerif-Regular',
    color: '#BDBDBD',
    fontSize: 10,
  },
  contentShows: {
    flexDirection: 'row',
    width: 155,
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
