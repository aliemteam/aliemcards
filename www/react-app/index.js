import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import NotFound from './bits/not-found';
import Main from './bits/main';
import Home from './bits/home';
import Empty from './bits/empty';
import Cards from './bits/cards';
import CardContainer from './bits/card-container';
import Category from './bits/category';
import Categories from './bits/categories';
import TagsContainer from './bits/tags-container';
import TagContainer from './bits/tag-container';


injectTapEventPlugin();

ReactDOM.render((
  <Router history={browserHistory}>
    <Route name="Home" path="/" component={Main}>
      <IndexRoute component={Home} />

      <Route name="Cards" path="/cards">
        <IndexRoute component={Cards} />
        <Route name="Card" path=":slug" component={CardContainer} />
      </Route>
      <Route name="Card" path="/cards/:slug" component={CardContainer} />

      <Route name="Categories" path="/categories">
        <IndexRoute component={Categories} />
        <Route name="Category" path=":catslug" component={Empty}>
          <IndexRoute component={Category} />
          <Route name="CatCard" path=":slug" component={CardContainer} />
        </Route>
      </Route>

      <Route name="Tags" path="/tags" >
        <IndexRoute component={TagsContainer} />
        <Route name="Tag" path=":tagslug" component={Empty}>
          <IndexRoute component={TagContainer} />
          <Route name="Card" path=":slug" component={CardContainer} />
        </Route>
      </Route>

      <Route name="Not Found" path="*" component={NotFound} />
    </Route>
  </Router>
), document.getElementById('app'));
