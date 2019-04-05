import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { videoProjectPreview } from 'components/admin/projects/ProjectEdit/mockData';
import PreviewProjectContent, { VIDEO_PROJECT_PREVIEW_QUERY } from './PreviewProjectContent';

const props = { id: '123' };
const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_QUERY,
      variables: { id: '123', isReviewPage: false }
    },
    result: {
      data: { project: videoProjectPreview }
    }
  }
];

const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <PreviewProjectContent { ...props } />
  </MockedProvider>
);

describe( '<PreviewProjectContent />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const preview = wrapper.find( 'PreviewProjectContent' );

    expect( preview.exists() ).toEqual( true );
    expect( preview.find( '.preview-project-loader' ).exists() )
      .toEqual( true );
    expect( preview.find( 'Loader' ).exists() )
      .toEqual( true );
    expect( toJSON( preview ) ).toMatchSnapshot();
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = mount( Component );
    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );

    expect( preview.exists() ).toEqual( true );
    expect( preview.find( '.preview-project-loader' ).exists() )
      .toEqual( false );
    expect( preview.find( 'Loader' ).exists() )
      .toEqual( false );
    expect( preview.find( 'ModalItem.project-preview' ).exists() )
      .toEqual( true );
    expect( toJSON( preview ) ).toMatchSnapshot();
  } );

  it( 'renders error message if error is thrown', async () => {
    const errorMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_QUERY,
          variables: { id: '123', isReviewPage: false }
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
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );

    expect( preview.text() )
      .toEqual( 'Error! GraphQL error: There was an error.' );
  } );


  it( 'renders `null` if `!project`', async () => {
    const nullMocks = [
      {
        request: {
          query: VIDEO_PROJECT_PREVIEW_QUERY,
          variables: { id: '123', isReviewPage: false }
        },
        result: {
          data: { project: null }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={ nullMocks } addTypename={ false }>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );

    // wait for the data and !loading
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );

    expect( preview.html() ).toEqual( null );
  } );

  it( 'sets `dropDownIsOpen` and `selectedLanguage` in initial `state`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const { dropDownIsOpen, selectedLanguage } = inst.state;

    expect( dropDownIsOpen ).toEqual( false );
    expect( selectedLanguage ).toEqual( 'English' );
  } );

  it( '`getLanguages` returns an array of language objects', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getLanguages' );
    const { units } = inst.props.data.project;
    const languages = inst.getLanguages( units );

    expect( spy ).toHaveBeenCalled();
    expect( languages ).toEqual( [
      { key: 'en', value: 'English', text: 'English' },
      { key: 'fr', value: 'French', text: 'French' }
    ] );
  } );

  it( '`getProjectItems` sets `projectItems` in initial `state`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getProjectItems' );
    const { units } = inst.props.data.project;
    const projectItems = inst.getProjectItems( units );
    const languages = units.map( unit => unit.language.displayName );

    expect( spy ).toHaveBeenCalled();
    languages.forEach( ( language, i ) => {
      expect( projectItems[language] ).toEqual( units[i] );
    } );
  } );

  it( '`toggleArrow` updates `dropDownIsOpen` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'toggleArrow' );
    const dropDownIsOpen = () => inst.state.dropDownIsOpen;

    expect( dropDownIsOpen() ).toEqual( false );

    inst.toggleArrow();
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( dropDownIsOpen() ).toEqual( true );

    inst.toggleArrow();
    expect( spy ).toHaveBeenCalledTimes( 2 );
    expect( dropDownIsOpen() ).toEqual( false );
  } );

  it( '`selectLanguage` updates `selectedLanguage` in state', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'selectLanguage' );
    const selectedLanguage = () => inst.state.selectedLanguage;

    expect( selectedLanguage() ).toEqual( 'English' );

    inst.selectLanguage( 'French' );
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( selectedLanguage() ).toEqual( 'French' );

    inst.selectLanguage( 'English' );
    expect( spy ).toHaveBeenCalledTimes( 2 );
    expect( selectedLanguage() ).toEqual( 'English' );
  } );


  it( '`handleChange` calls `toggleArrow` and `selectLanguage`', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();

    const preview = wrapper.find( 'PreviewProjectContent' );
    const inst = preview.instance();
    const selectedLanguage = () => inst.state.selectedLanguage;

    const handleChangeSpy = jest.spyOn( inst, 'handleChange' );
    const toggleArrowSpy = jest.spyOn( inst, 'toggleArrow' );
    const selectLanguageSpy = jest.spyOn( inst, 'selectLanguage' );

    const e = {};
    const selection = { value: 'French' };

    expect( selectedLanguage() ).toEqual( 'English' );

    inst.handleChange( e, selection );

    expect( handleChangeSpy ).toHaveBeenCalledWith( e, selection );
    expect( toggleArrowSpy ).toHaveBeenCalledTimes( 1 );
    expect( selectLanguageSpy ).toHaveBeenCalledWith( selection.value );
    expect( selectedLanguage() ).toEqual( selection.value );

    selection.value = 'English';
    inst.handleChange( e, selection );

    expect( handleChangeSpy ).toHaveBeenCalledWith( e, selection );
    expect( handleChangeSpy ).toHaveBeenCalledTimes( 2 );
    expect( toggleArrowSpy ).toHaveBeenCalledTimes( 2 );
    expect( selectLanguageSpy ).toHaveBeenCalledWith( selection.value );
    expect( selectLanguageSpy ).toHaveBeenCalledTimes( 2 );
    expect( selectedLanguage() ).toEqual( selection.value );
  } );
} );
