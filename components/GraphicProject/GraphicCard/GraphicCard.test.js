import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import moment from 'moment';
import { graphicElasticMock } from '../graphicElasticMock';
// import { getGraphicImgsBySocial } from '../utils';
import { normalizeItem } from 'lib/elastic/parser';
import GraphicCard from './GraphicCard';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: { REACT_APP_PUBLIC_API: 'http://localhost:8080' },
} ) );

const mockedSignedUrl = 'https://mockImg.jpg';

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: mockedSignedUrl } ) ) );

jest.mock(
  'components/InternalUseDisplay/InternalUseDisplay',
  () => function InternalUseDisplay() { return ''; },
);
jest.mock( '../GraphicProject', () => function GraphicProject() { return ''; } );

// Set default thumbnail img
// const filteredGraphicImgs = getGraphicImgsBySocial( props.item.images, 'Twitter' );
// const setDefaultImg = () => {
//   const englishImg = filteredGraphicImgs.find( img => img.language.display_name === 'English' );

//   if ( englishImg ) {
//     return englishImg;
//   }

//   return filteredGraphicImgs[0];
// };
// const thumbnailImg = setDefaultImg();

describe( '<GraphicCard />', () => {
  const props = {
    item: normalizeItem( graphicElasticMock[0], 'en-us' ),
  };
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicCard { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the article element', () => {
    const article = wrapper.find( 'article.graphic_card' );

    expect( article.exists() ).toEqual( true );
  } );

  it( 'renders the thumbnail', () => {
    const thumbnail = wrapper.find( 'img[data-img="graphic_thumbnail"]' );

    expect( thumbnail.exists() ).toEqual( true );
    expect( thumbnail.prop( 'src' ) ).toEqual( mockedSignedUrl );
  } );

  it( 'renders the title', () => {
    const buttonTitle = wrapper.find( 'button.title' );

    expect( buttonTitle.exists() ).toEqual( true );
    expect( buttonTitle.text() ).toEqual( props.item.title );
  } );

  it( 'toggles the modals on handleOpen & handleClose', () => {
    const thumbnailModal = () => wrapper.find( 'Modal:first-child' );
    const titleModal = () => wrapper.find( 'Modal' ).last();

    // Init state
    expect( thumbnailModal().prop( 'open' ) ).toEqual( false );
    expect( titleModal().prop( 'open' ) ).toEqual( false );

    // Open modal
    act( () => {
      thumbnailModal().prop( 'onOpen' )();
      titleModal().prop( 'onOpen' )();
    } );
    wrapper.update();
    expect( thumbnailModal().prop( 'open' ) ).toEqual( true );
    expect( titleModal().prop( 'open' ) ).toEqual( true );

    // Close Modal
    act( () => {
      thumbnailModal().prop( 'onClose' )();
      titleModal().prop( 'onClose' )();
    } );
    wrapper.update();
    expect( thumbnailModal().prop( 'open' ) ).toEqual( false );
    expect( titleModal().prop( 'open' ) ).toEqual( false );
  } );

  it( 'renders the public description', () => {
    const publicDesc = wrapper.find( 'p.publicDesc' );

    expect( publicDesc.exists() ).toEqual( true );
  } );

  it( 'renders the graphic publish date', () => {
    const propsPublishedDate = moment( props.item.published ).format( 'MMMM DD, YYYY' );
    const publishedDate = wrapper.find( '.publishedDate' );

    expect( publishedDate.exists() ).toEqual( true );
    expect( publishedDate.text() ).toEqual( propsPublishedDate );
  } );

  it( 'renders the graphic tags', () => {
    const propTags = props.item.categories;
    const tagsList = wrapper.find( 'ModalPostTags' );

    expect( tagsList.exists() ).toEqual( true );
    expect( tagsList.prop( 'tags' ) ).toEqual( propTags );
  } );

  it( 'does not render tags component if there are no tags', () => {
    const propsNoTags = {
      ...props.item,
      categories: [],
    };

    wrapper.setProps( { item: propsNoTags } );
    const tagsList = wrapper.find( 'ModalPostTags' );

    expect( tagsList.exists() ).toEqual( false );

    // Reset component props
    wrapper.setProps( { item: props.item } );
  } );

  it( 'renders the DOS logo & team', () => {
    const mediaObj = wrapper.find( 'footer > MediaObject' );
    const propsOwner = props.item.owner;

    expect( mediaObj.find( '.media > span' ).text() ).toEqual( propsOwner );
    expect( mediaObj.find( '.media > img' ).prop( 'src' ) ).toEqual( 'image-stub' );
  } );

  it( 'does not render the InternalUseDisplay', () => {
    const internalDisplay = wrapper.find( 'InternalUseDisplay' );

    expect( internalDisplay.exists() ).toEqual( false );
  } );
} );

describe( '<GraphicCard />, with INTERNAL visibility', () => {
  const props = {
    item: {
      ...normalizeItem( graphicElasticMock[0], 'en-us' ),
      visibility: 'INTERNAL',
    },
  };
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicCard { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders the InternalUseDisplay', () => {
    const internalDisplay = wrapper.find( 'InternalUseDisplay' );

    expect( internalDisplay.exists() ).toEqual( true );
    expect( internalDisplay.props() ).toEqual( {
      style: { margin: '0.5em auto 0 1em' },
    } );
  } );
} );
