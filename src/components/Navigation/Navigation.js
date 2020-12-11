import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/charts">Charts</Link>
        </li>
        <li>
          <Link to="/trees">Trees</Link>
        </li>
        <li>
          <Link to="/three-js">ThreeJS</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navigation;
