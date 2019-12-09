import { PACKAGE_FILES_QUERY } from 'lib/graphql/queries/package';

export const AWS_URL = 'https://s3-bucket-url.s3.amazonaws.com';
export const AWS_SIGNED_URL_QUERY_STRING = '?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE';

const english = {
  __typename: 'Language',
  id: 'ck2lzfx710hkq07206thus6pt',
  languageCode: 'en',
  locale: 'en-us',
  textDirection: 'LTR',
  displayName: 'English',
  nativeName: 'English'
};

const image = {
  __typename: 'ImageFile',
  createdAt: '2019-11-12T13:01:01.906Z',
  updatedAt: '2019-11-12T13:01:01.906Z',
  language: english,
  dimensions: {
    __typename: 'Dimensions',
    id: 'd21',
    width: 224,
    height: 290
  },
  longdesc: 'the longdesc',
  caption: 'the image caption',
  filetype: 'png',
  filesize: 35000,
  visibility: 'PUBLIC',
  use: {
    __typename: 'ImageUse',
    id: 'ck2lzfx510hhj07205mal3e4l',
    name: 'Thumbnail/Cover Image'
  },
  md5: 'gggg7777',
  alt: 'thumbnail of guidance document',
};

const documentUses = [
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj5h10kq0720hr0nkfgz',
    name: 'Background Briefing'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj6010kz0720c358mbrt',
    name: 'Department Press Briefing'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj6w10l80720gzhwlr9s',
    name: 'Fact Sheet'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj7b10lg0720htdvmgru',
    name: 'Interview'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj7u10lo07207aa55qmz',
    name: 'Media Note'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj8810lx0720ruj5eylz',
    name: 'Notice to the Press'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj8n10m50720eu2ob3pq',
    name: 'On-the-record Briefing'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj8y10md0720vsuqxq87',
    name: 'Press Guidance'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj9b10ml0720245vk3uy',
    name: 'Remarks'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj9v10mt0720hwq7013q',
    name: 'Speeches'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjaa10n20720fg5ayhn9',
    name: 'Statement'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjao10na0720ncwefnm6',
    name: 'Taken Questions'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjb210nj07205m16k3xx',
    name: 'Travel Alert'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjbf10nr0720o6zpopyt',
    name: 'Readout'
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjbu10nz072060p67wk5',
    name: 'Travel Warning'
  }
];

const bureaus = [
  {
    __typename: 'Bureau',
    id: 'sdfq',
    name: 'Bureau of Global Public Affairs',
    abbr: 'GPA',
    offices: [
      {
        __typename: 'Office',
        id: 'kglf',
        name: 'Press Office',
        abbr: 'PO',
        bureau: {
          __typename: 'Bureau',
          id: 'sdfq',
          name: 'Bureau of Global Public Affairs',
          abbr: 'GPA'
        }
      }
    ]
  }
];

const globalIssues = {
  __typename: 'Category',
  id: 'ck2lzgu1e0rea0720a0drvwkp',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfyja0hze072082syb27d',
      name: 'global issues',
      language: english
    },
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfyjs0hzl07207ejimjx7',
      name: 'Asuntos mundiales',
      language: {
        __typename: 'Language',
        id: 'ck2lzfx7o0hl707205uteku77',
        languageCode: 'es',
        locale: 'es-es',
        textDirection: 'LTR',
        displayName: 'Spanish',
        nativeName: 'Español'
      }
    },
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfykd0hzs0720700s81yb',
      name: 'Questions mondiales',
      language: {
        __typename: 'Language',
        id: 'ck2lzfx710hkp07206oo0icbv',
        languageCode: 'fr',
        locale: 'fr-fr',
        textDirection: 'LTR',
        displayName: 'French',
        nativeName: 'Français'
      }
    }
  ]
};

const humanRights = {
  __typename: 'Category',
  id: 'ck2lzgu1e0rec0720oq0g4liq',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfyud0i3a0720hko7y2a9',
      name: 'human rights',
      language: english
    },
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfyuv0i3h0720twczq24b',
      name: 'derechos humanos',
      language: {
        __typename: 'Language',
        id: 'ck2lzfx7o0hl707205uteku77',
        languageCode: 'es',
        locale: 'es-es',
        textDirection: 'LTR',
        displayName: 'Spanish',
        nativeName: 'Español'
      }
    },
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfyvb0i3o0720fiv0ozlm',
      name: 'Droits de l’homme',
      language: {
        __typename: 'Language',
        id: 'ck2lzfx710hkp07206oo0icbv',
        languageCode: 'fr',
        locale: 'fr-fr',
        textDirection: 'LTR',
        displayName: 'French',
        nativeName: 'Français'
      }
    }
  ]
};

export const tag1 = {
  __typename: 'Tag',
  id: 'ck2lzgu1i0rei07206gvy1ygg',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfzwr0iey0720hrigffxo',
      name: 'american culture',
      language: english
    }
  ]
};

export const tag2 = {
  __typename: 'Tag',
  id: 'ck2lzgu2s0rer07208jc6y6ww',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzg1900iui0720q28le4rs',
      name: 'leadership',
      language: english
    }
  ]
};

const getDocumentUseObj = ( val, property = 'name' ) => (
  documentUses.find( u => u[property] === val )
);

export const props = { id: 'test-123' };

export const mocks = [
  {
    request: {
      query: PACKAGE_FILES_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        pkg: {
          __typename: 'Package',
          id: props.id,
          title: 'Guidance Package mm-dd-yy',
          type: 'DAILY_GUIDANCE',
          documents: [
            {
              __typename: 'DocumentFile',
              id: '1asd',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language: english,
              filename: 'Lesotho National Day.docx',
              filetype: 'Statement',
              filesize: 25000,
              status: 'DRAFT',
              content: {
                __typename: 'DocumentConversionFormat',
                id: 'ccc1',
                rawText: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
                html: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
                markdown: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.'
              },
              url: `2019/11/${props.id}/lesotho_national_day.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/lesotho_national_day.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th1',
                  filename: 'lesotho_national_day.png',
                  url: `2019/11/${props.id}/lesotho_national_day.png`,
                  signedUrl: `${AWS_URL}/2019/11/${props.id}/lesotho_national_day.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Statement' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag1]
            },
            {
              __typename: 'DocumentFile',
              id: '2sdf',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language: english,
              filename: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event.docx',
              filetype: 'Media Note',
              filesize: 25000,
              status: 'DRAFT',
              content: {
                __typename: 'DocumentConversionFormat',
                id: 'ccc1',
                rawText: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
                html: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
                markdown: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.'
              },
              url: `2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th2',
                  filename: 'us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png',
                  url: `2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png`,
                  signedUrl: `${AWS_URL}/2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Media Note' ),
              bureaus,
              categories: [globalIssues, humanRights],
              tags: []
            },
            {
              __typename: 'DocumentFile',
              id: '3dxs',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language: english,
              filename: 'Rewards for Justice: Reward Offer for Those Involved in the 2017 “Tongo Tongo” Ambush in Niger.docx',
              filetype: 'Media Note',
              filesize: 25000,
              status: 'DRAFT',
              content: {
                __typename: 'DocumentConversionFormat',
                id: 'ccc1',
                rawText: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
                html: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
                markdown: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.'
              },
              url: `2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th3',
                  filename: 'rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.png',
                  url: `2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.png`,
                  signedUrl: `${AWS_URL}/2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Media Note' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag2]
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
