import React from 'react';
import { shallow } from 'enzyme';

import withAuth from './index';

describe( '<withAuth />', () => {
  it( 'renders without crashing', () => {
    shallow( <withAuth /> );
  } );
} );
