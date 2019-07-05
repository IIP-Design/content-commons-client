import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Share from './Share';

const props = {
  id: 'c888',
  isPreview: false,
  site: '',
  language: 'en-us',
  link: 'https://www.vimeo.com/23729318',
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

  it( 'passes the correct Facebook and Twitter share links', () => {
    const wrapper = mount( Component );
    const facebookBtn = wrapper.find( 'ShareButton[icon="facebook f"]' );
    const twitterBtn = wrapper.find( 'ShareButton[icon="twitter"]' );
    const facebookShare = 'https://www.facebook.com/sharer/sharer.php?u=';
    const twitterShare = 'https://twitter.com/home?status=';

    expect( facebookBtn.prop( 'url' ) )
      .toEqual( `${facebookShare}${props.link}` );
    expect( twitterBtn.prop( 'url' ) )
      .toEqual( `${twitterShare}${props.title} ${props.link}` );
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
    const facebookShare = 'https://www.facebook.com/sharer/sharer.php?u=';
    const twitterShare = 'https://twitter.com/home?status=';

    expect( wrapper.prop( 'link' ) ).toEqual( 'content.america.gov' );
    expect( wrapper.prop( 'type' ) ).toEqual( 'post' );
    expect( facebookBtn.prop( 'url' ) )
      .toEqual( `${facebookShare}${shareLink}` );
    expect( twitterBtn.prop( 'url' ) )
      .toEqual( `${twitterShare}${props.title} ${shareLink}` );
  } );

  it( 'passes the correct link to ClipboardCopy if type is video', () => {
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
      `http://localhost/article?id=${props.id}&site=${props.site}`
    ) );

    expect( wrapper.prop( 'type' ) ).toEqual( 'image' );
    expect( clipboardCopy.prop( 'copyItem' ) )
      .toEqual( props.link );
  } );
} );
