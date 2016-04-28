/**
 * Created by wangchenlong on 16/4/25.
 * @flow
 */
'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  View,
  RefreshControl,
  ActivityIndicatorIOS
} from 'react-native';

import Story from './Story.js';

class Feed extends Component {

  /**
   * 构造器, 初始化加载状态和列表数据
   * @param props 属性
   */
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      dataSource: dataSource,
      loaded: false,
      isAnimating: true,
      isRefreshing: false
    };
  }

  /**
   * 已经挂载当前页面
   */
  componentDidMount() {
    this.loadInterval = true; // 加载异常的处理方法
    this._fetchData();
  }

  /**
   * 将会卸载当前页面
   */
  componentWillUnmount() {
    this.loadInterval = false;
  }

  /**
   * 抓取数据, 抓取时调用加载页面, 结束后关闭加载
   * @private
   */
  _fetchData() {
    this.setState.isRefreshing = true;

    fetch(`http://trevor-producer-cdn.api.bbci.co.uk/content${this.props.collection || '/cps/news/world'}`)
      .then((response) => response.json())
      .then((responseData) => this._filterNews(responseData.relations))
      .then((newItems) => {
        this.loadInterval && this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newItems),
          loaded: true,
          isRefreshing: false,
          isAnimating: false
        })
      }).done();
  }

  /**
   * 过滤新闻的内容, 只使用文本.
   * @param news
   * @returns {Promise}
   * @private
   */
  _filterNews(news = []) {
    return new Promise((res, rej) => {
      const filtered = news.filter(item => {
        return item.content.format === 'bbc.mobile.news.format.textual'
      });
      res(filtered);
    })
  }

  /**
   * 渲染加载页面
   * @returns {XML} ActivityIndicatorIOS加载
   * @private
   */
  _renderLoading() {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1}}>
        <ActivityIndicatorIOS
          animating={this.state.isAnimating}
          style={{height: 80}}
          size="large"/>
      </View>
    );
  }

  /**
   * 渲染每个列表项
   * @param story 列表项的内容
   * @returns {XML} 布局
   * @private
   */
  _renderStories(story) {
    return (
      <Story story={story} navigator={this.props.navigator}/>
    );
  }

  render() {
    // 未加载完成时, 调用加载页面
    if (!this.state.loaded) {
      return this._renderLoading();
    }

    return (
      <ListView
        testID={"Feed Screen"}
        dataSource={this.state.dataSource}
        renderRow={this._renderStories.bind(this)}
        style={{backgroundColor: '#eee'}}
        contentInset={{top:0, left:0, bottom: 64, right: 0}}
        scrollEventThrottle={200}
        {...this.props}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._fetchData()}
            tintColor='#BB1919'
            title="Loading..."
            progressBackgroundColor="#FFFF00"
          />}
        ></ListView>
    );
  }
}

export default Feed;
