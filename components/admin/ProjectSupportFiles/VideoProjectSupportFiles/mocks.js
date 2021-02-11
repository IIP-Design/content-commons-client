import {
  IMAGE_USES_QUERY,
  UPDATE_SUPPORT_FILE_MUTATION,
  UPDATE_IMAGE_FILE_MUTATION,
  DELETE_SUPPORT_FILE_MUTATION,
  DELETE_IMAGE_FILE_MUTATION,
  DELETE_MANY_THUMBNAILS_MUTATION,
} from 'lib/graphql/queries/common';
import {
  UPDATE_VIDEO_PROJECT_MUTATION,
  UPDATE_VIDEO_UNIT_MUTATION,
  VIDEO_PROJECT_QUERY,
} from 'lib/graphql/queries/video';
import { buildImageFile, buildThumbnailTree } from 'lib/graphql/builders/common';

const file = {
  id: 'file123456',
  input: {
    name: 'file-name-2.jpg',
    size: 'FULL',
  },
  use: {
    __typename: 'ImageUse',
    id: 'cjtkdq8kr0knf07569goo9eqe',
    name: 'Thumbnail/Cover Image',
  },
  language: {
    __typename: 'Language',
    id: 'cjsq4565v005c0756f0lqbfe4',
    displayName: 'French',
    locale: 'fr-fr',
  },
};

export const props = {
  projectId: '123',
};

