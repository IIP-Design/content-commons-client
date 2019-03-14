import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { projects } from 'components/admin/projects/ProjectEdit/mockData';
import PreviewProjectContent from './PreviewProjectContent';

const props = {
  data: projects[0],
  projecttype: 'videos'
};

const Component = <PreviewProjectContent { ...props } />;

describe( '<PreviewProjectContent />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( '`componentDidMount` is called and selects the project item', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const didMountSpy = jest.spyOn( wrapper.instance(), 'componentDidMount' );
    const selectProjectItemSpy = jest.spyOn( wrapper.instance(), 'selectProjectItem' );

    wrapper.instance().componentDidMount();

    expect( didMountSpy ).toHaveBeenCalled();
    expect( selectProjectItemSpy ).toHaveBeenCalled();

    const selectedItemObj = wrapper.state( 'selectedItem' );
    const language = wrapper.state( 'selectedLanguage' );
    expect( selectedItemObj ).toEqual(
      props.data.videos.find( video => video.language.display_name === language )
    );
  } );

  it( 'sets `dropDownIsOpen` and `selectedLanguage` in initial `state`', () => {
    const wrapper = shallow( Component );
    expect( wrapper.state( 'dropDownIsOpen' ) )
      .toEqual( false );
    expect( wrapper.state( 'selectedLanguage' ) )
      .toEqual( 'English' );
  } );

  it( '`getLanguages` sets `languages` in initial `state`', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const spy = jest.spyOn( wrapper.instance(), 'getLanguages' );

    wrapper.instance().getLanguages( props.data, props.projecttype );

    expect( spy ).toHaveBeenCalled();
    expect( wrapper.state( 'languages' ) ).toEqual( [
      { key: 'en', value: 'English', text: 'English' },
      { key: 'fr', value: 'French', text: 'French' },
      { key: 'ar', value: 'Arabic', text: 'Arabic' }] );
  } );

  it( '`getProjectItems` sets `projectItems` in initial `state`', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const spy = jest.spyOn( wrapper.instance(), 'getProjectItems' );
    wrapper.instance().getProjectItems( props.data, props.projecttype );

    const projectItemsObj = wrapper.state( 'projectItems' );
    const objKeys = Object.keys( projectItemsObj );

    expect( spy ).toHaveBeenCalled();
    expect( objKeys.length )
      .toEqual( wrapper.state( 'languages' ).length );
    objKeys.forEach( key => {
      expect( projectItemsObj[key] ).toEqual(
        props.data.videos.find( video => video.language.display_name === key )
      );
    } );
  } );

  it( '`handleChange` updates `selectedLanguage` and `selectedItem` in `state`', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const inst = wrapper.instance();

    const handleChangeSpy = jest.spyOn( inst, 'handleChange' );
    const toggleArrowSpy = jest.spyOn( inst, 'toggleArrow' );
    const selectLanguageSpy = jest.spyOn( inst, 'selectLanguage' );
    const selectProjectItemSpy = jest.spyOn( inst, 'selectProjectItem' );

    const e = {};
    const data = { value: 'French' };

    inst.handleChange( e, data );

    const language = wrapper.state( 'selectedLanguage' );
    const selectedItemObj = wrapper.state( 'selectedItem' );

    expect( handleChangeSpy ).toHaveBeenCalledWith( e, data );
    expect( toggleArrowSpy ).toHaveBeenCalled();
    expect( selectLanguageSpy ).toHaveBeenCalledWith( data.value );
    expect( selectProjectItemSpy ).toHaveBeenCalled();

    expect( language ).toEqual( data.value );
    expect( selectedItemObj ).toEqual(
      props.data.videos.find( video => video.language.display_name === language )
    );
  } );

  it( '`toggleArrow` updates `dropDownIsOpen` in state', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const spy = jest.spyOn( wrapper.instance(), 'toggleArrow' );

    expect( wrapper.state( 'dropDownIsOpen' ) )
      .toEqual( false );
    expect( wrapper.find( 'Dropdown' ).prop( 'icon' ) )
      .toEqual( 'chevron down' );
    wrapper.instance().toggleArrow();
    expect( spy ).toHaveBeenCalled();
    expect( wrapper.state( 'dropDownIsOpen' ) )
      .toEqual( true );
    expect( wrapper.find( 'Dropdown' ).prop( 'icon' ) )
      .toEqual( 'chevron up' );
  } );

  it( '`selectLanguage` updates `selectedLanguage` and `selectedItem` in state', () => {
    jest.clearAllMocks();
    const wrapper = shallow( Component );
    const inst = wrapper.instance();

    const selectLanguageSpy = jest.spyOn( inst, 'selectLanguage' );
    const selectProjectItemSpy = jest.spyOn( inst, 'selectProjectItem' );

    expect( wrapper.state( 'selectedLanguage' ) )
      .toEqual( 'English' );
    expect( wrapper.state( 'selectedItem' ) )
      .toEqual(
        props.data.videos.find( video => (
          video.language.display_name === wrapper.state( 'selectedLanguage' )
        ) )
      );

    inst.selectLanguage( 'French' );
    expect( selectLanguageSpy ).toHaveBeenCalled();
    expect( selectProjectItemSpy ).toHaveBeenCalled();
    expect( wrapper.state( 'selectedLanguage' ) )
      .toEqual( 'French' );
    expect( wrapper.state( 'selectedItem' ) )
      .toEqual(
        props.data.videos.find( video => (
          video.language.display_name === wrapper.state( 'selectedLanguage' )
        ) )
      );
  } );
} );
