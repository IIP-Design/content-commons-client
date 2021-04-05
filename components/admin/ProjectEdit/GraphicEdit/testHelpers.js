import { GraphQLError } from 'graphql';
import sortBy from 'lodash/sortBy';

import {
  DELETE_GRAPHIC_PROJECT_MUTATION,
  GRAPHIC_PROJECT_QUERY,
  LOCAL_GRAPHIC_FILES,
} from 'lib/graphql/queries/graphic';
import { GRAPHIC_STYLES_QUERY } from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';

import { getFileExt } from 'lib/utils';

const props = {
  id: 'ck9b9n8kw1x720720sjwwl1g7',
};

const mocks = [
  {
    request: {
      query: GRAPHIC_PROJECT_QUERY,
      variables: { id: props.id },
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
          descPublic: {
            __typename: 'ContentField',
            id: 'ckbtc7w3a01eg0720xofdzoxe',
            visibility: 'PUBLIC',
            content: 'the public description',
          },
          descInternal: {
            __typename: 'ContentField',
            id: 'ckbtc7w3d01eh0720jh940bzv',
            visibility: 'INTERNAL',
            content: 'the internal description',
          },
          assetPath: null,
          author: {
            id: 'ck2m042xo0rnp0720nb4gxjix',
            firstName: 'Edwin',
            lastName: 'Mah',
            email: 'mahe@america.gov',
            __typename: 'User',
          },
          team: {
            id: 'ck2qgfbku0ubh0720iwhkvuyn',
            name: 'GPA Press Office',
            contentTypes: ['GRAPHIC'],
            __typename: 'Team',
          },
          status: 'DRAFT',
          visibility: 'PUBLIC',
          images: [
            {
              id: 'ckbkr9q4w04mi0720y9vfhlbl',
              createdAt: '2020-06-18T12:23:34.541Z',
              updatedAt: '2020-06-18T12:23:49.321Z',
              title: '1_3_Serious_FB.png',
              filename: '1_3_Serious_FB.png',
              filetype: 'image/png',
              filesize: 18986,
              url: 'social_media/2020/06/commons.america.gov_ckbjexfkf02pv0720g6xjfv3p/1_3_Serious_FB.png',
              signedUrl: 'https://the-signed-url.com',
              alt: null,
              use: null,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                languageCode: 'en',
                locale: 'en-us',
                textDirection: 'LTR',
                displayName: 'English',
                nativeName: 'English',
                __typename: 'Language',
              },
              social: [
                {
                  id: 'ck9h3m9bl26bm0720rm69c60s',
                  name: 'Facebook',
                  __typename: 'SocialPlatform',
                },
                {
                  id: 'ck9h3meu626bw07201o36tapc',
                  name: 'Instagram',
                  __typename: 'SocialPlatform',
                },
              ],
              style: {
                id: 'ck9h3kyb326ak0720wkbk01q6',
                name: 'Info/Stat',
                __typename: 'GraphicStyle',
              },
              dimensions: {
                id: 'ckbkr9q5e04mj0720aqiya19y',
                width: 2100,
                height: 1500,
                __typename: 'Dimensions',
              },
              __typename: 'ImageFile',
            },
            {
              id: 'ckbkr503z04kh07203yb3q5bf',
              createdAt: '2020-06-18T12:19:54.186Z',
              updatedAt: '2020-06-18T12:19:54.186Z',
              title: '4_16_Vaccines_French_Gif_FB.gif',
              filename: '4_16_Vaccines_French_Gif_FB.gif',
              filetype: 'image/gif',
              filesize: 4687703,
              url: 'social_media/2020/06/commons.america.gov_ckbjexfkf02pv0720g6xjfv3p/4_16_Vaccines_French_Gif_FB.gif',
              signedUrl: 'https://the-signed-url.com',
              alt: null,
              use: null,
              language: {
                id: 'ck2lzfx710hkp07206oo0icbv',
                languageCode: 'fr',
                locale: 'fr-fr',
                textDirection: 'LTR',
                displayName: 'French',
                nativeName: 'Français',
                __typename: 'Language',
              },
              social: [
                {
                  id: 'ck9h3m9bl26bm0720rm69c60s',
                  name: 'Facebook',
                  __typename: 'SocialPlatform',
                },
                {
                  id: 'ck9h3meu626bw07201o36tapc',
                  name: 'Instagram',
                  __typename: 'SocialPlatform',
                },
              ],
              style: {
                id: 'ck9h3ka3o269y0720t7wzp5uq',
                name: 'GIF',
                __typename: 'GraphicStyle',
              },
              dimensions: {
                id: 'ckbkr504a04ki07200d43er7e',
                width: 1200,
                height: 1200,
                __typename: 'Dimensions',
              },
              __typename: 'ImageFile',
            },
            {
              id: 'ck30lyuxm15px0720dkd7hodl',
              createdAt: '2019-11-15T20:42:07.165Z',
              updatedAt: '2020-05-04T17:16:57.512Z',
              title: '4_3_Serious_TW.jpg',
              filename: '4_3_Serious_TW.jpg',
              filetype: 'image/jpeg',
              filesize: 1030591,
              url: '2019/11/commons.america.gov_ck30lyah915p50720pw4fbwo1/4_3_Serious_TW.jpg',
              signedUrl: 'https://the-signed-url.com',
              alt: null,
              use: {
                id: 'ck2lzfx510hhj07205mal3e4l',
                name: 'Thumbnail/Cover Image',
                __typename: 'ImageUse',
              },
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language',
              },
              social: [
                {
                  id: 'ck9h3m3g626bd07201gh712vk',
                  name: 'Twitter',
                  __typename: 'SocialPlatform',
                },
              ],
              style: {
                id: 'ck9h3l7zn26au0720ialhqtg4',
                name: 'Quote',
                __typename: 'GraphicStyle',
              },
              dimensions: {
                id: 'cka3w01q530230720kasdk2ia',
                width: 1200,
                height: 675,
                __typename: 'Dimensions',
              },
              __typename: 'ImageFile',
            },
            {
              id: 'ck37p8z731vim0720nrlespm1',
              createdAt: '2019-11-20T19:48:21.415Z',
              updatedAt: '2020-05-04T17:17:01.227Z',
              title: '4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg',
              filename: '4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg',
              filetype: 'image/jpeg',
              filesize: 42093736,
              url: '2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg',
              signedUrl: 'https://the-signed-url.com',
              alt: null,
              use: {
                id: 'ck2lzfx510hhj07205mal3e4l',
                name: 'Thumbnail/Cover Image',
                __typename: 'ImageUse',
              },
              language: {
                id: 'ck2lzfx7g0hl10720vfyiek0q',
                locale: 'id-id',
                languageCode: 'id',
                displayName: 'Bahasa Indonesia',
                textDirection: 'LTR',
                nativeName: 'Bahasa Indonesia',
                __typename: 'Language',
              },
              social: [
                {
                  id: 'ck9h3m9bl26bm0720rm69c60s',
                  name: 'Facebook',
                  __typename: 'SocialPlatform',
                },
                {
                  id: 'ck9h3meu626bw07201o36tapc',
                  name: 'Instagram',
                  __typename: 'SocialPlatform',
                },
              ],
              style: {
                id: 'ck9h3koe426aa0720y421wmk3',
                name: 'Info/Stat',
                __typename: 'GraphicStyle',
              },
              dimensions: {
                id: 'cka3w01q530230720quz8k2s',
                width: 1200,
                height: 1200,
                __typename: 'Dimensions',
              },
              __typename: 'ImageFile',
            },
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
                },
              ],
              __typename: 'Category',
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
                },
              ],
              __typename: 'Category',
            },
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
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
                    __typename: 'Language',
                  },
                  __typename: 'LanguageTranslation',
                },
              ],
              __typename: 'Tag',
            },
          ],
          __typename: 'GraphicProject',
          supportFiles: [
            {
              id: 'ck9jtuqhy292w07200tfpbkju',
              createdAt: '2020-04-28T11:28:43.173Z',
              updatedAt: '2020-05-01T14:05:55.765Z',
              filename: 's-secure-rights_asikaid_ksidn_kaslkdfiwnz_iqmshqusm_kwspamdisa_sucms_english.psd',
              filetype: 'image/vnd.adobe.photoshop',
              filesize: 509000,
              url: '2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/s-secure-rights_asikaid_ksidn_kaslkdfiwnz_iqmshqusm_kwspamdisa_sucms_english.psd',
              signedUrl: 'https://the-signed-url.com',
              editable: true,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language',
              },
              use: null,
              __typename: 'SupportFile',
            },
            {
              id: 'ck2maluky0s5z0720a2dgkisd',
              createdAt: '2019-11-05T20:15:17.892Z',
              updatedAt: '2020-05-04T17:16:55.720Z',
              filename: 's-secure-rights_shell.png',
              filetype: 'image/png',
              filesize: 29000,
              url: '2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/s-secure-rights_shell.png',
              signedUrl: 'https://the-signed-url.com',
              editable: true,
              language: {
                id: 'ck2lzfx7m0hl50720y9oqzyqz',
                locale: 'ja',
                languageCode: 'ja',
                displayName: 'Japanese',
                textDirection: 'LTR',
                nativeName: '日本語',
                __typename: 'Language',
              },
              use: null,
              __typename: 'SupportFile',
            },
            {
              id: 'ck9jtuqhy29kakd92ka92kd92',
              createdAt: '2020-04-28T11:28:43.173Z',
              updatedAt: '2020-05-01T14:05:55.765Z',
              filename: 'test-file-FB.psd',
              filetype: 'image/vnd.adobe.photoshop',
              filesize: 509000,
              url: '2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/test-file.psd',
              signedUrl: 'https://the-signed-url.com',
              editable: true,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language',
              },
              use: null,
              __typename: 'SupportFile',
            },
            {
              id: 'ckbjexi0v02s907200vw1cf2s',
              createdAt: '2020-06-17T13:50:22.589Z',
              updatedAt: '2020-06-17T13:50:22.589Z',
              filename: 'test-file-clean.jpg',
              filetype: 'image/jpeg',
              filesize: 18986,
              url: 'social_media/2020/06/commons.america.gov_ckbjexfkf02pv0720g6xjfv3p/test-file-clean.jpg',
              signedUrl: 'https://the-signed-url.com',
              editable: true,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language',
              },
              use: null,
              __typename: 'SupportFile',
            },
            {
              id: 'ckbjexhuw02rw0720mbc07dr3',
              createdAt: '2020-06-17T13:50:22.370Z',
              updatedAt: '2020-06-17T13:50:22.370Z',
              filename: 'test-file-shell.png',
              filetype: 'image/png',
              filesize: 18986,
              url: 'social_media/2020/06/commons.america.gov_ckbjexfkf02pv0720g6xjfv3p/test-file-shell.png',
              signedUrl: 'https://the-signed-url.com',
              editable: true,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language',
              },
              use: null,
              __typename: 'SupportFile',
            },
            {
              id: 'ck9jtwa1v293h0720rbd1vdjr',
              createdAt: '2020-04-28T11:29:55.168Z',
              updatedAt: '2020-04-28T11:29:55.168Z',
              filename: 's-secure-rights_transcript.docx',
              filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              filesize: 9000,
              url: '2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/s-secure-rights_transcript.docx',
              signedUrl: 'https://the-signed-url.com',
              editable: false,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language',
              },
              use: null,
              __typename: 'SupportFile',
            },
            {
              id: 'ck9ld2skk2cjn0720d5s33uxo',
              createdAt: '2020-04-29T13:14:37.942Z',
              updatedAt: '2020-04-29T13:14:37.942Z',
              filename: 'OpenSans-regular.ttf',
              filetype: 'font/ttf',
              filesize: null,
              url: '2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/OpenSans-regular.ttf',
              signedUrl: 'https://the-signed-url.com',
              editable: false,
              language: {
                id: 'ck2lzfx710hkq07206thus6pt',
                locale: 'en-us',
                languageCode: 'en',
                displayName: 'English',
                textDirection: 'LTR',
                nativeName: 'English',
                __typename: 'Language',
              },
              use: null,
              __typename: 'SupportFile',
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: DELETE_GRAPHIC_PROJECT_MUTATION,
      variables: { id: props.id },
    },
    result: {
      data: {
        deleteGraphicProject: {
          __typename: 'GraphicProject',
          id: props.id,
        },
      },
    },
  },
  {
    request: {
      query: LOCAL_GRAPHIC_FILES,
    },
    result: {
      data: {
        localGraphicProject: {
          __typename: 'LocalGraphicProject',
          files: [
            {
              __typename: 'LocalImageFile',
              id: 'ckbkr-9q4w04-mi0720y-9vfhlbl',
              name: '1_3_Serious_FB.png',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: ['ck9h3m9bl26bm0720rm69c60s', 'ck9h3meu626bw07201o36tapc'],
              style: 'ck9h3kyb326ak0720wkbk01q6',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/png;base64,/9j/4AAQSkZJRgBADAQ',
                name: '1_3_Serious_FB.png',
                size: 18986,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: 'ckbkr-503z04k-h07203-yb3q5bf',
              name: '4_16_Vaccines_French_Gif_FB.gif',
              language: 'ck2lzfx710hkp07206oo0icbv',
              social: ['ck9h3m9bl26bm0720rm69c60s', 'ck9h3meu626bw07201o36tapc'],
              style: 'ck9h3ka3o269y0720t7wzp5uq',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/gif;base64,/9j/4AAQSkZJRgAODAQ',
                name: '4_16_Vaccines_French_Gif_FB.gif',
                size: 4687703,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: 'ckbjex-i0v02s-907200-vw1cf2s',
              name: 'test-file-clean.jpg',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: ['ck9h3m9bl26bm0720rm69c60s'],
              style: 'ck9h3koe426aa0720y421wmk3',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgPLRAQ',
                name: 'test-file-shell.jpg',
                size: 18986,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: 'ckbjex-huw02rw-0720mbc-07dr3',
              name: 'test-file-shell.png',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: ['ck9h3naq526cp0720i4u3uqlv'],
              style: 'ck9h3koe426aa0720y421wmk3',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/png;base64,/9j/4AAQSkZJRgABAQ',
                name: 'test-file-shell.png',
                size: 18986,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: '51ccb5dc-9961-4880-b385-89142cbc1c38',
              name: '4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: ['ck9h3m9bl26bm0720rm69c60s', 'ck9h3meu626bw07201o36tapc'],
              style: 'ck9h3kyb326ak0720wkbk01q6',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ',
                name: '4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg',
                size: 9999,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: '5114e689-7c8c-4566-ac0f-baa2008d6e2d',
              name: '4_3_Serious_TW.jpg',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: ['ck9h3m3g626bd07201gh712vk'],
              style: 'ck9h3l7zn26au0720ialhqtg4',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ',
                name: '4_3_Serious_TW.jpg',
                size: 9999,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: 'db6086b2-bc52-4cc2-8133-6accc96ba3df',
              name: 's-secure-rights_asikaid_ksidn_kaslkdfiwnz_iqmshqusm_kwspamdisa_sucms_english.psd',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: [],
              style: '',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/vnd.adobe.photoshop;base64,OEJQUwABAAAA',
                name: 's-secure-rights_asikaid_ksidn_kaslkdfiwnz_iqmshqusm_kwspamdisa_sucms_english.psd',
                size: 999999,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: 'bfadfcaf-e82c-436c-9c85-f635ea930ba4',
              name: 'OpenSans-Regular.ttf',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: [],
              style: '',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:application/octet-stream;base64,AAEAAAATAQAAB',
                name: 'OpenSans-Regular.ttf',
                size: 999,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: '5b2f9140-96ba-4e44-aff1-e74dd51cdadc',
              name: 'test-file-FB.psd',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: [],
              style: '',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/vnd.adobe.photoshop;base64,OEJQUwABAAAA',
                name: 'test-file-FB.psd',
                size: 999999,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: 'ec7d934a-dd82-4923-a4c6-4245afa56256',
              name: 's-secure-rights_shell.png',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: ['ck9h3naq526cp0720i4u3uqlv'],
              style: 'ck9h3koe426aa0720y421wmk3',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANS',
                name: 's-secure-rights_shell.png',
                size: 9999,
              },
            },
            {
              __typename: 'LocalImageFile',
              id: '42bae4ac-eb21-4c22-98c0-d3af045d456c',
              name: 's-secure-rights_transcript.docx',
              language: 'ck2lzfx710hkq07206thus6pt',
              social: [],
              style: '',
              loaded: 0,
              input: {
                __typename: 'LocalInputFile',
                dataUrl: 'data:application/vnd.openxmlformats-officedocument;base64,asdfEACGAE',
                name: 's-secure-rights_transcript.docx',
                size: 99,
              },
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: GRAPHIC_STYLES_QUERY,
    },
    result: {
      data: {
        graphicStyles: [
          {
            __typename: 'GraphicStyle',
            id: 'ck9h3ka3o269y0720t7wzp5uq',
            name: 'GIF',
          },
          {
            __typename: 'GraphicStyle',
            id: 'ck9h3koe426aa0720y421wmk3',
            name: 'Clean',
          },
          {
            __typename: 'GraphicStyle',
            id: 'ck9h3kyb326ak0720wkbk01q6',
            name: 'Info/Stat',
          },
          {
            __typename: 'GraphicStyle',
            id: 'ck9h3l7zn26au0720ialhqtg4',
            name: 'Quote',
          },
        ],
      },
    },
  },
];

const publishedMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        graphicProject: {
          ...mocks[0].result.data.graphicProject,
          status: 'PUBLISHED',
        },
      },
    },
  },
  {
    ...mocks[1],
  },
  {
    ...mocks[2],
  },
  {
    ...mocks[3],
  },
];

