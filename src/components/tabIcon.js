import React, { Component } from 'react'
import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

class tabIcon extends Component {
  render() {
    var color = this.props.focused ? '#00006d' : '#343434'
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          alignSelf: 'center',
        }}
      >
        <MaterialCommunityIcons
          name={this.props.iconName}
          size={30}
          color={color}
        />
        {/* <Icon style={{ color: color }} name={this.props.iconName} size={30} /> */}
      </View>
    )
  }
}

export default tabIcon
