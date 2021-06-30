import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';

import Packages from './Packages/Packages';
import Playbooks from './Playbooks/Playbooks';
import Recents from './Recents/Recents';
import Priorities from './Priorities/Priorities';

import { useAuth } from 'context/authContext';

const components = {
  Packages,
  Playbooks,
  Recents,
  Priorities,
};

const Featured = ( { config } ) => {
  const { user } = useAuth();

  const renderSection = data => {
    const { key, props } = data;

    const ComponentName = components[data.component];

    return <ComponentName key={ key } { ...props } user={ user } />;
  };

  if ( !config?.landing ) {
    return null;
  }

  const { landing: { 'private': privateData, 'public': publicData } } = config;

  return (
    <div className="featured">
      { user && user.id !== 'public' && sortBy( privateData, 'order' ).map( d => renderSection( d ) ) }

      { sortBy( publicData, 'order' ).map( d => renderSection( d ) ) }
    </div>
  );
};

Featured.propTypes = {
  config: PropTypes.shape( {
    landing: PropTypes.object,
  } ),
};

export default Featured;
