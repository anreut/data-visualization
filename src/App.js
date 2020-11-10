import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import ChartsPage from './pages/ChatsPage';
import TreesPage from './pages/TreesPage';

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
      </Switch>
    </Router>
  );
};
export default App;
