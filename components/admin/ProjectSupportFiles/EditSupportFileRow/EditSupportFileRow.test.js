import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { projects } from 'components/admin/projects/ProjectEdit/mockData';
import EditSupportFileRow from './EditSupportFileRow';

const props = {
  handleChange: jest.fn(),
  file: projects[0].supportFiles.other[0],
  fileExtensions: ['.jpg', '.mp3'],
  selectedLanguage: projects[0].supportFiles.other[0].lang
};

const languages = [
  { value: 'arabic', text: 'Arabic' },
  { value: 'chinese', text: 'Chinese' },
  { value: 'english', text: 'English' },
  { value: 'french', text: 'French' },
  { value: 'portuguese', text: 'Portuguese' },
  { value: 'russian', text: 'Russian' },
  { value: 'spanish', text: 'Spanish' }
];

const resizeWindow = ( x, y ) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent( new Event( 'resize' ) );
};

const Component = <EditSupportFileRow { ...props } />;

describe( '<EditSupportFileRow />', () => {
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

  it( 'calls `debounceResize` when window is resized', () => {
    const wrapper = shallow( Component );
    const spy = jest.spyOn( wrapper.instance(), 'debounceResize' );

    wrapper.instance().componentDidMount();

    const map = {};
    window.addEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    resizeWindow( 900, 600 );
    expect( spy ).toHaveBeenCalled();
  } );

  it( '`componentWillUnmount` removes the `resize` event listener', () => {
    const wrapper = shallow( Component );
    const inst = wrapper.instance();
    const map = {};
    window.removeEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    wrapper.instance().componentWillUnmount();
    expect( window.removeEventListener )
      .toHaveBeenCalledWith( 'resize', inst.debounceResize );
  } );

  it( '`getShortFileName` returns an ellipsis shortened file name', () => {
    const wrapper = shallow( Component );
    const longName = props.file.file; // madeinamerica_arabic.jpg
    const index = 8;
    const shortName = wrapper.instance()
      .getShortFileName( longName, index )
      .props
      .children;

    expect( shortName ).toHaveLength( 3 );
    expect( shortName[0] ).toHaveLength( 8 );
    expect( shortName[1] ).toHaveLength( 1 );
    expect( shortName[2] ).toHaveLength( 8 );
    expect( shortName.join( '' ) ).toEqual( 'madeinam…abic.jpg' );
  } );

  it( '`getProportionalNumber` returns a number that is proportional to a reference', () => {
    const wrapper = shallow( Component );
    const reference = 500;
    const proportion = wrapper.instance().ITEM_NAME_PROPORTION;
    const num = wrapper.instance()
      .getProportionalNumber( reference, proportion );
    expect( num ).toEqual( 425 );
  } );

  it( '`isLongName` returns a boolean whether given number is greater or equal to another', () => {
    const wrapper = shallow( Component );
    let itemWidth = 290;
    const reference = 500;
    const proportion = wrapper.instance().ITEM_NAME_PROPORTION;

    const isLongName = () => (
      wrapper.instance()
        .isLongName( itemWidth, reference, proportion )
    );

    expect( isLongName() ).toEqual( false );
    itemWidth = 450;
    expect( isLongName() ).toEqual( true );
  } );

  it( '`setRefWidth` and `resetWidths` sets ref widths in state', () => {
    const wrapper = shallow( Component );
    const div = wrapper.find( '.file-name' );
    const span = wrapper.find( '.file-name-wrap' );

    const nodes = [div, span];
    const names = ['cell', 'fileName'];

    div.offsetWidth = 200;
    span.offsetWidth = 170;

    nodes.forEach( ( n, i ) => {
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( null );

      wrapper.instance().setRefWidth( n, names[i] );
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );

      wrapper.instance().resetWidths();
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( null );
    } );
  } );

  it( '`resetWidths` does not reset ref widths in state if component is unmounted', () => {
    const wrapper = shallow( Component );
    const div = wrapper.find( '.file-name' );
    const span = wrapper.find( '.file-name-wrap' );

    const nodes = [div, span];
    const names = ['cell', 'fileName'];

    div.offsetWidth = 200;
    span.offsetWidth = 170;

    wrapper.instance().componentDidMount();
    const isMounted = () => wrapper.instance()._isMounted;

    expect( isMounted() ).toEqual( true );

    nodes.forEach( ( n, i ) => {
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( null );

      wrapper.instance().setRefWidth( n, names[i] );
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );

    wrapper.instance().componentWillUnmount();
    expect( isMounted() ).toEqual( false );

    wrapper.instance().resetWidths();

    nodes.forEach( ( n, i ) => {
      expect( wrapper.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );
  } );

  it( 'renders `setReplaceFileRef`', () => {
    /**
     * Wrap Component in `<table><tbody></tbody></table>`
     * to prevent this terminal console warning:
     *
     * `Warning: validateDOMNesting(...): <tr> cannot appear as a child of <div>.`
     *
     * `mount` instead of `shallow` to get access to `ref`.
     */
    const wrapper = mount(
      <table>
        <tbody>
          <EditSupportFileRow { ...props } />
        </tbody>
      </table>
    );
    const row = wrapper.find( 'EditSupportFileRow' );
    const input = wrapper.find( 'input#upload-file--single' );
    expect( input.exists() ).toEqual( true );
    expect( row.instance().setReplaceFileRef ).toBeTruthy();
  } );

  it( 'sets correct `acceptedTypes` for the file upload `input`', () => {
    const wrapper = shallow( Component );
    const input = () => wrapper.find( 'input#upload-file--single' );

    expect( input().prop( 'accept' ) ).toEqual( '' );
    wrapper.setProps( { fileExtensions: ['.srt'], fileType: 'srt' } );
    expect( input().prop( 'accept' ) ).toEqual( '.srt' );
  } );

  it( '`null` or `{}` `file` does not crash the component', () => {
    const wrapper = shallow( Component );

    wrapper.setProps( { file: null } );
    expect( wrapper.html() ).toEqual( null );
    wrapper.setProps( { file: {} } );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'selecting a language from the Dropdown calls `handleChange`', () => {
    const wrapper = shallow( Component );
    const dropdown = wrapper.find( 'Dropdown' );

    dropdown.simulate( 'change' );
    expect( props.handleChange ).toHaveBeenCalled();
  } );

  it( 'renders Dropdown with correct `options`', () => {
    const wrapper = shallow( Component );
    const dropdown = wrapper.find( 'Dropdown' );

    expect( dropdown.prop( 'options' ) ).toEqual( languages );
  } );

  it( 'renders Dropdown with correct `text` and `value`', () => {
    const wrapper = shallow( Component );
    const dropdown = wrapper.find( 'Dropdown' );
    const { selectedLanguage } = props;

    expect( dropdown.prop( 'text' ) ).toEqual( selectedLanguage );
    expect( dropdown.prop( 'value' ) ).toEqual( selectedLanguage );
  } );

  it( 'renders Dropdown with error if no `selectedLanguage`', () => {
    const newProps = { ...props, selectedLanguage: '' };
    const wrapper = shallow( <EditSupportFileRow { ...newProps } /> );
    const dropdown = wrapper.find( 'Dropdown' );

    expect( dropdown.prop( 'error' ) ).toEqual( !newProps.selectedLanguage );
  } );

  it( 'Popup is rendered if file name is long', () => {
    const wrapper = shallow( Component );
    const popup = () => (
      wrapper.find( `Popup[content="${props.file.file}"]` )
    );

    wrapper.setState( { cellWidth: 400, fileNameWidth: 350 } );
    expect( popup().exists() ).toEqual( true );
    wrapper.setState( { cellWidth: 400, fileNameWidth: 300 } );
    expect( popup().exists() ).toEqual( false );
  } );

  it( '`fileName` only (i.e., no Popup) is rendered if file name is not long', () => {
    const wrapper = shallow( Component );
    const span = () => wrapper.find( '.file-name-wrap' );
    const popup = () => (
      wrapper.find( `Popup[content="${props.file.file}"]` )
    );

    wrapper.setState( { cellWidth: 400, fileNameWidth: 300 } );
    expect( popup().exists() ).toEqual( false );
    expect( span().children().text() ).toEqual( props.file.file );
  } );

  // it( 'clicking Delete icon calls `handleDeleteFile`', () => {
  //   const wrapper = shallow( Component );
  //   const popup = wrapper.find( 'Popup[content="Delete"]' );
  //   const deleteBtn = shallow( popup.prop( 'trigger' ) );
  //   const spy = jest.spyOn( wrapper.instance(), 'handleDeleteFile' );

  //   deleteBtn.simulate( 'click' );
  //   expect( spy ).toHaveBeenCalled();
  // } );

  // it( 'clicking Replace icon calls `handleReplaceFile`', () => {
  //   const wrapper = mount(
  //     <table>
  //       <tbody>
  //         <EditSupportFileRow { ...props } />
  //       </tbody>
  //     </table>
  //   );
  //   const row = wrapper.find( 'EditSupportFileRow' );
  //   const popup = row.find( 'Popup[content="Replace"]' );
  //   const replaceBtn = shallow( popup.prop( 'trigger' ) );
  //   const spy = jest.spyOn( row.instance(), 'handleReplaceFile' );

  //   replaceBtn.simulate( 'click' );
  //   expect( spy ).toHaveBeenCalled();
  // } );
} );
