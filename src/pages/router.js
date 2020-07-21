import React, { Component } from 'react'
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux'
import tabIcon from '../components/tabIcon'
import BoardClass from './boardClass'
import HotBoard from './hotBoard'
import Favorite from './favorite'
import BoardList from './boardList'
import Article from './article'
import detailNavBar from '../components/detailNavBar'
import { getFB } from '../utils/storage'

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
              onEnter={() => {
                this.recPage = Actions.currentScene
                console.log('onEnter ' + this.recPage)
              }}
              onExit={() => {
                console.log('onExit ' + this.recPage)
              }}
              title="熱門看板"
              titleStyle={{ color: '#ffff0b' }}
              icon={tabIcon}
              iconName={'fire'}
            />
            <Scene
              key="Favorite"
              component={Favorite}
              initial={true}
              onEnter={() => {
                this.recPage = Actions.currentScene
                console.log('onEnter ' + this.recPage)
                setTimeout(() => {
                  Actions.refresh()
                }, 0.1)
              }}
              onExit={() => {
                console.log('onExit ' + this.recPage)
              }}
              title="我的最愛"
              titleStyle={{ color: '#ffff0b' }}
              icon={tabIcon}
              iconName={'heart'}
            />
            <Scene
              key="Class"
              component={BoardClass}
              onEnter={() => {
                this.recPage = Actions.currentScene
                console.log('onEnter ' + this.recPage)
              }}
              onExit={() => {
                console.log('onExit ' + this.recPage)
              }}
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