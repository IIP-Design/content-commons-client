import { mount } from 'enzyme';
import ButtonPublish from './ButtonPublish';

const props = {
  handlePublish: jest.fn(),
  handleUnPublish: jest.fn(),
  publishing: false,
  status: 'DRAFT',
  updated: false,
  disabled: false,
};

const getBtn = ( str, buttons ) => (
  buttons.findWhere( n => n.text() === str && n.name() === 'button' )
);

describe( '<ButtonPublish />, for DRAFT status', () => {
  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ButtonPublish { ...props } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( props.status === 'DRAFT' );
  } );

  it( 'renders the correct className values for the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );
    const { className } = publishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) )
      .toEqual( props.status === 'DRAFT' );
    expect( className.includes( 'loading' ) ).toEqual( props.publishing );
  } );

  it( 'clicking Publish button calls handlePublish', () => {
    const publishBtn = getBtn( 'Publish', btns );

    publishBtn.simulate( 'click' );
    expect( props.handlePublish ).toHaveBeenCalled();
  } );

  it( 'does not render the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( props.status === 'PUBLISHED' && props.updated );
  } );

  it( 'does not render the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( false );
  } );
} );

describe( '<ButtonPublish />, for DRAFT status & disabled', () => {
  const newProps = {
    ...props,
    disabled: true,
  };
  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ButtonPublish { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the disabled Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( props.status === 'DRAFT' );
    expect( publishBtn.prop( 'disabled' ) ).toEqual( true );
  } );

  it( 'renders the correct className values for the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );
    const { className } = publishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) )
      .toEqual( props.status === 'DRAFT' );
    expect( className.includes( 'loading' ) ).toEqual( props.publishing );
  } );

  it( 'does not render the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( props.status === 'PUBLISHED' && props.updated );
  } );

  it( 'does not render the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( false );
  } );
} );

describe( '<ButtonPublish />, for PUBLISHED status', () => {
  const newProps = {
    ...props,
    status: 'PUBLISHED',
  };
  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ButtonPublish { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'does not render the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( newProps.status === 'PUBLISHED' && newProps.updated );
  } );

  it( 'renders the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );

describe( '<ButtonPublish />, for PUBLISHED status & updated', () => {
  const newProps = {
    ...props,
    updated: true,
    status: 'PUBLISHED',
  };
  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ButtonPublish { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'renders the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( newProps.status === 'PUBLISHED' && newProps.updated );
  } );

  it( 'renders the correct className values for the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );
    const { className } = publishChangesBtn.props();

    expect( className.includes( 'action-btn btn--publish-changes' ) )
      .toEqual( newProps.status === 'PUBLISHED' && newProps.updated );
    expect( className.includes( 'loading' ) ).toEqual( newProps.publishing );
  } );

  it( 'clicking Publish Changes button calls handlePublish', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    publishChangesBtn.simulate( 'click' );
    expect( props.handlePublish ).toHaveBeenCalled();
  } );

  it( 'renders the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );

describe( '<ButtonPublish />, for PUBLISHED status, updated, & disabled', () => {
  const newProps = {
    ...props,
    updated: true,
    status: 'PUBLISHED',
    disabled: true,
  };
  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ButtonPublish { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'renders the disabled Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( newProps.status === 'PUBLISHED' && newProps.updated );
    expect( publishChangesBtn.prop( 'disabled' ) ).toEqual( true );
  } );

  it( 'renders the correct className values for the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );
    const { className } = publishChangesBtn.props();

    expect( className.includes( 'action-btn btn--publish-changes' ) )
      .toEqual( newProps.status === 'PUBLISHED' && newProps.updated );
    expect( className.includes( 'loading' ) ).toEqual( newProps.publishing );
  } );

  it( 'clicking Publish Changes button calls handlePublish', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    publishChangesBtn.simulate( 'click' );
    expect( props.handlePublish ).toHaveBeenCalled();
  } );

  it( 'renders the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );

describe( '<ButtonPublish />, for PUBLISHING status, publishing, & not updated', () => {
  const newProps = {
    ...props,
    publishing: true,
    status: 'PUBLISHING',
  };
  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ButtonPublish { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'does not render the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( newProps.status === 'PUBLISHED' && newProps.updated );
  } );

  it( 'renders the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );

describe( '<ButtonPublish />, for PUBLISHING status, publishing, and updated', () => {
  const newProps = {
    ...props,
    publishing: true,
    status: 'PUBLISHING',
    updated: true,
  };
  let Component;
  let wrapper;
  let btns;

  beforeEach( () => {
    Component = <ButtonPublish { ...newProps } />;
    wrapper = mount( Component );
    btns = wrapper.find( 'Button' );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not render the Publish button', () => {
    const publishBtn = getBtn( 'Publish', btns );

    expect( publishBtn.exists() ).toEqual( newProps.status === 'DRAFT' );
  } );

  it( 'renders the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    expect( publishChangesBtn.exists() )
      .toEqual( ( newProps.status === 'PUBLISHED' || newProps.status === 'PUBLISHING' ) && newProps.updated );
  } );

  it( 'renders the correct className values for the Publish Changes button', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );
    const { className } = publishChangesBtn.props();

    expect( className.includes( 'action-btn btn--publish-changes' ) )
      .toEqual( ( newProps.status === 'PUBLISHED' || newProps.status === 'PUBLISHING' ) && newProps.updated );
    expect( className.includes( 'loading' ) ).toEqual( newProps.publishing );
  } );

  it( 'clicking Publish Changes button calls handlePublish', () => {
    const publishChangesBtn = getBtn( 'Publish Changes', btns );

    publishChangesBtn.simulate( 'click' );
    expect( props.handlePublish ).toHaveBeenCalled();
  } );

  it( 'renders the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    expect( unpublishBtn.exists() ).toEqual( newProps.status !== 'DRAFT' );
  } );

  it( 'renders the correct className values for the Unpublish button', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );
    const { className } = unpublishBtn.props();

    expect( className.includes( 'action-btn btn--publish' ) ).toEqual( true );
  } );

  it( 'clicking Unpublish button calls handleUnPublish', () => {
    const unpublishBtn = getBtn( 'Unpublish', btns );

    unpublishBtn.simulate( 'click' );
    expect( props.handleUnPublish ).toHaveBeenCalled();
  } );
} );
