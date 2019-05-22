import React from 'react';
import { shallow } from 'enzyme';

import TableMobileDataToggleIcon from './TableMobileDataToggleIcon';

describe( '<TableMobileDataToggleIcon />', () => {
  it( 'renders without crashing', () => {
    shallow( <TableMobileDataToggleIcon /> );
  } );
} );