export const mocks = [
  {
    request: {
      query: IMAGE_USES_QUERY,
    },
    result: {
      data: {
        imageUses: [
          {
            __typename: 'ImageUse',
            id: 'cjtkdq8kr0knf07569goo9eqe',
            name: 'Thumbnail/Cover Image',
          },
        ],
      },
    },
  },
  {
    request: {
      query: UPDATE_SUPPORT_FILE_MUTATION,
      variables: {
        data: {
          language: {
            connect: {
              id: file.language,
            },
          },
        },
        where: { id: file.id },
      },
    },
    result: {
      data: {
        updateSupportFile: {
          id: file.id,
          filename: 'file-name.jpg',
          language: {
            __typename: 'Language',
            id: 'cjsq439dz005607560gwe7k3m',
            displayName: 'English',
            locale: 'en-us',
          },
          use: {
            __typename: 'ImageUse',
            id: 'cjtkdq8kr0knf07569goo9eqe',
            name: 'Thumbnail/Cover Image',
          },
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_IMAGE_FILE_MUTATION,
      variables: {
        data: {
          language: {
            connect: {
              id: file.language,
            },
          },
        },
        where: { id: file.id },
      },
    },
    result: {
      data: {
        updateImageFile: {
          id: file.id,
          filename: 'file-name.jpg',
          language: {
            __typename: 'Language',
            id: 'cjsq439dz005607560gwe7k3m',
            displayName: 'English',
            locale: 'en-us',
          },
          use: {
            __typename: 'ImageUse',
            id: 'cjtkdq8kr0knf07569goo9eqe',
            name: 'Thumbnail/Cover Image',
          },
        },
      },
    },
  },
  {
    request: {
      query: DELETE_SUPPORT_FILE_MUTATION,
      variables: { id: file.id },
    },
    result: {
      data: {
        deleteSupportFile: { id: file.id },
      },
    },
  },
  {
    request: {
      query: DELETE_IMAGE_FILE_MUTATION,
      variables: { id: file.id },
    },
    result: {
      data: {
        deleteImageFile: { id: file.id },
      },
    },
  },
  {
    request: {
      query: DELETE_MANY_THUMBNAILS_MUTATION,
      variables: {
        where: { id_in: ['thumb-id-1', 'thumb-id-2'] },
      },
    },
    result: {
      data: {
        deleteManyThumbnails: { count: 2 },
      },
    },
  },
  {
    request: {
      query: UPDATE_VIDEO_PROJECT_MUTATION,
      variables: {
        where: { id: props.projectId },
        data: {
          thumbnails: {
            create: buildImageFile( file ),
          },
        },
      },
    },
    result: {
      data: {
        updateVideoProject: {
          id: props.projectId,
          createdAt: '2019-08-30T13:29:21.115Z',
          updatedAt: '2019-08-30T13:29:21.115Z',
          publishedAt: null,
          author: {
            id: 'cjuybpucc1tuk0756bpi84enp',
            firstName: 'Jane',
            lastName: 'Doe',
          },
          team: {
            id: 'cjrkzhvku000f0756l44blw33',
            name: 'GPA Video Production',
          },
          projectTitle: 'Test Title',
          descPublic: 'the project public description',
          descInternal: 'the project internal description',
          status: 'DRAFT',
          visibility: 'PUBLIC',
          categories: [
            {
              __typename: 'Category',
              id: 'cjubblzw915qe07560zkz9xas',
              translations: [
                {
                  __typename: 'LanguageTranslation',
                  id: 'cjubble530uxq0756q5bphm9c',
                  name: 'economic opportunity',
                },
              ],
            },
          ],
          tags: [
            {
              __typename: 'Tag',
              id: 'cjubblzxl15tx0756ve90lln9',
              translations: [
                {
                  __typename: 'LanguageTranslation',
                  id: 'cjubbli4x0wq60756icx6211a',
                  name: 'anti-corruption',
                },
              ],
            },
          ],
          thumbnails: [
            {
              __typename: 'Thumbnail',
              id: 'cjzy5lpzv1bef07207s354cbw',
              language: {
                __typename: 'Language',
                id: 'cjsq439dz005607560gwe7k3m',
                displayName: 'English',
                locale: 'en-us',
              },
            },
          ],
          units: [
            {
              id: 'cjzy5mcr41bf10720njs7wa7m',
              language: {
                __typename: 'Language',
                id: 'cjsq439dz005607560gwe7k3m',
                displayName: 'English',
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_VIDEO_UNIT_MUTATION,
      variables: {
        data: buildThumbnailTree( {
          id: 'cjzy5me4v1bfm0720854bc97o',
          size: 'FULL',
          image: {
            id: 'cjzy5mcsu1bf60720zyt05l8l',
            url: `2019/08/commons.america.gov_${props.projectId}/file-name.jpg`,
          },
        } ),
        where: { id: 'cjzy5mcr41bf10720njs7wa7m' },
      },
    },
    results: {
      data: {
        updateVideoUnit: {
          id: 'cjzy5mcr41bf10720njs7wa7m',
          thumbnails: [
            {
              __typename: 'Thumbnail',
              id: 'cjzy5me4v1bfm0720854bc97o',
              size: 'FULL',
              image: {
                __typename: 'ImageFile',
                id: 'cjzy5mcsu1bf60720zyt05l8l',
                url: `2019/08/commons.america.gov_${props.projectId}/file-name.jpg`,
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: VIDEO_PROJECT_QUERY,
      variables: { id: props.projectId },
    },
    result: {
      data: {
        project: {
          __typename: 'VideoProject',
          id: props.projectId,
          createdAt: '2019-03-02T15:11:48.043Z',
          updatedAt: '2019-03-06T18:11:48.043Z',
          publishedAt: '2019-03-09T14:11:48.043Z',
          author: {
            __typename: 'User',
            id: 'cjuybpucc1tuk0756bpi84enp',
            firstName: 'Jane',
            lastName: 'Doe',
          },
          team: {
            __typename: 'Team',
            id: 'cjrkzhvku000f0756l44blw33',
            name: 'GPA Video Production',
          },
          projectTitle: 'Test Title',
          descPublic: 'the project public description',
          descInternal: 'the project internal description',
          status: 'DRAFT',
          visibility: 'PUBLIC',
          categories: [
            {
              __typename: 'Category',
              id: 'cjubblzw915qe07560zkz9xas',
              translations: [
                {
                  __typename: 'LanguageTranslation',
                  id: 'cjubble530uxq0756q5bphm9c',
                  name: 'economic opportunity',
                  language: {
                    __typename: 'Language',
                    id: 'cjsq439dz005607560gwe7k3m',
                    locale: 'en-us',
                  },
                },
              ],
            },
          ],
          tags: [
            {
              __typename: 'Tag',
              id: 'cjubblzx615sd0756lgfvsdzz',
              translations: [
                {
                  __typename: 'LanguageTranslation',
                  id: 'cjubblfu10voe0756r11a1j9j',
                  name: 'american culture',
                  language: {
                    __typename: 'Language',
                    id: 'cjsq439dz005607560gwe7k3m',
                    displayName: 'English',
                    languageCode: 'en',
                    locale: 'en-us',
                    nativeName: 'English',
                    textDirection: 'LTR',
                  },
                },
                {
                  __typename: 'LanguageTranslation',
                  id: 'tr019',
                  name: 'Culture américaine',
                  language: {
                    __typename: 'Language',
                    id: 'cjsq4565v005c0756f0lqbfe4',
                    displayName: 'French',
                    languageCode: 'fr',
                    locale: 'fr-fr',
                    nativeName: 'French',
                    textDirection: 'LTR',
                  },
                },
              ],
            },
            {
              __typename: 'Tag',
              id: 'cjubblzx615se0756q25ul8hs',
              translations: [
                {
                  __typename: 'LanguageTranslation',
                  id: 'cjubblfyl0vqm0756kuq2rv4u',
                  name: 'english learning',
                  language: {
                    __typename: 'Language',
                    id: 'cjsq439dz005607560gwe7k3m',
                    displayName: 'English',
                    languageCode: 'en',
                    locale: 'en-us',
                    nativeName: 'English',
                    textDirection: 'LTR',
                  },
                },
                {
                  __typename: 'LanguageTranslation',
                  id: 'tr777',
                  name: 'Anglais langue étrangère',
                  language: {
                    __typename: 'Language',
                    id: 'cjsq4565v005c0756f0lqbfe4',
                    displayName: 'French',
                    languageCode: 'fr',
                    locale: 'fr-fr',
                    nativeName: 'French',
                    textDirection: 'LTR',
                  },
                },
              ],
            },
          ],
          thumbnails: [
            {
              __typename: 'Thumbnail',
              id: 'th11',
              createdAt: '2019-03-06T13:11:48.043Z',
              updatedAt: '2019-06-18T13:58:10.024Z',
              filename: 'image-1.jpg',
              filesize: 28371,
              filetype: 'image/jpeg',
              alt: 'the alt text',
              url: `2019/06/${props.projectId}/image-1.jpg`,
              use: {
                __typename: 'ImageUse',
                id: 'imu33',
                name: 'Thumbnail/Cover Image',
              },
              language: {
                __typename: 'Language',
                id: 'cjsq439dz005607560gwe7k3m',
                displayName: 'English',
                languageCode: 'en',
                locale: 'en-us',
                nativeName: 'English',
                textDirection: 'LTR',
              },
            },
          ],
          units: [
            {
              __typename: 'VideoUnit',
              id: 'un91',
              updatedAt: '2019-06-18T14:58:10.024Z',
              title: 'test project title',
              descPublic: 'the arabic description',
              language: {
                __typename: 'Language',
                id: 'ar22',
                displayName: 'Arabic',
                languageCode: 'ar',
                locale: 'ar',
                nativeName: 'العربية',
                textDirection: 'RTL',
              },
              tags: [
                {
                  __typename: 'Tag',
                  id: 'tag13',
                  translations: [
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr555',
                      name: 'الثقافة الأميركية',
                      language: {
                        __typename: 'Language',
                        id: 'ar22',
                        displayName: 'Arabic',
                        languageCode: 'ar',
                        locale: 'ar',
                        nativeName: 'العربية',
                        textDirection: 'RTL',
                      },
                    },
                  ],
                },
              ],
              thumbnails: [
                {
                  __typename: 'Thumbnail',
                  id: 'th11',
                  size: 'FULL',
                  image: {
                    __typename: 'ImageFile',
                    id: 'im28',
                    createdAt: '2019-03-06T13:11:48.043Z',
                    updatedAt: '2019-06-18T14:58:10.024Z',
                    filename: 'image-1.jpg',
                    filesize: 28371,
                    filetype: 'image/jpeg',
                    alt: 'the alt text',
                    url: `2019/06/${props.projectId}/image-1.jpg`,
                    use: {
                      __typename: 'ImageUse',
                      id: 'imu33',
                      name: 'Thumbnail/Cover Image',
                    },
                    language: {
                      __typename: 'Language',
                      id: 'ar22',
                      displayName: 'Arabic',
                      languageCode: 'ar',
                      locale: 'ar',
                      nativeName: 'العربية',
                      textDirection: 'RTL',
                    },
                  },
                },
              ],
              files: [
                {
                  __typename: 'VideoFile',
                  id: 'f19',
                  createdAt: '2019-03-05T20:18:54.032Z',
                  updatedAt: '2019-06-19T17:38:37.502Z',
                  duration: 556,
                  filename: 'video-file-1.mp4',
                  filesize: 662595174,
                  filetype: 'video/mp4',
                  quality: 'WEB',
                  url: `2019/06/${props.projectId}/video-file-1.mp4`,
                  videoBurnedInStatus: 'CLEAN',
                  dimensions: {
                    __typename: 'Dimensions',
                    id: 'd21',
                    height: '1080',
                    width: '1920',
                  },
                  language: {
                    __typename: 'Language',
                    id: 'ar22',
                    displayName: 'Arabic',
                    languageCode: 'ar',
                    locale: 'ar',
                    nativeName: 'العربية',
                    textDirection: 'RTL',
                  },
                  use: {
                    __typename: 'VideoUse',
                    id: 'us31',
                    name: 'Full Video',
                  },
                  stream: [
                    {
                      __typename: 'VideoStream',
                      id: 'st93',
                      site: 'YouTube',
                      url: 'https://www.youtube.com/watch?v=1evw4fRu3bo',
                    },
                    {
                      __typename: 'VideoStream',
                      id: 'st35',
                      site: 'Vimeo',
                      url: 'https://vimeo.com/340239507',
                    },
                  ],
                },
              ],
            },
            {
              __typename: 'VideoUnit',
              id: 'un95',
              updatedAt: '2019-06-18T12:58:10.024Z',
              title: 'test project title',
              descPublic: 'the english description',
              language: {
                __typename: 'Language',
                id: 'cjsq439dz005607560gwe7k3m',
                displayName: 'English',
                languageCode: 'en',
                locale: 'en-us',
                nativeName: 'English',
                textDirection: 'LTR',
              },
              tags: [
                {
                  __typename: 'Tag',
                  id: 'tag13',
                  translations: [
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr999',
                      name: 'american culture',
                      language: {
                        __typename: 'Language',
                        id: 'cjsq439dz005607560gwe7k3m',
                        displayName: 'English',
                        languageCode: 'en',
                        locale: 'en-us',
                        nativeName: 'English',
                        textDirection: 'LTR',
                      },
                    },
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr019',
                      name: 'Culture américaine',
                      language: {
                        __typename: 'Language',
                        id: 'cjsq4565v005c0756f0lqbfe4',
                        displayName: 'French',
                        languageCode: 'fr',
                        locale: 'fr-fr',
                        nativeName: 'French',
                        textDirection: 'LTR',
                      },
                    },
                  ],
                },
                {
                  __typename: 'Tag',
                  id: 'tag14',
                  translations: [
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr888',
                      name: 'english learning',
                      language: {
                        __typename: 'Language',
                        id: 'cjsq439dz005607560gwe7k3m',
                        displayName: 'English',
                        languageCode: 'en',
                        locale: 'en-us',
                        nativeName: 'English',
                        textDirection: 'LTR',
                      },
                    },
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr777',
                      name: 'Anglais langue étrangère',
                      language: {
                        __typename: 'Language',
                        id: 'cjsq4565v005c0756f0lqbfe4',
                        displayName: 'French',
                        languageCode: 'fr',
                        locale: 'fr-fr',
                        nativeName: 'French',
                        textDirection: 'LTR',
                      },
                    },
                  ],
                },
              ],
              thumbnails: [
                {
                  __typename: 'Thumbnail',
                  id: 'th11',
                  size: 'FULL',
                  image: {
                    __typename: 'ImageFile',
                    id: 'im28',
                    createdAt: '2019-03-06T13:11:48.043Z',
                    updatedAt: '2019-06-18T14:58:10.024Z',
                    filename: 'image-1.jpg',
                    filesize: 28371,
                    filetype: 'image/jpeg',
                    alt: 'the alt text',
                    url: `2019/06/${props.projectId}/image-1.jpg`,
                    use: {
                      __typename: 'ImageUse',
                      id: 'imu33',
                      name: 'Thumbnail/Cover Image',
                    },
                    language: {
                      __typename: 'Language',
                      id: 'cjsq439dz005607560gwe7k3m',
                      displayName: 'English',
                      languageCode: 'en',
                      locale: 'en-us',
                      nativeName: 'English',
                      textDirection: 'LTR',
                    },
                  },
                },
              ],
              files: [
                {
                  __typename: 'VideoFile',
                  id: 'f19',
                  createdAt: '2019-03-05T20:18:54.032Z',
                  updatedAt: '2019-06-19T17:38:37.502Z',
                  duration: 556,
                  filename: 'video-file-1.mp4',
                  filesize: 662595174,
                  filetype: 'video/mp4',
                  quality: 'WEB',
                  url: `2019/06/${props.projectId}/video-file-1.mp4`,
                  videoBurnedInStatus: 'CLEAN',
                  dimensions: {
                    __typename: 'Dimensions',
                    id: 'd21',
                    height: '1080',
                    width: '1920',
                  },
                  language: {
                    __typename: 'Language',
                    id: 'cjsq439dz005607560gwe7k3m',
                    displayName: 'English',
                    languageCode: 'en',
                    locale: 'en-us',
                    nativeName: 'English',
                    textDirection: 'LTR',
                  },
                  use: {
                    __typename: 'VideoUse',
                    id: 'us31',
                    name: 'Full Video',
                  },
                  stream: [
                    {
                      __typename: 'VideoStream',
                      id: 'st93',
                      site: 'YouTube',
                      url: 'https://www.youtube.com/watch?v=1evw4fRu3bo',
                    },
                    {
                      __typename: 'VideoStream',
                      id: 'st35',
                      site: 'Vimeo',
                      url: 'https://vimeo.com/340239507',
                    },
                  ],
                },
              ],
            },
          ],
          supportFiles: [
            {
              __typename: 'SupportFile',
              id: 'v832',
              createdAt: '2019-06-12T14:58:10.024Z',
              updatedAt: '2019-06-19T18:48:10.024Z',
              url: `2019/06/${props.projectId}/srt-1.srt`,
              filename: 'srt-1.srt',
              filesize: 6424,
              filetype: 'application/x-subrip',
              use: null,
              language: {
                __typename: 'Language',
                id: 'cjsq439dz005607560gwe7k3m',
                displayName: 'English',
                nativeName: 'English',
                languageCode: 'en',
                locale: 'en-us',
                textDirection: 'LTR',
              },
            },
            {
              __typename: 'SupportFile',
              id: 'v238',
              createdAt: '2019-06-10T14:58:10.024Z',
              updatedAt: '2019-06-11T12:18:10.024Z',
              url: `2019/06/${props.projectId}/srt-2.srt`,
              filename: 'srt-2.srt',
              filesize: 6424,
              filetype: 'application/x-subrip',
              use: null,
              language: {
                __typename: 'Language',
                id: 'cjsq4565v005c0756f0lqbfe4',
                displayName: 'French',
                nativeName: 'French',
                languageCode: 'fr',
                locale: 'fr-fr',
                textDirection: 'LTR',
              },
            },
          ],
        },
      },
    },
  },
];
