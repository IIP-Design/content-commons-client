import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ShareButton from './ShareButton';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

const props = {
  url: 'https://the-url.com',
  icon: 'twitter',
  isPreview: false,
  label: 'Share on Twitter',
};

const Component = <ShareButton { ...props } />;

describe( '<ShareButton />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'clicking the list item calls isMobile and openWindow if !isMobile', () => {
    const wrapper = mount( Component );
    const listItem = wrapper.find( 'ListItem' );
    const libBrowser = require( 'lib/browser' ); // eslint-disable-line

    libBrowser.openWindow = jest.fn();
    libBrowser.isMobile = jest.fn( () => false );

    const e = { preventDefault: jest.fn() };

    listItem.simulate( 'click', e );

    expect( wrapper.prop( 'isPreview' ) ).toEqual( props.isPreview );
    expect( libBrowser.isMobile ).toHaveBeenCalled();
    expect( libBrowser.openWindow ).toHaveBeenCalled();
  } );

  it( 'keypressing the list item calls isMobile and openWindow if !isMobile', () => {
    const wrapper = mount( Component );
    const listItem = wrapper.find( 'ListItem' );
    const libBrowser = require( 'lib/browser' ); // eslint-disable-line

    libBrowser.openWindow = jest.fn();
    libBrowser.isMobile = jest.fn( () => false );

    const e = { preventDefault: jest.fn() };

    listItem.simulate( 'keypress', e );

    expect( wrapper.prop( 'isPreview' ) ).toEqual( props.isPreview );
    expect( libBrowser.isMobile ).toHaveBeenCalled();
    expect( libBrowser.openWindow ).toHaveBeenCalled();
  } );

  it( 'clicking the list item calls isMobile and does not call openWindow if isMobile is true', () => {
    const wrapper = mount( Component );
    const listItem = wrapper.find( 'ListItem' );
    const libBrowser = require( 'lib/browser' ); // eslint-disable-line

    libBrowser.openWindow = jest.fn();
    libBrowser.isMobile = jest.fn( () => true );

    const e = { preventDefault: jest.fn() };

    listItem.simulate( 'click', e );

    expect( wrapper.prop( 'isPreview' ) ).toEqual( props.isPreview );
    expect( libBrowser.isMobile ).toHaveBeenCalled();
    expect( libBrowser.openWindow ).not.toHaveBeenCalled();
  } );

  it( 'keypressing the list item calls isMobile and does not call openWindow if isMobile is true', () => {
    const wrapper = mount( Component );
    const listItem = wrapper.find( 'ListItem' );
    const libBrowser = require( 'lib/browser' ); // eslint-disable-line

    libBrowser.openWindow = jest.fn();
    libBrowser.isMobile = jest.fn( () => true );

    const e = { preventDefault: jest.fn() };

    listItem.simulate( 'keypress', e );

    expect( wrapper.prop( 'isPreview' ) ).toEqual( props.isPreview );
    expect( libBrowser.isMobile ).toHaveBeenCalled();
    expect( libBrowser.openWindow ).not.toHaveBeenCalled();
  } );

  it( 'clicking the list item does not call isMobile and openWindow if isPreview is true', () => {
    const wrapper = mount( Component );
    const listItem = wrapper.find( 'ListItem' );
    const libBrowser = require( 'lib/browser' ); // eslint-disable-line

    libBrowser.openWindow = jest.fn();
    libBrowser.isMobile = jest.fn( () => false );

    wrapper.setProps( { isPreview: true } );
    const e = { preventDefault: jest.fn() };

    listItem.simulate( 'click', e );

    expect( wrapper.prop( 'isPreview' ) ).toEqual( !props.isPreview );
    expect( libBrowser.isMobile ).not.toHaveBeenCalled();
    expect( libBrowser.openWindow ).not.toHaveBeenCalled();
  } );

  it( 'keypressing the list item does not call isMobile and openWindow if isPreview is true', () => {
    const wrapper = mount( Component );
    const listItem = wrapper.find( 'ListItem' );
    const libBrowser = require( 'lib/browser' ); // eslint-disable-line

    libBrowser.openWindow = jest.fn();
    libBrowser.isMobile = jest.fn( () => false );

    wrapper.setProps( { isPreview: true } );
    const e = { preventDefault: jest.fn() };

    listItem.simulate( 'keypress', e );

    expect( wrapper.prop( 'isPreview' ) ).toEqual( !props.isPreview );
    expect( libBrowser.isMobile ).not.toHaveBeenCalled();
    expect( libBrowser.openWindow ).not.toHaveBeenCalled();
  } );
} );
