import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import ChartsPage from './pages/ChatsPage';
import TreesPage from './pages/TreesPage';
import ThreeJSPage from './pages/ThreeJSPage';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/charts">
          <ChartsPage />
        </Route>
        <Route path="/trees">
          <TreesPage />
        </Route>
        <Route path="/three-js">
          <ThreeJSPage />
        </Route>
      </Switch>
    </Router>
  );
};
export default App;
