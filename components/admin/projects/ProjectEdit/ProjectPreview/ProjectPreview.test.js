import { shallow } from 'enzyme';
import TestRenderer from 'react-test-renderer';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { units } from 'components/admin/projects/ProjectEdit/mockData';
import PreviewProjectContent, { VIDEO_PROJECT_PREVIEW_QUERY } from './ProjectPreview';

const props = { id: '123', data: units };
const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_QUERY,
      variables: { id: '123' }
    },
    result: {
      data: {
        videoProject: {
          projectType: 'video',
          thumbnails: [
            {
              alt: 'the alt text',
              url: 'https://website.com/filename.jpg'
            }
          ],
          team: { name: 'the team name' }
        }
      }
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
    const wrapper = TestRenderer.create( Component );
    expect( wrapper.toJSON() ).toEqual( 'Loading the project...' );
  } );

  it( 'renders final state without crashing', async () => {
    const wrapper = TestRenderer.create( Component );
    await wait( 0 );
    expect( wrapper.toJSON() ).toMatchSnapshot();
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
    const wrapper = TestRenderer.create(
      <MockedProvider mocks={ errorMocks } addTypename={ false }>
        <PreviewProjectContent { ...props } />
      </MockedProvider>
    );
    await wait( 0 );

    expect( wrapper.toJSON() ).toContain( 'Error! GraphQL error: There was an error.' );
    expect( wrapper.toJSON() ).toMatchSnapshot();
  } );

  it( '`componentDidMount` is called and selects the project item', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const preview = wrapper.find( 'PreviewProjectContent' ).dive();
    const inst = preview.instance();
    const didMountSpy = jest.spyOn( preview.instance(), 'componentDidMount' );
    const selectProjectItemSpy = jest.spyOn( preview.instance(), 'selectProjectItem' );

    inst.componentDidMount();
    expect( didMountSpy ).toHaveBeenCalled();
    expect( selectProjectItemSpy ).toHaveBeenCalled();

    const selectedItemObj = preview.state( 'selectedItem' );
    const language = preview.state( 'selectedLanguage' );
    const { data } = inst.props;
    expect( selectedItemObj ).toEqual(
      data.find( unit => unit.language.displayName === language )
    );
  } );

  it( 'sets `dropDownIsOpen` and `selectedLanguage` in initial `state`', () => {
    const wrapper = shallow( Component );
    const preview = wrapper.find( 'PreviewProjectContent' ).dive();
    const inst = preview.instance();
    const { dropDownIsOpen, selectedLanguage } = inst.state;

    expect( dropDownIsOpen ).toEqual( false );
    expect( selectedLanguage ).toEqual( 'English' );
  } );

  it( '`getLanguages` sets `languages` in initial `state`', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const preview = wrapper.find( 'PreviewProjectContent' ).dive();
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getLanguages' );

    inst.getLanguages( inst.props.data );

    expect( spy ).toHaveBeenCalled();
    expect( inst.state.languages ).toEqual( [
      { key: 'en', value: 'English', text: 'English' },
      { key: 'fr', value: 'French', text: 'French' }] );
  } );

  it( '`getProjectItems` sets `projectItems` in initial `state`', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const preview = wrapper.find( 'PreviewProjectContent' ).dive();
    const inst = preview.instance();
    const spy = jest.spyOn( inst, 'getProjectItems' );
    const { data } = inst.props;

    inst.getProjectItems( data );

    const { languages, projectItems } = inst.state;
    const langKeys = Object.keys( projectItems );

    expect( spy ).toHaveBeenCalled();
    expect( langKeys.length ).toEqual( languages.length );
    langKeys.forEach( key => {
      expect( projectItems[key] ).toEqual(
        data.find( unit => unit.language.displayName === key )
      );
    } );
  } );

  it( '`handleChange` updates `selectedLanguage` and `selectedItem` in `state`', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const preview = wrapper.find( 'PreviewProjectContent' ).dive();
    const inst = preview.instance();
    const { data } = inst.props;

    const handleChangeSpy = jest.spyOn( inst, 'handleChange' );
    const toggleArrowSpy = jest.spyOn( inst, 'toggleArrow' );
    const selectLanguageSpy = jest.spyOn( inst, 'selectLanguage' );
    const selectProjectItemSpy = jest.spyOn( inst, 'selectProjectItem' );

    const e = {};
    const selection = { value: 'French' };

    inst.handleChange( e, selection );

    const { selectedLanguage, selectedItem } = inst.state;

    expect( handleChangeSpy ).toHaveBeenCalledWith( e, selection );
    expect( toggleArrowSpy ).toHaveBeenCalled();
    expect( selectLanguageSpy ).toHaveBeenCalledWith( selection.value );
    expect( selectProjectItemSpy ).toHaveBeenCalled();

    expect( selectedLanguage ).toEqual( selection.value );
    expect( selectedItem ).toEqual(
      data.find( unit => unit.language.displayName === selectedLanguage )
    );
  } );

  it( '`toggleArrow` updates `dropDownIsOpen` in state & the dropdown icon', async () => {
    jest.clearAllMocks();
    const wrapper = TestRenderer.create( Component );
    await wait( 0 );
    const inst = wrapper.root;
    const preview = inst.findByType( PreviewProjectContent ).instance;
    const spy = jest.spyOn( preview, 'toggleArrow' );
    const dropdownIcon = () => inst.findByProps( { className: 'modal_languages' } ).props.icon;

    expect( preview.state.dropDownIsOpen ).toEqual( false );

    preview.toggleArrow();
    expect( spy ).toHaveBeenCalledTimes( 1 );
    expect( preview.state.dropDownIsOpen ).toEqual( true );
    expect( dropdownIcon() ).toEqual( 'chevron up' );

    preview.toggleArrow();
    expect( spy ).toHaveBeenCalledTimes( 2 );
    expect( preview.state.dropDownIsOpen ).toEqual( false );
    expect( dropdownIcon() ).toEqual( 'chevron down' );
  } );

  it( '`selectLanguage` updates `selectedLanguage` and `selectedItem` in state', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const preview = wrapper.find( 'PreviewProjectContent' ).dive();
    const inst = preview.instance();
    const { data } = inst.props;
    const selectedItem = () => inst.state.selectedItem;
    const selectedLanguage = () => inst.state.selectedLanguage;

    const selectLanguageSpy = jest.spyOn( inst, 'selectLanguage' );
    const selectProjectItemSpy = jest.spyOn( inst, 'selectProjectItem' );

    expect( selectedLanguage() ).toEqual( 'English' );
    expect( selectedItem() )
      .toEqual(
        data.find( unit => (
          unit.language.displayName === selectedLanguage()
        ) )
      );

    inst.selectLanguage( 'French' );
    expect( selectLanguageSpy ).toHaveBeenCalledTimes( 1 );
    expect( selectProjectItemSpy ).toHaveBeenCalledTimes( 1 );
    expect( selectedLanguage() ).toEqual( 'French' );
    expect( selectedItem() )
      .toEqual(
        data.find( unit => (
          unit.language.displayName === selectedLanguage()
        ) )
      );

    inst.selectLanguage( 'English' );
    expect( selectLanguageSpy ).toHaveBeenCalledTimes( 2 );
    expect( selectProjectItemSpy ).toHaveBeenCalledTimes( 2 );
    expect( selectedLanguage() ).toEqual( 'English' );
    expect( selectedItem() )
      .toEqual(
        data.find( unit => (
          unit.language.displayName === selectedLanguage()
        ) )
      );
  } );
} );
