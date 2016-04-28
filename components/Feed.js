/**
 * Created by wangchenlong on 16/4/25.
 */
'use strict';

import React, {
  Component,
  StyleSheet,
  ListView,
  View,
  Text,
  TimerMixin,
  RefreshControl,
  ActivityIndicatorIOS
} from 'react-native';

import Story from './Story.js';

var isMounted = (component) => {
  try {
    React.findDOMNode(component);
    return true;
  } catch (e) {
    return false;
  }
};


class Feed extends Component {
  constructor(props) {
    super(props);

    this._fetchData = this._fetchData.bind(this);

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

  componentDidMount() {
    this.loadInterval = true;
    this._fetchData();
  }

  componentWillUnmount () {
    this.loadInterval = false;
}

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

  _filterNews(news = []) {
    return new Promise((res, rej) => {
      const filtered = news.filter(item => {
        return item.content.format === 'bbc.mobile.news.format.textual'
      });
      res(filtered);
    })
  }

  _renderLoading() {
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center', flex: 1}}>
        <ActivityIndicatorIOS
          animating={this.state.isAnimating}
          style={[styles.centering, {height: 80}]}
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
    if (!this.state.loaded) {
      return this._renderLoading();
    }

    return (
      <ListView
        testID={"Feed Screen"}
        dataSource={this.state.dataSource}
        renderRow={this._renderStories.bind(this)}
        style={styles.listView}
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
          ></RefreshControl>
        }
        ></ListView>
    );
  }
}

var styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },

  loadingView: {
    marginTop: 30,
    marginRight: 50,
    backgroundColor: '#FF00FF'
  },

  listView: {
    backgroundColor: '#eee'
  }
});

export default Feed;
