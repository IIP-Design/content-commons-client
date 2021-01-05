import React from 'react';
import PropTypes from 'prop-types';
import Featured from 'components/Featured/Featured';
import { fetchUser } from 'context/authContext';
import { useDispatch } from 'react-redux';
import { clearFilters } from 'lib/redux/actions/filter';


const Landing = ( { user } ) => {
  const dispatch = useDispatch();

  // trigger parallel loading calls to reset filters
  dispatch( clearFilters() );

  return (
    <section>
      <Featured
        user={ user }
      />
    </section>
  );
};

Landing.propTypes = {
  user: PropTypes.object,
};

// Prefer to use getServerSideProps but context does not
// have access to the apolloClient.
Landing.getInitialProps = async ctx => {
  const user = await fetchUser( ctx );

  return { user };
};

export default Landing;
