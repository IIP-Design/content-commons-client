import React from 'react';
import { shallow } from 'enzyme';

import TableActionsMenu from './TableActionsMenu';

describe( '<TableActionsMenu />', () => {
  it( 'renders without crashing', () => {
    shallow( <TableActionsMenu /> );
  } );
} );
