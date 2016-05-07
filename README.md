# React Native 实例 - 新闻客户端

> 欢迎Follow我的GitHub: https://github.com/SpikeKing/

关于``React Native``的实例, 新闻客户端. 通过访问BBC的公开网络接口, 获取新闻内容, 也可以根据类型显示. 在编写代码中, 学习RN的知识, 源码是使用ES6的规范编写, 符合Facebook的RN代码最新规范.

主要技术

1. 访问网络请求, 过滤内容, 获取数据.
2. 显示多媒体页面, 图片, 视频, 链接等.

---

## 配置项目

初始化项目**WclBBCNews**, 修改``package.json``, 添加依赖库. 
Html解析库: ``htmlparser``, 时间处理库: ``moment``, 线性梯度库: [``react-native-linear-gradient``](https://github.com/brentvatne/react-native-linear-gradient), 视频库: ``react-native-video``.

``` json
  "dependencies": {
    "react": "^0.14.8",
    "react-native": "^0.24.1",

    "htmlparser": "^1.7.7",
    "moment": "^2.11.1",

    "react-native-linear-gradient": "^1.4.0",
    "react-native-video": "^0.6.1"
  }
```

> 目前, React Native禁止使用``-``初始化项目名称, 最好使用驼峰式.

初始化主模块``index.ios.js``, 使用``NavigatorIOS``导航页面, 首页组件**Feed模块**.

``` javascript
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
```

渲染使用动态加载组件, StatusBar使用浅色样式.

``` javascript
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
```

> [StatusBar](https://facebook.github.io/react-native/docs/statusbar.html#barstyle)样式只有两种, 默认``default``, 字是黑色; 可选``light-content``, 字是白色.

---

## 新闻列表

Feed页面, 主要以列表形式, 即``ListView``标签, 显示新闻. 未加载完成时, 调用页面加载提示符``ActivityIndicatorIOS``, 显示动画.

``` javascript
render() {
  // 未加载完成时, 调用加载页面
  if (!this.state.loaded) {
    return this._renderLoading();
  }
  // ...
}

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
```

加载完成后, 调用``ListView``显示页面, ``renderRow``渲染每一行, ``refreshControl ``加载页面的过场.

``` javascript
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
        onRefresh={this._fetchData.bind(this)}
        tintColor='#BB1919'
        title="Loading..."
        progressBackgroundColor="#FFFF00"
      />}
    />
);
```

每一行使用``Story``模块渲染.

``` javascript
_renderStories(story) {
  return (
    <Story story={story} navigator={this.props.navigator}/>
  );
}
```

启动页面的时候, 使用``fetch``方法加载数据.

``` javascript
componentDidMount() {
  this._fetchData();
}
```

通过访问BBC的网络请求, 异步获取数据. 使用``_filterNews``过滤需要的数据, 把数据设置入每一行, 修改状态``setState``, 重新渲染页面.

``` javascript
_fetchData() {
  this.setState({isRefreshing: true});
  fetch(`http://trevor-producer-cdn.api.bbci.co.uk/content${this.props.collection || '/cps/news/world'}`)
    .then((response) => response.json())
    .then((responseData) => this._filterNews(responseData.relations))
    .then((newItems) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(newItems),
        loaded: true,
        isRefreshing: false,
        isAnimating: false
      })
    }).done();
}
```

列表项提供分类显示功能, 点击类别, 可以重新加载所选类型的新闻, 把``Feed``页面再次添加至导航``navigator``, 即页面栈.

``` javascript
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
```

点击列表项, 跳转至详情页面``StoryDetail``.

``` javascript
_pressedStory(story) {
  this.props.navigator.push({
    component: StoryDetail,
    title: this._truncateTitle(story.content.name),
    passProps: {story, navigator: this.props.navigator}
  });
}
```

---

## 新闻详情

主要是解析HTML页面, 加载并显示, 除了文字之外, 会显示图片\视频\超链接等样式. 渲染使用动态元素, 状态``state``的``elements``属性.

``` javascript
render() {
  if (this.state.loading) {
    return (
      <Text>Loading</Text>
    );
  }
  return this.state.elements;
}
```

页面启动时, 加载数据. 在``_fetchStoryData``方法中, 进行处理, 使用回调返回数据. 主要内容``body``与多媒体``media``通过滚动视图``ScrollView``的形式显示出来.

``` javascript
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
```

处理数据, 使用``fetch``方法, 分离视频与图片, 还有页面, 通过回调``cb(callback)``的处理返回数据.

``` javascript
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
```

使用``Tautologistics``解析``dom``数据与``body``数据. DOM, 即Document Object Model, 文件对象模型.

``` javascript
_parseXMLBody(body, cb) {
  var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(
    function (error, dom) {
      cb(dom)
    }, {enforceEmptyTags: false, ignoreWhitespace: true});

  var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
  parser.parseComplete(body);
}
```

XML解析类``XMLToReactMap``比较复杂, 不做过多介绍, 参考源码.

---

通过编写新闻类应用, 学习使用网络请求和解析HTML格式的文本. 多编码多思考, 不断学习, ``React Native``是非常有意思的开发语言.

OK, that's all! Enjoy it!
