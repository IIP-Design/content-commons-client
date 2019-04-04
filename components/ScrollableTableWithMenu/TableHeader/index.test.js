import React from 'react';
import { shallow } from 'enzyme';

import TableHeader from './index';

describe( '<TableHeader />', () => {
  it( 'renders without crashing', () => {
    shallow( <TableHeader /> );
  } );
} );
