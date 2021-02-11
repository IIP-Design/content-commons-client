import { mount } from 'enzyme';
import PopupTabbed from './PopupTabbed';

const props = {
  panes: [
    {
      title: 'pane 1',
      component: <div>pane 1</div>,
    },
    {
      title: 'pane 2',
      component: <div>pane 2</div>,
    },
    {
      title: 'pane 3',
      component: <div>pane 3</div>,
    },
  ],
  title: 'a test title',
};

const Component = <PopupTabbed { ...props } />;

describe( '<PopupTabbed />', () => {
  it( 'renders without crashing', () => {
    /**
     * Must `attachTo` DOM tree in order to set
     * `clientWidth` and `offsetLeft` in state
     */
    const div = document.createElement( 'div' );

    div.classList.add( 'popup', 'secondary', 'menu', 'active', 'item' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'componentDidMount calls initSliderStyle', () => {
    const div = document.createElement( 'div' );

    div.classList.add( 'popup', 'secondary', 'menu', 'active', 'item' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );
    const inst = wrapper.instance();
    const spy = jest.spyOn( inst, 'initSliderStyle' );

    inst.componentDidMount();
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'renders the title', () => {
    const div = document.createElement( 'div' );

    div.classList.add( 'popup', 'secondary', 'menu', 'active', 'item' );
    window.domNode = div;
    document.body.appendChild( div );
    const wrapper = mount( Component, { attachTo: window.domNode } );

    expect( wrapper.contains( props.title ) ).toEqual( true );
  } );

  it( 'renders the correct panes', () => {
    const div = document.createElement( 'div' );

    div.classList.add( 'popup', 'secondary', 'menu', 'active', 'item' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );
    const menuItems = wrapper.find( 'MenuItem' );

    expect( menuItems.length ).toEqual( props.panes.length );
    menuItems.forEach( ( item, i ) => {
      const { title } = props.panes[i];

      expect( item.contains( title ) ).toEqual( true );
    } );
  } );

  it( 'changing tabs switches the active pane correctly', () => {
    const div = document.createElement( 'div' );

    div.classList.add( 'popup', 'secondary', 'menu', 'active', 'item' );
    window.domNode = div;
    document.body.appendChild( div );

    const wrapper = mount( Component, { attachTo: window.domNode } );
    const menuItems = () => wrapper.find( 'MenuItem' );
    const getPane = str => menuItems().findWhere( n => n.prop( 'name' ) === str );
    const e = {
      target: {
        clientWidth: 300,
        offsetLeft: 120,
      },
    };

    // check initial active & inactive tab
    props.panes.forEach( ( pane, i ) => {
      // check that pane 1 is the active pane
      const isActivePane = i === 0;

      expect( wrapper.containsMatchingElement( pane.component ) )
        .toEqual( isActivePane );
      expect( getPane( pane.title ).prop( 'active' ) )
        .toEqual( isActivePane );
    } );

    // switch to pane 2
    getPane( props.panes[1].title ).simulate( 'click', e );
    props.panes.forEach( ( pane, i ) => {
      // check that pane 2 is the active pane
      const isActivePane = i === 1;

      expect( wrapper.containsMatchingElement( pane.component ) )
        .toEqual( isActivePane );
      expect( getPane( pane.title ).prop( 'active' ) )
        .toEqual( isActivePane );
    } );
    expect( wrapper.state( 'sliderStyle' ) )
      .toEqual( { width: e.target.clientWidth, left: e.target.offsetLeft } );
  } );
} );
