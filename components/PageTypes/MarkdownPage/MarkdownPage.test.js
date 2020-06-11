import { mount } from 'enzyme';

import MarkdownPage from './MarkdownPage';

const mockProps = {
  data: 'Mock data',
  error: null,
  pageTitle: 'Mock Title',
  pageSubTitle: 'Mock Subtitle',
};

const withError = {
  ...mockProps,
  error: 404,
};

describe( '<MarkdownPage />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <MarkdownPage /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the provided content', () => {
    const wrapper = mount(
      <MarkdownPage { ...mockProps }>
        <p>Child Node</p>
      </MarkdownPage>,
    );

    const header = wrapper.find( 'h1' );
    const subheader = wrapper.find( '.sub.header' );
    const renderedText = wrapper.find( 'TextRenderer' );

    expect( header.exists() ).toEqual( true );
    expect( header.text() ).toEqual( `${mockProps.pageTitle}${mockProps.pageSubTitle}` );

    expect( subheader.exists() ).toEqual( true );
    expect( subheader.text() ).toEqual( mockProps.pageSubTitle );

    expect( renderedText.exists() ).toEqual( true );
    expect( renderedText.text() ).toEqual( mockProps.data );
  } );

  it( 'renders an error message if there is an error', () => {
    const wrapper = mount( <MarkdownPage { ...withError } /> );

    const errorPage = wrapper.find( 'ErrorPage' );
    const header = wrapper.find( 'h1' );
    const subheader = wrapper.find( '.sub.header' );
    const renderedText = wrapper.find( 'TextRenderer' );

    expect( errorPage.exists() ).toEqual( true );
    expect( header.text() ).toEqual( withError.error.toString() );
    expect( subheader.exists() ).toEqual( false );
    expect( renderedText.exists() ).toEqual( false );
  } );
} );
