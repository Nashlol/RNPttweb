import React, { Component } from 'react'
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux'
import tabIcon from '../utils/tabIcon'
import BoardClass from './boardClass'
import HotBoard from './hotBoard'
import BoardList from './boardList'
import Article from './article'
import detailNavBar from '../components/detailNavBar'

class RouterComponent extends Component {

  onBackPress() {
    switch (Actions.currentScene) {
      case 'boardlist':
        Actions.pop()
        return true
      case 'Article':
        Actions.pop()
        return true
      default:
        return false
    }
  }

  render() {
    this.recPage = ''
    return (
      <Router
        backAndroidHandler={this.onBackPress.bind(this)}
        navigationBarStyle={{
          backgroundColor: '#00006d',
        }}
      >
        <Scene key="root" headerLayoutPreset="center" hideNavBar={true}>
          <Scene
            key="home"
            tabs={true}
            tabBarPosition="bottom"
            tabBarStyle={{ backgroundColor: '#b3b3b3' }}
            type={ActionConst.RESET}
          >
            <Scene
              key="HotBoard"
              component={HotBoard}
              title="熱門看板"
              titleStyle={{ color: '#ffff0b' }}
              icon={tabIcon}
              iconName={'fire'}
            />
            <Scene
              key="Class"
              component={BoardClass}
              title="分類看板"
              titleStyle={{ color: '#ffff0b' }}
              icon={tabIcon}
              iconName={'home'}
              {...{data: {path:'/cls/1'}}}
            />
          </Scene>
          <Scene key="classboard">
            <Scene
              key="boardclass"
              component={BoardClass}
              leftTitle="back"
              onLeft={() => {
                Actions.pop()
              }}
              title={this.props.boardName}
              titleStyle={{ color: '#ffff0b' }}
            />
          </Scene>
          <Scene key="childboard">
            <Scene
              key="boardlist"
              component={BoardList}
              leftTitle="back"
              onLeft={() => {
                Actions.pop()
              }}
              title={this.props.boardName}
              titleStyle={{ color: '#ffff0b' }}
            />
          </Scene>
          <Scene key="ArticlePage">
            <Scene
              key="Article"
              component={Article}
              navBar={detailNavBar}
            />
          </Scene>
        </Scene>
      </Router>
    )
  }
}

export default RouterComponent