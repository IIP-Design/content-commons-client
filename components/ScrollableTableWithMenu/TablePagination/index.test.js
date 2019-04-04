import React from 'react';
import { shallow } from 'enzyme';

import TablePagination from './index';

describe( '<TablePagination />', () => {
  it( 'renders without crashing', () => {
    shallow( <TablePagination /> );
  } );
} );
