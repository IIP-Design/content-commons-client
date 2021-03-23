import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';

import Featured from 'components/Featured/Featured';

const { publicRuntimeConfig: { REACT_APP_UI_CONFIG } } = getConfig();

const Landing = ( { config } ) => (
  <section>
    <Featured config={ config } />
  </section>
);

export async function getServerSideProps() {
  const result = await fetch( REACT_APP_UI_CONFIG );
  const config = await result.json();

  return {
    props: { config },
  };
}

Landing.propTypes = {
  config: PropTypes.shape( {
    landing: PropTypes.shape( {
      'private': PropTypes.array,
      'public': PropTypes.array,
    } ),
  } ),
};

export default Landing;
