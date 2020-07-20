import * as query from './FileDataFormQueries';
import { LANGUAGES_QUERY, LANGUAGE_BY_NAME_QUERY } from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import { VIDEO_UNIT_QUERY } from 'components/admin/ProjectEdit/EditVideoModal/ModalSections/FileSection/FileSection';
import { VIDEO_USE_QUERY } from 'components/admin/dropdowns/UseDropdown/UseDropdown';

const props = {
  fileCount: 2,
  setFieldValue: jest.fn(),
  values: {
    language: 'ck2lzfx710hkq07206thus6pt',
    quality: 'WEB',
    use: 'ckcm6aii005dv0720fapgz92p',
    videoBurnedInStatus: 'CLEAN',
    vimeo: 'https://vimeo.com/438865910',
    youtube: '',
  },
};

const reduxState = {
  projectUpdated: false,
};

const mocks = [
  {
    request: {
      query: query.VIDEO_PROJECT_QUERY,
      variables: {
        id: 'ckcoositc0biv0720dwlj4l0g',
      },
    },
    result: {
      data: {
        project: {
          id: 'ckcoositc0biv0720dwlj4l0g',
          units: [
            {
              id: 'ckcoospdp0bjc07207x6j8xhw',
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                __typename: 'Language',
              },
              __typename: 'VideoUnit',
            },
            {
              id: 'ckcovuyt30co70720tp5w6oem',
              language: {
                id: 'ck2lzfx710hkp07206oo0icbv',
                locale: 'fr-fr',
                __typename: 'Language',
              },
              __typename: 'VideoUnit',
            },
          ],
          __typename: 'VideoProject',
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_QUERY,
      variables: {
        // props.selectedFile from redux
        id: 'ckcoospf10bjh0720ftniacm3',
      },
    },
    result: {
      data: {
        file: {
          id: 'ckcoospf10bjh0720ftniacm3',
          createdAt: '2020-07-16T11:05:08.192Z',
          duration: 14.889875,
          filename: 'Mexico City 1.mp4',
          filesize: 15829673,
          quality: 'WEB',
          videoBurnedInStatus: 'CLEAN',
          dimensions: {
            id: 'ckcoosph00bjm07205nrbnxpu',
            height: 1080,
            width: 1920,
            __typename: 'Dimensions',
          },
          language: {
            id: 'ck2lzfx710hkq07206thus6pt',
            displayName: 'English',
            __typename: 'Language',
          },
          stream: [
            {
              id: 'ckcoospi00bjn0720nt6p5ful',
              site: 'vimeo',
              url: 'https://vimeo.com/438865910',
              __typename: 'VideoStream',
            },
          ],
          use: {
            id: 'ckcm6aii005dv0720fapgz92p',
            name: 'Clean',
            __typename: 'VideoUse',
          },
          __typename: 'VideoFile',
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_LANG_MUTATION,
      variables: {
        data: {
          language: {
            connect: { id: 'ck2lzfx710hkp07206oo0icbv' },
          },
        },
        where: { id: 'ckcoospf10bjh0720ftniacm3' },
      },
    },
    result: {
      data: {
        updateVideoFile: {
          id: 'ckcoospf10bjh0720ftniacm3',
          language: { id: 'ck2lzfx710hkp07206oo0icbv' },
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_UNIT_CONNECT_FILE_MUTATION,
      variables: {
        data: {
          files: {
            connect: { id: 'ckcoospf10bjh0720ftniacm3' },
          },
        },
        where: { id: 'ckcoospdp0bjc07207x6j8xhw' },
      },
    },
    result: {
      data: {
        updateVideoUnit: {
          id: 'ckcoospdp0bjc07207x6j8xhw',
          files: { id: 'ckcoospf10bjh0720ftniacm3' },
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_UNIT_DISCONNECT_FILE_MUTATION,
      variables: {
        data: {
          files: {
            disconnect: { id: 'ckcoospf10bjh0720ftniacm3' },
          },
        },
        where: { id: 'ckcoospdp0bjc07207x6j8xhw' },
      },
    },
    result: {
      data: {
        updateVideoUnit: {
          id: 'ckcoospdp0bjc07207x6j8xhw',
          files: { id: 'ckcoospf10bjh0720ftniacm3' },
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_SUBTITLES_MUTATION,
      variables: {
        data: {
          videoBurnedInStatus: 'SUBTITLED',
        },
        where: { id: 'ckcoospf10bjh0720ftniacm3' },
      },
    },
    result: {
      data: {
        updateVideoFile: {
          id: 'ckcoospf10bjh0720ftniacm3',
          videoBurnedInStatus: 'SUBTITLED',
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_USE_MUTATION,
      variables: {
        data: {
          use: {
            connect: { id: 'ck2lzfx5y0hhz07207nol9j6r' },
          },
        },
        where: { id: 'ckcoospf10bjh0720ftniacm3' },
      },
    },
    result: {
      data: {
        updateVideoFile: {
          id: 'ckcoospf10bjh0720ftniacm3',
          use: { id: 'ck2lzfx5y0hhz07207nol9j6r' },
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_QUALITY_MUTATION,
      variables: {
        data: {
          quality: 'WEB',
        },
        where: { id: 'ckcoospf10bjh0720ftniacm3' },
      },
    },
    result: {
      data: {
        updateVideoFile: {
          id: 'ckcoospf10bjh0720ftniacm3',
          quality: 'WEB',
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_CREATE_STREAM_MUTATION,
      variables: {
        data: {
          stream: {
            create: {
              site: 'thesite',
              url: 'https://thesite.com/the-site-stream-id',
            },
          },
        },
        where: { id: 'ckcoospf10bjh0720ftniacm3' },
      },
    },
    result: {
      data: {
        updateVideoFile: {
          id: 'ckcoospf10bjh0720ftniacm3',
          stream: { id: 'the-site-stream-id' },
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_UPDATE_STREAM_MUTATION,
      variables: {
        data: {
          stream: {
            update: {
              data: {
                url: 'https://thesite.com/the-new-site-stream-id',
              },
              where: {
                id: 'the-new-site-stream-id',
              },
            },
          },
        },
        where: { id: 'ckcoospf10bjh0720ftniacm3' },
      },
    },
    result: {
      data: {
        updateVideoFile: {
          id: 'ckcoospf10bjh0720ftniacm3',
          stream: { id: 'the-new-site-stream-id' },
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_DELETE_STREAM_MUTATION,
      variables: {
        data: {
          stream: {
            'delete': {
              id: 'the-site-stream-id',
            },
          },
        },
        where: { id: 'ckcoospf10bjh0720ftniacm3' },
      },
    },
    result: {
      data: {
        updateVideoFile: {
          id: 'ckcoospf10bjh0720ftniacm3',
          stream: { id: 'the-site-stream-id' },
        },
      },
    },
  },
  {
    request: {
      query: query.VIDEO_FILE_DELETE_MUTATION,
      variables: {
        id: 'ckcoospf10bjh0720ftniacm3',
      },
    },
    result: {
      data: {
        deleteVideoFile: {
          id: 'ckcoospf10bjh0720ftniacm3',
        },
      },
    },
  },
  {
    request: {
      query: LANGUAGE_BY_NAME_QUERY,
      variables: {
        where: { displayName: 'English' },
      },
    },
    result: {
      data: {
        languages: [
          {
            id: 'ck2lzfx710hkq07206thus6pt',
            displayName: 'English',
            locale: 'en-us',
          },
        ],
      },
    },
  },
  {
    request: {
      query: VIDEO_USE_QUERY,
      variables: {
        where: { name: 'Clean' },
      },
    },
    result: {
      data: {
        videoUses: [
          {
            id: 'ckcm6aii005dv0720fapgz92p',
            name: 'Clean',
          },
        ],
      },
    },
  },
  {
    request: {
      query: VIDEO_UNIT_QUERY,
      variables: { id: 'ckcoospdp0bjc07207x6j8xhw' },
    },
    result: {
      data: {
        videoUnit: {
          id: 'ckcoospdp0bjc07207x6j8xhw',
          files: [
            {
              id: 'ckcoospf10bjh0720ftniacm3',
            },
          ],
          language: {
            id: 'ck2lzfx710hkq07206thus6pt',
            displayName: 'English',
            locale: 'en-us',
          },
        },
      },
    },
  },
  {
    request: {
      query: LANGUAGES_QUERY,
    },
    result: {
      data: {
        languages: [
          {
            id: 'ck2lzfx710hkp07206oo0icbv',
            displayName: 'French',
            locale: 'fr-fr',
          },
          {
            id: 'ck2lzfx710hkq07206thus6pt',
            displayName: 'English',
            locale: 'en-us',
          },
        ],
      },
    },
  },
  {
    request: {
      query: VIDEO_USE_QUERY,
    },
    result: {
      data: {
        videoUses: [
          {
            id: 'ckcm6aii005dv0720fapgz92p',
            name: 'Clean',
          },
          {
            id: 'ck2lzfx5y0hhz07207nol9j6r',
            name: 'Full Video',
          },
        ],
      },
    },
  },
];

export { mocks, props, reduxState };
