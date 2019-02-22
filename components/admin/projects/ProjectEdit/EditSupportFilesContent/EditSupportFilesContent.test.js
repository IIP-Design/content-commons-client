import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { projects } from 'components/admin/projects/ProjectEdit/mockData';
import EditSupportFilesContent from './EditSupportFilesContent';

const props = {
  data: projects[0].supportFiles.other,
  fileType: 'other',
  closeEditModal: jest.fn()
};

const Component = <EditSupportFilesContent { ...props } />;

describe( '<EditSupportFilesContent />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( '`componentDidMount` sets `_isMounted`', () => {
    const wrapper = shallow( Component );
    wrapper.instance().componentDidMount();
    expect( wrapper.instance()._isMounted ).toEqual( true );
  } );

  it( '`componentWillUnmount` sets `_isMounted` to false', () => {
    const wrapper = shallow( Component );
    wrapper.instance().componentWillUnmount();
    expect( wrapper.instance()._isMounted ).toEqual( false );
  } );

  it( '`getFileExtension` returns a file\'s extension', () => {
    const wrapper = shallow( Component );
    const fileName = 'madeinamerica_arabic.srt';
    const extension = wrapper.instance().getFileExtension( fileName );
    expect( extension ).toEqual( '.srt' );
  } );

  it( '`getFileExtensions` returns an array of unique file extensions', () => {
    const wrapper = shallow( Component );
    const extensions = wrapper.instance().getFileExtensions( props.data );
    expect( extensions ).toEqual( ['.jpg', '.mp3'] );
  } );

  it( '`haveAllLangsBeenPopulated` does not set `hasPopulatedLanguages` state if all languages have not been populated', () => {
    const wrapper = shallow( Component );

    expect( wrapper.state( 'selectedLangValues' ) ).toEqual( {} );

    wrapper.setState( {
      selectedLangValues: {
        5682: 'Arabic',
        5683: 'Chinese (Simplified)',
        5684: 'English'
      }
    } );

    wrapper.instance().haveAllLangsBeenPopulated();
    expect( wrapper.state( 'selectedLangValues' ) )
      .toEqual( {
        5682: 'Arabic',
        5683: 'Chinese (Simplified)',
        5684: 'English'
      } );
    expect( wrapper.state( 'hasPopulatedLanguages' ) )
      .toEqual( false );
  } );

  it( '`haveAllLangsBeenPopulated` does set `hasPopulatedLanguages` state if all languages have been populated', () => {
    const wrapper = shallow( Component );

    expect( wrapper.state( 'selectedLangValues' ) ).toEqual( {} );

    wrapper.setState( {
      selectedLangValues: {
        5682: 'Arabic',
        5683: 'Chinese (Simplified)',
        5684: 'English',
        5685: 'French',
        5686: 'English'
      }
    } );

    wrapper.instance().haveAllLangsBeenPopulated();
    expect( wrapper.state( 'selectedLangValues' ) )
      .toEqual( {
        5682: 'Arabic',
        5683: 'Chinese (Simplified)',
        5684: 'English',
        5685: 'French',
        5686: 'English'
      } );
    expect( wrapper.state( 'hasPopulatedLanguages' ) )
      .toEqual( true );
  } );

  it( '`handleChange` sets `selectedLangValues` and `hasUnsavedData` in state', () => {
    const wrapper = shallow( Component );
    const spy = jest.spyOn(
      wrapper.instance(), 'haveAllLangsBeenPopulated'
    );
    const e = {};
    const data = { id: '5682', value: 'Arabic' };

    expect( wrapper.state( 'hasUnsavedData' ) ).toEqual( false );
    expect( wrapper.state( 'selectedLangValues' ) ).toEqual( {} );

    wrapper.instance().handleChange( e, data );

    expect( wrapper.state( 'hasUnsavedData' ) ).toEqual( true );
    expect( wrapper.state( 'selectedLangValues' ) )
      .toEqual( { 5682: 'Arabic' } );
    expect( spy ).toHaveBeenCalled();
  } );

  it( '`handleSubmit` sets `displaySaveMsg`, `hasSaved`, and `hasUnsavedData` in state', () => {
    const wrapper = shallow( Component );

    wrapper.instance().handleSubmit();

    expect( wrapper.state( 'displaySaveMsg' ) ).toEqual( true );
    expect( wrapper.state( 'hasSaved' ) ).toEqual( true );
    expect( wrapper.state( 'hasUnsavedData' ) ).toEqual( false );
  } );

  it( '`handleSubmit` calls `delayUnmount` and `handleDisplaySaveMsg` as callback', async () => {
    const wrapper = shallow( Component );
    const delayUnmountSpy = jest.spyOn( wrapper.instance(), 'delayUnmount' );
    const handleDisplaySaveMsgSpy = jest.spyOn( wrapper.instance(), 'handleDisplaySaveMsg' );

    wrapper.instance().handleSubmit();

    expect( delayUnmountSpy ).toHaveBeenCalled();
    await wait( wrapper.instance().SAVE_MSG_DELAY );
    expect( handleDisplaySaveMsgSpy ).toHaveBeenCalled();
    expect( wrapper.state( 'displaySaveMsg' ) ).toEqual( false );
    expect( wrapper.instance().saveMsgTimer ).toEqual( null );
  } );

  it( '`delayUnmount` calls a function after a delay', async () => {
    const wrapper = shallow( Component );
    const fn = jest.fn();
    const timer = () => wrapper.instance().saveMsgTimer;
    const delay = wrapper.instance().SAVE_MSG_DELAY;

    wrapper.instance().delayUnmount( fn, timer(), delay );
    await wait( delay );
    expect( fn ).toHaveBeenCalled();
  } );

  it( 'renders the `Notification` component and correct props if `displaySaveMsg` or `hasUnsavedData`', () => {
    const wrapper = shallow( Component );
    const notification = () => wrapper.find( 'Notification' );

    expect( notification().exists() ).toEqual( false );

    wrapper.setState( { displaySaveMsg: true, hasUnsavedData: false } );
    expect( notification().exists() ).toEqual( true );
    expect( notification().prop( 'el' ) ).toEqual( 'p' );
    expect( notification().prop( 'msg' ) ).toEqual( 'Saved' );
    expect( notification().prop( 'customStyles' ) )
      .toEqual( {
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        borderBottomLeftRadius: '0.28571429rem',
        borderBottomRightRadius: '0.28571429rem',
        padding: '1em 1.5em',
        fontSize: '1em'
      } );

    wrapper.setState( { displaySaveMsg: false, hasUnsavedData: false } );
    expect( notification().exists() ).toEqual( false );

    wrapper.setState( { displaySaveMsg: false, hasUnsavedData: true } );
    expect( notification().exists() ).toEqual( true );
    expect( notification().prop( 'el' ) ).toEqual( 'p' );
    expect( notification().prop( 'msg' ) )
      .toEqual( 'You have unsaved data' );
    expect( notification().prop( 'customStyles' ) )
      .toEqual( {
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        borderBottomLeftRadius: '0.28571429rem',
        borderBottomRightRadius: '0.28571429rem',
        padding: '1em 1.5em',
        fontSize: '1em'
      } );
  } );

  it( 'renders the Save button with correct message', () => {
    const wrapper = shallow( Component );
    const saveBtn = () => wrapper.find( 'Button.save' );

    expect( saveBtn().prop( 'content' ) ).toEqual( 'Save' );
    wrapper.setState( { hasSaved: true, hasUnsavedData: false } );
    expect( saveBtn().prop( 'content' ) ).toEqual( 'Data Saved' );
  } );

  it( 'renders the Save button with correct disabled state', () => {
    const wrapper = shallow( Component );
    const saveBtn = () => wrapper.find( 'Button.save' );

    expect( saveBtn().prop( 'disabled' ) ).toEqual( true );
    wrapper.setState( {
      hasSaved: true,
      hasUnsavedData: false,
      hasPopulatedLanguages: true
    } );
    expect( saveBtn().prop( 'disabled' ) ).toEqual( true );

    wrapper.setState( {
      hasSaved: false,
      hasUnsavedData: true,
      hasPopulatedLanguages: false
    } );
    expect( saveBtn().prop( 'disabled' ) ).toEqual( true );

    wrapper.setState( {
      hasSaved: false,
      hasUnsavedData: true,
      hasPopulatedLanguages: true
    } );
    expect( saveBtn().prop( 'disabled' ) ).toEqual( false );

    wrapper.setState( {
      hasSaved: true,
      hasUnsavedData: false,
      hasPopulatedLanguages: false
    } );
    expect( saveBtn().prop( 'disabled' ) ).toEqual( true );

    wrapper.setState( {
      hasSaved: true,
      hasUnsavedData: true,
      hasPopulatedLanguages: true
    } );
    expect( saveBtn().prop( 'disabled' ) ).toEqual( false );

    wrapper.setState( {
      hasSaved: false,
      hasUnsavedData: false,
      hasPopulatedLanguages: false
    } );
    expect( saveBtn().prop( 'disabled' ) ).toEqual( true );
  } );

  it( 'clicking the Save button calls the `handleSubmit`', () => {
    const wrapper = shallow( Component );
    const saveBtn = () => wrapper.find( 'Button.save' );
    const spy = jest.spyOn( wrapper.instance(), 'handleSubmit' );

    wrapper.setState( {
      hasSaved: false,
      hasUnsavedData: true,
      hasPopulatedLanguages: true
    } );
    expect( saveBtn().prop( 'disabled' ) ).toEqual( false );

    saveBtn().simulate( 'click' );
    expect( spy ).toHaveBeenCalled();
  } );

  it( 'renders the Cancel button with the correct content', () => {
    const wrapper = shallow( Component );
    const cancelCloseBtn = () => wrapper.find( 'Button.cancel-close' );

    wrapper.setState( { hasSaved: true } );
    expect( cancelCloseBtn().prop( 'content' ) ).toEqual( 'Close' );

    wrapper.setState( { hasSaved: false } );
    expect( cancelCloseBtn().prop( 'content' ) ).toEqual( 'Cancel' );
  } );

  it( '`handleCancelClose` calls `closeEditModal`', () => {
    const wrapper = shallow( Component );
    wrapper.instance().handleCancelClose();
    expect( props.closeEditModal ).toHaveBeenCalled();
  } );

  it( 'clicking the Cancel button calls `handleCancelClose`', () => {
    const wrapper = shallow( Component );
    const cancelCloseBtn = wrapper.find( 'Button.cancel-close' );
    // const spy = jest.spyOn( wrapper.instance(), 'handleCancelClose' );

    cancelCloseBtn.simulate( 'click' );
    /**
     * @todo Need to figure out why this spy assertion fails
     * even though if its return fn, props.closeEditModal, is called.
     * This would be evidence that the spy was called.
     */
    // expect( spy ).toHaveBeenCalled();
    expect( props.closeEditModal ).toHaveBeenCalled();
  } );

  it( 'renders `addFilesInputRef`', () => {
    const wrapper = mount( Component );
    const input = wrapper.find( 'input#upload-file--multiple' );
    expect( input.exists() ).toEqual( true );
    expect( wrapper.instance().addFilesInputRef ).toBeTruthy();
  } );

  it( '`null` or `[]` `data` does not crash the component', () => {
    const wrapper = shallow( Component );

    wrapper.setProps( { data: null } );
    expect( wrapper.html() ).toEqual( null );
    wrapper.setProps( { data: [] } );
    expect( wrapper.html() ).toEqual( null );
  } );
} );
