import { mount } from 'enzyme';

import Meta from './Meta';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_GOOGLE_ANALYTICS_ID: '12345',
  },
} ) );

describe( '<Meta />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <Meta title="Mock Title" /> );

    const head = wrapper.find( 'Head' );

    expect( wrapper.exists() ).toEqual( true );
    expect( head.exists() ).toEqual( true );
  } );
} );
