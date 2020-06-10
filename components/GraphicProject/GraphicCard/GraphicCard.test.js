import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { graphicElasticMock } from '../graphicElasticMock';
import { normalizeItem } from 'lib/elastic/parser';
import GraphicCard from './GraphicCard';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: { REACT_APP_PUBLIC_API: 'http://localhost:8080' }
} ) );

jest.mock( '../GraphicProject', () => function GraphicProject() { return ''; } );

const props = {
  item: normalizeItem( graphicElasticMock[0], 'en-us' ),
};
// Get the first english twitter img
const twitterEnglishImg = props.item.images
  .filter( img => img.language.locale === 'en-us' && img.social.includes( 'Twitter' ) )[0];

const Component = <GraphicCard {...props} />;

describe( 'GraphicCard', () => {
  const wrapper = mount( Component );

  it( 'renders without crashing', () => {    
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the article element', () => {
    const article = wrapper.find( 'article.graphic_card' );
    expect( article.exists() ).toEqual( true );
  } );

  it( 'renders the image', () => {
    const img = wrapper.find( 'article > img' );    
    expect( img.exists() ).toEqual( true );
        
    expect( img.prop( 'src' ) ).toEqual( twitterEnglishImg.srcUrl );
  } );

  it( 'renders the title', () => {
    const buttonTitle = wrapper.find( 'button.title' );
    expect( buttonTitle.exists() ).toEqual( true );
    expect( buttonTitle.text() ).toEqual( twitterEnglishImg.title );
  } );

  it( 'toggles the modal on handleOpen & handleClose', () => {
    const modal = () => wrapper.find( 'Modal' );
    // Init state
    expect( modal().prop('open') ).toEqual( false );

    // Open modal
    act( () => {
      modal().prop('onOpen')();
    } );
    wrapper.update();
    expect( modal().prop('open') ).toEqual( true );
    
    // Close Modal
    act( () => {
      modal().prop('onClose')();
    } );
    wrapper.update();
    expect( modal().prop('open') ).toEqual( false );
  } );

  it( 'renders the internal description', () => {
    const internalDesc = wrapper.find( 'p.internal-desc' );
    expect( internalDesc.exists() ).toEqual( true );
  } );
} );