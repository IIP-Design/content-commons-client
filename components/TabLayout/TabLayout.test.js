import React from 'react';
import { mount } from 'enzyme';

import TabLayout from './TabLayout';

const props = {
  headline: 'Download this graphic.',
  tabs: [
    { title: 'Graphic Files', content: <div /> },
    { title: 'Editable Files', content: <div /> },
    { title: 'Other', content: <div /> },
    { title: 'Help', content: <div /> },
  ],
};

jest.mock( 'react', () => ( {
  ...jest.requireActual( 'react' ),
  useEffect: () => ( {} ),
} ) );

describe( 'TabLayout', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <TabLayout { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );
} );
