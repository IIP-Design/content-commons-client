import React from 'react';
import { shallow } from 'enzyme';

import TableActionsMenu from './index';

describe( '<TableActionsMenu />', () => {
  it( 'renders without crashing', () => {
    shallow( <TableActionsMenu /> );
  } );
} );
