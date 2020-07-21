import React, { Component } from 'react';
import { TouchableOpacity, View, FlatList, StyleSheet, Text } from 'react-native'
import htmlParser from '../utils/htmlParser'
import { Actions } from 'react-native-router-flux'

class BoardClass extends Component {
  state = {
    loading: false,
    data: [],
    boardNumArray: [],
    neverload: false,
    count: 0,
  }

  componentDidMount() {
    console.log('boardClass data: ' + this.props.data.path)
    setTimeout(() => {
      Actions.refresh({ title: this.props.data.boardName })
    }, 0.1)
    this.getPttHotBoardList(this.props.data.path)
  }

  async getPttHotBoardList(path) {
    
    try {
      var data = []
      const response = await fetch('https://www.ptt.cc' + path);
      const html = await response.text();
      const parsed = htmlParser(html);
      const boardList = parsed.getElementsByClassName('b-ent');
      // console.log("boardList length: " + boardList.length);
      for (var i = 0; i < boardList.length; i++) {
        // console.log('boardList = ' + boardList[i])
        const itemDetail = this.rowDetail(boardList[i], i);
        // console.log('itemDetail = ' + itemDetail)
         
        data = data.concat(itemDetail);
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
    const category = itemDetail.getElementsByClassName('class');
    const boardName = itemDetail.getElementsByClassName('board-name')[0].textContent;
    const narration = itemDetail.getElementsByClassName('board-title')[0].textContent;
    const popularity = itemDetail.getElementsByClassName('board-nuser')[0].textContent;
    const path = itemDetail.getElementsByClassName('board')[0].getAttribute("href");
    // console.log('rowDetail path: ' + path)

    return {
      row: {
        boardName,
        category,
        narration,
        popularity,
        path
      },
      key: num
    }
  }

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
        onPress={this._onPressItem.bind(this, {item})}
        style={[
          styles.item,
          { backgroundColor: '#6e3b6e' },
        ]}
      >
        <Text style={styles.title}>{narration}</Text>
        <Text style={styles.narration}>{board}</Text>
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
    fontSize: 17,
    color : '#ffffff',
  },
  narration: {
    fontSize: 15,
    color : '#999999',
  }
})

export default BoardClass