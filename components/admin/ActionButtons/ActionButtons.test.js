import { mount } from 'enzyme';
import ActionButtons from './ActionButtons';

jest.mock( 'next/config', () => ( { publicRuntimeConfig: {} } ) );

const props = {
  id: 'p123',
  type: 'package',
  deleteConfirmOpen: false,
  setDeleteConfirmOpen: jest.fn( bool => bool ),
  previewNode: <p>project preview</p>,
  disabled: {
    'delete': false,
    save: false,
    preview: false,
    publish: false,
    publishChanges: false,
    unpublish: false,
    review: false,
  },
  handle: {
    deleteConfirm: jest.fn(),
    save: jest.fn(),
    publish: jest.fn(),
    publishChanges: jest.fn(),
    unpublish: jest.fn(),
    review: jest.fn(),
  },
  show: {
    'delete': true,
    save: true,
    preview: true,
    publish: true,
    publishChanges: true,
    unpublish: true,
    review: true,
  },
  loading: {
    publish: false,
    publishChanges: false,
    unpublish: false,
  },
};

const getBtn = ( str, buttons ) => (
  buttons.findWhere( n => n.text() === str && n.name() === 'button' )
);

describe( '<ActionButtons />, if not disabled', () => {
  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ActionButtons { ...props } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct buttons', () => {
    const btnTxt = [
      'Delete Package',
      'Save & Exit',
      'Preview',
      'Publish Changes',
      'Publish',
      'Unpublish',
      'Final Review',
    ];

    btns.forEach( ( btn, i ) => {
      const txt = btnTxt[i];

      expect( btn.text() ).toEqual( txt );
      expect( btn.prop( 'disabled' ) ).toEqual( false );
    } );
  } );

  it( 'renders the Delete button', () => {
    const deleteBtn = getBtn( 'Delete Package', btns );
    const val = 'action-btn btn--delete';

    expect( deleteBtn.hasClass( val ) ).toEqual( true );
  } );

  it( 'clicking the Delete button calls setDeleteConfirmOpen', () => {
    const deleteBtn = getBtn( 'Delete Package', btns );

    deleteBtn.simulate( 'click' );
    expect( props.setDeleteConfirmOpen ).toHaveBeenCalledWith( true );
  } );

  it( 'renders the Save & Exit button', () => {
    const saveBtn = getBtn( 'Save & Exit', btns );
    const val = 'action-btn btn--save-draft';

    expect( saveBtn.hasClass( val ) ).toEqual( true );
  } );

  it( 'clicking the Save & Exit button calls handle.save', () => {
    const saveBtn = getBtn( 'Save & Exit', btns );

    saveBtn.simulate( 'click' );
    expect( props.handle.save ).toHaveBeenCalled();
  } );

  it( 'renders the Preview button', () => {
    const modal = wrapper.find( 'Modal[trigger]' );
    const previewBtn = mount( modal.prop( 'trigger' ) );
    const modalContent = mount( modal.prop( 'children' ) );
    const content = <div className="content">{ props.previewNode }</div>;
    const val = 'action-btn btn--preview';

    expect( previewBtn.hasClass( val ) ).toEqual( true );
    expect( previewBtn.prop( 'primary' ) ).toEqual( true );
    expect( modal.prop( 'closeIcon' ) ).toEqual( true );
    expect( modalContent.contains( content ) ).toEqual( true );
  } );

  it( 'renders the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );
    const val = 'action-btn btn--publish-changes';

    expect( publishChangesBtn.hasClass( val ) ).toEqual( true );
  } );

  it( 'clicking the Publish Changes Button calls handle.publishChanges', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    publishChangesBtn.simulate( 'click' );
    expect( props.handle.publishChanges ).toHaveBeenCalled();
  } );

  it( 'renders the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );
    const val = 'action-btn btn--publish';

    expect( publishBtn.hasClass( val ) ).toEqual( true );
  } );

  it( 'clicking the Publish Button calls handle.publish', () => {
    const publishBtn = getBtn( 'Publish', btns );

    publishBtn.simulate( 'click' );
    expect( props.handle.publish ).toHaveBeenCalled();
  } );

  it( 'renders the Unpublish button', () => {
    const unPublishBtn = getBtn( 'Unpublish', btns );
    const val = 'action-btn btn--publish';

    expect( unPublishBtn.hasClass( val ) ).toEqual( true );
  } );

  it( 'clicking the Unpublish Button calls handle.unpublish', () => {
    const unPublishBtn = getBtn( 'Unpublish', btns );

    unPublishBtn.simulate( 'click' );
    expect( props.handle.unpublish ).toHaveBeenCalled();
  } );

  it( 'renders the Final Review button', () => {
    const reviewBtn = getBtn( 'Final Review', btns );
    const val = 'action-btn btn--final-review';

    expect( reviewBtn.hasClass( val ) ).toEqual( true );
  } );

  it( 'clicking the Final Review Button calls handle.review', () => {
    const reviewBtn = getBtn( 'Final Review', btns );

    reviewBtn.simulate( 'click' );
    expect( props.handle.review ).toHaveBeenCalled();
  } );

  it( 'clicking the "Yes, delete forever" button calls handle.deleteConfirm', () => {
    // open the Confirm modal
    wrapper.setProps( { deleteConfirmOpen: true } );
    const updatedBtns = wrapper.find( 'Button' );
    const confirmDeleteBtn = getBtn( 'Yes, delete forever', updatedBtns );

    confirmDeleteBtn.simulate( 'click' );
    expect( props.handle.deleteConfirm ).toHaveBeenCalled();
  } );

  it( 'clicking the "No, take me back" button calls setDeleteConfirmOpen', () => {
    // open the Confirm modal
    wrapper.setProps( { deleteConfirmOpen: true } );
    const updatedBtns = wrapper.find( 'Button' );
    const cancelDeleteBtn = getBtn( 'No, take me back', updatedBtns );

    cancelDeleteBtn.simulate( 'click' );
    expect( props.setDeleteConfirmOpen ).toHaveBeenCalledWith( false );
  } );

  it( 'renders the ConfirmModalContent headline and message', () => {
    const confirmModal = wrapper.find( 'Confirm' );
    const confirmModalContent = mount( confirmModal.prop( 'content' ) );
    const headline = 'Are you sure you want to delete this package?';
    const msg = `This ${props.type} will be removed permanently from the Content Commons. Any files uploaded in this ${props.type} will also be removed permanently.`;

    expect( confirmModalContent.contains( headline ) ).toEqual( true );
    expect( confirmModalContent.find( 'p' ).text() ).toEqual( msg );
  } );
} );

