import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Mutation } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import DeleteProjects, { DELETE_VIDEO_PROJECTS_MUTATION } from './DeleteProjects';

const props = {
  deleteConfirmOpen: false,
  handleDeleteCancel: jest.fn(),
  handleDeleteConfirm: jest.fn(),
  handleResetSelections: jest.fn(),
  hasSelectedAllDrafts: false,
  showConfirmationMsg: jest.fn()
};

const mocks = [
  {
    request: {
      query: DELETE_VIDEO_PROJECTS_MUTATION,
      variables: {
        where: {
          AND: [
            { id_in: ['C1', 'C2', 'C3'] },
            { status_in: ['DRAFT', 'EMBARGOED'] }
          ]
        }
      }
    },
    result: { data: { deleteProjects: 3 } }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <DeleteProjects { ...props } />
  </MockedProvider>
);

describe( '<DeleteProjects />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( 'DeleteProjects' );

    expect( deleteMutation.exists() ).toEqual( true );
    expect( toJSON( deleteMutation ) ).toMatchSnapshot();
  } );

  it( 'renders a Confirm component', () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( 'DeleteProjects' );
    const confirm = deleteMutation.find( 'Confirm' );

    expect( confirm.exists() ).toEqual( true );
    expect( confirm.prop( 'className' ) ).toEqual( 'delete' );
  } );

  it( 'deleteConfirmOpen opens the Confirm component', () => {
    const newProps = { ...props, ...{ deleteConfirmOpen: true } };

    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DeleteProjects { ...newProps } />
      </MockedProvider>
    );

    const deleteMutation = wrapper.find( 'DeleteProjects' );
    const confirm = deleteMutation.find( 'Confirm' );

    expect( confirm.prop( 'open' ) ).toEqual( newProps.deleteConfirmOpen );
  } );

  it( 'renders the correct Confirm messages if !hasSelectedAllDrafts', () => {
    const newProps = { ...props, ...{ deleteConfirmOpen: true } };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DeleteProjects { ...newProps } />
      </MockedProvider>
    );
    const deleteMutation = wrapper.find( 'DeleteProjects' );
    const confirmModalContent = deleteMutation.find( 'ConfirmModalContent' );
    const msg1 = <p>Only selected DRAFT video project(s) will be permanently removed from the Content Cloud.</p>;
    const msg2 = <p>Selected Non-DRAFT projects will be not be removed.</p>;

    expect( confirmModalContent.contains( msg1 ) ).toEqual( true );
    expect( confirmModalContent.contains( msg2 ) ).toEqual( true );
  } );

  it( 'renders the correct Confirm message if hasSelectedAllDrafts', () => {
    const newProps = {
      ...props,
      ...{
        deleteConfirmOpen: true,
        hasSelectedAllDrafts: true
      }
    };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <DeleteProjects { ...newProps } />
      </MockedProvider>
    );
    const deleteMutation = wrapper.find( 'DeleteProjects' );
    const confirmModalContent = deleteMutation.find( 'ConfirmModalContent' );
    const msg = <p>The selected DRAFT video project(s) will be removed permanently from the Content Cloud.</p>;

    expect( confirmModalContent.contains( msg ) ).toEqual( true );
  } );

  it( 'clicking the cancel button calls handleDeleteCancel', () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( 'DeleteProjects' );
    const confirm = deleteMutation.find( 'Confirm' );

    confirm.prop( 'onCancel' )();
    expect( props.handleDeleteCancel ).toHaveBeenCalled();
  } );

  it( 'clicking the confirm button calls handleDeleteConfirm', () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( 'DeleteProjects' );
    const confirm = deleteMutation.find( 'Confirm' );

    confirm.prop( 'onConfirm' )();
    expect( props.handleDeleteConfirm ).toHaveBeenCalled();
  } );

  it( 'mutation calls handleResetSelections, handleDeleteCancel, showConfirmationMsg on completion', () => {
    const wrapper = mount( Component );
    const deleteMutation = wrapper.find( 'DeleteProjects' );
    const mutation = deleteMutation.find( Mutation );

    mutation.prop( 'onCompleted' )();
    expect( props.handleResetSelections ).toHaveBeenCalled();
    expect( props.handleDeleteCancel ).toHaveBeenCalled();
    expect( props.showConfirmationMsg ).toHaveBeenCalled();
  } );
} );
