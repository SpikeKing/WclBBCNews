/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  NavigatorIOS,
  StatusBar
} from 'react-native';

import Feed from './components/Feed.js';

class WclBBCNews extends Component {

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('WclBBCNews', () => WclBBCNews);
