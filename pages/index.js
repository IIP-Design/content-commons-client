import React from 'react';
import Featured from 'components/Featured/Featured';
import { useDispatch } from 'react-redux';
import { clearFilters } from 'lib/redux/actions/filter';

const Landing = () => {
  const dispatch = useDispatch();

  // trigger parallel loading calls to reset filters
  dispatch( clearFilters() );

  return (
    <section>
      <Featured />
    </section>
  );
};

export default Landing;
