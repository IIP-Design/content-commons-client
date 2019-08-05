import {
  DELETE_VIDEO_PROJECT_MUTATION,
  PUBLISH_VIDEO_PROJECT_MUTATION,
  VIDEO_PROJECT_QUERY
} from 'lib/graphql/queries/video';

export const props = { id: '234' };

export const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          __typename: 'VideoProject',
          id: props.id,
          createdAt: '2019-03-02T15:11:48.043Z',
          updatedAt: '2019-03-06T18:11:48.043Z',
          publishedAt: '2019-03-09T14:11:48.043Z',
          author: {
            __typename: 'User',
            id: 'u921',
            firstName: 'FirstName',
            lastName: 'LastName'
          },
          team: {
            __typename: 'Team',
            id: 't81',
            name: 'the team name'
          },
          projectTitle: 'Test Title',
          descPublic: 'the project public description',
          descInternal: 'the project internal description',
          status: 'DRAFT',
          visibility: 'PUBLIC',
          categories: [
            {
              __typename: 'Category',
              id: '38s',
              translations: [
                {
                  __typename: 'LanguageTranslation',
                  id: '832',
                  name: 'about america',
                  language: {
                    id: 'en23',
                    locale: 'en-us'
                  }
                }
              ]
            }
          ],
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
                    id: 'en38',
                    displayName: 'English',
                    languageCode: 'en',
                    locale: 'en-us',
                    nativeName: 'English',
                    textDirection: 'LTR'
                  }
                },
                {
                  __typename: 'LanguageTranslation',
                  id: 'tr019',
                  name: 'Culture américaine',
                  language: {
                    __typename: 'Language',
                    id: 'fr82',
                    displayName: 'French',
                    languageCode: 'fr',
                    locale: 'fr-fr',
                    nativeName: 'French',
                    textDirection: 'LTR'
                  }
                }
              ]
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
                    id: 'en38',
                    displayName: 'English',
                    languageCode: 'en',
                    locale: 'en-us',
                    nativeName: 'English',
                    textDirection: 'LTR'
                  }
                },
                {
                  __typename: 'LanguageTranslation',
                  id: 'tr777',
                  name: 'Anglais langue étrangère',
                  language: {
                    __typename: 'Language',
                    id: 'fr82',
                    displayName: 'French',
                    languageCode: 'fr',
                    locale: 'fr-fr',
                    nativeName: 'French',
                    textDirection: 'LTR'
                  }
                }
              ]
            }
          ],
          thumbnails: [
            {
              __typename: 'ImageFile',
              id: 'th11',
              createdAt: '2019-03-06T13:11:48.043Z',
              updatedAt: '2019-06-18T13:58:10.024Z',
              filename: 'image-1.jpg',
              filesize: 28371,
              filetype: 'image/jpeg',
              alt: 'the alt text',
              url: `2019/06/${props.id}/image-1.jpg`,
              language: {
                __typename: 'Language',
                id: 'en38',
                displayName: 'English',
                languageCode: 'en',
                locale: 'en-us',
                nativeName: 'English',
                textDirection: 'LTR'
              }
            }
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
                textDirection: 'RTL'
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
                        textDirection: 'RTL'
                      }
                    }
                  ]
                }
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
                    url: `2019/06/${props.id}/image-1.jpg`,
                    language: {
                      __typename: 'Language',
                      id: 'ar22',
                      displayName: 'Arabic',
                      languageCode: 'ar',
                      locale: 'ar',
                      nativeName: 'العربية',
                      textDirection: 'RTL'
                    }
                  }
                }
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
                  url: `2019/06/${props.id}/video-file-1.mp4`,
                  videoBurnedInStatus: 'CLEAN',
                  dimensions: {
                    __typename: 'Dimensions',
                    id: 'd21',
                    height: '1080',
                    width: '1920'
                  },
                  language: {
                    __typename: 'Language',
                    id: 'ar22',
                    displayName: 'Arabic',
                    languageCode: 'ar',
                    locale: 'ar',
                    nativeName: 'العربية',
                    textDirection: 'RTL'
                  },
                  use: {
                    __typename: 'VideoUse',
                    id: 'us31',
                    name: 'Full Video'
                  },
                  stream: [
                    {
                      __typename: 'VideoStream',
                      id: 'st93',
                      site: 'YouTube',
                      url: 'https://www.youtube.com/watch?v=1evw4fRu3bo'
                    },
                    {
                      __typename: 'VideoStream',
                      id: 'st35',
                      site: 'Vimeo',
                      url: 'https://vimeo.com/340239507'
                    }
                  ]
                }
              ]
            },
            {
              __typename: 'VideoUnit',
              id: 'un95',
              updatedAt: '2019-06-18T12:58:10.024Z',
              title: 'test project title',
              descPublic: 'the english description',
              language: {
                __typename: 'Language',
                id: 'en38',
                displayName: 'English',
                languageCode: 'en',
                locale: 'en-us',
                nativeName: 'English',
                textDirection: 'LTR'
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
                        id: 'en38',
                        displayName: 'English',
                        languageCode: 'en',
                        locale: 'en-us',
                        nativeName: 'English',
                        textDirection: 'LTR'
                      }
                    },
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr019',
                      name: 'Culture américaine',
                      language: {
                        __typename: 'Language',
                        id: 'fr82',
                        displayName: 'French',
                        languageCode: 'fr',
                        locale: 'fr-fr',
                        nativeName: 'French',
                        textDirection: 'LTR'
                      }
                    }
                  ]
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
                        id: 'en38',
                        displayName: 'English',
                        languageCode: 'en',
                        locale: 'en-us',
                        nativeName: 'English',
                        textDirection: 'LTR'
                      }
                    },
                    {
                      __typename: 'LanguageTranslation',
                      id: 'tr777',
                      name: 'Anglais langue étrangère',
                      language: {
                        __typename: 'Language',
                        id: 'fr82',
                        displayName: 'French',
                        languageCode: 'fr',
                        locale: 'fr-fr',
                        nativeName: 'French',
                        textDirection: 'LTR'
                      }
                    }
                  ]
                }
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
                    url: `2019/06/${props.id}/image-1.jpg`,
                    language: {
                      __typename: 'Language',
                      id: 'en38',
                      displayName: 'English',
                      languageCode: 'en',
                      locale: 'en-us',
                      nativeName: 'English',
                      textDirection: 'LTR'
                    }
                  }
                }
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
                  url: `2019/06/${props.id}/video-file-1.mp4`,
                  videoBurnedInStatus: 'CLEAN',
                  dimensions: {
                    __typename: 'Dimensions',
                    id: 'd21',
                    height: '1080',
                    width: '1920'
                  },
                  language: {
                    __typename: 'Language',
                    id: 'en38',
                    displayName: 'English',
                    languageCode: 'en',
                    locale: 'en-us',
                    nativeName: 'English',
                    textDirection: 'LTR'
                  },
                  use: {
                    __typename: 'VideoUse',
                    id: 'us31',
                    name: 'Full Video'
                  },
                  stream: [
                    {
                      __typename: 'VideoStream',
                      id: 'st93',
                      site: 'YouTube',
                      url: 'https://www.youtube.com/watch?v=1evw4fRu3bo'
                    },
                    {
                      __typename: 'VideoStream',
                      id: 'st35',
                      site: 'Vimeo',
                      url: 'https://vimeo.com/340239507'
                    }
                  ]
                }
              ]
            }
          ],
          supportFiles: [
            {
              __typename: 'SupportFile',
              id: 'v832',
              createdAt: '2019-06-12T14:58:10.024Z',
              updatedAt: '2019-06-19T18:48:10.024Z',
              url: `2019/06/${props.id}/srt-1.srt`,
              filename: 'srt-1.srt',
              filesize: 6424,
              filetype: 'application/x-subrip',
              use: null,
              language: {
                __typename: 'Language',
                id: 'en33',
                displayName: 'English',
                nativeName: 'English',
                languageCode: 'en',
                locale: 'en-us',
                textDirection: 'LTR'
              }
            },
            {
              __typename: 'SupportFile',
              id: 'v238',
              createdAt: '2019-06-10T14:58:10.024Z',
              updatedAt: '2019-06-11T12:18:10.024Z',
              url: `2019/06/${props.id}/srt-2.srt`,
              filename: 'srt-2.srt',
              filesize: 6424,
              filetype: 'application/x-subrip',
              use: null,
              language: {
                __typename: 'Language',
                id: 'fr533',
                displayName: 'French',
                nativeName: 'French',
                languageCode: 'fr',
                locale: 'fr-fr',
                textDirection: 'LTR'
              }
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: DELETE_VIDEO_PROJECT_MUTATION,
      variables: { id: props.id }
    },
    result: {
      data: {
        deleteVideoProject: {
          __typename: 'VideoProject',
          id: props.id
        }
      }
    }
  },
  {
    request: {
      query: PUBLISH_VIDEO_PROJECT_MUTATION,
      variables: { id: props.id }
    },
    result: {
      data: {
        publishVideoProject: {
          __typename: 'VideoProject',
          id: props.id,
          status: 'PUBLISHED'
        }
      }
    }
  }
];

export const publishedMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          status: 'PUBLISHED'
        }
      }
    }
  }
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [
        {
          graphQLErrors: [{
            message: 'There was an error.'
          }]
        }
      ]
    }
  }
];

export const nullMocks = [
  {
    ...mocks[0],
    result: { data: { project: null } }
  }
];
