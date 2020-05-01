import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { getVimeoId, getYouTubeId } from 'lib/utils';
import Share from './Share';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

const props = {
  id: 'c888',
  isPreview: false,
  site: '',
  language: 'en-us',
  link: 'https://player.vimeo.com/video/23729318',
  title: 'the title',
  type: 'video'
};

const Component = <Share { ...props } />;

describe( '<Share />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'does not render the Facebook and Twitter share links if there is no link prop', () => {
    const wrapper = mount( Component );
    wrapper.setProps( { link: '' } );
    const list = wrapper.find( 'List.share_list' );

    expect( list.exists() ).toEqual( false );
  } );

  it( 'does not render the Facebook and Twitter share links if type is document', () => {
    const wrapper = mount( Component );
    wrapper.setProps( { type: 'document' } );
    const list = wrapper.find( 'List.share_list' );

    expect( list.exists() ).toEqual( false );
  } );

  it( 'does not render the Facebook and Twitter share links if type is package', () => {
    const wrapper = mount( Component );
    wrapper.setProps( { type: 'package' } );
    const list = wrapper.find( 'List.share_list' );

    expect( list.exists() ).toEqual( false );
  } );

  it( 'does not render the Facebook and Twitter share links if type is video', () => {
    const wrapper = mount( Component );
    wrapper.setProps( { type: 'video' } );
    const list = wrapper.find( 'List.share_list' );

    expect( list.exists() ).toEqual( false );
  } );

  it( 'passes the correct Facebook and Twitter share links if type is post and is from content.america.gov', () => {
    jest.resetModules();
    const wrapper = mount( Component );
    wrapper.setProps( { link: 'content.america.gov', type: 'post' } );

    const libBrowser = require( 'lib/browser' ); // eslint-disable-line
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
    const wrapper = mount( Component );
    const clipboardCopy = wrapper.find( 'ClipboardCopy' );

    const libBrowser = require( 'lib/browser' ); // eslint-disable-line
    libBrowser.stringifyQueryString = jest.fn( () => (
      `http://localhost/video?id=${props.id}&site=${props.site}&language=${props.language}`
    ) );

    expect( clipboardCopy.prop( 'copyItem' ) )
      .toEqual( libBrowser.stringifyQueryString() );
  } );

  it( 'passes the placeholder text to ClipboardCopy if type is video & isPreview is true', () => {
    const wrapper = mount( Component );
    wrapper.setProps( {
      isPreview: true,
      link: 'The direct link to the project will appear here.'
    } );
    const clipboardCopy = wrapper.find( 'ClipboardCopy' );

    expect( clipboardCopy.prop( 'copyItem' ) )
      .toEqual( wrapper.prop( 'link' ) );
  } );

  it( 'passes the correct link to ClipboardCopy if type is post and is from content.america.gov', () => {
    jest.resetModules();
    const wrapper = mount( Component );
    wrapper.setProps( { link: 'content.america.gov', type: 'post' } );
    const clipboardCopy = wrapper.find( 'ClipboardCopy' );

    const libBrowser = require( 'lib/browser' ); // eslint-disable-line
    libBrowser.stringifyQueryString = jest.fn( () => (
      `http://localhost/article?id=${props.id}&site=${props.site}`
    ) );

    expect( wrapper.prop( 'link' ) ).toEqual( 'content.america.gov' );
    expect( wrapper.prop( 'type' ) ).toEqual( 'post' );
    expect( clipboardCopy.prop( 'copyItem' ) )
      .toEqual( libBrowser.stringifyQueryString() );
  } );

  it( 'passes the correct link to ClipboardCopy if type is neither post nor video', () => {
    jest.resetModules();
    const wrapper = mount( Component );
    wrapper.setProps( { type: 'image' } );
    const clipboardCopy = wrapper.find( 'ClipboardCopy' );

    const libBrowser = require( 'lib/browser' ); // eslint-disable-line
    libBrowser.stringifyQueryString = jest.fn( () => (
      `http://localhost/image?id=${props.id}&site=${props.site}&language=${props.language}`
    ) );

    expect( wrapper.prop( 'type' ) ).toEqual( 'image' );
    expect( clipboardCopy.prop( 'copyItem' ) )
      .toEqual(libBrowser.stringifyQueryString());
  } );
} );
