import React from 'react';
import Navigation from '../../components/Navigation';
import NonHierarchicTree from '../../components/nonHierarchicTree';
import HierarchicTree from '../../components/HierarchicTree';

const TreesPage = () => {
  return (
    <div>
      <Navigation />
      <div>
        <HierarchicTree />
      </div>
      {/* <div>
        <NonHierarchicTree />
      </div> */}
    </div>
  );
};

export default TreesPage;
