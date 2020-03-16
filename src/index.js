import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import thunk from 'redux-thunk';
// import serviceWorker from './serviceWorker';

/* Css */
import './index.scss';

/* Layout */
import App from 'layout/App';

/* Pages */
import Home from 'pages/Home';
import Upload from 'pages/Upload';
import Parse from 'pages/Parse';
import Create from 'pages/Rule/Create';

import rootReducer from './reducers';

/* Tools */
if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
  whyDidYouRender(React);
}

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/upload" component={Upload} />
          <Route path="/parse" component={Parse} />
          <Route path="/rules/create" component={Create} />
        </Switch>
      </App>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);

// serviceWorker.register()