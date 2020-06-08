import { PACKAGE_QUERY, DELETE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';

export const AWS_URL = 'https://s3-bucket-url.s3.amazonaws.com';
export const AWS_SIGNED_URL_QUERY_STRING = '?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE';

export const props = {
  id: 'test-123',
};

const english = {
  __typename: 'Language',
  id: 'ck2lzfx710hkq07206thus6pt',
  languageCode: 'en',
  locale: 'en-us',
  textDirection: 'LTR',
  displayName: 'English',
  nativeName: 'English',
};

const tag1 = {
  __typename: 'Tag',
  id: 'ck2lzgu1i0rei07206gvy1ygg',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfzwr0iey0720hrigffxo',
      name: 'american culture',
      language: english,
    },
  ],
};

const tag2 = {
  __typename: 'Tag',
  id: 'ck2lzgu2s0rer07208jc6y6ww',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzg1900iui0720q28le4rs',
      name: 'leadership',
      language: english,
    },
  ],
};

const image = {
  __typename: 'ImageFile',
  createdAt: '2019-11-12T13:01:01.906Z',
  updatedAt: '2019-11-12T13:01:01.906Z',
  language: english,
  filetype: 'png',
  filesize: 35000,
  use: {
    __typename: 'ImageUse',
    id: 'ck2lzfx510hhj07205mal3e4l',
    name: 'Thumbnail/Cover Image',
  },
  alt: 'thumbnail of guidance document',
  dimensions: {
    __typename: 'Dimensions',
    id: 'da8dasd',
    height: 1200,
    width: 1200,
  },
};

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
      },
    ],
  },
];

const documentUses = [
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj5h10kq0720hr0nkfgz',
    name: 'Background Briefing',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj6010kz0720c358mbrt',
    name: 'Department Press Briefing',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj6w10l80720gzhwlr9s',
    name: 'Fact Sheet',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj7b10lg0720htdvmgru',
    name: 'Interview',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj7u10lo07207aa55qmz',
    name: 'Media Note',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj8810lx0720ruj5eylz',
    name: 'Notice to the Press',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj8n10m50720eu2ob3pq',
    name: 'On-the-record Briefing',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj8y10md0720vsuqxq87',
    name: 'Press Guidance',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj9b10ml0720245vk3uy',
    name: 'Remarks',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvj9v10mt0720hwq7013q',
    name: 'Speeches',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjaa10n20720fg5ayhn9',
    name: 'Statement',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjao10na0720ncwefnm6',
    name: 'Taken Questions',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjb210nj07205m16k3xx',
    name: 'Travel Alert',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjbf10nr0720o6zpopyt',
    name: 'Readout',
  },
  {
    __typename: 'DocumentUse',
    id: 'ck2wbvjbu10nz072060p67wk5',
    name: 'Travel Warning',
  },
];

const getDocumentUseObj = ( val, property = 'name' ) => documentUses.find( u => u[property] === val );
const documents = [
  {
    __typename: 'DocumentFile',
    id: '1asd',
    createdAt: '2019-11-12T13:07:49.364Z',
    updatedAt: '2019-11-12T13:08:28.830Z',
    publishedAt: '',
    language: english,
    title: 'Lesotho National Day',
    filename: 'Lesotho National Day.docx',
    filetype: 'Statement',
    filesize: 25000,
    status: 'DRAFT',
    excerpt: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
    content: {
      __typename: 'DocumentConversionFormat',
      id: 'ccc1',
      rawText: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
      html: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
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
        signedUrl: `${AWS_URL}/2019/11/${props.id}/lesotho_national_day.png${AWS_SIGNED_URL_QUERY_STRING}`,
      },
    ],
    use: getDocumentUseObj( 'Statement' ),
    bureaus,
    categories: [],
    tags: [tag1],
    countries: [
      {
        __typename: 'Country',
        id: 'ck6krp9723f3y0720dfzwzv9f',
        name: 'Bahrain',
        abbr: 'NEA',
        region: {
          __typename: 'Region',
          id: 'ck6krp96o3f3i07201zo5ai59',
          name: 'Bureau of Near Eastern Affairs',
          abbr: 'NEA',
        },
      },
    ],
  },
  {
    __typename: 'DocumentFile',
    id: '2sdf',
    createdAt: '2019-11-12T13:07:49.364Z',
    updatedAt: '2019-11-12T13:08:28.830Z',
    publishedAt: '',
    language: english,
    title: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event',
    filename: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event.docx',
    filetype: 'Media Note',
    filesize: 25000,
    status: 'DRAFT',
    excerpt: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
    content: {
      __typename: 'DocumentConversionFormat',
      id: 'ccc1',
      rawText: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
      html: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
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
        signedUrl: `${AWS_URL}/2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png${AWS_SIGNED_URL_QUERY_STRING}`,
      },
    ],
    use: getDocumentUseObj( 'Media Note' ),
    bureaus,
    categories: [],
    tags: [],
    countries: [
      {
        __typename: 'Country',
        id: 'ck6krp9773f420720i7aesohq',
        name: 'Benin',
        abbr: 'AF',
        region: {
          __typename: 'Region',
          id: 'ck6krp96g3f3c0720c1w09bx1',
          name: 'Bureau of African Affairs',
          abbr: 'AF',
        },
      },
      {
        __typename: 'Country',
        id: 'ck6krp97d3f470720osba7g4m',
        name: 'Botswana',
        abbr: 'AF',
        region: {
          __typename: 'Region',
          id: 'ck6krp96g3f3c0720c1w09bx1',
          name: 'Bureau of African Affairs',
          abbr: 'AF',
        },
      },
    ],
  },
  {
    __typename: 'DocumentFile',
    id: '3dxs',
    createdAt: '2019-11-12T13:07:49.364Z',
    updatedAt: '2019-11-12T13:08:28.830Z',
    publishedAt: '',
    language: english,
    title: 'Rewards for Justice: Reward Offer for Those Involved in the 2017 “Tongo Tongo” Ambush in Niger',
    filename: 'Rewards for Justice: Reward Offer for Those Involved in the 2017 “Tongo Tongo” Ambush in Niger.docx',
    filetype: 'Media Note',
    filesize: 25000,
    status: 'DRAFT',
    excerpt: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
    content: {
      __typename: 'DocumentConversionFormat',
      id: 'ccc1',
      rawText: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
      html: '<p>The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.</p>',
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
        signedUrl: `${AWS_URL}/2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.png${AWS_SIGNED_URL_QUERY_STRING}`,
      },
    ],
    use: getDocumentUseObj( 'Media Note' ),
    bureaus,
    categories: [],
    tags: [tag2],
    countries: [
      {
        __typename: 'Country',
        id: 'ck6krp9773f420720i7aesohq',
        name: 'Benin',
        abbr: 'AF',
        region: {
          __typename: 'Region',
          id: 'ck6krp96g3f3c0720c1w09bx1',
          name: 'Bureau of African Affairs',
          abbr: 'AF',
        },
      },
      {
        __typename: 'Country',
        id: 'ck6krp97d3f470720osba7g4m',
        name: 'Botswana',
        abbr: 'AF',
        region: {
          __typename: 'Region',
          id: 'ck6krp96g3f3c0720c1w09bx1',
          name: 'Bureau of African Affairs',
          abbr: 'AF',
        },
      },
    ],
  },
];

