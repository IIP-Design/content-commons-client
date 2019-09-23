import { shallow } from 'enzyme';
import wait from 'waait';
import mockAxios from 'axios';
import withFiledownload from './withFiledownload';

const Component = withFiledownload( 'WrappedComponent' );

describe( '<withFiledownload />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( <Component /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'passes a download and error props', () => {
    const wrapper = shallow( <Component /> );

    expect( typeof wrapper.prop( 'download' ) ).toEqual( 'function' );
    expect( wrapper.prop( 'error' ) ).toEqual( '' );
  } );

  it( 'download method calls axios.post', () => {
    const wrapper = shallow( <Component /> );
    const inst = wrapper.instance();

    const id = '123456';
    const title = 'project title';
    const url = `2019/09/${id}/file name.srt`;
    const locale = 'en';
    const filename = `project_title.${locale}.${id}.srt`;
    inst.ENDPOINT = 'test-endpoint';

    const response = { data: { key: 'value' } };
    mockAxios.post = jest.fn();
    mockAxios.post.mockResolvedValue( response );

    inst.download( url, title, locale, id );
    expect( mockAxios.post )
      .toHaveBeenCalledWith( inst.ENDPOINT, { url, filename }, { responseType: 'blob' } );
    expect( wrapper.prop( 'error' ) ).toEqual( '' );
  } );

  it( 'download method calls axios.post and sets error state', async () => {
    const wrapper = shallow( <Component /> );
    const inst = wrapper.instance();

    const id = '123456';
    const title = 'project title';
    const url = `2019/09/${id}/file name.srt`;
    const locale = 'en';
    const filename = `project_title.${locale}.${id}.srt`;
    inst.ENDPOINT = 'test-endpoint';

    const err = { message: 'there was an error' };
    const errorMsg = `Oops there was a problem downloading your file: ${err.message}`;
    mockAxios.post = jest.fn();
    mockAxios.post.mockRejectedValue( err );

    inst.download( url, title, locale, id );
    expect( mockAxios.post )
      .toHaveBeenCalledWith( inst.ENDPOINT, { url, filename }, { responseType: 'blob' } );

    await wait( 0 );
    wrapper.update();
    expect( inst.state.error ).toEqual( errorMsg );
    expect( wrapper.prop( 'error' ) ).toEqual( errorMsg );
  } );
} );
