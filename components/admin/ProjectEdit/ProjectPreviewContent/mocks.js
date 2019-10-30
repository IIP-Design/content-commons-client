import { VIDEO_PROJECT_PREVIEW_QUERY } from 'components/admin/ProjectEdit/ProjectPreviewContent/ProjectPreviewContent';

export const props = { id: '123' };

export const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          __typename: 'VideoProject',
          id: props.id,
          projectType: 'LANGUAGE',
          descPublic: 'the project public description',
          team: {
            __typename: 'Team',
            id: 't81',
            name: 'the team name'
          },
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
              url: `https://s3-bucket-url.s3.amazonaws.com/2019/06/${props.id}/image-1.jpg?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE`,
              use: {
                __typename: 'ImageUse',
                id: 'imu33',
                name: 'Thumbnail/Cover Image'
              },
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
              createdAt: '2019-06-18T14:58:10.024Z',
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
                    url: `https://s3-bucket-url.s3.amazonaws.com/2019/06/${props.id}/image-1.jpg?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE`,
                    use: {
                      __typename: 'ImageUse',
                      id: 'imu33',
                      name: 'Thumbnail/Cover Image'
                    },
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
              createdAt: '2019-06-18T12:58:10.024Z',
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
                    url: `https://s3-bucket-url.s3.amazonaws.com/2019/06/${props.id}/image-1.jpg?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE`,
                    use: {
                      __typename: 'ImageUse',
                      id: 'imu33',
                      name: 'Thumbnail/Cover Image'
                    },
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
          ]
        }
      }
    }
  }
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

export const noUnitsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: []
        }
      }
    }
  }
];

export const noFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: []
            }
          ]
        }
      }
    }
  }
];

export const vimeoMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: [
                {
                  ...mocks[0].result.data.project.units[0].files[0],
                  stream: [
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
          ]
        }
      }
    }
  }
];

export const noStreamsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: [
                {
                  ...mocks[0].result.data.project.units[0].files[0],
                  stream: []
                }
              ]
            }
          ]
        }
      }
    }
  }
];

export const noTagsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              tags: []
            }
          ]
        }
      }
    }
  }
];

export const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { project: null }
    }
  }
];

export const nullUnitsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: null
        }
      }
    }
  }
];

export const nullFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          units: [
            {
              ...mocks[0].result.data.project.units[0],
              files: null
            }
          ]
        }
      }
    }
  }
];
