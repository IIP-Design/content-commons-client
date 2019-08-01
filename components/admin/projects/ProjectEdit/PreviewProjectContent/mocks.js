export const getMocks = ( query, variables ) => (
  [
    {
      request: {
        query,
        variables: { ...variables }
      },
      result: {
        data: {
          project: {
            __typename: 'VideoProject',
            id: variables.id,
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
                url: `2019/06/${variables.id}/image-1.jpg`,
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
                      url: `2019/06/${variables.id}/image-1.jpg`,
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
                    url: `2019/06/${variables.id}/video-file-1.mp4`,
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
                      url: `2019/06/${variables.id}/image-1.jpg`,
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
                    url: `2019/06/${variables.id}/video-file-1.mp4`,
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
  ]
);
