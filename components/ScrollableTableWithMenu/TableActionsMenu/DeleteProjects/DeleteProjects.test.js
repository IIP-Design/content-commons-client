import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Mutation } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import { Confirm } from 'semantic-ui-react';
import DeleteProjects from './DeleteProjects';

const props = {
  deleteConfirmOpen: false,
  handleDeleteCancel: jest.fn(),
  handleDeleteConfirm: jest.fn(),
  handleResetSelections: jest.fn(),
  showConfirmationMsg: jest.fn()
};

const Component = (
  <MockedProvider mocks={ [] } addTypename={ false }>
    <DeleteProjects { ...props } />
  </MockedProvider>
);

describe( '<DeleteProjects />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( DeleteProjects );

    expect( deleteMutation.exists() ).toEqual( true );
    expect( toJSON( deleteMutation ) ).toMatchSnapshot();
  } );

  it( 'renders a Confirm component', () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( DeleteProjects );
    const confirm = deleteMutation.find( Confirm );

    expect( confirm.exists() ).toEqual( true );
    expect( confirm.prop( 'className' ) ).toEqual( 'delete' );
  } );

  it( 'deleteConfirmOpen opens the Confirm component', () => {
    const newProps = { ...props, ...{ deleteConfirmOpen: true } };

    const wrapper = mount(
      <MockedProvider mocks={ [] } addTypename={ false }>
        <DeleteProjects { ...newProps } />
      </MockedProvider>
    );

    const deleteMutation = wrapper.find( DeleteProjects );
    const confirm = deleteMutation.find( Confirm );

    expect( confirm.prop( 'open' ) ).toEqual( newProps.deleteConfirmOpen );
  } );

  it( 'clicking the cancel button calls handleDeleteCancel', () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( DeleteProjects );
    const confirm = deleteMutation.find( Confirm );

    confirm.prop( 'onCancel' )();
    expect( props.handleDeleteCancel ).toHaveBeenCalled();
  } );

  it( 'clicking the confirm button calls handleDeleteConfirm', async () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( DeleteProjects );
    const confirm = deleteMutation.find( Confirm );

    confirm.prop( 'onConfirm' )();
    expect( props.handleDeleteConfirm ).toHaveBeenCalled();
  } );

  it( 'mutation calls handleResetSelections, handleDeleteCancel, showConfirmationMsg on completion', async () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( DeleteProjects );
    const mutation = deleteMutation.find( Mutation );

    mutation.prop( 'onCompleted' )();
    expect( props.handleResetSelections ).toHaveBeenCalled();
    expect( props.handleDeleteCancel ).toHaveBeenCalled();
    expect( props.showConfirmationMsg ).toHaveBeenCalled();
  } );
} );
