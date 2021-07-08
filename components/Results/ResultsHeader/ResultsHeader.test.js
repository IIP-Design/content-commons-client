import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import * as state from './mocks';
import ResultsHeader from './ResultsHeader';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' } } ) );

jest.mock( 'context/authContext', () => ( {
  useAuth: jest.fn( () => true ),
} ) );

jest.mock(
  '../ResultsToggleView/ResultsToggleView',
  () => function ResultsToggleView() { return ''; },
);

const mockStore = configureStore( [] );

describe( '<ResultsHeader />', () => {
  let store;
  let Component;
  let wrapper;
  let resultsHeader;
  let props;

  beforeEach( () => {
    store = mockStore( state.mocks );

    Component = (
      <Provider store={ store }>
        <ResultsHeader currentView="gallery" toggleView={ jest.fn() } />
      </Provider>
    );

    wrapper = mount( Component );
    resultsHeader = wrapper.find( 'ResultsHeader' );
    props = resultsHeader.props();
  } );

  it( 'renders without crashing', () => {
    expect( resultsHeader.exists() ).toEqual( true );
  } );

  it( 'renders "Sort by" text for the recent/relevance dropdown', () => {
    const sortBy = resultsHeader.find( '.sortResults span[aria-hidden]' );

    expect( sortBy.contains( 'Sort by' ) ).toEqual( true );
  } );

  it( 'renders the recent/relevance dropdown with an aria-label', () => {
    const dropdown = resultsHeader.find( '[aria-label="sort results by recent or relevance"]' );

    expect( dropdown.exists() ).toEqual( true );
  } );

  it.skip( 'renders ResultsToggleView', () => {
    const toggleView = resultsHeader.find( 'ResultsToggleView' );

    expect( toggleView.exists() ).toEqual( true );
  } );

  it( 'renders a live region for the results per page', () => {
    const liveRegion = resultsHeader.find( '[role="status"][aria-live="polite"]' );

    expect( liveRegion.contains( '1 to 2 of 2' ) ).toEqual( true );
  } );

  it( 'renders an accessibly hidden "| Show:" separator', () => {
    const separator = resultsHeader.find( '.perPage [aria-hidden]' );

    expect( separator.contains( '| Show:' ) ).toEqual( true );
  } );

  it( 'renders the results per page dropdown with an aria-label', () => {
    const dropdown = resultsHeader.find( '[aria-label="set results per page"]' );

    expect( dropdown.exists() ).toEqual( true );
  } );

  it( 'renders dropdowns that do not open on focus', () => {
    const dropdowns = resultsHeader.find( 'Dropdown' );

    dropdowns.forEach( dropdown => {
      expect( dropdown.prop( 'openOnFocus' ) ).toEqual( false );
    } );
  } );
} );
