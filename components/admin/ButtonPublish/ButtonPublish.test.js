import { mount } from 'enzyme';
import ButtonPublish from './ButtonPublish';

const props = {
  handlePublish: jest.fn(),
  handleUnPublish: jest.fn(),
  publishedAndUpdated: false,
  publishing: false,
  status: 'DRAFT'
};

const getBtn = ( str, buttons ) => (
  buttons.findWhere( n => n.text() === str && n.name() === 'button' )
);

describe( '<ButtonPublish />, for DRAFT status', () => {
  const Component = <ButtonPublish { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( props.status === 'DRAFT' );
  } );

  it( 'renders the correct className values for the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );
    const { className } = publishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) )
      .toEqual( props.status === 'DRAFT' );
    expect( className.includes( 'loading' ) ).toEqual( props.publishing );
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

    expect( publishChangesBtn.exists() )
      .toEqual( props.publishedAndUpdated );
  } );

  it( 'does not render the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( false );
  } );
} );

describe( '<ButtonPublish />, for PUBLISHED status', () => {
  const newProps = {
    ...props,
    status: 'PUBLISHED'
  };
  const Component = <ButtonPublish { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'does not render the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( newProps.publishedAndUpdated );
  } );

  it( 'renders the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );

describe( '<ButtonPublish />, for PUBLISHED status & updated', () => {
  const newProps = {
    ...props,
    publishedAndUpdated: true,
    status: 'PUBLISHED'
  };
  const Component = <ButtonPublish { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'renders the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( newProps.publishedAndUpdated );
  } );

  it( 'renders the correct className values for the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );
    const { className } = publishChangesBtn.props();

    expect( className.includes( 'action-btn btn--edit' ) )
      .toEqual( newProps.publishedAndUpdated );
    expect( className.includes( 'loading' ) ).toEqual( newProps.publishing );
  } );

  it( 'clicking Publish Changes button calls handlePublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    publishChangesBtn.simulate( 'click' );
    expect( props.handlePublish ).toHaveBeenCalled();
  } );

  it( 'renders the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );

describe( '<ButtonPublish />, for PUBLISHING status, publishing, and not updated', () => {
  const newProps = {
    ...props,
    publishing: true,
    status: 'PUBLISHING'
  };
  const Component = <ButtonPublish { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'does not render the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( newProps.publishedAndUpdated );
  } );

  it( 'renders the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );

describe( '<ButtonPublish />, for PUBLISHING status, publishing, and updated', () => {
  const newProps = {
    ...props,
    publishedAndUpdated: true,
    publishing: true,
    status: 'PUBLISHING'
  };
  const Component = <ButtonPublish { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'renders the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( newProps.publishedAndUpdated );
  } );

  it( 'renders the correct className values for the Publish Changes button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );
    const { className } = publishChangesBtn.props();

    expect( className.includes( 'action-btn btn--edit' ) )
      .toEqual( newProps.publishedAndUpdated );
    expect( className.includes( 'loading' ) ).toEqual( newProps.publishing );
  } );

  it( 'clicking Publish Changes button calls handlePublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    publishChangesBtn.simulate( 'click' );
    expect( props.handlePublish ).toHaveBeenCalled();
  } );

  it( 'renders the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );
