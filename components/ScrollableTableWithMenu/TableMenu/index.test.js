import React from 'react';
import { shallow } from 'enzyme';

import TableMenu from './index';

describe( '<TableMenu />', () => {
  it( 'renders without crashing', () => {
    shallow( <TableMenu /> );
  } );
} );
