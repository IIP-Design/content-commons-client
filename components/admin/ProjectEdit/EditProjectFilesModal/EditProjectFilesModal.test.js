import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { data } from '../../ProjectSupportFiles/SupportFileTypeList/mocks';
import { config } from '../../ProjectSupportFiles/VideoProjectSupportFiles/config';
import EditProjectFilesModal from './EditProjectFilesModal';

const props = {
  supportFiles: data.projectFiles.supportFiles,
  extensions: config.supportFiles.types.srt.extensions,
  save: jest.fn()
};

const Component = <EditProjectFilesModal { ...props } />;

describe( '<EditSupportFiles />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'clicking Save Button calls props.save', () => {
    const wrapper = shallow( Component );
    const saveBtn = wrapper.find( 'Button.primary' );

    saveBtn.simulate( 'click' );
    expect( props.save ).toHaveBeenCalled();
  } );
} );
