export const packageMocks = [
  {
    request: {
      query: 'PACKAGE_QUERY',
      variables: { id: 'package123' }
    },
    result: {
      data: [
        {
          __typename: 'Package',
          id: 'package123',
          createdAt: '2019-03-06T13:11:48.043Z',
          updatedAt: '2019-06-18T14:58:10.024Z',
          author: {
            __typename: 'User',
            id: 'u921',
            firstName: 'FirstName',
            lastName: 'LastName'
          },
          team: {
            __typename: 'Team',
            id: 't81',
            name: 'Press Office'
          },
          title: 'Guidance Package',
          desc: 'Lorem ipsum dolor sit amet, dicta utroque meliore id sea, voluptua detraxit ne sea, aperiri nominavi ex est. Ius an antiopam delicata intellegat, eum dolore fierent albucius cu.',
          status: 'DRAFT',
          visibility: 'INTERNAL',
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
          documents: [
            {
              __typename: 'DocumentFile',
              id: 'df1',
              createdAt: '2019-06-18T14:58:10.024Z',
              updatedAt: '2019-06-18T14:58:10.024Z',
              language: {
                __typename: 'Language',
                id: 'en38',
                displayName: 'English',
                languageCode: 'en',
                locale: 'en-us',
                nativeName: 'English',
                textDirection: 'LTR'
              },
              filetype: '.docx',
              filename: 'DocumentFile1.docx',
              filesize: 23671998,
              text: 'Document File Text',
              url: '',
              signedUrl: 'https://s3-bucket-url.s3.amazonaws.com/path-to-the-file?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE',
              visibility: 'INTERNAL',
              use: {
                __typename: 'DocumentUse',
                id: 'ck2xf4e0a00gh07355ztwyj32',
                name: 'Press Guidance'
              },
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
                }
              ],
            }
          ],
        }
      ]
    }
  }
];

export const documentFileMocks = [
  {
    request: {
      query: 'DOCUMENTFILE_QUERY',
      variables: { id: 'documentFile123' }
    },
    result: {
      data: [
        {
          __typename: 'DocumentFile',
          id: 'documentFile123',
          createdAt: '2019-10-06T13:11:48.043Z',
          updatedAt: '2019-11-18T14:58:10.024Z',
          status: 'DRAFT',
          author: {
            __typename: 'User',
            id: 'u921',
            firstName: 'FirstName',
            lastName: 'LastName'
          },
          team: {
            __typename: 'Team',
            id: 't81',
            name: 'Press Office'
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
          filetype: '.docx',
          filename: 'DocumentFile1.docx',
          filesize: 23671998,
          text: 'Document File Text',
          url: '',
          signedUrl: 'https://s3-bucket-url.s3.amazonaws.com/path-to-the-file?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE',
          visibility: 'INTERNAL',
          use: {
            __typename: 'DocumentUse',
            id: 'ck2xf4e0a00gh07355ztwyj32',
            name: 'Press Guidance'
          },
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
            }
          ],
        }
      ]
    }
  }
];