import React from 'react';
import { shallow } from 'enzyme';

import MyProjectPrimaryCol from './MyProjectPrimaryCol';

describe( '<MyProjectPrimaryCol />', () => {
  it( 'renders without crashing', () => {
    shallow( <MyProjectPrimaryCol /> );
  } );
} );
