import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { Loader } from 'semantic-ui-react';
import PreviewProjectContent, { VIDEO_PROJECT_PREVIEW_QUERY } from './PreviewProjectContent';
import { getMocks } from './mocks';

jest.mock( 'lib/utils', () => ( {
  getPathToS3Bucket: jest.fn( () => {} ),
  getS3Url: jest.fn( assetPath => (
    `https://s3-url.com/${assetPath}`
  ) ),
  getStreamData: jest.fn( ( stream, site = 'youtube', field = 'url' ) => {
    const uri = stream.find( s => s.site.toLowerCase() === site );
    if ( uri && Object.keys( uri ).length > 0 ) {
      return uri[field];
    }
    return null;
  } ),
  getVimeoId: jest.fn( () => '340239507' ),
  getYouTubeId: jest.fn( () => '1evw4fRu3bo' ),
  contentRegExp: jest.fn( () => false )
} ) );

// jest.mock( 'static/icons/icon_download.svg', () => () => 'downloadIcon' );
// jest.mock( 'static/icons/icon_embed.svg', () => () => 'embedIcon' );
// jest.mock( 'static/icons/icon_share.svg', () => () => 'shareIcon' );

const props = { id: '123' };

const mocks = getMocks( VIDEO_PROJECT_PREVIEW_QUERY, props );

const vimeoMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: [
                {
                  ...mocks[0].result.data.project.units[0].files[0],
                  stream: [
                    {
                      __typename: 'VideoStream',
                      id: 'st35',
                      site: 'Vimeo',
                      url: 'https://vimeo.com/340239507'
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  }
];

const noStreamsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: [
                {
                  ...mocks[0].result.data.project.units[0].files[0],
                  stream: []
                }
              ]
            }
          ]
        }
      }
    }
  }
];

const noFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: []
            }
          ]
        }
      }
    }
  }
];

const noUnitsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: []
        }
      }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <PreviewProjectContent { ...props } />
  </MockedProvider>
);

