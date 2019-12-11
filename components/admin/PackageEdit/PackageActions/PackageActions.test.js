import { mount } from 'enzyme';
import PackageActions from './PackageActions';

jest.mock(
  'components/ButtonAddFiles/ButtonAddFiles',
  () => function ButtonAddFiles() { return ''; }
);

const props = {
  handlePublish: jest.fn(),
  handleUnPublish: jest.fn(),
  status: 'DRAFT',
  notPublished: true,
  publishedAndUpdated: false,
  publishedAndNotUpdated: false,
};

const getBtn = ( str, buttons ) => (
  buttons.findWhere( n => n.text() === str && n.name() === 'button' )
);

describe( '<PackageActions />, for DRAFT packages', () => {
  const Component = <PackageActions { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct section className', () => {
    const wrapper = mount( Component );
    const section = wrapper.find( 'section' );

    expect( section.prop( 'className' ) ).toEqual( 'edit-package__actions' );
  } );

  it( 'renders the correct headline', () => {
    const wrapper = mount( Component );
    const headlines = [
      'It looks like you made changes to your package. Do you want to publish changes?',
      'Your package looks great! Are you ready to Publish?',
      'Not ready to share with the world yet?'
    ];

    headlines.forEach( ( txt, i ) => {
      expect( wrapper.contains( txt ) ).toEqual( i === 1 );
    } );
  } );

  it( 'renders ButtonAddFiles', () => {
    const wrapper = mount( Component );
    const btnAddFiles = wrapper.find( 'ButtonAddFiles' );

    expect( btnAddFiles.exists() ).toEqual( true );
    expect( btnAddFiles.prop( 'accept' ) ).toEqual( '.doc, .docx' );
    expect( btnAddFiles.prop( 'multiple' ) ).toEqual( true );
    expect( typeof btnAddFiles.prop( 'onChange' ) ).toEqual( 'function' );
    expect( btnAddFiles.prop( 'className' ) )
      .toEqual( 'basic action-btn btn--add-more' );
  } );

  it( 'does not render the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( false );
  } );

  it( 'renders the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( true );
  } );

  it( 'clicking Publish button calls handlePublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    publishBtn.simulate( 'click' );
    expect( props.handlePublish ).toHaveBeenCalled();
  } );

  it( 'does not render the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() ).toEqual( false );
  } );
} );

describe( '<PackageActions />, for PUBLISHED and updated packages', () => {
  const newProps = {
    ...props,
    status: 'PUBLISHED',
    notPublished: false,
    publishedAndUpdated: true,
    publishedAndNotUpdated: false,
  };
  const Component = <PackageActions { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct section className', () => {
    const wrapper = mount( Component );
    const section = wrapper.find( 'section' );

    expect( section.prop( 'className' ) ).toEqual( 'edit-package__actions' );
  } );

  it( 'renders the correct headline', () => {
    const wrapper = mount( Component );
    const headlines = [
      'It looks like you made changes to your package. Do you want to publish changes?',
      'Your package looks great! Are you ready to Publish?',
      'Not ready to share with the world yet?'
    ];

    headlines.forEach( ( txt, i ) => {
      expect( wrapper.contains( txt ) ).toEqual( i === 0 );
    } );
  } );

  it( 'renders ButtonAddFiles', () => {
    const wrapper = mount( Component );
    const btnAddFiles = wrapper.find( 'ButtonAddFiles' );

    expect( btnAddFiles.exists() ).toEqual( true );
    expect( btnAddFiles.prop( 'accept' ) ).toEqual( '.doc, .docx' );
    expect( btnAddFiles.prop( 'multiple' ) ).toEqual( true );
    expect( typeof btnAddFiles.prop( 'onChange' ) ).toEqual( 'function' );
    expect( btnAddFiles.prop( 'className' ) )
      .toEqual( 'basic action-btn btn--add-more' );
  } );

  it( 'renders the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( true );
  } );

  it( 'clicking the Unpublish button calls handleUnPublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );

  it( 'does not render the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( false );
  } );

  it( 'renders the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() ).toEqual( true );
  } );

  it( 'clicking Publish Changes button calls handlePublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    publishChangesBtn.simulate( 'click' );
    expect( props.handlePublish ).toHaveBeenCalled();
  } );
} );

describe( '<PackageActions />, for PUBLISHED and packages not updated', () => {
  const newProps = {
    ...props,
    status: 'PUBLISHED',
    notPublished: false,
    publishedAndUpdated: false,
    publishedAndNotUpdated: true,
  };
  const Component = <PackageActions { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct section className', () => {
    const wrapper = mount( Component );
    const section = wrapper.find( 'section' );

    expect( section.prop( 'className' ) ).toEqual( 'edit-package__actions' );
  } );

  it( 'renders the correct headline', () => {
    const wrapper = mount( Component );
    const headlines = [
      'It looks like you made changes to your package. Do you want to publish changes?',
      'Your package looks great! Are you ready to Publish?',
      'Not ready to share with the world yet?'
    ];

    headlines.forEach( ( txt, i ) => {
      expect( wrapper.contains( txt ) ).toEqual( i === 2 );
    } );
  } );

  it( 'renders ButtonAddFiles', () => {
    const wrapper = mount( Component );
    const btnAddFiles = wrapper.find( 'ButtonAddFiles' );

    expect( btnAddFiles.exists() ).toEqual( true );
    expect( btnAddFiles.prop( 'accept' ) ).toEqual( '.doc, .docx' );
    expect( btnAddFiles.prop( 'multiple' ) ).toEqual( true );
    expect( typeof btnAddFiles.prop( 'onChange' ) ).toEqual( 'function' );
    expect( btnAddFiles.prop( 'className' ) )
      .toEqual( 'basic action-btn btn--add-more' );
  } );

  it( 'renders the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( true );
  } );

  it( 'clicking the Unpublish button calls handleUnPublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );

  it( 'does not render the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( false );
  } );

  it( 'does not render the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() ).toEqual( false );
  } );
} );
