import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList } from 'react-native'
import TitleData from '../components/titleData'
import DOMParser from 'react-native-html-parser';

class Article extends PureComponent {
  _isMounted = false

  state = {
    loading: false,
    firstLoad: true,
    navData: {},
    startRow: 0,
    endRow: 0,
    pagePercent: 0,
    data: [],
    recData: [],
    commentIndex: 1,
  }

  componentDidMount() {
    this._isMounted = true
    // console.log('child board item :' + this.props.data.path);
    const aritclePath = this.getArticlePath(this.props.data.path);
    this.getArticleDetail(aritclePath);
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getArticlePath(str) {
    // console.log('str = ' + str);
    var split1 = str.toString().split(">");
    // console.log('split1 = ' + split1[1]);
    var split2 = split1[1].split("\"");
    // console.log('path = ' + split2[1]);
    return split2[1];
  }

  async getArticleDetail(articlePath) {
    try {
      var myHeaders = new Headers();
      myHeaders.append("Cookie", "__cfduid=d6318ec4f8235d22d754e346af2db6ad91593100725; over18=1; __cf_bm=1d1bd704cb362cc1f15955ee559a735ae9b278f4-1593101101-1800-AWbHSURPVeWSJujzOtV2QCCJDjKDwPoOKXGvMzea8wYY8cQ5lpo/pyIHA/cIwMHq01YLzseDNq/QwWp4ykdsufU=");

      var requestOption = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
        credentials: 'omit'
      };
      // var data = [];
      const response = await fetch('https://www.ptt.cc' + articlePath, requestOption);
      const html = await response.text();
      const parser = new DOMParser.DOMParser();
      const parsed = parser.parseFromString(html, 'text/html');
      // console.log('ArticleDetail: ' + parsed);
      const navBarDetail = parsed.getElementsByClassName('article-meta-value');
      this.getNavBarDetail(navBarDetail);
      const ArticleDetail = parsed.getElementsByClassName('bbs-screen bbs-content');
      // console.log("ArticleDetail : " + ArticleDetail[0].textContent);
      this.getArticleContent(ArticleDetail);
      this.getArticleComment(ArticleDetail);
    }
    catch (error) {
      console.error(error);
    }
  }

  getNavBarDetail(navBarDetail) {
    if (navBarDetail.length > 1) {
      const author = navBarDetail[0].textContent;
      const board = navBarDetail[1].textContent;
      const title = navBarDetail[2].textContent;
      const time = navBarDetail[3].textContent;
      this.setState({
        navData: { author: author, board: board, title: title, time: time },
      })
    } else {
      this.setState({navData:{}})
    }
  }

  getArticleContent(ArticleDetail) {
    var contentSplit;
    var content;
    if (Object.keys(this.state.navData).length > 0) {
      contentSplit = ArticleDetail[0].textContent.split(this.state.navData.time);
      content = contentSplit[1].split('※ 發信站');
      // console.log("ArticleDetail : " + content[0]);
    } else {
      // contentSplit = ArticleDetail[0].textContent.split(this.state.navData.time);
      content = ArticleDetail[0].textContent.split('※ 發信站');
    }
    
    this.setState({
      content: content[0]
    })
  }

  getArticleComment(ArticleDetail) {
    const comments = ArticleDetail[0].getElementsByClassName('push');
    var comment = [];
    var commentDetail = {};
    // console.log('comments length: ' + comments.length)
    var length = comments.length > 50 ? 50 : comments.length
    for (var i = 0; i < length; i++) {
      var pushtag;
      if (comments[i].getElementsByClassName('hl push-tag').length)
        pushtag = comments[i].getElementsByClassName('hl push-tag')[0].textContent;
      else
        pushtag = comments[i].getElementsByClassName('f1 hl push-tag')[0].textContent;
      var userid = comments[i].getElementsByClassName('f3 hl push-userid')[0].textContent;
      var content = comments[i].getElementsByClassName('f3 push-content')[0].textContent;
      var time = comments[i].getElementsByClassName('push-ipdatetime')[0].textContent;

      commentDetail = { pushtag, userid, content, time }
      comment = comment.concat(commentDetail);
    }
    // console.log('comment length: ' + comment.length)

    this.setState({
      comment
    })
  }

  renderComment = ({ item }) => {
    // console.log('renderRow item: ' + item);
    var tag = item.pushtag;
    var userid = item.userid;
    var content = item.content;
    var time = item.time;
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentTop}>
          <Text style={styles.commentUserid}>{userid}</Text>
          <Text style={styles.commentTime}>{time}</Text>
        </View>
        <View style={styles.commentContent}>
          { tag.startsWith('噓') ? (
            <Text style={styles.commentTag}>{tag}</Text>
          ) : (
            <Text style={styles.commentTagPush}>{tag}</Text>
          )}
          <Text style={styles.commentText}>{content}</Text>
        </View>
      </View>
    )
  }

  render() {
    var content = this.state.content;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {Object.keys(this.state.navData).length > 0 ? (
          <TitleData
            articleDetail={this.state.navData}
          />
        ) : null}
        <Text style={styles.content}>
          {content}
        </Text>
        <FlatList
          data={this.state.comment}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderComment.bind(this)}
          initialNumToRender={99}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
  },
  content: {
    backgroundColor: '#000000',
    color: '#b3b3b3',
    fontSize: 20,
  },
  commentContainer: {
    flexDirection: 'column',
    borderRadius: 10,
    backgroundColor: '#b3b3b3',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  commentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#555555',
    fontSize: 8,
  },
  commentUserId: {
    marginLeft:8
  },
  commentTime: {
    marginRight: 8
  },
  commentContent: {
    flexDirection: 'row',
    color: '#000000',
    fontSize: 16,
  },
  commentTag: {
    color: '#ff0b0b',
    fontSize: 16,
  },
  commentTagPush: {
    color: '#ffff0b',
    fontSize: 16,
  },
  commentText: {
    color: '#000000',
    fontSize: 16,
  }
})

export default Article
