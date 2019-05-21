import React from 'react';
import { shallow } from 'enzyme';

import TableItemsDisplay from './TableItemsDisplay';

describe( '<TableItemsDisplay />', () => {
  it( 'renders without crashing', () => {
    shallow( <TableItemsDisplay /> );
  } );
} );
