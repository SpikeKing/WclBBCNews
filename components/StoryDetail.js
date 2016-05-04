/**
 * Created by wangchenlong on 16/4/28.
 * @flow
 */
'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  Linking
} from 'react-native';

var moment = require('moment');
var Link = require('./Link');
var htmlparser = require('htmlparser');
var XMLToReactMap = require('../XMLToReactMap.js');

class StoryDetail extends Component {

  /**
   * 构造器
   * @param props 属性
   */
  constructor(props) {
    super(props);

    this.state = {
      paragraph: "",
      loading: true,
      elements: null
    }
  }

  /**
   * 解析内容和Dom数据
   * @param body 数据内容
   * @param cb 表示Callback.
   * @private
   */
  _parseXMLBody(body, cb) {
    var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(
      function (error, dom) {
        cb(dom)
      }, {enforceEmptyTags: false, ignoreWhitespace: true});

    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
    parser.parseComplete(body);
  }

  /**
   * 抓取信息数据内容
   * @param cb 表示回调
   * @private
   */
  _fetchStoryData(cb) {
    // 提取数据, 转换JSON格式, 图片过滤, 视频过滤, 组合relations, 解析.
    fetch(`http://trevor-producer-cdn.api.bbci.co.uk/content${this.props.story.content.id}`)
      .then((response) => response.json())
      .then((responseData) => {
        const images = responseData.relations.filter(item => {
          return item.primaryType === 'bbc.mobile.news.image';
        });
        const videos = responseData.relations.filter(item => {
          return item.primaryType === 'bbc.mobile.news.video';
        });
        const relations = {images, videos};
        this._parseXMLBody(responseData.body, (result) => {
          cb(result, relations);
        });
      }).done();
  }

  /**
   * 组件已经加载的生命周期
   */
  componentDidMount() {
    this._fetchStoryData(
      // media表示视频或图片.
      (result, media) => {
        const rootElement = result.find(item => {
          return item.name === 'body';
        });

        XMLToReactMap.createReactElementsWithXMLRoot(rootElement, media)
          .then(array => {
            var scroll = React.createElement(ScrollView, {
              contentInset: {top: 0, left: 0, bottom: 64, right: 0},
              style: {flex: 1, flexDirection: 'column', backgroundColor: 'white'},
              accessibilityLabel: "Story Detail"
            }, array);

            this.setState({loading: false, elements: scroll});
          });
      }
    );
  }

  // 渲染
  render() {
    if (this.state.loading) {
      return (
        <Text>Loading</Text>
      );
    }
    return this.state.elements;
  }
}

var styles = StyleSheet.create({
  container: {},

  paragraph: {
    padding: 40,
    fontSize: 16,
    lineHeight: 20 * 1.2
  },

  headline: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    paddingLeft: 30,
    paddingRight: 30,
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white'
  },

  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 200
  },

  thumbnail: {
    flex: 1
  },

  imageContainer: {
    flex: 1,
    height: 300,
    alignItems: 'stretch'
  }
});

export default StoryDetail;