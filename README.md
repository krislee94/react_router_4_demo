# react-router

*本来想给大家教学react-router2.0的版本。但是考虑到4.0的版本已经出现了。本着学新不学旧的原则。今天来带大家踩坑react-router4.0，react-routerV2，v3。V3相对V2其实没有什么改变，V2是一种面向切面的编程思想（AOP），而V4是一种万物皆组件的思想(just component)。V4和V2也大相径庭。因此学了V2的同学可能要在思想有所转变。*

### 1.准备
- 创建项目

```js
//创建项目
create-react-app react4demo
```

- 引入react-router
 
```js
//引入react-router
npm install react-router --save
```

![package.json](http://upload-images.jianshu.io/upload_images/5531021-52c60cd4875acfe6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


**项目中的目录是4.2.0**

### 2.开始

*先让我们看一个小demo。可能开始有些地方不理解，但是之后我会慢慢讲解每个用到的知识点。让我们从整体开始认识react-routerV4*

```js
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
    </div>
  </Router>
)

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)


export default BasicExample;

```
![Demo1-截图](http://upload-images.jianshu.io/upload_images/5531021-b4bc7e32dabe12c7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 2.1包的选择

react router v4 是对v3的重写。现在分为三个包：

- `react-router` :只提供核心的路由和函数。一般的应用不会直接使用
- `react-router-dom` :供浏览器/Web应用使用的API。依赖于react-router， 同时将react-router的API重新暴露(export)出来；
- `react-router-native`:供 React Native 应用使用的API。同时将react-router的API重新暴露(export)出来；

因此对于一般项目来说，我们其实只需要引入`react-router-dom`就好了。如果你项目中存在老版本的v2,v3，需要你先删除

```js
npm uninstall react-router --save
npm install --save react-router-dom
```

#### 2.2`<Router>`
和之前的Router不一样，这里<Router>组件下只允许存在一个子元素，如存在多个则会报错。

```js
/*错误的实例*/
<Router>
      <ul>
        <li><Link to="/">首页</Link></li>
        <li><Link to="/about">关于</Link></li>
        <li><Link to="/topics">主题列表</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
 </Router>
```
同上面的例子不同的是，没有了div的庇护，这里就会报错。

![image.png](http://upload-images.jianshu.io/upload_images/5531021-457a8e148bc4cad1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 2.3`<Route>`

Route组件主要的作用就是当一个location匹配路由的path时，渲染某些UI。示例如下：

```js

<Router>
  <div>
    <Route exact path="/" component={Home}/>
    <Route path="/ttt" component={Topic}/>
  </div>
</Router>

// 如果应用的地址是/,那么相应的UI会类似这个样子：
<div>
  <Home/>
</div>

// 如果应用的地址是/ttt,那么相应的UI就会成为这个样子：
<div>
  <Topic/>
</div>

```

**Route属性**

```js
path（string）: 路由匹配路径。（没有path属性的Route 总是会 匹配）；
exact（bool）：为true时，则要求路径与location.pathname必须完全匹配；
strict（bool）：true的时候，有结尾斜线的路径只能匹配有斜线的location.pathname；
```
同时，新版的路由为<Route>提供了三种渲染内容的方法：

- `<Route component>`:在地址匹配的时候React的组件才会被渲染，route props也会随着一起被渲染；
- `<Route render>`:这种方式对于内联渲染和包装组件却不引起意料之外的重新挂载特别方便；
- `<Route children>`:与render属性的工作方式基本一样，除了它是不管地址匹配与否都会被调用；


上面的例子是讲的<Route component>,现在我们来说<Route render>

```js

//就在源代码中渲染。

<Route path="/home" render={() => <div>Home</div>}/>


// 包装/合成
const FadingRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <FadeIn>
      <Component {...props}/>
    </FadeIn>
  )}/>
)

<FadingRoute path="/cool" component={Something}/>

```

###### <Route component>的优先级要比<Route render>高，所以不要在同一个<Route>中同时使用这两个属性。

#### 2.4`<Link>`

也就是我们的跳转属性啦。现在我们看看Link的属性

- to（string / object）：要跳转的路径或地址；
- replace ：为 true 时，点击链接后将使用新地址替换掉访问历史记录里面的原地址；为 false 时，点击链接后将在原有访问历史记录的基础上添加一个新的纪录。默认为 false；


```js
/*这里一些关于Link的例子*/


//当to为string类型的时候
<Link to="/about">关于</Link>

//to为obj
<Link to={{
  pathname: '/courses',
  search: '?sort=name',
  hash: '#the-hash',
  state: { fromDashboard: true }
}}/>

// replace 
<Link to="/courses" replace />

```

#### 2.5`<NavLink>`

<NavLink>是<Link>的一个特定版本，会在匹配上当前URL的时候会给已经渲染的元素添加样式参数。

我们自己如果手写一个NavLink，应该可以这样去完成：只是封装这层<NavLink>花了更多的心思去完成他的样式封装和功能封装。

```js

import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return <Link {...this.props} activeClassName="active"/>
  }
})

//index.css

.active {
  color: green;
}
```
让我们来看下<NavLink>有什么属性吧

- activeClassName（string）：设置选中样式，默认值为 active；
- activeStyle（object）：当元素被选中时, 为此元素添加样式；
- exact（bool）：为 true 时, 只有当地址完全匹配 class 和 style 才会应用；
- strict（bool）：为 true 时，在确定位置是否与当前 URL 匹配时，将考虑位置 pathname 后的斜线；
isActive（func）：判断链接是否激活的额外逻辑的功能；


**来看几个简单的demo**

```js
// activeClassName选中时样式为selected
<NavLink
  to="/faq"
  activeClassName="selected"
 >FAQs</NavLink>

// 选中时样式为activeStyle的样式设置
<NavLink
  to="/faq"
  activeStyle={{
    fontWeight: 'bold',
    color: 'red'
   }}
 >FAQs</NavLink>
 
 
// 当event id为奇数的时候，激活链接
const oddEvent = (match, location) => {
  if (!match) {
    return false
  }
  const eventID = parseInt(match.params.eventID)
  return !isNaN(eventID) && eventID % 2 === 1
}

<NavLink
  to="/events/123"
  isActive={oddEvent}
>Event 123</NavLink>



```


#### 2.6`<Switch>`

该组件用来渲染匹配地址的第一个<Route>或者<Redirect>。那么它与使用一堆route又有什么区别呢？

<Switch>的独特之处是独它仅仅渲染一个路由。相反地，每一个包含匹配地址(location)的<Route>都会被渲染。思考下面的代码：

```js
<Route path="/about" component={About}/>
<Route path="/:user" component={User}/>
<Route component={NoMatch}/>
```

如果现在的URL是/about，那么<About>, <User>, 还有<NoMatch>都会被渲染，因为它们都与路径(path)匹配。这种设计，允许我们以多种方式将多个<Route>组合到我们的应用程序中，例如侧栏(sidebars)，面包屑(breadcrumbs)，bootstrap tabs等等。 然而，偶尔我们只想选择一个<Route>来渲染。如果我们现在处于/about，我们也不希望匹配/:user（或者显示我们的 “404” 页面 ）。以下是使用 Switch 的方法来实现

```js
<Switch>
  <Route exact path="/" component={Home}/>
  <Route path="/about" component={About}/>
  <Route path="/:user" component={User}/>
  <Route component={NoMatch}/>
</Switch>
```

现在，如果我们处于/about，<Switch>将开始寻找匹配的<Route>。<Route path="/about"/> 将被匹配， <Switch>将停止寻找匹配并渲染<About>。同样，如果我们处于/michael，<User>将被渲染

以上是react-router的基础。
***

### 3.URL参数

同样的，我们先来看一个demo

```js
import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const ParamsExample = () => (
  <Router>
    <div>
      <h2>Accounts</h2>
      <ul>
        <li><Link to="/netflix">Netflix</Link></li>
        <li><Link to="/zillow-group">Zillow Group</Link></li>
        <li><Link to="/yahoo">Yahoo</Link></li>
        <li><Link to="/modus-create">Modus Create</Link></li>
      </ul>

      <Route path="/:id" component={Child}/>
    </div>
  </Router>
)

const Child = ({ match }) => (
  <div>
    <h3>ID: {match.params.id}</h3>
  </div>
)

export default ParamsExample
```

### 4.重定向
<Redirect>
组件用于路由的跳转，即用户访问一个路由，会自动跳转到另一个路由。

**这里原本我们需要访问protected，由于没登录被跳转登录到login页面。**

看效果图:

![image.png](http://upload-images.jianshu.io/upload_images/5531021-0a18dddc9890af9a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这是一个需要你登录才能查看隐私内容。那么如何去实现呢？

```js

  const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
      this.isAuthenticated = true
      setTimeout(cb, 100) // fake async
    },
    signout(cb) {
      this.isAuthenticated = false
      setTimeout(cb, 100)
    }
  }	
  
  
  const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
      fakeAuth.isAuthenticated ? (
        <Component {...props}/>
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }}/>
      )
    )}/>
  )
  
  const AuthButton = withRouter(({ history }) => (
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome! <button onClick={() => {
          fakeAuth.signout(() => history.push('/'))
        }}>Sign out</button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
  ))
```

代码中出现了**withRouter**这个又是什么呢？

*首先withRouter是一个组件，withRouter可以包装任何自定义组件，将react-router 的 history,location,match 三个对象传入。 无需一级级传递react-router 的属性，当需要用的router 属性的时候，将组件包一层withRouter，就可以拿到需要的路由信息*

ok,得到了**history**(统一的API管理历史堆栈、导航、确认跳转、以及sessions间的持续状态)。在v3的时候，我们想跳转路径，一般会这样处理。

1. 我们从react-router导出browserHistory。
2. 我们使用browserHistory.push()等等方法操作路由跳转。

例如：

```js
import browserHistory from 'react-router';

export function addProduct(props) {
  return dispatch =>
    axios.post(`xxx`, props, config)
      .then(response => {
        browserHistory.push('/cart'); //这里
      });
}
```

在v4我们直接操作history来进行路由栈的管理。`history.push('/'))`默认调到该路由的主页

ok,现在我们来看Login里的代码

```js
class Login extends React.Component {
    state = {
      redirectToReferrer: false
    }
  
    login = () => {
      fakeAuth.authenticate(() => {
        this.setState({ redirectToReferrer: true })
      })
    }
  
    render() {
      const { from } = this.props.location.state || { from: { pathname: '/' } }
      const { redirectToReferrer } = this.state

      if (redirectToReferrer) {
        return (
          <Redirect to={from}/>
        )
      }
      
      return (
        <div>
          <p>You must log in to view the page at {from.pathname}</p>
          <button onClick={this.login}>Log in</button>
        </div>
      )
    }
  }
```

**这里肯定有人会有疑问，这里的from 是什么？打印出来是什么？**

回答这个问题，我们先来看一下**location**

首先location是一个Object。当前访问地址信息组成的对象，具有如下属性：

- pathname: string URL路径
- search: string URL中的查询字符串
- hash: string URL的 hash 片段
- state: string 例如执行 push(path, state) 操作时，location 的 state 将被提供到堆栈信息里。

打印出来刚刚代码里的**location**

![location](http://upload-images.jianshu.io/upload_images/5531021-779ae3686ab35208.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这里的from.pathname是 /protected 意思是什么？其实本应该跳转到 ‘/protected’，但是redirect 因为你没登录拦截下来了。因此我们可以通过 this.props.location.state.from 来查看是否跳转到成功的页面。讲到这里相信大家对重定向有了自己的理解。手敲一遍代码是最方便也是最好的理解。

### 5.自定义链接

![自定义截图](http://upload-images.jianshu.io/upload_images/5531021-8800c2c0ae3903bc.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

自定义链接的思路，其实就是对`<Route>`和`<Link>` 进行封装一层。

```js
  const OldSchoolMenuLink = ({ label, to, activeOnlyWhenExact }) => (
    <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
      <div className={match ? 'active' : ''}>
        {match ? '> ' : ''}<Link to={to}>{label}</Link>
      </div>
    )}/>
  )
  
```

要想理解这段代码，我们先了解**match**，

match 对象包含了 <Route path> 如何与 URL 匹配的信息，具有以下属性：

- params: object 路径参数，通过解析 URL 中的动态部分获得键值对
- isExact: bool 为 true 时，整个 URL 都需要匹配
- path: string 用来匹配的路径模式，用于创建嵌套的 <Route>
- url: string URL 匹配的部分，用于嵌套的 <Link>

在以下情境中可以获取 match 对象

- 在 Route component 中，以 this.props.match获取
- 在 Route render 中，以 ({match}) => () 方式获取
- 在 Route children 中，以 ({match}) => () 方式获取
- 在 withRouter 中，以 this.props.match的方式获取
- matchPath 的返回值



![打印match内容](http://upload-images.jianshu.io/upload_images/5531021-2ce47cc04f30cf72.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

当该链接被点击的时候，match就有了值，未被点击的就是null。这时候可以根据match是否存在来进行判断。当有的时候，className为active，并且，在Link之前加上 > 符号

理解了match对于这里的理解就会显得方便了多。在项目中我们可以根据自己的需求封装不同样式不同外观的造型。

### 6.防止转换
首先我们来看一下这里的效果图
![QQ20180131-162002.gif](http://upload-images.jianshu.io/upload_images/5531021-32a42a6173268aa7.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

*代码*：

```js
        <Prompt
          when={isBlocking}
          message={history => (
            `Are you sure you want to go to ${history.pathname}`
          )}
        />
        
        //这里history 同样可以 使用location.pathname 来获得
```
其实这里的关键就 一个组件 **Prompt** ，我们来看一下它的属性：

- message ：提示用户的一种方式。（可以得到 history ，match ，location）
- when：作为一种触发的方式 bool 类型

### 7.404 No match

之前上面是switch讲的有点干瘪，现在配合着具体的代码来说

```js
const NoMatchExample = () => (
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/old-match">Old Match, to be redirected</Link></li>
          <li><Link to="/will-match">Will Match</Link></li>
          <li><Link to="/will-not-match">Will Not Match</Link></li>
          <li><Link to="/also/will/not/match">Also Will Not Match</Link></li>
        </ul>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Redirect from="/old-match" to="/will-match"/>
          <Route path="/will-match" component={WillMatch}/>
          <Route component={NoMatch}/>
        </Switch>
      </div>
    </Router>
  )
  
  const Home = () => (
    <p>
      A <code>&lt;Switch></code> renders the
      first child <code>&lt;Route></code> that
      matches. A <code>&lt;Route></code> with
      no <code>path</code> always matches.
    </p>
  )
  
  const WillMatch = () => <h3>Matched!</h3>
  
  const NoMatch = ({ location }) => (
    <div>
      <h3>No match for <code>{location.pathname}</code></h3>
    </div>
  )
  
  export default NoMatchExample
```

我们把switch 理解为 代码中的 switch case 有匹配的则跳转。`<Route component={NoMatch}/>` 放在最后的意义是，如果上诉都没有匹配的，那么就跳转到404页面。

### 8.递归路径

通常来说，递归路径适用于项目中需要用到分级的地方，比如，一级目录，二级目录，三级目录这样子。我们先来看一下项目的效果图。

![递归路径.gif](http://upload-images.jianshu.io/upload_images/5531021-949788f951bd0b55.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接下来，我们来解析源码。

```js
const PEEPS = [
    { id: 0, name: 'Michelle', friends: [ 1, 2, 3 ] },
    { id: 1, name: 'Sean', friends: [ 0, 3 ] },
    { id: 2, name: 'Kim', friends: [ 0, 1, 3 ], },
    { id: 3, name: 'David', friends: [ 1, 2 ] }
  ]
  
  const find = (id) => PEEPS.find(p => p.id == id)
  
  const RecursiveExample = () => (
    <Router>
      <Person match={{ params: { id: 0 }, url: '' }}/>
    </Router>
  )
  
  const Person = ({ match }) => {
    
    //console.log(match);
    const person = find(match.params.id)
    console.log(person);
    return (
      <div>
        <h3>{person.name}’s Friends</h3>
        <ul>
          {person.friends.map(id => (
            <li key={id}>
              <Link to={`${match.url}/${id}`}>
                {find(id).name}
              </Link>
            </li>
          ))}
        </ul>
        <Route path={`${match.url}/:id`} component={Person}/>
      </div>
    )
  }
```

**find** 是ES6中的方法。用于找到第一个符合条件的数组成员并返回。

*每次点击的时候，我们会传递id过去。因此可以使用“match” 查看我们的params 中的参数属性。通过id 再继而判断 找出是 find 的数据。*

这里的知识点是告诉我们如何进行递归路径的排序。

### 9.边栏
边栏的代码相对较简单，这里我就不多过述

### 10.动画转化
首先来看效果图
![QQ20180201-101027.gif](http://upload-images.jianshu.io/upload_images/5531021-309ba8503f8f87cb.gif?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这里需要我们在项目导入

```js
npm install react-transition-group --save
```
我们用到了CSSTransitionGroup 这个组件。它有这么些个属性

```js
transitionName="fade"
transitionEnterTimeout={300}
transitionLeaveTimeout={300}
```
[更多的大家可以上github上查看](https://reactcommunity.org/react-transition-group/) 具体的文档。

```js
 <div style={styles.content}>
            <CSSTransitionGroup
              transitionName="fade"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {/* no different than other usage of
                  CSSTransitionGroup, just make
                  sure to pass `location` to `Route`
                  so it can match the old location
                  as it animates out
              */}
              <Route
                location={location}
                key={location.key}
                path="/:h/:s/:l"
                component={HSL}
              />
            </CSSTransitionGroup>
          </div>
```

### 11.不明确匹配
知识点也同switch，这里就不过多述

### 12.路由配置
官方文档里写的路由配置，可以实际配置到项目中的。它把我们所有的路由情况加载到一个数组中，通过数组去配置整个路由。

```js
const routes = [
  { path: '/sandwiches',
    component: Sandwiches
  },
  { path: '/tacos',
    component: Tacos,
    routes: [
      { path: '/tacos/bus',
        component: Bus
      },
      { path: '/tacos/cart',
        component: Cart
      }
    ]
  }
]
```
如果有多个路由，routes继续递增。我们可以看到routes[1]的这个路由对象，它的路由一级目录是'/tacos' 在‘/tacos‘下还有二级目录。分别是'/tacos/bus'和'/tacos/cart'。因此每次我们需要增加路由的时候，只需要在routes这个数组中完成配置，并不需要添加额外的组件，同时也减少了代码的耦合，增加了可读性，这是非常关键的一点。

```js
const RouteWithSubRoutes = (route) => 
{   
    console.log(route);
    return(
  <Route path={route.path} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes}/>
  )}/>
)}
```
上面这个是对路由的一次封装。

```js
const RouteConfigExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/tacos">Tacos</Link></li>
        <li><Link to="/sandwiches">Sandwiches</Link></li>
      </ul>

      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route}/>
      ))}
    </div>
  </Router>
)

```
使用的时候，我们只需要对数组进行一次map遍历。按照上面封装的方法依次加载所需展示的路由。

与此同时我也在思考一个问题？

我们使用标签的方式去展示路由，自然是没有问题的，但是？假设项目很大。我们使用webpack对项目进行打包，webpack是把所有的文件都打包在一个main.***.js的文件中，那么加载首页的时候的，就需要花费大量的的时间去加载这么大的文件，岂不是很耗时间？

**如何改善？**

按需加载。。也可以叫延迟加载。 [这里有一份简书的文档可以参考(作者:zhangpei)](https://www.jianshu.com/p/ba3c295be412),里面的内容值得深入琢磨，在这里不做讨论，有兴趣的可以研究研究。


#####[demo地址-github](https://github.com/krislee94/react_router_4_demo/)

###参考
```js
作者：阮一峰
链接：http://www.ruanyifeng.com/blog/2016/05/react_router.html?utm_source=tool.lu
```

```js
react-router 官网
链接 ：https://reacttraining.com/react-router/web/example/url-params

```

```js
作者：桂圆_noble
链接：https://www.jianshu.com/p/6a45e2dfc9d9
來源：简书
```
```js
参考博文链接：http://blog.csdn.net/sinat_17775997/article/details/69218382
```


