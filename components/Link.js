/**
 * Created by wangchenlong on 16/4/29.
 */
'use strict';

import React, {
  StyleSheet,
  Text,
  Component,
  LinkingIOS
} from 'react-native';

class Story extends Component {
  static propTypes = {
    name: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  _pressURL() {
    console.log('hi', this.props.url);
    LinkingIOS.openURL(this.props.url);
  }

  render() {
    return (
      <Text style={styles.hyperlink}
            onPress={this._pressURL.bind(this)}>
        {this.props.children}
      </Text>
    );
  }
}

var styles = StyleSheet.create({
  hyperlink: {
    color: 'black',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  }
});

export default Story;