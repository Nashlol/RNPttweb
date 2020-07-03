import React, { PureComponent } from 'react'
import { TextInput, View, StyleSheet, Picker, Text, Button } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Spinner } from '../components/spinner'
import DOMParser from 'react-native-html-parser';

class Search extends PureComponent {
  _isMounted = false

  state = {
    boardName: '',
    path: '',
    searchFunction: '搜尋標題',
    searchBarText: ''
  }

  componentDidMount() {
    this._isMounted = true
    setTimeout(() => {
      Actions.refresh({ title: this.props.boardName })
    }, 0.1)
    this.setState({
      boardName: this.props.boardName
    })
    // const boardPath = this.getBoardPath(this.props.data.path);
    // console.log('child board item :' + boardPath);
    // this.getBoardList(boardPath)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  _onPressItem({ item }) {
    // router跳轉
    setTimeout(() => {
      Actions.ArticlePage({ data: item.row })
    }, 0.1)
  }

  onChangeText(text) {
    console.log(text)
    var path = '/bbs/' + this.state.boardName + '/search?q=' + text
    this.setState({
      searchBarText: text,
      path
    })
  }

  setSelectedValue(itemValue) {
    console.log(itemValue)
    this.setState({
      searchFunction: itemValue
    })
  }

  onSearch({ item }) {
    // console.log('Search:' + this.props.data.boardName);
    Actions.childboard({ data: this.state})
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.searchTitle}>{this.state.searchFunction}</Text> */}
        <Picker
          style={styles.searchFunction}
          selectedValue={this.state.searchFunction}
          onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue)}
        >
          <Picker.Item label="搜尋標題" value="tread" />
          <Picker.Item label="搜尋作者" value="auther" />
          <Picker.Item label="搜尋推文數" value="recommend" />
        </Picker>
        <TextInput style={styles.searchBar}
          onChangeText={text => this.onChangeText(text)}
          value={this.state.searchBarText}
        />
        <Button
          onPress={this.onSearch.bind(this)}
          title="Search"
          color="#841584"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#000000',
  },
  searchTitle: {
    padding: 20,
    fontSize: 24,
    color: '#b3b3b3',
  },
  searchFunction:{
    height: 50,
    width: 150,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#b3b3b3'
  },
  searchBar: {
    height: 40,
    color: '#000000',
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#b3b3b3',
    marginHorizontal: 16,
  },
  test: {
    flexDirection: 'column',
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  }
})

export default Search
