/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  NavigatorIOS,
  StatusBar
} from 'react-native';

import Feed from './components/Feed.js';

class WclBBCNews extends Component {

  /**
   * 初始化导航器
   * @param route 路由的属性
   * @param navigator 导航器
   * @returns {XML} 渲染组件
   * @private
   */
  _renderScene(route, navigator) {
    var Component = route.component;
    StatusBar.setBarStyle('light-content');
    return (
      <Component
        {...route.props}
        changeNavBarHeight={this.changeNavBarHeight}
        navigator={navigator}
        route={route}/>
    );
  }

  /**
   * 设置StatusBar的样式
   */
  componentWillMount() {
    // 设置StatusBar的颜色, 默认default是黑色, light-content是白色
    // 参考: https://facebook.github.io/react-native/docs/statusbar.html#barstyle
    StatusBar.setBarStyle('light-content');
  }

  render() {
    return (
      <NavigatorIOS
        style={{flex:1}}
        translucent={false}
        barTintColor={'#BB1919'}
        titleTextColor={'white'}
        tintColor={'white'}
        initialRoute={{
          component: Feed,
          title: "Feed",
          passProps: {}
        }}/>
    );
  }
}

AppRegistry.registerComponent('WclBBCNews', () => WclBBCNews);
