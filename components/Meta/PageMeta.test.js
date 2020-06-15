import { mount } from 'enzyme';

import PageMeta from './PageMeta';

import { mockNonVideoItem, mockVideoItem } from './mocks';

const mockUrl = 'https://mockurl.com';
const mockSignedUrl = 'https://mocksignedurl.com';

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: mockSignedUrl } ) ) );


describe( '<PageMeta />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <PageMeta item={ mockVideoItem } url={ mockUrl } /> );

    const head = wrapper.find( 'Head' );

    expect( wrapper.exists() ).toEqual( true );
    expect( head.exists() ).toEqual( true );
  } );

  it( 'does not return meta headers when the item visibility is "INTERNAL"', () => {
    const wrapper = mount( <PageMeta item={ mockNonVideoItem } url={ mockUrl } /> );

    const head = wrapper.find( 'Head' );

    expect( wrapper.exists() ).toEqual( true );
    expect( head.exists() ).toEqual( false );
  } );
} );
