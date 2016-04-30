/**
 * Created by wangchenlong on 16/4/26.
 * @flow
 */
'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image,
  View
} from 'react-native';

import moment from 'moment'; // 处理时间
import Feed from './Feed.js'; // 新闻列表
import StoryDetail from './StoryDetail.js'; // 详细内容

/**
 * 新闻项的模块
 */
class Story extends Component {

  static propTypes = {
    name: React.PropTypes.string // 标题名称
  };

  /**
   * 构造函数
   * @param props 属性
   */
  constructor(props) {
    super(props);
  }

  /**
   * 点击列表项, 跳转详情页面
   * @param story 内容
   * @private
   */
  _pressedStory(story) {
    this.props.navigator.push({
      component: StoryDetail,
      title: this._truncateTitle(story.content.name),
      passProps: {story, navigator: this.props.navigator}
    });
  }

  /**
   * 截断标题
   * @param title 标题
   * @returns {*}
   */
  _truncateTitle(title) {
    if (title.length > 15) {
      return `${title.substring(0, 15)}...`
    } else {
      return title;
    }
  }

  /**
   * 根据类型, 提取不同的新闻组
   * @param story 内容
   * @private
   */
  _getCollectionForStory(story) {
    console.log('STORY', story);
    if (story.content.relations && story.content.relations.length) {
      return story.content.relations.find(item => {
        return item.primaryType === 'bbc.mobile.news.collection';
      });
    } else {
      throw  "No collection found";
    }
  }

  /**
   * 点击新闻组, 重新加载页面
   * @param collection 新闻组
   * @private
   */
  _pressedCollection(collection) {
    this.props.navigator.push({
      component: Feed,
      title: collection.content.name,
      passProps: {
        collection: collection.content.id,
        navigator: this.props.navigator
      }
    });
  }

  render() {
    var story = this.props.story; // 新闻项
    var time = moment.unix(story.content.lastUpdated / 1000).fromNow(); // 时间处理
    var collection = this._getCollectionForStory(story) || {}; // 新闻组的标题

    return (
      <TouchableHighlight
        underlayColor={'white'}
        onPress={() => this._pressedStory(story)}>
        <View testID={"Story"}>

          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image source={{uri: story.content.relations[0].content.href}}
                     style={styles.thumbnail}>
              </Image>
            </View>
          </View>

          <View style={styles.textView}>
            <Text style={styles.headline}>
              {story.content.name}
            </Text>
            <View style={styles.details}>
              <Text style={styles.timeStamp}>
                {time}
              </Text>
              <Text style={styles.border}>
                |
              </Text>
              <TouchableHighlight onPress={() => this._pressedCollection(collection)}>
                <Text style={styles.collection}>
                  {collection.content ? collection.content.name : ""}
                </Text>
              </TouchableHighlight>
            </View>

          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white'
  },

  textView: {
    flex: 1,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'white',
    marginBottom: 5
  },

  details: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },

  headline: {
    flex: 0,
    fontWeight: 'bold',
    fontSize: 20,
    margin: 3
  },

  timeStamp: {
    flex: 0,
    margin: 3
  },

  collection: {
    flex: 0,
    color: '#9D0A0E',
    margin: 3
  },

  border: {
    padding: 3,
    borderLeftWidth: 1,
    borderLeftColor: 'black',
    borderStyle: 'solid'
  },

  imageContainer: {
    flex: 1,
    height: 200,
    alignItems: 'stretch'
  },

  thumbnail: {
    flex: 1
  }
});

export default Story;