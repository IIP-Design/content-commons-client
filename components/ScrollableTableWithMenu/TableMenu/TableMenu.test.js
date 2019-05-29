import React from 'react';
import { shallow } from 'enzyme';

import TableMenu from './TableMenu';

describe( '<TableMenu />', () => {
  it( 'renders without crashing', () => {
    shallow( <TableMenu /> );
  } );
} );
