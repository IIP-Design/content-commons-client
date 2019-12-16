import { mount } from 'enzyme';
import ActionHeadline from './ActionHeadline';

const props = {
  className: 'headline',
  type: 'package',
  published: false,
  updated: false
};

describe( '<ActionHeadline />, if not published', () => {
  const Component = <ActionHeadline { ...props } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className', () => {
    const wrapper = mount( Component );
    expect( wrapper.prop( 'className' ) ).toEqual( props.className );
  } );

  it( 'renders the correct HTML element', () => {
    const wrapper = mount( Component );
    expect( wrapper.prop( 'el' ) ).toEqual( 'h3' );
  } );

  it( 'renders the correct headline', () => {
    const wrapper = mount( Component );
    const headlines = [
      `It looks like you made changes to your ${props.type}. Do you want to publish changes?`,
      `Your ${props.type} looks great! Are you ready to Publish?`,
      'Not ready to share with the world yet?'
    ];

    headlines.forEach( ( txt, i ) => {
      expect( wrapper.contains( txt ) ).toEqual( i === 1 );
    } );
  } );
} );

describe( '<ActionHeadline />, if published and updated', () => {
  const newProps = {
    ...props,
    published: true,
    updated: true
  };
  const Component = <ActionHeadline { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className', () => {
    const wrapper = mount( Component );
    expect( wrapper.prop( 'className' ) ).toEqual( props.className );
  } );

  it( 'renders the correct HTML element', () => {
    const wrapper = mount( Component );
    expect( wrapper.prop( 'el' ) ).toEqual( 'h3' );
  } );

  it( 'renders the correct headline', () => {
    const wrapper = mount( Component );
    const headlines = [
      `It looks like you made changes to your ${props.type}. Do you want to publish changes?`,
      `Your ${props.type} looks great! Are you ready to Publish?`,
      'Not ready to share with the world yet?'
    ];

    headlines.forEach( ( txt, i ) => {
      expect( wrapper.contains( txt ) ).toEqual( i === 0 );
    } );
  } );
} );

describe( '<ActionHeadline />, if published and not updated', () => {
  const newProps = {
    ...props,
    published: true,
    updated: false
  };
  const Component = <ActionHeadline { ...newProps } />;

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct className', () => {
    const wrapper = mount( Component );
    expect( wrapper.prop( 'className' ) ).toEqual( props.className );
  } );

  it( 'renders the correct HTML element', () => {
    const wrapper = mount( Component );
    expect( wrapper.prop( 'el' ) ).toEqual( 'h3' );
  } );

  it( 'renders the correct headline', () => {
    const wrapper = mount( Component );
    const headlines = [
      `It looks like you made changes to your ${props.type}. Do you want to publish changes?`,
      `Your ${props.type} looks great! Are you ready to Publish?`,
      'Not ready to share with the world yet?'
    ];

    headlines.forEach( ( txt, i ) => {
      expect( wrapper.contains( txt ) ).toEqual( i === 2 );
    } );
  } );
} );
