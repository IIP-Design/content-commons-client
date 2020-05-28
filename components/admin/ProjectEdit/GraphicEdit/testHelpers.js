import sortBy from 'lodash/sortBy';
import { getCount, getFileExt } from 'lib/utils';
import {
  DELETE_GRAPHIC_PROJECT_MUTATION,
  GRAPHIC_PROJECT_QUERY,
  LOCAL_GRAPHIC_FILES,
} from 'lib/graphql/queries/graphic';
import { GRAPHIC_STYLES_QUERY } from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';

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
          descPublic: 'the public description',
          descInternal: 'the internal description',
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
              id: 'ck2maluky0s5z0720a2dgkisd',
              createdAt: '2019-11-05T20:15:17.892Z',
              updatedAt: '2020-05-04T17:16:55.720Z',
              filename: 's-secure-rights_shell.png',
              filetype: 'image/png',
              filesize: 29000,
              url: '2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/s-secure-rights_shell.png',
              signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck2malqe30s4w0720vvjdygjb/s-secure-rights_shell.png?AWSAccessKeyId=someaccesskeyid&Expires=1588616250&Signature=thesignature',
              alt: null,
              use: {
                id: 'ck2lzfx510hhj07205mal3e4l',
                name: 'Thumbnail/Cover Image',
                __typename: 'ImageUse',
              },
              language: {
                id: 'ck2lzfx7m0hl50720y9oqzyqz',
                locale: 'ja',
                languageCode: 'ja',
                displayName: 'Japanese',
                textDirection: 'LTR',
                nativeName: '日本語',
                __typename: 'Language',
              },
              __typename: 'ImageFile',
              title: 's-secure-rights_shell.png',
              social: [
                {
                  id: 'ck9h3naq526cp0720i4u3uqlv',
                  name: 'WhatsApp',
                  __typename: 'SocialPlatform',
                },
              ],
              style: {
                id: 'ck9h3kyb326ak0720wkbk01q6',
                name: 'Clean',
                __typename: 'GraphicStyle',
              },
              dimensions: {
                id: 'cka3w01q530230720aqrt4h2n',
                width: 1024,
                height: 512,
                __typename: 'Dimensions',
              },
            },
            {
              id: 'ck30lyuxm15px0720dkd7hodl',
              createdAt: '2019-11-15T20:42:07.165Z',
              updatedAt: '2020-05-04T17:16:57.512Z',
              filename: '4_3_Serious_TW.jpg',
              filetype: 'image/jpeg',
              filesize: 1030591,
              url: '2019/11/commons.america.gov_ck30lyah915p50720pw4fbwo1/4_3_Serious_TW.jpg',
              signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck30lyah915p50720pw4fbwo1/4_3_Serious_TW.jpg?AWSAccessKeyId=someaccesskeyid&Expires=1588616250&Signature=thesignature',
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
              __typename: 'ImageFile',
              title: '4_3_Serious_TW.jpg',
              social: [
                {
                  id: 'ck9h3m3g626bd07201gh712vk',
                  name: 'Twitter',
                  __typename: 'SocialPlatform',
                },
              ],
              style: {
                id: 'ck9h3ka3o269y0720t7wzp5uq',
                name: 'Quote',
                __typename: 'GraphicStyle',
              },
              dimensions: {
                id: 'cka3w01q530230720kasdk2ia',
                width: 1200,
                height: 675,
                __typename: 'Dimensions',
              },
            },
            {
              id: 'ck37p8z731vim0720nrlespm1',
              createdAt: '2019-11-20T19:48:21.415Z',
              updatedAt: '2020-05-04T17:17:01.227Z',
              filename: '4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg',
              filetype: 'image/jpeg',
              filesize: 42093736,
              url: '2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg',
              signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/11/commons.america.gov_ck2m08qbo0rot0720rvz8jwxg/4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg?AWSAccessKeyId=someaccesskeyid&Expires=1588616250&Signature=thesignature',
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
              __typename: 'ImageFile',
              title: '4_3_Serious_asdoij_czxiwa_cxicm38_cmauqo_zoczp_FB.jpg',
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
              url: null,
              signedUrl: 'https://the-signed-url.com',
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
              id: 'ck9jtuqhy29kakd92ka92kd92',
              createdAt: '2020-04-28T11:28:43.173Z',
              updatedAt: '2020-05-01T14:05:55.765Z',
              filename: 'test-file-FB.psd',
              filetype: 'image/vnd.adobe.photoshop',
              filesize: 509000,
              url: null,
              signedUrl: 'https://the-signed-url.com',
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
              url: null,
              signedUrl: 'https://the-signed-url.com',
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
              url: null,
              signedUrl: 'https://the-signed-url.com',
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

const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
  {
    ...mocks[1],
  },
];

