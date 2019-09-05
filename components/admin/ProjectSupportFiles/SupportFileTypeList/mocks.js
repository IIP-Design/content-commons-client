import { config } from '../VideoProjectSupportFiles/config';

export const srtProps = {
  config: config.supportFiles,
  heading: 'Support Files',
  projectId: '123',
  save: jest.fn(),
  type: 'srt'
};

export const otherProps = {
  ...srtProps,
  type: 'other'
};

export const filesToUpload = [
  {
    language: 'cjsq439dz005607560gwe7k3m',
    use: 'cjtkdq8kr0knf07569goo9eqe',
    quality: '',
    videoBurnedInStatus: '',
    input: {
      name: 'Mexico City 1.jpg',
      lastModified: 1517162382000,
      size: 1030591,
      type: 'image/jpeg',
      webkitRelativePath: ''
    },
    id: '05db5362-9357-4995-9457-acc14bc35125',
    loaded: 0
  },
  {
    language: 'cjsq439dz005607560gwe7k3m',
    use: '',
    quality: '',
    videoBurnedInStatus: '',
    input: {
      name: 'Mexico City 2.jpg',
      lastModified: 1517162382000,
      size: 1030591,
      type: 'image/jpeg',
      webkitRelativePath: ''
    },
    id: '52ec3a2f-bff8-4a50-b8a4-45cff8ab002f',
    loaded: 0
  },
  {
    language: 'cjsq4565v005c0756f0lqbfe4',
    use: 'cjtkdq8kr0knf07569goo9eqe',
    quality: '',
    videoBurnedInStatus: '',
    input: {
      name: 'Mexico City 1.srt',
      lastModified: 1560876777094,
      size: 0,
      type: '',
      webkitRelativePath: ''
    },
    id: '54e26f28-847b-4dd4-82a6-da7069bb1cff',
    loaded: 0
  },
  {
    language: 'cjsq4565v005c0756f0lqbfe4',
    use: '',
    quality: '',
    videoBurnedInStatus: '',
    input: {
      name: 'Mexico City 2.srt',
      lastModified: 1560876777094,
      size: 0,
      type: '',
      webkitRelativePath: ''
    },
    id: 'ef578be9-8ad5-404b-8b89-5c11f49f3856',
    loaded: 0
  }
];

export const data = {
  projectFiles: {
    id: srtProps.projectId,
    supportFiles: [
      {
        id: 'cjzts1nem1afd0720duzgoqty',
        createdAt: '2019-08-27T11:58:44.742Z',
        updatedAt: '2019-08-27T11:58:44.742Z',
        filename: 'Mexico City 1.srt',
        filetype: 'application/x-subrip',
        filesize: 0,
        url: `2019/08/commons.america.gov_${srtProps.projectId}/mexico_city_1.srt`,
        language: {
          id: 'cjsq439dz005607560gwe7k3m',
          locale: 'en-us',
          languageCode: 'en',
          displayName: 'English',
          textDirection: 'LTR',
          nativeName: 'English',
          __typename: 'Language'
        },
        use: null,
        __typename: 'SupportFile'
      },
      {
        id: 'cjzts1nf01afe0720psq9ouj1',
        createdAt: '2019-08-27T11:58:44.742Z',
        updatedAt: '2019-08-27T11:58:44.742Z',
        filename: 'Mexico City 2.srt',
        filetype: 'application/x-subrip',
        filesize: 0,
        url: `2019/08/commons.america.gov_${srtProps.projectId}/mexico_city_2.srt`,
        language: {
          id: 'cjsq4565v005c0756f0lqbfe4',
          locale: 'fr-fr',
          languageCode: 'fr',
          displayName: 'French',
          textDirection: 'LTR',
          nativeName: 'Français',
          __typename: 'Language'
        },
        use: null,
        __typename: 'SupportFile'
      }
    ],
    thumbnails: [
      {
        id: 'cjzts1nf31aff0720ekdg0bts',
        createdAt: '2019-08-27T11:58:44.742Z',
        updatedAt: '2019-08-27T11:58:44.742Z',
        filename: 'Mexico City 1.jpg',
        filetype: 'image/jpeg',
        filesize: 1030591,
        url: `2019/08/commons.america.gov_${srtProps.projectId}/mexico_city_1.jpg`,
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
      {
        id: 'cjzts1nfm1afh0720grpc5d5n',
        createdAt: '2019-08-27T11:58:44.742Z',
        updatedAt: '2019-08-27T11:58:44.742Z',
        filename: 'Mexico City 2.jpg',
        filetype: 'image/jpeg',
        filesize: 1030591,
        url: `2019/08/commons.america.gov_${srtProps.projectId}/mexico_city_2.jpg`,
        alt: null,
        use: {
          id: 'cjtkdq8kr0knf07569goo9eqe',
          name: 'Thumbnail/Cover Image',
          __typename: 'ImageUse'
        },
        language: {
          id: 'cjsq4565v005c0756f0lqbfe4',
          locale: 'fr-fr',
          languageCode: 'fr',
          displayName: 'French',
          textDirection: 'LTR',
          nativeName: 'Français',
          __typename: 'Language'
        },
        __typename: 'ImageFile'
      }
    ],
    __typename: 'VideoProject'
  }
};
