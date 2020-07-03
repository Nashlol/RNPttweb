import { View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { Actions } from 'react-native-router-flux'
import Constants from 'expo-constants'

class detailNavBar extends Component {
  render() {
    return (
      <View style={styles.backgroundStyle}>
        <View style={styles.statusBar} />
        <MaterialIcons
          name="arrow-back"
          size={30}
          color="#ffffff"
          style={styles.backIcon}
          onPress={() => {
            Actions.pop()
          }}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  backgroundStyle: {
    backgroundColor: '#00006d',
  },
  statusBar: {
    backgroundColor: '#00006d',
    height: Constants.statusBarHeight,
  },
})

export default detailNavBar
