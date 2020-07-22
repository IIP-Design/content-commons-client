import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import { Loader } from 'semantic-ui-react';

import ProjectPreviewContent from './ProjectPreviewContent';

import { suppressActWarning } from 'lib/utils';
import {
  errorMocks,
  mocks,
  noFilesMocks,
  noStreamsMocks,
  noTagsMocks,
  noUnitsMocks,
  props,
  vimeoMocks,
} from './mocks';

// jest.mock( 'lib/utils', () => ( {
//   getStreamData: jest.fn( ( stream, site = 'youtube', field = 'url' ) => {
//     const uri = stream.find( s => s.site.toLowerCase() === site );

//     if ( uri && Object.keys( uri ).length > 0 ) {
//       return uri[field];
//     }

//     return null;
//   } ),
//   getVimeoId: jest.fn( () => '340239507' ),
//   getYouTubeId: jest.fn( () => '1evw4fRu3bo' ),
//   contentRegExp: jest.fn( () => false ),
//   getApolloErrors: jest.fn( error => {
//     let errs = [];
//     const { graphQLErrors, networkError, otherError } = error;

//     if ( graphQLErrors ) {
//       errs = graphQLErrors.map( error => error.message );
//     }
//     if ( networkError ) errs.push( networkError );
//     if ( otherError ) errs.push( otherError );

//     return errs;
//   } ),
// } ) );

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

jest.mock( 'static/icons/icon_download.svg', () => 'downloadIcon.svg' );
jest.mock( 'static/icons/icon_embed.svg', () => 'embedIcon.svg' );
jest.mock( 'static/icons/icon_share.svg', () => 'shareIcon.svg' );

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <ProjectPreviewContent { ...props } />
  </MockedProvider>
);