export const mocks = [
  {
    request: {
      query: PACKAGE_QUERY,
      variables: { id: props.id },
    },
    result: {
      data: {
        pkg: {
          __typename: 'Package',
          id: props.id,
          createdAt: '2019-11-12T13:07:49.364Z',
          updatedAt: '2019-11-12T13:08:28.830Z',
          publishedAt: '',
          type: 'DAILY_GUIDANCE',
          assetPath: '',
          author: {
            __typename: 'User',
            id: 'ck2m042xo0rnp0720nb4gxjix',
            firstName: 'First',
            lastName: 'Last',
          },
          team: {
            __typename: 'Team',
            id: 'ck2qgfbku0ubh0720iwhkvuyn',
            name: 'GPA Press Office',
          },
          title: 'Final Guidance mm-dd-yy',
          desc: '',
          status: 'DRAFT',
          visibility: 'INTERNAL',
          categories: [],
          tags: [
            {
              __typename: 'Tag',
              id: 'ck2lzgu1i0rei07206gvy1ygg',
              translations: [
                {
                  __typename: 'LanguageTranslation',
                  id: 'ck2lzfzwr0iey0720hrigffxo',
                  name: 'american culture',
                },
              ],
            },
            {
              __typename: 'Tag',
              id: 'ck2lzgu2s0rer07208jc6y6ww',
              translations: [
                {
                  __typename: 'LanguageTranslation',
                  id: 'ck2lzg1900iui0720q28le4rs',
                  name: 'leadership',
                },
              ],
            },
          ],
          documents,
        },
      },
    },
  },
  {
    request: {
      query: DELETE_PACKAGE_MUTATION,
      variables: { id: props.id },
    },
    result: {
      data: {
        deletePackage: {
          __typename: 'Package',
          id: props.id,
        },
      },
    },
  },
  {
    request: {
      query: PACKAGE_QUERY,
      variables: { id: 'new-pkg-id-xyz' },
    },
    result: {
      data: {
        pkg: {
          __typename: 'Package',
          id: 'new-package-id-xyz',
          createdAt: '2020-01-03T17:52:30.082Z',
          updatedAt: '2020-01-03T17:52:30.082Z',
          publishedAt: '',
          type: 'DAILY_GUIDANCE',
          assetPath: '',
          author: {
            __typename: 'User',
            id: 'ck2m042xo0rnp0720nb4gxjix',
            firstName: 'First',
            lastName: 'Last',
          },
          team: {
            __typename: 'Team',
            id: 'ck2qgfbku0ubh0720iwhkvuyn',
            name: 'GPA Press Office',
          },
          title: 'Final Guidance mm-dd-yy',
          desc: '',
          status: 'DRAFT',
          visibility: 'INTERNAL',
          categories: [],
          tags: [tag1, tag2],
          documents,
        },
      },
    },
  },
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
  { ...mocks[1] },
];

export const undefinedDataMocks = [
  {
    ...mocks[0],
    result: {
      data: undefined,
    },
  },
  { ...mocks[1] },
];

export const publishedMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        'package': {
          ...mocks[0].result.data.package,
          publishedAt: '2019-11-13T13:08:28.830Z',
        },
      },
    },
  },
  {
    request: {
      query: 'DELETE_PACKAGE_MUTATION',
      variables: { id: props.id },
    },
    result: {
      data: {
        deletePackage: {
          __typename: 'Package',
          id: props.id,
        },
      },
    },
  },
];

export const noDocumentsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        pkg: {
          ...mocks[0].result.data.pkg,
          documents: [],
        },
      },
    },
  },
  { ...mocks[1] },
];
