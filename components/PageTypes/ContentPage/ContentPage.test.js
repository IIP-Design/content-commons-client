import { mount } from 'enzyme';

import ContentPage from './ContentPage';

jest.mock( 'components/Meta/PageMeta', () => () => 'page-meta' );

describe( '<ContentPage />', () => {
  it( 'render without crashing', () => {
    const wrapper = mount( <ContentPage item={ {} } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'render the page meta and child components', () => {
    const wrapper = mount(
      <ContentPage item={ {} }>
        <p>Test content</p>
      </ContentPage>,
    );

    const section = wrapper.find( 'section' );

    expect( wrapper.contains( 'page-meta' ) ).toEqual( true );
    expect( section.exists() ).toEqual( true );
    expect( section.find( 'p' ).text() ).toEqual( 'Test content' );
  } );

  it( 'shows the "Content Unavailable" message when no item is provided', () => {
    const wrapper = mount( <ContentPage /> );

    const section = wrapper.find( 'section' );

    expect( wrapper.contains( 'page-meta' ) ).toEqual( false );
    expect( section.exists() ).toEqual( true );
    expect( section.find( 'p' ).text() ).toEqual( 'Content Unavailable' );
  } );
} );