const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [new GraphQLError( 'There was an error.' )],
    },
  },
  {
    ...mocks[1],
  },
];

const EDITABLE_EXTS = [
  '.psd', '.ai', '.ae', '.eps',
];

const SHELL_EXTS = [
  '.jpg', '.jpeg', '.png',
];

const getIsShell = filename => {
  const extension = getFileExt( filename );
  const isJpgOrPng = SHELL_EXTS.includes( extension );
  const hasCleanInName = filename.toLowerCase().includes( 'clean' );
  const hasShellInName = filename.toLowerCase().includes( 'shell' );

  return isJpgOrPng && ( hasShellInName || hasCleanInName );
};

const getIsEditable = file => {
  const extension = getFileExt( file.name );
  const hasEditableExt = EDITABLE_EXTS.includes( extension );
  const isShell = getIsShell( file.name );

  return isShell || hasEditableExt;
};

const localGraphicFiles = mocks[2].result.data.localGraphicProject.files.filter( file => {
  const isShell = getIsShell( file.name );

  return file.style && !isShell;
} );

const sortFiles = ( files, field = 'name' ) => sortBy( files, file => file[field].toLowerCase() );
const getLocalEditableFiles = () => {
  const { files } = mocks[2].result.data.localGraphicProject;
  const editableFiles = files.filter( file => getIsEditable( file ) );

  return sortFiles( editableFiles );
};

const getLocalAdditionalFiles = () => {
  const { files } = mocks[2].result.data.localGraphicProject;
  const additionalFiles = files.filter( file => {
    const excludedExtensions = [
      ...EDITABLE_EXTS,
      ...SHELL_EXTS,
      '.gif',
    ];
    const extension = getFileExt( file.name );

    return !excludedExtensions.includes( extension );
  } );

  return sortFiles( additionalFiles );
};

const supportFilesConfig = [
  {
    headline: 'editable files',
    helperText: 'Original files that may be edited and adapted as needed for reuse.',
    files: mocks[0].result.data.graphicProject.supportFiles.filter( file => file.editable ),
  },
  {
    headline: 'additional files',
    helperText: 'Additional files may include transcript files, style guides, or other support files needed by internal staff in order to properly use these graphics.',
    files: mocks[0].result.data.graphicProject.supportFiles.filter( file => !file.editable ),
  },
];

export {
  errorMocks,
  mocks,
  publishedMocks,
  props,
  getLocalAdditionalFiles,
  getLocalEditableFiles,
  localGraphicFiles,
  supportFilesConfig,
};