describe( '<ActionButtons />, if disabled', () => {
  const newProps = {
    ...props,
    disabled: {
      'delete': true,
      save: true,
      preview: true,
      publish: true,
      publishChanges: true,
      unpublish: true,
      review: true,
    },
  };

  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ActionButtons { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct buttons', () => {
    const btnTxt = [
      'Delete Package',
      'Save & Exit',
      'Preview',
      'Publish Changes',
      'Publish',
      'Unpublish',
      'Final Review',
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
      'delete': false,
      save: false,
      publish: false,
      review: false,
    },
  };

  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ActionButtons { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render buttons', () => {
    expect( btns.length ).toEqual( 0 );
    expect( btns.exists() ).toEqual( false );
  } );
} );

describe( '<ActionButtons />, if publish, publish changes, and unpublish are loading', () => {
  const newProps = {
    ...props,
    loading: {
      publishChanges: true,
      publish: true,
      unpublish: true,
    },
  };

  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ActionButtons { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );
    const val = 'action-btn btn--publish-changes loading';

    expect( publishChangesBtn.hasClass( val ) ).toEqual( true );
  } );

  it( 'renders the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );
    const val = 'action-btn btn--publish loading';

    expect( publishBtn.hasClass( val ) ).toEqual( true );
  } );

  it( 'renders the Unpublish button', () => {
    const unPublishBtn = getBtn( 'Unpublish', btns );
    const val = 'action-btn btn--publish loading';

    expect( unPublishBtn.hasClass( val ) ).toEqual( true );
  } );
} );
