import { mount } from 'enzyme';
import ActionButtons from './ActionButtons';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url'
  }
} ) );

const props = {
  type: 'package',
  deleteConfirmOpen: false,
  setDeleteConfirmOpen: jest.fn( bool => bool ),
  disabled: {
    delete: false,
    save: false,
    preview: false,
    publish: false,
    publishChanges: false,
    unpublish: false,
    review: false
  },
  handle: {
    deleteConfirm: jest.fn(),
    save: jest.fn(),
    publish: jest.fn(),
    publishChanges: jest.fn(),
    unpublish: jest.fn(),
    review: jest.fn()
  },
  show: {
    delete: true,
    save: true,
    preview: true,
    publish: true,
    publishChanges: true,
    unpublish: true,
    review: true
  },
  loading: {
    publish: false,
    publishChanges: false,
    unpublish: false
  }
};

const getBtn = ( str, buttons ) => (
  buttons.findWhere( n => n.text() === str && n.name() === 'button' )
);

describe( '<ActionButtons />, if not disabled', () => {
  const Component = <ActionButtons { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct buttons', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const btnTxt = [
      'Delete Package',
      'Save & Exit',
      'Preview',
      'Publish Changes',
      'Publish',
      'Unpublish',
      'Final Review'
    ];

    btns.forEach( ( btn, i ) => {
      const txt = btnTxt[i];

      expect( btn.text() ).toEqual( txt );
      expect( btn.prop( 'disabled' ) ).toEqual( false );
    } );
  } );

  it( 'renders the className values for the Delete button', () => {
    const wrapper = mount( Component );

    const btns = wrapper.find( 'Button' );
    const deleteBtn = getBtn( 'Delete Package', btns );
    const { className } = deleteBtn.props();

    expect( className.includes( 'action-btn btn--delete' ) ).toEqual( true );
  } );

  it( 'clicking the Delete button calls setDeleteConfirmOpen', () => {
    const wrapper = mount( Component );

    const btns = wrapper.find( 'Button' );
    const deleteBtn = getBtn( 'Delete Package', btns );

    deleteBtn.simulate( 'click' );
    expect( props.setDeleteConfirmOpen ).toHaveBeenCalledWith( true );
  } );

  it( 'renders the className values for the Save & Exit button', () => {
    const wrapper = mount( Component );

    const btns = wrapper.find( 'Button' );
    const saveBtn = getBtn( 'Save & Exit', btns );
    const { className } = saveBtn.props();

    expect( className.includes( 'action-btn btn--save-draft' ) )
      .toEqual( true );
  } );

  it( 'clicking the Save & Exit button calls handle.save', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const saveBtn = getBtn( 'Save & Exit', btns );

    saveBtn.simulate( 'click' );
    expect( props.handle.save ).toHaveBeenCalled();
  } );

  it( 'renders the className values for the Publish button', () => {
    const wrapper = mount( Component );

    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );
    const { className } = publishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking the Publish Button calls handle.publish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    publishBtn.simulate( 'click' );
    expect( props.handle.publish ).toHaveBeenCalled();
  } );

  it( 'renders the className values for the Final Review button', () => {
    const wrapper = mount( Component );

    const btns = wrapper.find( 'Button' );
    const reviewBtn = getBtn( 'Final Review', btns );
    const { className } = reviewBtn.props();

    expect( className.includes( 'action-btn btn--final-review' ) )
      .toEqual( true );
  } );

  it( 'clicking the Final Review Button calls handle.review', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const reviewBtn = getBtn( 'Final Review', btns );

    reviewBtn.simulate( 'click' );
    expect( props.handle.review ).toHaveBeenCalled();
  } );

  it( 'clicking the "Yes, delete forever" button calls handle.deleteConfirm', () => {
    const wrapper = mount( Component );
    // open the Confirm modal
    wrapper.setProps( { deleteConfirmOpen: true } );

    const btns = wrapper.find( 'Button' );
    const confirmDeleteBtn = getBtn( 'Yes, delete forever', btns );

    confirmDeleteBtn.simulate( 'click' );
    expect( props.handle.deleteConfirm ).toHaveBeenCalled();
  } );

  it( 'clicking the "No, take me back" button calls setDeleteConfirmOpen', () => {
    const wrapper = mount( Component );
    // open the Confirm modal
    wrapper.setProps( { deleteConfirmOpen: true } );

    const btns = wrapper.find( 'Button' );
    const cancelDeleteBtn = getBtn( 'No, take me back', btns );

    cancelDeleteBtn.simulate( 'click' );
    expect( props.setDeleteConfirmOpen ).toHaveBeenCalledWith( false );
  } );

  it( 'renders the ConfirmModalContent headline and message', () => {
    const wrapper = mount( Component );
    const confirmModal = wrapper.find( 'Confirm' );
    const confirmModalContent = mount( confirmModal.prop( 'content' ) );
    const headline = 'Are you sure you want to delete this package?';
    const msg = `This ${props.type} will be removed permanently from the Content Cloud. Any files uploaded in this ${props.type} will also be removed permanently.`;

    expect( confirmModalContent.contains( headline ) ).toEqual( true );
    expect( confirmModalContent.find( 'p' ).text() ).toEqual( msg );
  } );
} );

describe( '<ActionButtons />, if disabled', () => {
  const newProps = {
    ...props,
    disabled: {
      delete: true,
      save: true,
      preview: true,
      publish: true,
      publishChanges: true,
      unpublish: true,
      review: true
    }
  };
  const Component = <ActionButtons { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct buttons', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const btnTxt = [
      'Delete Package',
      'Save & Exit',
      'Preview',
      'Publish Changes',
      'Publish',
      'Unpublish',
      'Final Review'
    ];

    btns.forEach( ( btn, i ) => {
      const txt = btnTxt[i];

      expect( btn.text() ).toEqual( txt );
      expect( btn.prop( 'disabled' ) ).toEqual( true );
    } );
  } );
} );

describe( '<ActionButtons />, if no buttons are shown', () => {
  const newProps = {
    ...props,
    show: {
      delete: false,
      save: false,
      publish: false,
      review: false
    }
  };
  const Component = <ActionButtons { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render buttons', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );

    expect( btns.length ).toEqual( 0 );
    expect( btns.exists() ).toEqual( false );
  } );
} );
