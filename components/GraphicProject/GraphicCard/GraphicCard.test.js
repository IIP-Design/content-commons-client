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

jest.mock( '../GraphicProject', () => function GraphicProject() { return ''; } );

const props = {
  item: normalizeItem( graphicElasticMock[0], 'en-us' ),
};

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

const Component = <GraphicCard { ...props } />;

describe( 'GraphicCard', () => {
  const wrapper = mount( Component );

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

  it( 'toggles the modal on handleOpen & handleClose', () => {
    const modal = () => wrapper.find( 'Modal' );

    // Init state
    expect( modal().prop( 'open' ) ).toEqual( false );

    // Open modal
    act( () => {
      modal().prop( 'onOpen' )();
    } );
    wrapper.update();
    expect( modal().prop( 'open' ) ).toEqual( true );

    // Close Modal
    act( () => {
      modal().prop( 'onClose' )();
    } );
    wrapper.update();
    expect( modal().prop( 'open' ) ).toEqual( false );
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
} );
