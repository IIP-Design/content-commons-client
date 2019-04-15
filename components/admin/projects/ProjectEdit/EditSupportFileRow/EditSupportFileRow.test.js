import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import EditSupportFileRow, {
  DELETE_SUPPORT_FILE_MUTATION,
  UPDATE_SUPPORT_FILE_USE_MUTATION,
  UPDATE_SUPPORT_FILE_LANGUAGE_MUTATION
} from './EditSupportFileRow';

const props = {
  file: {
    id: '8e7eu',
    filename: 'madeinamerica_english.jpg',
    filetype: 'jpg',
    use: {
      id: 'eisu',
      name: 'Thumbnail/Cover Image'
    },
    language: {
      id: 'ewi237',
      displayName: 'English'
    }
  },
  fileExtensions: ['.jpg', '.mp3']
};

const mocks = [
  {
    request: {
      query: UPDATE_SUPPORT_FILE_LANGUAGE_MUTATION,
      variables: {
        data: {
          language: { connect: { id: 'fr143' } }
        },
        where: { id: props.file.id }
      }
    },
    result: {
      data: {
        updateSupportFile: {
          id: props.file.id,
          filename: 'madeinamerica_french.jpg',
          filetype: 'jpg',
          language: {
            id: 'fr143',
            displayName: 'French'
          }
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_SUPPORT_FILE_USE_MUTATION,
      variables: {
        data: {
          use: { connect: { id: 'em92' } }
        },
        where: { id: props.file.id }
      }
    },
    result: {
      data: {
        updateSupportFile: {
          id: props.file.id,
          use: {
            id: 'em92',
            name: 'Email Graphic'
          }
        }
      }
    }
  },
  {
    request: {
      query: DELETE_SUPPORT_FILE_MUTATION,
      variables: { id: props.file.id },
    },
    result: {
      data: {
        deleteSupportFile: {
          id: props.file.id,
          filename: props.file.filename
        }
      }
    }
  }
];

/**
  * Wrap in `<table><tbody></tbody></table>` to prevent
  * this annoying terminal console warning:
  *
  * `Warning: validateDOMNesting(...): <tr> cannot appear as a child of <div>.`
  *
  */
const Component = (
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <table>
      <tbody>
        <EditSupportFileRow { ...props } />
      </tbody>
    </table>
  </MockedProvider>
);

const resizeWindow = ( x, y ) => {
  window.innerWidth = x;
  window.innerHeight = y;
  window.dispatchEvent( new Event( 'resize' ) );
};

describe( '<EditSupportFileRow />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );

    expect( row.exists() ).toEqual( true );
    expect( toJSON( row ) ).toMatchSnapshot();
  } );

  it( '`componentDidMount` sets `_isMounted`', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    inst.componentDidMount();

    expect( inst._isMounted ).toEqual( true );
  } );

  it( '`componentWillUnmount` sets `_isMounted` to false', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    inst.componentWillUnmount();

    expect( inst._isMounted ).toEqual( false );
  } );

  it( 'calls `debounceResize` when window is resized', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    const spy = jest.spyOn( inst, 'debounceResize' );

    inst.componentDidMount();

    const map = {};
    window.addEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    resizeWindow( 900, 600 );
    expect( spy ).toHaveBeenCalled();
  } );

  it( '`componentWillUnmount` removes the `resize` event listener', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    const map = {};
    window.removeEventListener = jest.fn( ( event, cb ) => {
      map[event] = cb;
    } );

    inst.componentWillUnmount();

    expect( window.removeEventListener )
      .toHaveBeenCalledWith( 'resize', inst.debounceResize );
  } );

  it( '`getShortFileName` returns an ellipsis shortened file name', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    const longName = props.file.filename; // madeinamerica_english.jpg
    const index = 8;
    const shortName = inst
      .getShortFileName( longName, index )
      .props
      .children;

    expect( shortName ).toHaveLength( 3 );
    expect( shortName[0] ).toHaveLength( 8 );
    expect( shortName[1] ).toHaveLength( 1 );
    expect( shortName[2] ).toHaveLength( 8 );
    expect( shortName.join( '' ) ).toEqual( 'madeinam…lish.jpg' );
  } );

  it( '`getProportionalNumber` returns a number that is proportional to a reference', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    const reference = 500;
    const proportion = inst.ITEM_NAME_PROPORTION;
    const num = inst
      .getProportionalNumber( reference, proportion );

    expect( num ).toEqual( 425 );
  } );

  it( '`isLongName` returns a boolean whether given number is greater or equal to another', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    let itemWidth = 290;
    const reference = 500;
    const proportion = inst.ITEM_NAME_PROPORTION;

    const isLongName = () => (
      inst.isLongName( itemWidth, reference, proportion )
    );

    expect( isLongName() ).toEqual( false );
    itemWidth = 450;
    expect( isLongName() ).toEqual( true );
  } );

  it( '`setRefWidth` and `resetWidths` sets ref widths in state', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    const div = row.find( 'div.file-name' );
    const span = row.find( 'span.file-name-wrap' );

    const nodes = [div, span];
    const names = ['cell', 'fileName'];

    div.offsetWidth = 200;
    span.offsetWidth = 170;

    nodes.forEach( ( n, i ) => {
      expect( row.state( `${names[i]}Width` ) )
        .toEqual( 0 );

      inst.setRefWidth( n, names[i] );
      expect( row.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );

      inst.resetWidths();
      expect( row.state( `${names[i]}Width` ) )
        .toEqual( 0 );
    } );
  } );

  it( '`resetWidths` does not reset ref widths in state if component is unmounted', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();

    const div = row.find( 'div.file-name' );
    const span = row.find( 'span.file-name-wrap' );

    const nodes = [div, span];
    const names = ['cell', 'fileName'];

    div.offsetWidth = 200;
    span.offsetWidth = 170;

    inst.componentDidMount();
    const isMounted = () => inst._isMounted;

    expect( isMounted() ).toEqual( true );

    nodes.forEach( ( n, i ) => {
      expect( row.state( `${names[i]}Width` ) )
        .toEqual( 0 );

      inst.setRefWidth( n, names[i] );
      expect( row.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );

    inst.componentWillUnmount();
    expect( isMounted() ).toEqual( false );

    inst.resetWidths();

    nodes.forEach( ( n, i ) => {
      expect( row.state( `${names[i]}Width` ) )
        .toEqual( n.offsetWidth );
    } );
  } );

  it( 'renders `setReplaceFileRef`', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();
    const input = wrapper.find( 'input#upload-file--single' );

    expect( input.exists() ).toEqual( true );
    expect( inst.setReplaceFileRef ).toBeTruthy();
  } );

  it( 'sets correct `acceptedTypes` for the file upload `input`', () => {
    const newProps = { ...props, ...{ fileExtensions: ['.srt'] } };
    const wrapper = mount(
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <table>
          <tbody>
            <EditSupportFileRow { ...newProps } />
          </tbody>
        </table>
      </MockedProvider>
    );

    const input = () => wrapper.find( 'input#upload-file--single' );

    expect( input().prop( 'accept' ) ).toEqual( '.srt' );
  } );

  it( '`handleChange` sets `fileLanguageId` in state', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = () => row.instance();

    const e = {};
    const selection = { value: 'fr143', name: 'fileLanguageId' };

    expect( inst().state.fileLanguageId ).toEqual( 'ewi237' );

    inst().handleChange( e, selection );

    inst().forceUpdate();

    expect( inst().state.fileLanguageId ).toEqual( 'fr143' );
  } );

  it( '`handleChange` sets `fileUse` in state', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = () => row.instance();

    const e = {};
    const selection = { value: 'em92', name: 'fileUse' };

    expect( inst().state.fileUse ).toEqual( 'eisu' );

    inst().handleChange( e, selection );

    expect( inst().state.fileUse ).toEqual( 'em92' );
  } );

  it( 'Popup is rendered if file name is long', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const popup = () => (
      wrapper.find( `Popup[content="${props.file.filename}"]` )
    );

    /**
     * file name is long if `isLongName` is `true`, i.e.,
     * fileNameWidth/cellWidth >= 0.85 (ITEM_NAME_PROPORTION)
     */
    row.setState( { cellWidth: 400, fileNameWidth: 350 } );
    expect( popup().exists() ).toEqual( true );

    row.setState( { cellWidth: 400, fileNameWidth: 300 } );
    expect( popup().exists() ).toEqual( false );
  } );

  it( '`fileName` only (i.e., no Popup) is rendered if file name is not long', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const span = wrapper.find( 'span.file-name-wrap' );

    row.setState( { cellWidth: 400, fileNameWidth: 300 } );
    const popup = wrapper.find( `Popup[content="${props.file.filename}"]` );

    expect( popup.exists() ).toEqual( false );
    expect( span.text() ).toEqual( props.file.filename );
  } );

  it( 'clicking Delete icon calls `handleDeleteFile`', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();
    const deleteBtn = row.find( 'Button.delete' );
    const spy = jest.spyOn( inst, 'handleDeleteFile' );

    inst.forceUpdate();
    deleteBtn.simulate( 'click' );

    expect( spy ).toHaveBeenCalled();
  } );

  it( 'clicking Replace icon calls `handleReplaceFile`', () => {
    const wrapper = mount( Component );
    const row = wrapper.find( 'EditSupportFileRow' );
    const inst = row.instance();
    const replaceBtn = row.find( 'Button.replace' );
    const spy = jest.spyOn( inst, 'handleReplaceFile' );
    inst.addReplaceFileRef = {
      click: jest.fn()
    };

    inst.forceUpdate();
    replaceBtn.simulate( 'click' );

    expect( spy ).toHaveBeenCalled();
    expect( inst.addReplaceFileRef.click ).toHaveBeenCalled();
  } );
} );
