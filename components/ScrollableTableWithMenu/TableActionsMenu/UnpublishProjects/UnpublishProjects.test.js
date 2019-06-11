import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Mutation } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import { Button, Popup } from 'semantic-ui-react';
import UnpublishProjects from './UnpublishProjects';

const props = {
  handleResetSelections: jest.fn(),
  handleUnpublish: jest.fn(),
  handleUnpublishCacheUpdate: jest.fn(),
  showConfirmationMsg: jest.fn()
};

const Component = (
  <MockedProvider mocks={ [] } addTypename={ false }>
    <UnpublishProjects { ...props } />
  </MockedProvider>
);

describe( '<UnpublishProjects />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    const unpublishMutation = wrapper.find( UnpublishProjects );

    expect( unpublishMutation.exists() ).toEqual( true );
    expect( toJSON( unpublishMutation ) ).toMatchSnapshot();
  } );

  it( 'renders a Popup component', () => {
    const wrapper = mount( Component );
    const unpublishMutation = wrapper.find( UnpublishProjects );
    const popup = unpublishMutation.find( Popup );

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

  it( 'clicking the Button calls handleUnpublish', () => {
    const wrapper = mount( Component );
    const button = wrapper.find( Button );

    button.simulate( 'click' );
    expect( props.handleUnpublish ).toHaveBeenCalled();
  } );

  it( 'mutation calls handleResetSelections and showConfirmationMsg on completion', async () => {
    const wrapper = mount( Component );
    const mutation = wrapper.find( Mutation );

    mutation.prop( 'onCompleted' )();
    expect( props.handleResetSelections ).toHaveBeenCalled();
    expect( props.showConfirmationMsg ).toHaveBeenCalled();
  } );

  it( 'mutation calls handleUnpublishCacheUpdate on update', async () => {
    const wrapper = mount( Component );
    const mutation = wrapper.find( Mutation );

    mutation.prop( 'update' )();
    expect( props.handleUnpublishCacheUpdate ).toHaveBeenCalled();
  } );
} );
