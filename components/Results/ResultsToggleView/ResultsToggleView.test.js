import { mount } from 'enzyme';
import ResultsToggleView from './ResultsToggleView';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

describe( '<ResultsToggleView />', () => {
  let Component;
  let wrapper;

  const props = {
    toggle: jest.fn(),
    currentView: 'gallery',
  };

  beforeEach( () => {
    Component = <ResultsToggleView { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders with an aria-label', () => {
    const div = wrapper.find( '[aria-label="set gallery/list view"]' );

    expect( div.exists() ).toEqual( true );
  } );

  it( 'renders a visually hidden live region', () => {
    const liveRegion = wrapper.find( '.hide-visually [role="status"][aria-live="polite"]' );

    expect( liveRegion.contains( `${props.currentView} view` ) ).toEqual( true );
  } );

  it( 'renders the view buttons with the correct tabIndex and aria-hidden values', () => {
    const btns = wrapper.find( 'button[data-view]' );

    btns.forEach( ( btn, i ) => {
      const value = i === 0 ? -1 : undefined;
      const ariaHiddenValue = i === 0 ? true : undefined;

      expect( btn.prop( 'tabIndex' ) ).toEqual( value );
      expect( btn.prop( 'aria-hidden' ) ).toEqual( ariaHiddenValue );
    } );
  } );

  it( 'renders a visually hidden name for each view button', () => {
    const btnNames = wrapper.find( 'button[data-view] VisuallyHidden' );

    btnNames.forEach( ( name, i ) => {
      const value = i === 0 ? 'gallery' : 'list';

      expect( name.contains( `set to ${value} view` ) ).toEqual( true );
    } );
  } );

  it( 'renders an accessibly hidden tooltip for each button', () => {
    const toolTips = wrapper.find( 'button[data-view] [aria-hidden][tooltip]' );

    toolTips.forEach( ( toolTip, i ) => {
      const value = i === 0 ? 'Gallery' : 'List';

      expect( toolTip.prop( 'tooltip' ) ).toEqual( `${value} View` );
    } );
  } );
} );
