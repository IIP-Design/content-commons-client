import { mount } from 'enzyme';
import Upload from './Upload';

/**
 * Use custom element to avoid "incorrect casing" error msg
 * @see https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 */
jest.mock( 'next/dynamic', () => () => 'video-upload' );

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {}
} ) );


const Component = <Upload />;

describe( '<Upload />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct content type buttons', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const content = [
      'Audio',
      'Videos',
      'Images',
      'Documents',
      'Teaching Materials'
    ];

    expect( btns.length ).toEqual( content.length );
    btns.forEach( ( btn, i ) => {
      expect( btn.contains( content[i] ) ).toEqual( true );
    } );
  } );

  it( 'modal trigger opens the modal', () => {
    const wrapper = mount( Component );
    const modal = () => wrapper.find( 'Modal' );
    const triggers = mount( modal().prop( 'trigger' ) );

    triggers.forEach( btn => {
      btn.simulate( 'click' );
      wrapper.update();
      expect( modal().prop( 'open' ) ).toEqual( true );
    } );
  } );

  it( 'modal content closeModal prop closes the modal', () => {
    const wrapper = mount( Component );
    const modal = () => wrapper.find( 'Modal' );
    const uploadComponents = mount( modal().prop( 'content' ) );

    uploadComponents.forEach( component => {
      component.prop( 'closeModal' )();
      expect( modal().prop( 'open' ) ).toEqual( false );
    } );
  } );

  it( 'modal content updateModalClassname prop sets a custom modal className', () => {
    const wrapper = mount( Component );
    const modal = () => wrapper.find( 'Modal' );
    const uploadComponents = mount( modal().prop( 'content' ) );

    uploadComponents.forEach( component => {
      const customClass = 'some-custom-class-name';

      component.prop( 'updateModalClassname' )( customClass );
      wrapper.update();
      expect( modal().prop( 'className' ) ).toEqual( customClass );
    } );
  } );
} );
