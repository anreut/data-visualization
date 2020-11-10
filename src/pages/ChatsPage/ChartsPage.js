import React from 'react';
import Navigation from '../../components/Navigation';
import MultiLineChart from '../../components/MultiLineChart';
import SimpleBarChart from '../../components/SimpleBarChart';

const ScalesPage = () => {
  return (
    <div>
      <Navigation />
      <div>
        <SimpleBarChart />
      </div>
      <div>
        <MultiLineChart />
      </div>
    </div>
  );
};

export default ScalesPage;
