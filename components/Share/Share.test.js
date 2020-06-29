import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Share from './Share';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );


describe( '<Share />', () => {
  const props = {
    id: 'c888',
    isPreview: false,
    site: '',
    language: 'en-us',
    link: 'https://player.vimeo.com/video/23729318',
    title: 'the title',
    type: 'video',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <Share { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'does not render the Facebook and Twitter share links if there is no link prop', () => {
    wrapper.setProps( { link: '', type: 'post' } );
    const list = wrapper.find( 'List' );

    expect( list.exists() ).toEqual( false );
  } );

  it( 'renders the Facebook and Twitter share links if type is post, but not if type is video, document, graphic, or package', () => {
    const list = wrapper.find( '.share_list' );

    // Test type video
    expect( wrapper.prop( 'type' ) ).toEqual( 'video' );
    expect( wrapper.find( 'List' ).exists() ).toEqual( false );

    // Test type post
    wrapper.setProps( { type: 'post' } );
    expect( wrapper.prop( 'type' ) ).toEqual( 'post' );
    expect( wrapper.find( 'List' ).exists() ).toEqual( true );

    // Test type document
    wrapper.setProps( { type: 'document' } );
    expect( wrapper.prop( 'type' ) ).toEqual( 'document' );
    expect( list.exists() ).toEqual( false );

    // Test type graphic
    wrapper.setProps( { type: 'graphic' } );
    expect( wrapper.prop( 'type' ) ).toEqual( 'graphic' );
    expect( list.exists() ).toEqual( false );

    // Test type package
    wrapper.setProps( { type: 'package' } );
    expect( wrapper.prop( 'type' ) ).toEqual( 'package' );
    expect( wrapper.find( 'List' ).exists() ).toEqual( false );
  } );

  it( 'passes the correct Facebook and Twitter share links if type is post and is from content.america.gov', () => {
    jest.resetModules();
    wrapper.setProps( { link: 'content.america.gov', type: 'post' } );

    /* eslint-disable global-require */
    const libBrowser = require( 'lib/browser' );

    libBrowser.stringifyQueryString = jest.fn( () => (
      `http://localhost/article?id=${props.id}&site=${props.site}`
    ) );

    const shareLink = libBrowser.stringifyQueryString();
    const facebookBtn = wrapper.find( 'ShareButton[icon="facebook f"]' );
    const twitterBtn = wrapper.find( 'ShareButton[icon="twitter"]' );
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`;
    const twitterShare = `https://twitter.com/intent/tweet?text=${props.title}&url=${shareLink}`;

    expect( wrapper.prop( 'link' ) ).toEqual( 'content.america.gov' );
    expect( wrapper.prop( 'type' ) ).toEqual( 'post' );
    expect( facebookBtn.prop( 'url' ) ).toEqual( facebookShare );
    expect( twitterBtn.prop( 'url' ) ).toEqual( twitterShare );
  } );

  it( 'passes the correct link to ClipboardCopy if type is video & !isPreview', () => {
    jest.resetModules();
    const clipboardCopy = wrapper.find( 'ClipboardCopy' );
    const type = wrapper.prop( 'type' );

    const libBrowser = require( 'lib/browser' );

    libBrowser.stringifyQueryString = jest.fn( () => (
      `http://localhost/${type}?id=${props.id}&site=${props.site}&language=${props.language}`
    ) );
    const shareLink = libBrowser.stringifyQueryString();

    expect( clipboardCopy.prop( 'copyItem' ) ).toEqual( shareLink );
  } );

  it( 'passes the placeholder text to ClipboardCopy if type is video & isPreview is true', () => {
    wrapper.setProps( {
      isPreview: true,
      link: 'The direct link to the project will appear here.',
    } );
    const clipboardCopy = wrapper.find( 'ClipboardCopy' );

    expect( clipboardCopy.prop( 'copyItem' ) ).toEqual( wrapper.prop( 'link' ) );
  } );

  it( 'passes the correct link to ClipboardCopy if type is post and is from content.america.gov', () => {
    jest.resetModules();
    wrapper.setProps( { link: 'content.america.gov', type: 'post' } );
    const clipboardCopy = wrapper.find( 'ClipboardCopy' );

    const libBrowser = require( 'lib/browser' );

    libBrowser.stringifyQueryString = jest.fn( () => (
      `http://localhost/article?id=${props.id}&site=${props.site}`
    ) );
    const shareLink = libBrowser.stringifyQueryString();

    expect( wrapper.prop( 'link' ) ).toEqual( 'content.america.gov' );
    expect( wrapper.prop( 'type' ) ).toEqual( 'post' );
    expect( clipboardCopy.prop( 'copyItem' ) ).toEqual( shareLink );
  } );

  it( 'passes the correct link to ClipboardCopy if type is neither post nor video', () => {
    jest.resetModules();
    wrapper.setProps( { type: 'graphic' } );
    const clipboardCopy = wrapper.find( 'ClipboardCopy' );
    const type = wrapper.prop( 'type' );

    const libBrowser = require( 'lib/browser' );

    libBrowser.stringifyQueryString = jest.fn( () => (
      `http://localhost/${type}?id=${props.id}&site=${props.site}&language=${props.language}`
    ) );
    const shareLink = libBrowser.stringifyQueryString();

    expect( wrapper.prop( 'type' ) ).toEqual( type );
    expect( clipboardCopy.prop( 'copyItem' ) ).toEqual( shareLink );
  } );
} );