describe( '<PreviewProjectContent />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const preview = wrapper.find( 'PreviewProjectContent' );
    const loader = (
      <Loader
        active
        inline="centered"
        style={ { marginBottom: '1em' } }
      />
    );
    const msg = <p>Loading the project preview...</p>;

    expect( preview.exists() ).toEqual( true );
    expect( preview.contains( loader ) ).toEqual( true );
    expect( preview.contains( msg ) ).toEqual( true );
  } );

  it( 'renders error message if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_QUERY,
          variables: { id: '123' }
        },
        result: {
          errors: [{ message: 'There was an error.' }]
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const errorComponent = preview.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );

    expect( toJSON( preview ) ).toMatchSnapshot();
  } );

  it( 'sets dropDownIsOpen and selectedLanguage in initial state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const { dropDownIsOpen, selectedLanguage } = inst.state;
    const { language } = mocks[0].result.data.project.units[1];

    expect( dropDownIsOpen ).toEqual( false );
    expect( selectedLanguage ).toEqual( language.displayName );
  } );

  it( 'sets language in state when mounted', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const { selectedLanguage } = inst.state;
    const { language } = mocks[0].result.data.project.units[1];

    expect( selectedLanguage ).toEqual( language.displayName );
  } );

  it( 'calling getLanguages gets the unit language(s)', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getLanguages' );
    const { units } = mocks[0].result.data.project;

    const languages = inst.getLanguages( units );

    expect( spy ).toHaveBeenCalled();
    expect( languages ).toEqual( [
      { key: 'ar', value: 'Arabic', text: 'Arabic' },
      { key: 'en', value: 'English', text: 'English' }
    ] );
  } );

  it( 'calling getProjectUnits gets the projectUnits', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getProjectUnits' );
    const { units } = mocks[0].result.data.project;

    const projectUnits = inst.getProjectUnits( units );

    expect( spy ).toHaveBeenCalled();
    expect( typeof projectUnits ).toEqual( 'object' );
    expect( Object.keys( projectUnits ).length ).toEqual( units.length );
    units.forEach( unit => {
      const { language: { displayName } } = unit;
      expect( projectUnits[displayName] ).toEqual( unit );
    } );
  } );

  it( 'handleChange updates selectedLanguage and selectedItem in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const { units } = mocks[0].result.data.project;

    const handleChangeSpy = jest.spyOn( inst, 'handleChange' );
    const toggleArrowSpy = jest.spyOn( inst, 'toggleArrow' );
    const selectLanguageSpy = jest.spyOn( inst, 'selectLanguage' );

    const e = {};
    const selection = { value: 'French' };

    inst.handleChange( e, selection );

    const { selectedLanguage, selectedItem } = inst.state;

    expect( handleChangeSpy ).toHaveBeenCalledWith( e, selection );
    expect( toggleArrowSpy ).toHaveBeenCalled();
    expect( selectLanguageSpy ).toHaveBeenCalledWith( selection.value );

    expect( selectedLanguage ).toEqual( selection.value );
    expect( selectedItem ).toEqual(
      units.find( unit => unit.language.displayName === selectedLanguage )
    );
  } );

  it( 'toggleArrow updates dropDownIsOpen in state & updates dropdown icon', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = () => wrapper.find( 'PreviewProjectContent' );
    const dropdown = () => preview().find( 'Dropdown.modal_languages' );
    const inst = preview().instance();
    const spy = jest.spyOn( inst, 'toggleArrow' );

    expect( inst.state.dropDownIsOpen ).toEqual( false );
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron down' );

    inst.toggleArrow();
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( inst.state.dropDownIsOpen ).toEqual( true );
    wrapper.update();
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron up' );

    inst.toggleArrow();
    expect( spy ).toHaveBeenCalledTimes( 2 );
    expect( inst.state.dropDownIsOpen ).toEqual( false );
    wrapper.update();
    expect( dropdown().prop( 'icon' ) ).toEqual( 'chevron down' );
  } );

  it( 'selectLanguage updates selectedLanguage in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const selectedLanguage = () => inst.state.selectedLanguage;
    const spy = jest.spyOn( inst, 'selectLanguage' );
    const { language: initialLang } = mocks[0].result.data.project.units[1];
    const { language: newLang } = mocks[0].result.data.project.units[0];

    expect( selectedLanguage() ).toEqual( initialLang.displayName );

    inst.selectLanguage( newLang.displayName );
    expect( spy ).toHaveBeenCalled();
    expect( selectedLanguage() ).toEqual( newLang.displayName );

    inst.selectLanguage( initialLang.displayName );
    expect( spy ).toHaveBeenCalled();
    expect( selectedLanguage() ).toEqual( initialLang.displayName );
  } );

  it( 'getEnglishIndex returns the index for the English language unit', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getEnglishIndex' );
    const { units } = mocks[0].result.data.project;
    const englishIndex = inst.getEnglishIndex( units );

    expect( spy ).toHaveBeenCalled();
    expect( englishIndex ).toEqual( units.length - 1 );
  } );

  it( 'getContentType returns the correct content type', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getContentType' );
    const videoType = inst.getContentType( 'VideoProject' );
    const noType = inst.getContentType();

    expect( spy ).toHaveBeenCalled();
    expect( videoType ).toEqual( 'video' );
    expect( noType ).toEqual( '' );
  } );

  it( 'renders the share icon and PopupTrigger', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const sharePopup = preview.find( 'PopupTrigger[tooltip="Share project"]' );

    expect( sharePopup.exists() ).toEqual( true );
  } );

  it( 'renders the embed icon and PopupTrigger', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const embedPopup = preview.find( 'PopupTrigger[toolTip="Embed video"]' );

    expect( embedPopup.exists() ).toEqual( true );
  } );

  it( 'does not render the embed icon and PopupTrigger if there are no YouTube and Vimeo urls', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noStreamsMocks } addTypename>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const embedPopup = preview.find( 'PopupTrigger[toolTip="Embed video"]' );

    expect( embedPopup.exists() ).toEqual( false );
  } );

  it( 'renders the download icon and PopupTrigger', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const downloadPopup = preview.find( 'PopupTrigger[toolTip="Download video"]' );

    expect( downloadPopup.exists() ).toEqual( true );
  } );

  it( 'renders an embedded YouTube video', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const embed = preview.find( 'Embed' );
    const assetPath = mocks[0].result.data.project.thumbnails[0].url;
    const s3Bucket = 'https://s3-url.com';

    expect( embed.exists() ).toEqual( true );
    expect( embed.prop( 'id' ) ).toEqual( '1evw4fRu3bo' );
    expect( embed.prop( 'source' ) ).toEqual( 'youtube' );
    expect( embed.prop( 'placeholder' ) )
      .toEqual( `${s3Bucket}/${assetPath}` );
  } );

  it( 'renders an embedded Vimeo video if there is no YouTube url', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ vimeoMocks } addTypename>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const embed = preview.find( 'Embed' );
    const assetPath = vimeoMocks[0].result.data.project.thumbnails[0].url;
    const s3Bucket = 'https://s3-url.com';

    expect( embed.exists() ).toEqual( true );
    expect( embed.prop( 'id' ) ).toEqual( '340239507' );
    expect( embed.prop( 'source' ) ).toEqual( 'vimeo' );
    expect( embed.prop( 'placeholder' ) )
      .toEqual( `${s3Bucket}/${assetPath}` );
  } );

  it( 'renders a project thumbnail if there are no YouTube or Vimeo urls', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noStreamsMocks } addTypename>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const embed = preview.find( 'Embed' );
    const thumbnail = preview.find( 'figure.modal_thumbnail' );
    const img = thumbnail.find( 'img.overlay-image' );
    const assetPath = noStreamsMocks[0].result.data.project.thumbnails[0].url;
    const { alt } = noStreamsMocks[0].result.data.project.thumbnails[0];
    const s3Bucket = 'https://s3-url.com';

    expect( embed.exists() ).toEqual( false );
    expect( thumbnail.exists() ).toEqual( true );
    expect( img.prop( 'src' ) ).toEqual( `${s3Bucket}/${assetPath}` );
    expect( img.prop( 'alt' ) ).toEqual( alt );
  } );

  it( 'renders a "no files message" if there are no files in the selected unit', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks } addTypename>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const noFilesMsg = 'This project unit does not have any files to preview.';

    expect( preview.contains( noFilesMsg ) ).toEqual( true );
  } );

  it( 'renders a "no units message" if there are no units in the project', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noUnitsMocks } addTypename>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const noUnitsMsg = 'This project does not have any units to preview.';

    expect( preview.contains( noUnitsMsg ) ).toEqual( true );
  } );
} );
