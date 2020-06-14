import { mount } from 'enzyme';
import wait from 'waait';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';
import { Button, Popup } from 'semantic-ui-react';
import UnpublishProjects from './UnpublishProjects';
import { mocks, unpublishMocks } from './mocks';

const props = {
  handleActionResult: jest.fn(),
  unpublishVideoProject: jest.fn(),
  handleResetSelections: jest.fn(),
  showConfirmationMsg: jest.fn(),
  selections: mocks,
};

const Component = (
  <MockedProvider mocks={ unpublishMocks } addTypename={ false }>
    <UnpublishProjects { ...props } />
  </MockedProvider>
);

describe.skip( '<UnpublishProjects />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    const unpublishProjects = wrapper.find( UnpublishProjects );

    expect( unpublishProjects.exists() ).toEqual( true );
    expect( toJSON( unpublishProjects ) ).toMatchSnapshot();
  } );

  it( 'renders a Popup component', () => {
    const wrapper = mount( Component );
    const unpublishProjects = wrapper.find( UnpublishProjects );
    const popup = unpublishProjects.find( Popup );

    expect( popup.exists() ).toEqual( true );
    expect( popup.prop( 'content' ) ).toEqual( 'Unpublish Selection(s)' );
  } );

  it( 'renders a Button as its trigger', () => {
    const wrapper = mount( Component );
    const button = wrapper.find( Button );
    const btnTxt = <span className="unpublish--text">Unpublish</span>;

    expect( button.exists() ).toEqual( true );
    expect( button.prop( 'className' ) ).toEqual( 'unpublish' );
    expect( button.contains( btnTxt ) ).toEqual( true );
  } );

  it( 'clicking the Button calls handleActionResult with the apporpriate results', async () => {
    const wrapper = mount( Component );
    const button = wrapper.find( Button );

    button.simulate( 'click' );
    await wait( 10 );
    wrapper.update();

    expect( props.handleActionResult ).toHaveBeenCalledTimes( mocks.length );
    const mockResults = unpublishMocks.map( mock => [mock.result] );

    mockResults.forEach( result => {
      expect( props.handleActionResult ).toHaveBeenCalledWith( result[0] );
    } );
  } );

  it( 'clicking the Button calls handleResetSelections and showConfirmationMsg on completion', () => {
    const wrapper = mount( Component );
    const button = wrapper.find( Button );

    button.simulate( 'click' );
    expect( props.handleResetSelections ).toHaveBeenCalled();
    expect( props.showConfirmationMsg ).toHaveBeenCalled();
  } );
} );
