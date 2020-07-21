import React, { Component } from 'react';
import {
  Alert,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  Text } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { removeFB, getFB, clearAll } from '../utils/storage'

class Favorite extends Component {
  state = {
    loading: false,
    data: [],
    boardNumArray: [],
    neverload: false,
    count: 0,
  }

  componentDidMount() {
    // clearAll()
    if (this.props.data) {
      this.getFavoriteBoardList(this.props.data)
    } else {
      this.getFBListFromStorage()
    }
  }

  componentDidUpdate() {
    console.log('componentDidUpdate')
    getFB(
      (result) => {
        if (result !== null) {
          var boardList = JSON.parse(result)
          if (!boardList.board.length) {
            this.FBNullAlart()
          } else if ( boardList.board.length != this.state.data.length) {
            this.getFavoriteBoardList(boardList)
          }
        }
      }
    )
  }

  getFBListFromStorage() {
    getFB(
      (result) => {
        if (result !== null) {
          console.log('FB data: ' + result)
          var boardList = JSON.parse(result)
          if (boardList.board.length) {
            this.getFavoriteBoardList(boardList)
          } else {
            this.FBNullAlart()
          }
        }
      }
    )
  }

  FBNullAlart() {
    Alert.alert(
      "前往熱門看板",
      '長按喜愛的看板加入我的最愛',
      [
        {
          text: "確認",
          onPress: () => {
            console.log("OK Pressed");
            Actions.HotBoard()
          }
        },
      ],
      { cancelable: false }
    );
  }

  getFavoriteBoardList(boardList) {  
    try {
      var data = []
      for (var i = 0; i < boardList.board.length; i++) {
        if (boardList.board[i] !== null) {
          // console.log('boardList = ' + boardList[i])
          const itemDetail = this.rowDetail(boardList.board[i], i);
          // console.log('itemDetail = ' + itemDetail)
         
          data = data.concat(itemDetail);
        }
      }
      this.setState({
        data
      })
    }
    catch (error) {
      console.error(error);
    }
  }

  rowDetail(itemDetail, num) {
    // console.log('rowDetail itemDetail = ' + itemDetail)
    // console.log('rowDetail num = ' + num)
    const boardName = itemDetail.boardName;
    const narration = itemDetail.narration;
    const path = itemDetail.path;
    // console.log('rowDetail path: ' + path)

    return {
      row: {
        boardName,
        narration,
        path
      },
      key: num
    }
  }

  handlerLongClick = ({ item }) => {
    //handler for Long Click
    Alert.alert(
      "確認刪除",
      '',
      [
        {
          text: "取消",
          onPress: () => {
            console.log("Cancel Pressed");
          },
          style: "cancel"
        },
        { text: "刪除",
          onPress: () => {
            console.log("OK Pressed")
            removeFB({item}, () => {
              this.setState({data:[]})
              this.getFBListFromStorage()
            })
          }
        }
      ],
      { cancelable: false }
    );
  };

  _onPressItem({ item }) {
    console.log('boardClass press item path: ' + item.row.boardName)
    if (item.row.path.startsWith('/bbs')) {
      Actions.childboard({ data: item.row })
    } else {
      Actions.classboard({ data: item.row })
    }
  }

  renderRow = ({ item }) => {
    // console.log('renderRow item: ' + item.row.boardName);
    var board = item.row.boardName;
    var narration = item.row.narration;

    return (
      <TouchableOpacity
        onLongPress={this.handlerLongClick.bind(this, {item})}
        onPress={this._onPressItem.bind(this, {item})}
        style={[
          styles.item,
          { backgroundColor: '#6e3b6e' },
        ]}
      >
        <Text style={styles.title}>{board}</Text>
        <Text style={styles.narration}>{narration}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
          <FlatList
            initialNumToRender={90}
            data={this.state.data}
            keyExtractor={item => item.key.toString()}
            renderItem={this.renderRow.bind(this)}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  item: {
    backgroundColor: '#f9c2ff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    color : '#ffffff',
  },
  narration: {
    fontSize: 16,
    color : '#999999',
  }
})

export default Favorite