const getStyleId = ( name, styles = [] ) => {
  const styleObj = styles.find( style => style.name === name );

  return styleObj?.id || '';
};

const getIsShell = filename => {
  const shellExtensions = [
    '.jpg', '.jpeg', '.png',
  ];
  const extension = getFileExt( filename );
  const isJpgOrPng = shellExtensions.includes( extension );
  const hasShellInName = filename.toLowerCase().includes( 'shell' );

  return isJpgOrPng && hasShellInName;
};

const getInitialFiles = ( files, type ) => {
  const initialSupportFiles = [];
  const initialGraphicFiles = [];

  if ( files ) {
    files.forEach( file => {
      const isClean = file.style === getStyleId( 'Clean', mocks[3].result.data.graphicStyles );
      const isCleanShell = isClean && getIsShell( file.name );
      const hasStyleAndSocial = getCount( file.style ) && getCount( file.social );

      if ( hasStyleAndSocial && !isCleanShell ) {
        initialGraphicFiles.push( file );
      } else {
        initialSupportFiles.push( file );
      }
    } );
  }

  return type === 'graphicFiles' ? initialGraphicFiles : initialSupportFiles;
};

const getSupportFiles = ( { data, type, projectId } ) => {
  const editableExtensions = [
    '.psd', '.ai', '.ae', '.eps',
  ];
  const editableFiles = [];
  const additionalFiles = [];

  const existingSupportFiles = data.graphicProject?.supportFiles || [];
  const existingGraphicFiles = data.graphicProject?.images || [];

  const shellFile = existingGraphicFiles.filter( img => getIsShell( img.filename ) );
  const existingFilesPlusShell = existingSupportFiles.concat( shellFile );

  const initialFiles = getInitialFiles( mocks[2].result.data.localGraphicProject.files, 'supportFiles' );
  const supportFiles = projectId ? existingFilesPlusShell : initialFiles;
  const sortedFiles = sortBy( supportFiles, file => {
    if ( projectId ) {
      return file.filename;
    }

    return file.name;
  } );

  if ( getCount( supportFiles ) ) {
    sortedFiles.forEach( file => {
      const _filename = projectId ? file.filename : file.name;
      const extension = getFileExt( _filename );

      const hasEditableExt = editableExtensions.includes( extension );
      const isShell = getIsShell( _filename );

      if ( hasEditableExt || isShell ) {
        editableFiles.push( file );
      } else {
        additionalFiles.push( file );
      }
    } );
  }

  return type === 'editable' ? editableFiles : additionalFiles;
};

const getGraphicFiles = ( { images, localFiles, projectId } ) => {
  const existingFiles = images || [];
  const initialFiles = getInitialFiles( localFiles, 'graphicFiles' );
  let files = [];

  if ( projectId ) {
    files = existingFiles.filter( img => !getIsShell( img.filename ) );
  } else {
    files = initialFiles;
  }

  return files;
};

const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';

  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};

export {
  errorMocks,
  mocks,
  props,
  getGraphicFiles,
  getSupportFiles,
  suppressActWarning,
};
