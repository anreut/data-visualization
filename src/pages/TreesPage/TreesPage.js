import React from 'react';
import Navigation from '../../components/Navigation';
import NonHierarchicTree from '../../components/nonHierarchicTree';

const TreesPage = () => {
  return (
    <div>
      <Navigation />
      <div>
        <NonHierarchicTree />
      </div>
    </div>
  );
};

export default TreesPage;
