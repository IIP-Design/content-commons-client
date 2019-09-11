import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { truncateAndReplaceStr } from 'lib/utils';
import EditSupportFileRow from './EditSupportFileRow';

jest.mock(
  'components/admin/dropdowns/LanguageDropdown',
  () => function LanguageDropdown() { return ''; }
);

jest.mock(
  'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup',
  () => function FileRemoveReplaceButtonGroup() { return ''; }
);

const props = {
  file: {
    id: '123',
    name: 'file-name.jpg',
    language: 'cjsq439dz005607560gwe7k3m'
  },
  accept: '.png,.jpeg,.jpg',
  update: jest.fn(),
  replaceFile: jest.fn(),
  removeFile: jest.fn()
};

const longNameProps = {
  ...props,
  file: {
    ...props.file,
    name: 'a-long-file-name-1234567890-1234567890-1234567890.jpg'
  }
};

const Component = <EditSupportFileRow { ...props } />;
const LongNameComponent = <EditSupportFileRow { ...longNameProps } />;

describe( '<EditSupportFileRow />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders a truncated long file name', () => {
    const wrapper = mount( LongNameComponent );
    const longNameEl = wrapper.find( 'span[tooltip]' );
    const visuallyHidden = wrapper.find( 'VisuallyHidden > .hide-visually' );
    const { name } = longNameProps.file;
    const shortName = truncateAndReplaceStr( name, 15, 8 );

    expect( longNameEl.exists() ).toEqual( true );
    expect( name.length ).toBeGreaterThan( 25 );
    expect( longNameEl.prop( 'tooltip' ) ).toEqual( name );
    expect( longNameEl.text() ).toEqual( shortName );
    expect( visuallyHidden.exists() ).toEqual( true );
    expect( visuallyHidden.text() ).toEqual( name );
  } );
} );
