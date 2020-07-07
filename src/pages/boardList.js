import React, { PureComponent } from 'react'
import {
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Text,
  Alert,
  Button,
  Modal,
  TouchableHighlight,
  TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { Spinner } from '../components/spinner'
import DOMParser from 'react-native-html-parser';

class BoardList extends PureComponent {
  _isMounted = false

  state = {
    loading: false,
    keyArray: [],
    data: [],
    articleNumArray: [],
    recLargeNum: {},
    reading: false,
    requestOptions: this.props.data.requestOptions ? this.props.data.requestOptions : {},
    nextPagePath: '',
    searchFunction: '',
    searchTitle: '搜尋標題',
    searchBarText: '',
    modalVisible: false
  }

  componentDidMount() {
    this._isMounted = true
    console.log(this.props.data.boardName)
    setTimeout(() => {
      Actions.refresh({ title: this.props.data.boardName })
    }, 0.1)
    const boardPath = this.getBoardPath(this.props.data.path);
    // console.log('child board item :' + boardPath);
    this.getBoardList(boardPath)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getNextPages(nextPagePath) {
    var nextPage;
    // console.log(nextPagePath.getElementsByClassName('btn wide')[1].textContent)
    if (nextPagePath.getElementsByClassName('btn wide')[1].textContent != '‹ 上頁') {
      nextPage = ''
    } else {
      nextPage = nextPagePath.getElementsByClassName('btn wide')[1].getAttribute('href');
    }
    console.log('nextPagePath: ' + nextPage);
    this.setState({nextPagePath: nextPage})
  }

  getBoardPath(str) {
    console.log('str = ' + str);
    // return str.getAttribute("href")
    return str
  }

  async getBoardList(boardPath, refresh=false) {
    try {
      var data = [];
      console.log('requestOptions: ' + JSON.stringify(this.state.requestOptions))
      const response = await fetch('https://www.ptt.cc' + boardPath, this.state.requestOptions);
      const html = await response.text();
      const parser = new DOMParser.DOMParser();
      const parsed = parser.parseFromString(html, 'text/html');
      // console.log('headers: ' + JSON.stringify(response.headers))
      // console.log('parsed html: ' + parsed.toString());
      if (parsed.getElementsByClassName('over18-button-container').length) {
        // console.log(parsed.toString());
        Alert.alert(
          "本網站已依網站內容分級規定處理",
          "警告︰您即將進入之看板內容需滿十八歲方可瀏覽。若您尚未年滿十八歲，請點選離開。若您已滿十八歲，亦不可將本區之內容派發、傳閱、出售、出租、交給或借予年齡未滿18歲的人士瀏覽，或將本網站內容向該人士出示、播放或放映。",
          [
            {
              text: "未滿十八歲或不同意本條款",
              onPress: () => {
                // console.log("Cancel Pressed");
                Actions.pop();
              },
              style: "cancel"
            },
            { text: "我同意，我已年滿十八歲",
              onPress: () => {
                // console.log("OK Pressed")
                var myHeaders = new Headers();
                myHeaders.append("Cookie", "__cfduid=d00fcadf5353f792f45e43d56442b7f0d1593485000; over18=1;");
                var requestOption = {
                  method: 'POST',
                  headers: myHeaders,
                  redirect: 'follow',
                  credentials: 'omit'
                };
                this.setState({requestOptions: requestOption})
                this.getBoardList(boardPath)
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        const boardList = parsed.getElementsByClassName('r-ent');
        var num = this.state.data.length;
        console.log("boardList length: " + boardList.length);
        for (var i = boardList.length -1; i > -1; i--) {
          // console.log('boardList = ' + boardList[i])
          const itemDetail = this.rowDetail(boardList[i], num);
          // console.log('itemDetail = ' + itemDetail)
           
          data = data.concat(itemDetail);
          num++;
        }
        const nextPageDetial = parsed.getElementsByClassName('btn-group btn-group-paging')[0];
        this.getNextPages(nextPageDetial);
        if (refresh) {
          this.setState({
            data,
            loading: true
          })
        } else {
          this.setState({
            data: this.state.data.concat(data),
            loading: true
          })
        }
        
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  rowDetail(itemDetail, num) {
    // console.log('rowDetail itemDetail = ' + itemDetail)

    const sign = itemDetail.getElementsByClassName('title')[0].textContent;
    const popularity = itemDetail.getElementsByClassName('nrec')[0].textContent;
    const articleNum = itemDetail.getElementsByClassName('title')[0].textContent;
    const date = itemDetail.getElementsByClassName('date')[0].textContent;
    const author = itemDetail.getElementsByClassName('author')[0].textContent;
    const category = itemDetail.getElementsByClassName('title')[0].textContent;
    const title = itemDetail.getElementsByClassName('title')[0].textContent.replace(/\s+/g, " ");
    const path = itemDetail.getElementsByClassName('title')[0];

    return {
      row: {
        sign: sign,
        popularity: popularity,
        articleNum: articleNum,
        date: date,
        author: author,
        category: category,
        title: title,
        path
      },
      key: num,
    }
  }

  loadNextPage({ item }) {
    // console.log('load next page: ' + this.state.nextPagePath);
    if (this.state.nextPagePath != '')
      this.getBoardList(this.state.nextPagePath)
  }

  _onPressItem({ item }) {
    // console.log('item : ' + item.row.author)
    if (item.row.author != '-') {
      setTimeout(() => {
        Actions.ArticlePage({ data: item.row })
      }, 0.1)
    }
  }

  onSearch() {
    console.log('Search:' + JSON.stringify(this.state.requestOptions));
    if (this.state.searchBarText != '') {
      this.setModalVisible(false);
      Actions.childboard({
        data: {
          boardName: this.props.data.boardName + ' : ' + this.state.searchBarText,
          requestOptions: this.state.requestOptions,
          path:'/bbs/' + this.props.data.boardName + '/search?q=' + this.state.searchFunction + this.state.searchBarText
        }
      })
    }
  }

  onChangeFunction(text, searchTitle) {
    console.log('onChangeFunction: ' + text)
    this.setState({
      searchFunction: text,
      searchTitle
    })
  }

  onChangeText(text) {
    console.log(text)
    this.setState({
      searchBarText: text,
    })
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible })
  }

  renderRow({ item }) {
    var text = item.row.title;
    var nuser = item.row.popularity;
    var author = item.row.author;
    var date = item.row.date;
    // console.log('renderRow item: ' + text);
    return (
      <TouchableOpacity
        onPress={this._onPressItem.bind(this, {item})}
        style={[
          styles.item,
          { backgroundColor: '#6e3b6e' },
        ]}
      >
        <View style={styles.itemTop}>
          <Text style={styles.popularity}>{nuser}</Text>
          <Text style={styles.title}>{text}</Text>
        </View>
        <View style={styles.itemBottom}>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.loading ? <Spinner size="large" /> : null}
        <FlatList
          data={this.state.data}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderRow.bind(this)}
          keyExtractor={item => item.key.toString()}
          initialNumToRender={20}
          onEndReached={this.loadNextPage.bind(this)}
          onEndReachedThreshold={0.5}
        />
        <Button style={styles.searchButton}
          onPress={this.setModalVisible.bind(this, true)}
          title="Search"
          color="#841584"
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.searchFunction}>
                <Button
                  onPress={this.onChangeFunction.bind(this, '', '搜尋標題')}
                  title="標題"
                  color="#841584"
                />
                <Button 
                  onPress={this.onChangeFunction.bind(this, 'recommend:', '搜尋推文數')}
                  title="推文數"
                  color="#841584"
                />
                <Button
                  onPress={this.onChangeFunction.bind(this, 'author:', '搜尋作者')}
                  title="作者"
                  color="#841584"
                />
              </View>
              <Text style={styles.modalText}>{this.state.searchTitle}</Text>
              <TextInput style={styles.searchBar}
                onChangeText={text => this.onChangeText(text)}
                value={this.state.searchBarText}
              />

              <View style={styles.searchFunction} >
                <TouchableHighlight
                  style={styles.searchButton}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                >
                  <Text style={styles.textStyle}>取消</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.searchButton}
                  onPress={this.onSearch.bind(this)}
                >
                  <Text style={styles.textStyle}>{this.state.searchTitle}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    backgroundColor: '#000000',
  },
  item: {
    flexDirection: 'column',
    backgroundColor: '#f9c2ff',
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemTop: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    color: '#555555',
    //fontSize: 8,
  },
  popularity: {
    fontSize: 24,
    color : '#ffff0d',
  },
  title: {
    fontSize: 20,
    color : '#ffffff',
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  author: {
    color : '#999999'
  },
  date: {
    color : '#999999'
  },
  searchFunction: {
    flexDirection: 'row',
  },
  searchButton: {
    color: "#841584",
    backgroundColor: '#000000',
  },
  modalView: {
    margin: 20,
    backgroundColor: "#b3b3b3",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  searchBar: {
    height: 30,
    width: 200,
    color: '#000000',
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: '#b3b3b3',
    marginVertical: 15,
    marginHorizontal: 16,
  },
  searchButton: {
    backgroundColor: "#841584",
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "#b3b3b3",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 24,
    marginVertical: 15,
    textAlign: "center"
  }
})

export default BoardList
