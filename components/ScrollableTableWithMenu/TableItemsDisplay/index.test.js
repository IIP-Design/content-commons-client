import React from 'react';
import { shallow } from 'enzyme';

import TableItemsDisplay from './index';

describe( '<TableItemsDisplay />', () => {
  it( 'renders without crashing', () => {
    shallow( <TableItemsDisplay /> );
  } );
} );
