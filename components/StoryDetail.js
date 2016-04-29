/**
 * Created by wangchenlong on 16/4/28.
 */
'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

var moment = require('moment');
var Link = require('./Link.js');
var htmlparser = require('htmlparser');
var XMLToReactMap = require('./XMLToReactMap.js');

class StoryDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      paragraph: "",
      loading: true,
      elements: null
    }
  }

  componentDidMount() {
    this.fetchStoryData((result, media) => {
      
    });
  }

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