describe( '<ProjectPreviewContent />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const preview = wrapper.find( 'ProjectPreviewContent' );
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
    const wrapper = mount(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <ProjectPreviewContent { ...props } />
      </MockedProvider>,
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const errorComponent = preview.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    expect( errorComponent.contains( 'There was an error.' ) )
      .toEqual( true );
  } );

  it.skip( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );

    expect( toJSON( preview ) ).toMatchSnapshot();
  } );

  it.skip( 'sets dropDownIsOpen and selectedLanguage in initial state', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    const { dropDownIsOpen, selectedLanguage } = inst.state;
    const { language } = mocks[0].result.data.project.units[1];

    expect( dropDownIsOpen ).toEqual( false );
    expect( selectedLanguage ).toEqual( language.displayName );
  } );

  it.skip( 'sets language in state when mounted', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    const { selectedLanguage } = inst.state;
    const { language } = mocks[0].result.data.project.units[1];

    expect( selectedLanguage ).toEqual( language.displayName );
  } );

  it.skip( 'calling getLanguages gets the unit language(s)', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getLanguages' );
    const { units } = mocks[0].result.data.project;

    const languages = inst.getLanguages( units );

    expect( spy ).toHaveBeenCalled();
    expect( languages ).toEqual( [
      { key: 'ar', value: 'Arabic', text: 'Arabic' },
      { key: 'en', value: 'English', text: 'English' },
    ] );
  } );

  it( 'getUnitsWithFiles returns an array of units with files', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    const units = [
      { id: '1', files: [] },
      { id: '2', files: [{ id: 'a', fileName: 'alpha' }] },
    ];
    const unitsWithFiles = inst.getUnitsWithFiles( units );

    expect( Array.isArray( unitsWithFiles ) ).toEqual( true );
    expect( unitsWithFiles[0] ).toEqual( units[1] );
  } );

  it( 'calling getProjectUnits gets the projectUnits', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
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

    const preview = wrapper.find( 'ProjectPreviewContent' );
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
      units.find( unit => unit.language.displayName === selectedLanguage ),
    );
  } );

  it.skip( 'toggleArrow updates dropDownIsOpen in state & updates dropdown icon', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = () => wrapper.find( 'ProjectPreviewContent' );
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

  it.skip( 'selectLanguage updates selectedLanguage in state', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
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

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getEnglishIndex' );
    const { units } = mocks[0].result.data.project;
    const englishIndex = inst.getEnglishIndex( units );

    expect( spy ).toHaveBeenCalledWith( units );
    expect( englishIndex ).toEqual( units.length - 1 );
  } );

  it( 'getFilesCount returns the correct number of unit files', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getFilesCount' );
    const { units } = mocks[0].result.data.project;
    const currentUnitIndex = 0; // just use the first unit
    const count = inst.getFilesCount( units, currentUnitIndex );

    expect( spy ).toHaveBeenCalledWith( units, currentUnitIndex );
    expect( count ).toEqual( units[currentUnitIndex].files.length );
  } );

  it( 'getCurrUnitIndex returns the correct index', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();

    expect( inst.getCurrUnitIndex( 2, 2 ) ).toEqual( 2 );
    expect( inst.getCurrUnitIndex( -1, 2 ) ).toEqual( 0 );
    expect( inst.getCurrUnitIndex( 2, 0 ) ).toEqual( 0 );
    expect( inst.getCurrUnitIndex( 2 ) ).toEqual( 0 );
  } );

  it( 'getUnitLanguage returns the unit language object', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    const { units } = mocks[0].result.data.project;
    const { units: noEnglishUnits } = vimeoMocks[0].result.data.project;
    const nonEnglish = inst.getUnitLanguage( noEnglishUnits );
    const english = inst.getUnitLanguage( units );

    expect( typeof nonEnglish ).toEqual( 'object' );
    expect( typeof english ).toEqual( 'object' );
    expect( nonEnglish ).toEqual( noEnglishUnits[0].language );
    expect( english ).toEqual( units[1].language );
  } );

  it( 'getContentType returns the correct content type', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getContentType' );
    const videoType = inst.getContentType( 'VideoProject' );
    const noType = inst.getContentType();

    expect( spy ).toHaveBeenCalled();
    expect( videoType ).toEqual( 'video' );
    expect( noType ).toEqual( '' );
  } );

  it.skip( 'renders the share icon and PopupTrigger', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const sharePopup = preview.find( '.video-project__popover--share' );

    expect( sharePopup.exists() ).toEqual( true );
  } );

  it.skip( 'renders the embed icon and PopupTrigger', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const embedPopup = preview.find( 'PopupTrigger[toolTip="Embed video"]' );

    expect( embedPopup.exists() ).toEqual( true );
  } );

  it( 'does not render the embed icon and PopupTrigger if there are no YouTube and Vimeo urls', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noStreamsMocks } addTypename>
        <ProjectPreviewContent { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const embedPopup = preview.find( 'PopupTrigger[toolTip="Embed video"]' );

    expect( embedPopup.exists() ).toEqual( false );
  } );

  it.skip( 'renders the download icon and PopupTrigger', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const downloadPopup = preview.find( 'PopupTrigger[toolTip="Download video"]' );

    expect( downloadPopup.exists() ).toEqual( true );
  } );

  it.skip( 'renders an embedded YouTube video', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const embed = preview.find( 'Embed' );
    const { signedUrl } = mocks[0].result.data.project.thumbnails[0];

    expect( embed.exists() ).toEqual( true );
    expect( embed.prop( 'id' ) ).toEqual( '1evw4fRu3bo' );
    expect( embed.prop( 'source' ) ).toEqual( 'youtube' );
    expect( embed.prop( 'placeholder' ) ).toEqual( signedUrl );
  } );

  it.skip( 'renders an embedded Vimeo video if there is no YouTube url', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ vimeoMocks } addTypename>
        <ProjectPreviewContent { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const embed = preview.find( 'Embed' );
    const { signedUrl } = vimeoMocks[0].result.data.project.thumbnails[0];

    expect( embed.exists() ).toEqual( true );
    expect( embed.prop( 'id' ) ).toEqual( '340239507' );
    expect( embed.prop( 'source' ) ).toEqual( 'vimeo' );
    expect( embed.prop( 'placeholder' ) ).toEqual( signedUrl );
  } );

  it.skip( 'renders a project thumbnail if there are no YouTube or Vimeo urls', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noStreamsMocks } addTypename>
        <ProjectPreviewContent { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const embed = preview.find( 'Embed' );
    const thumbnail = preview.find( 'figure.modal_thumbnail' );
    const img = thumbnail.find( 'img.overlay-image' );
    const { alt, signedUrl } = noStreamsMocks[0].result.data.project.thumbnails[0];

    expect( embed.exists() ).toEqual( false );
    expect( thumbnail.exists() ).toEqual( true );
    expect( img.prop( 'src' ) ).toEqual( signedUrl );
    expect( img.prop( 'alt' ) ).toEqual( alt );
  } );

  it.skip( 'renders a "no files message" if there are no files in the selected unit', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noFilesMocks } addTypename>
        <ProjectPreviewContent { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const { displayName } = noFilesMocks[0].result.data.project.units[0].language;
    const noFilesMsg = `This ${displayName} language unit does not have any files to preview.`;

    expect( preview.text() ).toEqual( noFilesMsg );
  } );

  it.skip( 'renders a "no units message" if there are no units in the project', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noUnitsMocks } addTypename>
        <ProjectPreviewContent { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const noUnitsMsg = 'This project does not have any units to preview.';

    expect( preview.contains( noUnitsMsg ) ).toEqual( true );
  } );

  it.skip( 'renders a single language but not a language dropdown if there is only one unit', async () => {
    // use vimeoMocks since it has a single unit
    const wrapper = mount(
      <MockedProvider mocks={ vimeoMocks } addTypename>
        <ProjectPreviewContent { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const dropdown = preview.find( '.modal_languages' );
    const singleLanguage = preview.find( '.modal_languages_single' );
    const { units } = vimeoMocks[0].result.data.project;

    expect( units.length ).toEqual( 1 );
    expect( dropdown.exists() ).toEqual( false );
    expect( singleLanguage.exists() ).toEqual( true );
  } );

  it( 'getTag returns the correct translation tag name', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    // using the English unit at index 1
    const tag = mocks[0].result.data.project.units[1].tags[0];
    const unit = mocks[0].result.data.project.units[1];
    const tagName = inst.getTag( tag, unit );

    expect( tagName ).toEqual( 'american culture' );
  } );

  it( 'getTags returns an array of translation tag name(s)', async () => {
    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const inst = preview.instance();
    // using the English unit at index 1
    const { tags } = mocks[0].result.data.project.units[1];
    const unit = mocks[0].result.data.project.units[1];
    const tagNames = inst.getTags( tags, unit );
    const ret = [
      { name: 'american culture' },
      { name: 'english learning' },
    ];

    expect( Array.isArray( tagNames ) ).toEqual( true );
    expect( tagNames ).toEqual( ret );
  } );

  it( 'does not render a tags section if the selected unit has no tags', async () => {
    const wrapper = mount(
      <MockedProvider mocks={ noTagsMocks } addTypename>
        <ProjectPreviewContent { ...props } />
      </MockedProvider>,
    );

    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'ProjectPreviewContent' );
    const tagsSection = preview.find( '.modal_section--postTags' );

    expect( tagsSection.exists() ).toEqual( false );
  } );
} );
