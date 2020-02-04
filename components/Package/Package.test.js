import { mount, shallow } from 'enzyme';
import moment from 'moment';
import { normalizeItem } from 'lib/elastic/parser';
import Package from './Package';
import { packageItem } from './packageElasticMock';
import { packageItemGraph } from './packageGraphMock';

const elasticPropsItem = normalizeItem( packageItem[0], 'en-us' );

const {
  id, createdAt, updatedAt, title, team, type, documents
} = packageItemGraph;

// Structure obj for use in Package component
const graphPropsItem = {
  id,
  published: createdAt,
  modified: updatedAt,
  team,
  type,
  title,
  packageFiles: documents
};

const propsByAPI = {
  elastic: {
    props: {
      item: elasticPropsItem
    },
    docFilesLength: elasticPropsItem.packageFiles.length
  },
  graphQL: {
    props: {
      item: graphPropsItem
    },
    docFilesLength: graphPropsItem.packageFiles.length
  }
};

Object.keys( propsByAPI ).forEach( apiType => {
  const { props } = propsByAPI[apiType];
  const Component = <Package { ...props } />;
  const { docFilesLength } = propsByAPI[apiType];

  describe( `<Package /> (${apiType} API)`, () => {
    const wrapper = shallow( Component );

    it( 'renders without crashing', () => {
      expect( wrapper.exists() ).toEqual( true );
    } );

    it( 'renders the package title', () => {
      const headline = wrapper.find( 'ModalItem' ).prop( 'headline' );
      expect( headline ).toEqual( props.item.title );
    } );

    it( 'renders the date', () => {
      const metaTerms = wrapper.find( 'MetaTerms' );

      const { published, modified } = props.item;
      const isUpdated = modified > published;
      const label = isUpdated ? 'Updated' : 'Created';
      const dateTime = isUpdated ? modified : published;
      const formattedDateTime = moment( dateTime ).format( 'LT, l' );
      const timeElement = mount( <time dateTime={ dateTime }>{ formattedDateTime }</time> );

      const { definition, displayName, name } = metaTerms.prop( 'terms' )[0];

      expect( metaTerms.exists() ).toEqual( true );
      expect( displayName ).toEqual( label );
      expect( name ).toEqual( label );
      expect( mount( definition ) ).toEqual( timeElement );
    } );

    it( 'renders the Share button', () => {
      const shareButton = wrapper.findWhere( n => n.prop( 'tooltip' ) === 'Share package' );
      expect( shareButton.exists() ).toEqual( true );
    } );

    it( 'renders the Download button', () => {
      const downloadButton = wrapper.findWhere( n => n.prop( 'tooltip' ) === 'Download file' );
      expect( downloadButton.exists() ).toEqual( true );
    } );

    it( 'renders correct file count for file downloads', () => {
      const fileCount = wrapper.find( '.file-count' );
      const fileCountNum = Number( fileCount.text().match( /\d+/g )[0] );
      expect( fileCountNum ).toEqual( docFilesLength );
    } );

    it( 'renders the correct number of PackageItems', () => {
      const packageItemComponents = wrapper.find( 'PackageItem' );
      expect( packageItemComponents.exists() ).toEqual( true );
      expect( packageItemComponents ).toHaveLength( docFilesLength );
    } );
  } );
} );
