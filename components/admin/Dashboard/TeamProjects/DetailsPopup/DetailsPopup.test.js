import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { act } from 'react-dom/test-utils';
import { MockedProvider } from '@apollo/client/testing';
import DetailsPopup from './DetailsPopup';
import { CHECK_PROJECT_TYPE_QUERY } from '../../MyProjects/DetailsPopup/DetailsPopup';

/**
 * Use custom element for VideoDetailsPopup to avoid
 * "incorrect casing" error triggered by "opens and
 * closes the Popup when the trigger is clicked" test
 * @see https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 */
jest.mock( 'next/dynamic', () => () => 'video-details-popup' );

const props = { id: '123' };

const mocks = [
  {
    request: {
      query: CHECK_PROJECT_TYPE_QUERY,
      variables: { ...props },
    },
    result: {
      data: {
        videoProject: {
          __typename: 'VideoProject',
          id: props.id,
          projectType: 'LANGUAGE',
        },
      },
    },
  },
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <DetailsPopup { ...props } />
  </MockedProvider>
);

describe.skip( '<DetailsPopup />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const detailsPopup = wrapper.find( 'DetailsPopup' );
    const loading = <p>Loading....</p>;

    expect( detailsPopup.exists() ).toEqual( true );
    expect( detailsPopup.contains( loading ) ).toEqual( true );
  } );

  it( 'renders error message if an error is returned', async () => {
    const errorMocks = [
      {
        request: {
          query: CHECK_PROJECT_TYPE_QUERY,
          variables: { ...props },
        },
        result: {
          errors: [{ message: 'There was an error.' }],
        },
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename>
        <DetailsPopup { ...props } />
      </MockedProvider>,
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const detailsPopup = wrapper.find( 'DetailsPopup' );
    const errorComponent = detailsPopup.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders the final state', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const detailsPopup = wrapper.find( 'DetailsPopup' );

    expect( toJSON( detailsPopup ) ).toMatchSnapshot();
  } );

  it( 'renders <VideoDetailsPopup /> as the Popup content', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const detailsPopup = wrapper.find( 'DetailsPopup' );
    const content = detailsPopup.find( 'Popup' ).prop( 'content' );

    expect( content.type ).toEqual( 'video-details-popup' );
    expect( content.props.id ).toEqual( props.id );
  } );

  it( 'renders null if videoProject is falsy', async () => {
    const nullMocks = [
      {
        request: {
          query: CHECK_PROJECT_TYPE_QUERY,
          variables: { ...props },
        },
        result: {
          data: { videoProject: null },
        },
      },
    ];
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename>
        <DetailsPopup { ...props } />
      </MockedProvider>,
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const detailsPopup = wrapper.find( 'DetailsPopup' );

    expect( detailsPopup.html() ).toEqual( null );
  } );

  it( 'clicking the button trigger opens the Popup', async () => {
    const div = document.createElement( 'div' );

    div.classList.add( 'items_table' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );

    await wait( 0 );
    wrapper.update();

    const popup = () => wrapper.find( 'Popup' );
    const btn = wrapper.find( 'button.projects_data_actions_action' );

    const map = {};

    window.addEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    // popup is initially closed
    expect( popup().prop( 'open' ) ).toEqual( false );

    // open the popup
    btn.simulate( 'click' );
    expect( popup().prop( 'open' ) ).toEqual( true );
  } );

  /**
   * For these last two tests, React 16.8 throws an `act`
   * warning for asynchronous actions and hooks. In this
   * component, lodash `debounce` is used. So, global events
   * to close are wrapped in `act`.
   * @see https://github.com/facebook/react/issues/14769
   */
  it( 'global resize event closes the Popup', async () => {
    const div = document.createElement( 'div' );

    div.classList.add( 'items_table' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );

    await wait( 0 );
    wrapper.update();

    const popup = () => wrapper.find( 'Popup' );
    const inst = popup().instance();
    const btn = wrapper.find( 'button.projects_data_actions_action' );
    const cb = jest.spyOn( inst, 'handleClose' );
    const portalMount = jest.spyOn( inst, 'handlePortalMount' );
    const portalUnmount = jest.spyOn( inst, 'handlePortalUnmount' );
    const event = 'resize';

    const map = {};

    window.addEventListener = jest.fn( () => {
      map[event] = cb;
    } );

    // popup is initially closed
    expect( popup().prop( 'open' ) ).toEqual( false );

    // open the popup
    act( () => {
      btn.simulate( 'click' );
    } );
    expect( portalMount ).toHaveBeenCalled();

    // resize window calls `handleClose` (i.e., `cb`)
    act( () => map.resize() );
    expect( cb ).toHaveBeenCalled();
    expect( portalUnmount ).toHaveBeenCalled();
  } );

  it( 'global click event closes the Popup', async () => {
    const div = document.createElement( 'div' );

    div.classList.add( 'items_table' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );

    await wait( 0 );
    wrapper.update();

    const popup = () => wrapper.find( 'Popup' );
    const inst = popup().instance();
    const btn = wrapper.find( 'button.projects_data_actions_action' );
    const cb = jest.spyOn( inst, 'handleClose' );
    const portalMount = jest.spyOn( inst, 'handlePortalMount' );
    const portalUnmount = jest.spyOn( inst, 'handlePortalUnmount' );
    const event = 'click';

    const map = {};

    window.addEventListener = jest.fn( () => {
      map[event] = cb;
    } );

    // popup is initially closed
    expect( popup().prop( 'open' ) ).toEqual( false );

    // open the popup
    act( () => {
      btn.simulate( 'click' );
    } );
    expect( portalMount ).toHaveBeenCalled();

    // clicking in window calls `handleClose` (i.e., `cb`)
    act( () => map.click() );
    expect( cb ).toHaveBeenCalled();
    expect( portalUnmount ).toHaveBeenCalled();
  } );
} );
