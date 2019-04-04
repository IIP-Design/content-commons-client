import React from 'react';
import { shallow } from 'enzyme';

import ScrollableTableWithMenu from './index';

describe( '<ScrollableTableWithMenu />', () => {
  it( 'renders without crashing', () => {
    shallow( <ScrollableTableWithMenu /> );
  } );
} );
