import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ProjectUnitItem from './ProjectUnitItem';

jest.mock( 'next-server/dynamic', () => () => 'Dynamic' );

jest.mock( 'next-server/config', () => () => ( { publicRuntimeConfig: { REACT_APP_AWS_S3_PUBLISHER_BUCKET: 's3-bucket-url' } } ) );

jest.mock(
  '../EditSingleProjectItem/EditSingleProjectItem',
  () => function EditSingleProjectItem() { return ''; }
);

const props = {
  projectId: '123',
  filesToUpload: [
    {
      language: 'cjsq439dz005607560gwe7k3m',
      use: 'cjsw78q6p00lp07566znbyatd',
      quality: 'BROADCAST',
      videoBurnedInStatus: 'CLEAN',
      input: {
        name: 'Mexico City 1.mp4',
        lastModified: 1517162208000,
        size: 15829673,
        type: 'video/mp4'
      },
      id: 'af1557de-c2ad-4107-bcd3-369f05779320',
      loaded: 0
    },
    {
      language: 'cjsq439dz005607560gwe7k3m',
      use: 'cjsw78q6p00lp07566znbyatd',
      quality: 'WEB',
      videoBurnedInStatus: 'CLEAN',
      input: {
        name: 'Mexico City 2.mp4',
        lastModified: 1517162208000,
        size: 15829673,
        type: 'video/mp4'
      },
      id: 'bdef2cb3-169b-4d98-8aec-f99442e6dcfa',
      loaded: 0
    }
  ],
  unit: {
    id: 'cjzy5mcr41bf10720njs7wa7m',
    updatedAt: '2019-08-30T13:29:50.596Z',
    title: 'the project title',
    descPublic: null,
    files: [
      {
        id: 'cjzy5mcs01bf20720add2sklq',
        createdAt: '2019-08-30T13:29:50.596Z',
        updatedAt: '2019-08-30T13:29:50.596Z',
        filename: 'Mexico City 1.mp4',
        filetype: 'video/mp4',
        filesize: 15829673,
        duration: 14.889875,
        videoBurnedInStatus: 'SUBTITLED',
        quality: 'WEB',
        dimensions: {
          id: 'cjzy5mcsg1bf40720p9jxyixl',
          width: 1920,
          height: 1080,
          __typename: 'Dimensions'
        },
        url: '2019/08/commons.america.gov_cjzy5lpzv1bef07207s354cbw/mexico_city_1.mp4',
        language: {
          id: 'cjsq439dz005607560gwe7k3m',
          locale: 'en-us',
          languageCode: 'en',
          displayName: 'English',
          textDirection: 'LTR',
          nativeName: 'English',
          __typename: 'Language'
        },
        use: {
          id: 'cjsw78q6p00lp07566znbyatd',
          name: 'Full Video',
          __typename: 'VideoUse'
        },
        stream: [
          {
            id: 'cjzy5mcsj1bf50720wxk4bdsf',
            site: 'vimeo',
            url: 'https://vimeo.com/356893849',
            __typename: 'VideoStream'
          }
        ],
        __typename: 'VideoFile'
      }
    ],
    language: {
      id: 'cjsq439dz005607560gwe7k3m',
      locale: 'en-us',
      languageCode: 'en',
      displayName: 'English',
      textDirection: 'LTR',
      nativeName: 'English',
      __typename: 'Language'
    },
    thumbnails: [
      {
        id: 'cjzy5me4v1bfm0720854bc97o',
        size: 'FULL',
        image: {
          id: 'cjzy5mcsu1bf60720zyt05l8l',
          createdAt: '2019-08-30T13:29:50.596Z',
          updatedAt: '2019-08-30T13:29:50.596Z',
          filename: 'Mexico City 1.jpg',
          filetype: 'image/jpeg',
          filesize: 1030591,
          url: '2019/08/commons.america.gov_cjzy5lpzv1bef07207s354cbw/mexico_city_1.jpg',
          alt: null,
          use: {
            id: 'cjtkdq8kr0knf07569goo9eqe',
            name: 'Thumbnail/Cover Image',
            __typename: 'ImageUse'
          },
          language: {
            id: 'cjsq439dz005607560gwe7k3m',
            locale: 'en-us',
            languageCode: 'en',
            displayName: 'English',
            textDirection: 'LTR',
            nativeName: 'English',
            __typename: 'Language'
          },
          __typename: 'ImageFile'
        },
        __typename: 'Thumbnail'
      }
    ],
    tags: [],
    __typename: 'VideoUnit'
  },
};

const Component = <ProjectUnitItem { ...props } />;

describe( '<ProjectUnitItem />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );
} );
