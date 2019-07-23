import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import DetailsPopup, { CHECK_PROJECT_TYPE_QUERY } from './DetailsPopup';

/**
 * Use custom element for VideoDetailsPopup to avoid
 * "incorrect casing" error triggered by "opens and
 * closes the Popup when the trigger is clicked" test
 * @see https://jestjs.io/docs/en/tutorial-react.html#snapshot-testing-with-mocks-enzyme-and-react-16
 */
// jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );
jest.mock( 'next-server/dynamic', () => () => 'video-details-popup' );

const props = { id: '123' };

const mocks = [
  {
    request: {
      query: CHECK_PROJECT_TYPE_QUERY,
      variables: { ...props }
    },
    result: {
      data: {
        videoProject: {
          __typename: 'VideoProject',
          id: props.id,
          projectType: 'LANGUAGE'
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <DetailsPopup { ...props } />
  </MockedProvider>
);

describe( '<DetailsPopup />', () => {
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
          variables: { ...props }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename>
        <DetailsPopup { ...props } />
      </MockedProvider>
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

  it( 'adds the event listeners on mount', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const map = {};
    window.addEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    setTimeout( () => {
      expect( window.addEventListener ).toHaveBeenCalledWith( 'resize' );
    }, 500 );
  } );

  it( 'removes the event listeners on unmount', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const map = {};
    window.removeEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    setTimeout( () => {
      wrapper.unmount();
      expect( window.removeEventListener ).toHaveBeenCalledWith( 'resize' );
    }, 500 );
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
          variables: { ...props }
        },
        result: {
          data: { videoProject: null }
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename>
        <DetailsPopup { ...props } />
      </MockedProvider>
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

  it( 'global resize event closes the Popup', async () => {
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

    /**
     * close the popup
     * Wrap in `setTimeout` as a workaround for `act` warning
     * bug related to `async` action and `useEffect` hook
     * @see https://github.com/facebook/react/issues/14769#issuecomment-507198432
     */
    setTimeout( () => {
      map.resize();
      expect( popup().prop( 'open' ) ).toEqual( false );
    }, 500 );
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

    // close the popup
    setTimeout( () => {
      map.click();
      expect( popup().prop( 'open' ) ).toEqual( false );
    }, 500 );
  } );
} );
