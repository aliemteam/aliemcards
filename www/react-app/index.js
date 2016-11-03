import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import NotFound from './bits/not-found';
import Main from './bits/main';
import Home from './bits/home';
import Empty from './bits/empty';
import Cards from './bits/cards';
import Card from './bits/card';
import Category from './bits/category';
import Categories from './bits/categories';
import Tags from './bits/tags';
import Tag from './bits/tag';
import Search from './bits/search';


injectTapEventPlugin();

ReactDOM.render((
  <Router history={browserHistory}>
    <Route name="Home" path="/" component={Main}>
      <IndexRoute component={Home} />

      <Route name="Cards" path="/cards">
        <IndexRoute component={Cards} />
        <Route name="Card" path=":slug" component={Card} />
      </Route>
      <Route name="Card" path="/cards/:slug" component={Card} />

      <Route name="Categories" path="/categories">
        <IndexRoute component={Categories} />
        <Route name="Category" path=":catslug" component={Empty}>
          <IndexRoute component={Category} />
          <Route name="CatCard" path=":slug" component={Card} />
        </Route>
      </Route>

      <Route name="Tags" path="/tags" >
        <IndexRoute component={Tags} />
        <Route name="Tag" path=":tagslug" component={Empty}>
          <IndexRoute component={Tag} />
          <Route name="Card" path=":slug" component={Card} />
        </Route>
      </Route>

      <Route name="Search" path="/search" component={Search} />

      <Route name="Not Found" path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('app'));
