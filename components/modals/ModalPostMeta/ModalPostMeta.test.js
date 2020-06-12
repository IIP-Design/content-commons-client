import { mount } from 'enzyme';

import ModalPostMeta from './ModalPostMeta';

const logo = 'data:image/svg+xml;base64,logo-file';
const source = 'share.dev.america.gov';
const sourcelink = 'https://share.dev.america.gov';

const props = {
  type: 'post',
  author: null,
  sourcelink,
  logo,
  source,
  datePublished: '2018-01-24T12:05:09+00:00',
  originalLink: 'http://share.dev.america.gov/trump-nominates-new-central-banker/',
  releaseType: null,
  textDirection: 'ltr',
};

jest.mock( 'components/PressSourceMeta/PressSourceMeta', () => 'press-source-meta' );

afterAll( () => { jest.restoreAllMocks(); } );
describe( '<ModalPostMeta />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <ModalPostMeta { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'adapts the post meta values depending on source and logo data', () => {
    const wrapper = mount( <ModalPostMeta { ...props } /> );

    // When all logo properties (logo, sourcelink, source) are present
    expect( wrapper.find( '.modal_section' ).children( 'a' ) ).toHaveLength( 2 );

    const withSourceLink = wrapper.find( 'a' ).first();

    expect( withSourceLink.exists() ).toEqual( true );
    expect( withSourceLink.prop( 'href' ) ).toEqual( sourcelink );
    expect( withSourceLink.children( 'img' ).exists() ).toEqual( true );
    expect( withSourceLink.children( 'img' ).prop( 'alt' ) ).toEqual( source );
    expect( withSourceLink.children( 'img' ).prop( 'src' ) ).toEqual( logo );

    // When there is no sourcelink (but there is a logo and source) provided
    wrapper.setProps( { sourcelink: null } );
    wrapper.update();

    expect( wrapper.find( '.modal_section' ).children( 'a' ) ).toHaveLength( 1 );

    const withSource = wrapper.find( '.modal_postmeta_logo--withSource' );
    const sourceClass = '.modal_postmeta_logo--withSource_source';

    expect( withSource.exists() ).toEqual( true );
    expect( withSource.children( 'img' ).exists() ).toEqual( true );
    expect( withSource.children( 'img' ).prop( 'alt' ) ).toEqual( source );
    expect( withSource.children( 'img' ).prop( 'src' ) ).toEqual( logo );
    expect( withSource.children( 'img' ).prop( 'style' ) ).toEqual( { marginRight: '6px' } );
    expect( withSource.children( sourceClass ).exists() ).toEqual( true );
    expect( withSource.children( sourceClass ).text() ).toEqual( source );

    // Style adjusts to RTL text direction
    wrapper.setProps( { textDirection: 'rtl' } );
    wrapper.update();

    expect( wrapper.find( 'img' ).prop( 'style' ) ).toEqual( { marginLeft: '6px' } );

    // When there is no source or sourcelink (but there is a logo)
    wrapper.setProps( { source: null } );
    wrapper.update();

    expect( wrapper.find( '.modal_section' ).children( 'a' ) ).toHaveLength( 1 );

    const withoutSourceImg = wrapper.find( 'img' );

    expect( withoutSourceImg.exists() ).toEqual( true );
    expect( withoutSourceImg.prop( 'alt' ) ).toEqual( '' );
    expect( withoutSourceImg.prop( 'src' ) ).toEqual( logo );

    // When there is no logo, source, or sourcelink
    wrapper.setProps( { logo: null } );
    wrapper.update();

    expect( wrapper.find( '.modal_section' ).children( 'a' ) ).toHaveLength( 1 );
    expect( wrapper.find( 'img' ).exists() ).toEqual( false );

    // When there is no logo or source (but there is a sourcelink)
    wrapper.setProps( { sourcelink } );
    wrapper.update();

    const onlySourceLink = wrapper.find( '.modal_postmeta_content' ).first();

    expect( onlySourceLink.find( 'a' ).exists() ).toEqual( true );
    expect( onlySourceLink.find( 'a' ).prop( 'href' ) ).toEqual( sourcelink );
    expect( onlySourceLink.find( 'a' ).text() ).toEqual( sourcelink );

    // When there is no logo or sourcelink (but there is a source)
    wrapper.setProps( { source, sourcelink: null } );
    wrapper.update();

    const withoutLogo = wrapper.find( '.modal_postmeta_content' ).first();

    expect( withoutLogo.text() ).toEqual( `Source: ${source}` );

    // When there is a sourcelink and source (but no logo)
    wrapper.setProps( { sourcelink } );
    wrapper.update();

    const withLink = wrapper.find( '.modal_postmeta_content' ).first();

    expect( withLink.find( 'a' ).exists() ).toEqual( true );
    expect( withLink.find( 'a' ).prop( 'href' ) ).toEqual( sourcelink );
    expect( withLink.find( 'a' ).text() ).toEqual( source );

    // When there is a sourcelink and logo (but no source)
    wrapper.setProps( { source: null, logo } );
    wrapper.update();

    expect( wrapper.find( '.modal_section' ).children( 'a' ) ).toHaveLength( 2 );

    const withoutSource = wrapper.find( 'a' ).first();

    expect( withoutSource.prop( 'href' ) ).toEqual( sourcelink );
    expect( withoutSource.children( 'img' ).exists() ).toEqual( true );
    expect( withoutSource.children( 'img' ).prop( 'alt' ) ).toEqual( '' );
    expect( withoutSource.children( 'img' ).prop( 'src' ) ).toEqual( logo );

    // No source span when source is one of those listed as a logo only source
    wrapper.setProps( { source: 'VOA Editorials', sourcelink: null } );
    wrapper.update();

    expect( wrapper.find( '.modal_postmeta_logo--withSource_source' ).exists() ).toEqual( false );
    expect( wrapper.find( 'img' ).exists() ).toEqual( true );
    expect( wrapper.find( 'img' ).prop( 'alt' ) ).toEqual( 'VOA Editorials' );
    expect( wrapper.find( 'img' ).prop( 'src' ) ).toEqual( logo );
  } );

  it( 'renders a PressSourceMeta component when the type is document', () => {
    const newProps = {
      ...props,
      type: 'document',
    };

    const wrapper = mount( <ModalPostMeta { ...newProps } /> );
    const pressMeta = wrapper.find( 'press-source-meta' );

    expect( pressMeta.exists() ).toEqual( true );
  } );

  it( 'converts the published date to human readable format', () => {
    const wrapper = mount( <ModalPostMeta { ...props } /> );

    const postMeta = wrapper.find( '.modal_postmeta_content' );

    expect( postMeta.exists() ).toEqual( true );
    expect( postMeta.text() ).toEqual( 'Date Published: January 24, 2018' );

    wrapper.setProps( { datePublished: null } );

    postMeta.update();
    expect( postMeta.text() ).toEqual( 'Date Published: ' );
  } );

  it( 'does not render the published date when the type is SOCIAL_MEDIA', () => {
    const newProps = {
      ...props,
      type: 'SOCIAL_MEDIA',
    };
    const wrapper = mount( <ModalPostMeta { ...newProps } /> );

    const postMeta = wrapper.find( '.modal_postmeta_content' );

    expect( postMeta.exists() ).toEqual( false );
  } );

  it( 'renders the original link if present and source is not the content site', () => {
    const wrapper = mount( <ModalPostMeta { ...props } /> );

    expect( wrapper.find( '.modal_section' ).children( 'a' ) ).toHaveLength( 2 );

    const original = wrapper.find( 'a' ).at( 1 );

    expect( original.prop( 'href' ) ).toEqual( props.originalLink );
    expect( original.text() ).toEqual( 'View Original' );

    wrapper.setProps( { sourcelink: 'http://content.america.gov/' } );
    wrapper.update();

    expect( wrapper.find( '.modal_section' ).children( 'a' ) ).toHaveLength( 0 );
    expect( wrapper.find( 'View Original' ).exists() ).toEqual( false );

    wrapper.setProps( { sourcelink, originalLink: null } );
    wrapper.update();

    expect( wrapper.find( '.modal_section' ).children( 'a' ) ).toHaveLength( 1 );
    expect( wrapper.find( 'View Original' ).exists() ).toEqual( false );
  } );
} );
