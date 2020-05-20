import { DELETE_GRAPHIC_PROJECT_MUTATION, GRAPHIC_PROJECT_QUERY } from 'lib/graphql/queries/graphic';

const props = {
  id: 'ck9b9n8kw1x720720sjwwl1g7'
};

const mocks = [
  {
    request: {
      query: GRAPHIC_PROJECT_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        graphicProject: {
          id: 'ck9b9n8kw1x720720sjwwl1g7',
          createdAt: '2020-04-22T11:40:51.599Z',
          updatedAt: '2020-05-04T17:17:30.316Z',
          publishedAt: null,
          type: 'SOCIAL_MEDIA',
          title: 'Just another graphic project',
          copyright: 'NO_COPYRIGHT',
          alt: 'some alt text',
          descPublic: 'the public description',
          descInternal: 'the internal description',
          assetPath: null,
          author: {
            id: 'ck2m042xo0rnp0720nb4gxjix',
            firstName: 'Edwin',
            lastName: 'Mah',
            email: 'mahe@america.gov',
            __typename: 'User'
          },
          team: {
            id: 'ck2qgfbku0ubh0720iwhkvuyn',
            name: 'GPA Press Office',
            contentTypes: ['GRAPHIC'],
            __typename: 'Team'
          },
          status: 'DRAFT',
          visibility: 'PUBLIC',
          images: [
            {
              id: 'ck2m096f80rq70720nsnylh27',
              createdAt: '2019-11-05T15:25:30.462Z',
              updatedAt: '2020-05-04T17:16:53.930Z',
              filename: 'Mexico_City_long_long_asiasd_lasdf_kljiemx_iskei_jlks_askljdf_asdiweoncx_xzxziwe.jpg',
              filetype: 'image/jpeg',
              filesize: 1030591,
              url: '2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/mexico_city_1.jpg',
              signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/mexico_city_1.jpg?AWSAccessKeyId=someaccesskeyid&Expires=1588616250&Signature=thesignature',
              alt: null,
              use: {
                id: 'ck2lzfx510hhj07205mal3e4l',
                name: 'Thumbnail/Cover Image',
                __typename: 'ImageUse'
              },
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language'
              },
              __typename: 'ImageFile',
              title: 'Mexico_City_long_long_asiasd_lasdf_kljiemx_iskei_jlks_askljdf_asdiweoncx_xzxziwe.jpg',
              social: [
                {
                  id: 'ck9h3meu626bw07201o36tapc',
                  name: 'Instagram',
                  __typename: 'SocialPlatform'
                }
              ],
              style: {
                id: 'ck9h3l7zn26au0720ialhqtg4',
                name: 'Quote',
                __typename: 'GraphicStyle'
              }
            },
            {
              id: 'ck2maluky0s5z0720a2dgkisd',
              createdAt: '2019-11-05T20:15:17.892Z',
              updatedAt: '2020-05-04T17:16:55.720Z',
              filename: 'Mexico City 1.jpg',
              filetype: 'image/jpeg',
              filesize: 1030591,
              url: '2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/mexico_city_1.jpg',
              signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/mexico_city_1.jpg?AWSAccessKeyId=someaccesskeyid&Expires=1588616250&Signature=thesignature',
              alt: null,
              use: {
                id: 'ck2lzfx510hhj07205mal3e4l',
                name: 'Thumbnail/Cover Image',
                __typename: 'ImageUse'
              },
              language: {
                id: 'ck2lzfx7m0hl50720y9oqzyqz',
                locale: 'ja',
                languageCode: 'ja',
                displayName: 'Japanese',
                textDirection: 'LTR',
                nativeName: '日本語',
                __typename: 'Language'
              },
              __typename: 'ImageFile',
              title: 'Mexico City 1.jpg',
              social: [
                {
                  id: 'ck9h3naq526cp0720i4u3uqlv',
                  name: 'WhatsApp',
                  __typename: 'SocialPlatform'
                }
              ],
              style: {
                id: 'ck9h3kyb326ak0720wkbk01q6',
                name: 'Info/Stat',
                __typename: 'GraphicStyle'
              }
            },
            {
              id: 'ck30lyuxm15px0720dkd7hodl',
              createdAt: '2019-11-15T20:42:07.165Z',
              updatedAt: '2020-05-04T17:16:57.512Z',
              filename: 'Mexico City 1.jpg',
              filetype: 'image/jpeg',
              filesize: 1030591,
              url: '2019/11/commons.america.gov_ck30lyah915p50720pw4fbwo1/mexico_city_1.jpg',
              signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck30lyah915p50720pw4fbwo1/mexico_city_1.jpg?AWSAccessKeyId=someaccesskeyid&Expires=1588616250&Signature=thesignature',
              alt: null,
              use: {
                id: 'ck2lzfx510hhj07205mal3e4l',
                name: 'Thumbnail/Cover Image',
                __typename: 'ImageUse'
              },
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language'
              },
              __typename: 'ImageFile',
              title: 'Mexico City 1.jpg',
              social: [
                {
                  id: 'ck9h3m3g626bd07201gh712vk',
                  name: 'Twitter',
                  __typename: 'SocialPlatform'
                }
              ],
              style: {
                id: 'ck9h3ka3o269y0720t7wzp5uq',
                name: 'GIF',
                __typename: 'GraphicStyle'
              }
            },
            {
              id: 'ck37p8z731vim0720nrlespm1',
              createdAt: '2019-11-20T19:48:21.415Z',
              updatedAt: '2020-05-04T17:17:01.227Z',
              filename: 'erwan-hesry-Q34YB7yjAxA-unsplash-1.png',
              filetype: 'image/png',
              filesize: 42093736,
              url: '2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/erwan-hesry-q34yb7yjaxa-unsplash-1.png',
              signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/erwan-hesry-q34yb7yjaxa-unsplash-1.png?AWSAccessKeyId=someaccesskeyid&Expires=1588616250&Signature=thesignature',
              alt: null,
              use: {
                id: 'ck2lzfx510hhj07205mal3e4l',
                name: 'Thumbnail/Cover Image',
                __typename: 'ImageUse'
              },
              language: {
                id: 'ck2lzfx7g0hl10720vfyiek0q',
                locale: 'id-id',
                languageCode: 'id',
                displayName: 'Bahasa Indonesia',
                textDirection: 'LTR',
                nativeName: 'Bahasa Indonesia',
                __typename: 'Language'
              },
              __typename: 'ImageFile',
              title: 'erwan-hesry-Q34YB7yjAxA-unsplash-1.png',
              social: [
                {
                  id: 'ck9h3m9bl26bm0720rm69c60s',
                  name: 'Facebook',
                  __typename: 'SocialPlatform'
                }
              ],
              style: {
                id: 'ck9h3koe426aa0720y421wmk3',
                name: 'Clean',
                __typename: 'GraphicStyle'
              }
            }
          ],
          categories: [
            {
              id: 'ck2lzgu1c0re307202dlrnue2',
              translations: [
                {
                  id: 'ck2lzfxab0hls0720o2sjmoqw',
                  name: 'about america',
                  language: {
                    id: 'ck2lzfx710hkq07206thus6pt',
                    locale: 'en-us',
                    languageCode: 'en',
                    displayName: 'English',
                    textDirection: 'LTR',
                    nativeName: 'English',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                },
                {
                  id: 'ck2lzfxbe0hlz0720qou6kr5x',
                  name: 'conozca Estados Unidos',
                  language: {
                    id: 'ck2lzfx7o0hl707205uteku77',
                    locale: 'es-es',
                    languageCode: 'es',
                    displayName: 'Spanish',
                    textDirection: 'LTR',
                    nativeName: 'Español',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                },
                {
                  id: 'ck2lzfxc90hm60720onv6tbro',
                  name: 'Amérique',
                  language: {
                    id: 'ck2lzfx710hkp07206oo0icbv',
                    locale: 'fr-fr',
                    languageCode: 'fr',
                    displayName: 'French',
                    textDirection: 'LTR',
                    nativeName: 'Français',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                },
              ],
              __typename: 'Category'
            },
            {
              id: 'ck2lzgu1e0re90720th24sglh',
              translations: [
                {
                  id: 'ck2lzfye00hxg0720djwj20fs',
                  name: 'geography',
                  language: {
                    id: 'ck2lzfx710hkq07206thus6pt',
                    locale: 'en-us',
                    languageCode: 'en',
                    displayName: 'English',
                    textDirection: 'LTR',
                    nativeName: 'English',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                },
                {
                  id: 'ck2lzfyej0hxn0720fwm4ior3',
                  name: 'Geografía',
                  language: {
                    id: 'ck2lzfx7o0hl707205uteku77',
                    locale: 'es-es',
                    languageCode: 'es',
                    displayName: 'Spanish',
                    textDirection: 'LTR',
                    nativeName: 'Español',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                },
                {
                  id: 'ck2lzfyf10hxu072065vqpr38',
                  name: 'Géographie',
                  language: {
                    id: 'ck2lzfx710hkp07206oo0icbv',
                    locale: 'fr-fr',
                    languageCode: 'fr',
                    displayName: 'French',
                    textDirection: 'LTR',
                    nativeName: 'Français',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                }
              ],
              __typename: 'Category'
            }
          ],
          tags: [
            {
              id: 'ck2lzgu5e0rhu07207x85lxmb',
              translations: [
                {
                  id: 'ck2lzgiwy0nx40720sedxm612',
                  name: 'biomedical science',
                  language: {
                    id: 'ck2lzfx710hkq07206thus6pt',
                    locale: 'en-us',
                    languageCode: 'en',
                    displayName: 'English',
                    textDirection: 'LTR',
                    nativeName: 'English',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                },
                {
                  id: 'ck2lzgixn0nxb072018rszcc5',
                  name: 'ciencia Biomedica',
                  language: {
                    id: 'ck2lzfx7o0hl707205uteku77',
                    locale: 'es-es',
                    languageCode: 'es',
                    displayName: 'Spanish',
                    textDirection: 'LTR',
                    nativeName: 'Español',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                },
                {
                  id: 'ck2lzgiy90nxi0720u91l9paa',
                  name: 'science biomédicale',
                  language: {
                    id: 'ck2lzfx710hkp07206oo0icbv',
                    locale: 'fr-fr',
                    languageCode: 'fr',
                    displayName: 'French',
                    textDirection: 'LTR',
                    nativeName: 'Français',
                    __typename: 'Language'
                  },
                  __typename: 'LanguageTranslation'
                }
              ],
              __typename: 'Tag'
            }
          ],
          __typename: 'GraphicProject',
          supportFiles: [
            {
              id: 'ck9jtsbvz291i0720by3crdcc',
              createdAt: '2020-04-28T11:26:50.874Z',
              updatedAt: '2020-04-28T14:33:38.016Z',
              filename: 's-secure-rights_shell.png',
              filetype: 'image/png',
              filesize: 29000,
              url: null,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
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
              id: 'ck9jtuqhy292w07200tfpbkju',
              createdAt: '2020-04-28T11:28:43.173Z',
              updatedAt: '2020-05-01T14:05:55.765Z',
              filename: 's-secure-rights_asikaid_ksidn_kaslkdfiwnz_iqmshqusm_kwspamdisa_sucms_english.psd',
              filetype: 'image/vnd.adobe.photoshop',
              filesize: 509000,
              url: null,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
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
              id: 'ck9jtwa1v293h0720rbd1vdjr',
              createdAt: '2020-04-28T11:29:55.168Z',
              updatedAt: '2020-04-28T11:29:55.168Z',
              filename: 's-secure-rights_transcript.docx',
              filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              filesize: 9000,
              url: null,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
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
              id: 'ck9ld2skk2cjn0720d5s33uxo',
              createdAt: '2020-04-29T13:14:37.942Z',
              updatedAt: '2020-04-29T13:14:37.942Z',
              filename: 'OpenSans-regular.ttf',
              filetype: 'font/ttf',
              filesize: null,
              url: null,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language'
              },
              use: null,
              __typename: 'SupportFile'
            }
          ]
        }
      }
    }
  },
  {
    request: {
      query: DELETE_GRAPHIC_PROJECT_MUTATION,
      variables: { id: props.id }
    },
    result: {
      data: {
        id: props.id
      }
    }
  }
];

const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  },
  {
    ...mocks[1]
  }
];

export { errorMocks, mocks, props };
