import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class LibraryScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Library Screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
});
