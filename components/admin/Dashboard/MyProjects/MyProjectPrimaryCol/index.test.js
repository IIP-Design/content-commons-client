import React from 'react';
import { shallow } from 'enzyme';

import MyProjectPrimaryCol from './index';

describe( '<MyProjectPrimaryCol />', () => {
  it( 'renders without crashing', () => {
    shallow( <MyProjectPrimaryCol /> );
  } );
} );
