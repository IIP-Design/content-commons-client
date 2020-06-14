import { mount } from 'enzyme';
import ModalPostTags from './ModalPostTags';

describe( '<ModalPostTags />', () => {
  const props = {
    tags: [
      {
        id: 'ck2lzgu1e0rea0720a0drvwkp',
        name: 'global issues',
      },
      {
        id: 'ck9h3ka3o269y0720t7wzp5uq',
        name: 'arts & culture',
      },
      {
        id: 'ck2lzgu1d0re60720cnc94vh6',
        name: 'economic opportunity',
      },
      {
        id: 'ck2lzgu1d0re70720khzd9c6z',
        name: 'education',
      },
    ],
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalPostTags { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct container className values', () => {
    const container = wrapper.find( 'section' );
    const values = 'modal_section modal_section--postTags';

    expect( container.hasClass( values ) ).toEqual( true );
  } );

  it( 'renders the correct tags', () => {
    const container = wrapper.find( 'section' );
    const postTags = container.find( '.modal_postTag' );
    const { tags } = props;
    const MAX_TAG_COUNT = 3;
    const MAX_INDEX = MAX_TAG_COUNT - 1;

    expect( tags.length ).toBeGreaterThan( MAX_TAG_COUNT );
    expect( postTags.length ).toEqual( MAX_TAG_COUNT );
    postTags.forEach( ( postTag, i ) => {
      const { name } = props.tags[i];

      expect( postTag.name() ).toEqual( 'span' );

      if ( i < MAX_INDEX && i < MAX_INDEX ) {
        expect( postTag.text() ).toEqual( ` ${name}  ·  ` );
      } else {
        expect( postTag.text() ).toEqual( ` ${name} ` );
      }
    } );
  } );
} );

describe( '<ModalPostTags />, when props.tags is a string', () => {
  const props = {
    tags: 'global issues · arts & culture',
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <ModalPostTags { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the postTags container', () => {
    const container = wrapper.find( 'section' );
    const values = 'modal_section modal_section--postTags';

    expect( container.hasClass( values ) ).toEqual( true );
    expect( container.contains( props.tags ) ).toEqual( true );
  } );
} );
