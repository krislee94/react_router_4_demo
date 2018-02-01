import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Auth from './pages/Auth';
import CustomLinkExample from './pages/CustomLinkExample';
import PreventingTransitionsExample from './pages/PreventingTransitionsExample';
import NoMatchExample from './pages/NoMatchExample';
import RecursiveExample from './pages/RecursiveExample';
import AnimationExample from './pages/AnimationExample';
import RouteConfigExample from './pages/RouteConfigExample';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
        <li><Link to="/auth">重定向页面</Link></li>
        <li><Link to='/custom'>自定义链接</Link></li>
        <li><Link to='/pte'>防止转换</Link></li>
        <li><Link to='/nomatch'>404</Link></li>
        <li><Link to='/digui'>递归路径</Link></li>
        <li><Link to="/animation">动画转换</Link></li>
        <li><Link to="/routerconfig">路由配置</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
      <Route path="/topics" component={Topics}/>
      <Route path="/auth" component={Auth}/>
      <Route path="/custom" component={CustomLinkExample}/>
      <Route path="/pte" component={PreventingTransitionsExample}/>
      <Route path="/nomatch" component={NoMatchExample}/>
      <Route path="/digui" component={RecursiveExample}/>
      <Route path="/animation" Component={AnimationExample} />
      <Route path="/routerconfig" Component={RouteConfigExample} />
    </div>
  </Router>

  /**
   * 重定向
   */

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
