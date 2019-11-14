import testImage from './test-img-for-dev.png';

const AWS_URL = 'https://s3-bucket-url.s3.amazonaws.com';
const AWS_SIGNED_URL_QUERY_STRING = '?AWSAccessKeyId=SOMEAWSACCESSKEY&Expires=1572028336&Signature=SOMESIGNATURE';

const language = {
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
  language,
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
    id: 'ck2wbvj5h10kq0720hr0nkfgz',
    name: 'Background Briefing'
  },
  {
    id: 'ck2wbvj6010kz0720c358mbrt',
    name: 'Department Press Briefing'
  },
  {
    id: 'ck2wbvj6w10l80720gzhwlr9s',
    name: 'Fact Sheet'
  },
  {
    id: 'ck2wbvj7b10lg0720htdvmgru',
    name: 'Interview'
  },
  {
    id: 'ck2wbvj7u10lo07207aa55qmz',
    name: 'Media Note'
  },
  {
    id: 'ck2wbvj8810lx0720ruj5eylz',
    name: 'Notice to the Press'
  },
  {
    id: 'ck2wbvj8n10m50720eu2ob3pq',
    name: 'On-the-record Briefing'
  },
  {
    id: 'ck2wbvj8y10md0720vsuqxq87',
    name: 'Press Guidance'
  },
  {
    id: 'ck2wbvj9b10ml0720245vk3uy',
    name: 'Remarks'
  },
  {
    id: 'ck2wbvj9v10mt0720hwq7013q',
    name: 'Speeches'
  },
  {
    id: 'ck2wbvjaa10n20720fg5ayhn9',
    name: 'Statement'
  },
  {
    id: 'ck2wbvjao10na0720ncwefnm6',
    name: 'Taken Questions'
  },
  {
    id: 'ck2wbvjb210nj07205m16k3xx',
    name: 'Travel Alert'
  },
  {
    id: 'ck2wbvjbf10nr0720o6zpopyt',
    name: 'Readout'
  },
  {
    id: 'ck2wbvjbu10nz072060p67wk5',
    name: 'Travel Warning'
  }
];

const bureaus = [
  {
    __typename: 'Bureau',
    id: 'b999',
    name: 'Bureau of Global Public Affairs',
    abbr: 'GPA',
    offices: [
      {
        __typename: 'Office',
        id: 'o888',
        name: 'Press Office',
        abbr: 'PO',
        bureau: {
          __typename: 'Bureau',
          id: 'b999',
          name: 'Bureau of Global Public Affairs',
          abbr: 'GPA'
        }
      }
    ]
  }
];

const globalIssues = {
  id: 'ck2lzgu1e0rea0720a0drvwkp',
  translations: [
    {
      id: 'ck2lzfyja0hze072082syb27d',
      name: 'global issues',
      language
    },
    {
      id: 'ck2lzfyjs0hzl07207ejimjx7',
      name: 'Asuntos mundiales',
      language: {
        id: 'ck2lzfx7o0hl707205uteku77',
        languageCode: 'es',
        locale: 'es-es',
        textDirection: 'LTR',
        displayName: 'Spanish',
        nativeName: 'Español'
      }
    },
    {
      id: 'ck2lzfykd0hzs0720700s81yb',
      name: 'Questions mondiales',
      language: {
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

const pressJournalism = {
  id: 'ck2lzgu1e0red072066m25ldt',
  translations: [
    {
      id: 'ck2lzfz0d0i580720g3mg0xut',
      name: 'press & journalism',
      language
    },
    {
      id: 'ck2lzfz0y0i5f0720az8sehv4',
      name: 'Prensa y periodismo',
      language: {
        id: 'ck2lzfx7o0hl707205uteku77',
        languageCode: 'es',
        locale: 'es-es',
        textDirection: 'LTR',
        displayName: 'Spanish',
        nativeName: 'Español'
      }
    },
    {
      id: 'ck2lzfz1i0i5m0720wa9pemol',
      name: 'Presse et journalisme',
      language: {
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
  id: 'ck2lzgu1e0rec0720oq0g4liq',
  translations: [
    {
      id: 'ck2lzfyud0i3a0720hko7y2a9',
      name: 'human rights',
      language
    },
    {
      id: 'ck2lzfyuv0i3h0720twczq24b',
      name: 'derechos humanos',
      language: {
        id: 'ck2lzfx7o0hl707205uteku77',
        languageCode: 'es',
        locale: 'es-es',
        textDirection: 'LTR',
        displayName: 'Spanish',
        nativeName: 'Español'
      }
    },
    {
      id: 'ck2lzfyvb0i3o0720fiv0ozlm',
      name: 'Droits de l’homme',
      language: {
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

const tag1 = {
  id: 'ck38ks92kd',
  translations: [
    {
      id: 'ck38s20s9',
      name: 'tag 1',
      language
    }
  ]
};

const tag2 = {
  id: 'cksdfi218d',
  translations: [
    {
      id: 'ck38s81s9',
      name: 'tag 2',
      language
    }
  ]
};

const getDocumentUseObj = ( val, property = 'name' ) => (
  documentUses.find( u => u[property] === val )
);

/**
 * mock data for UI development
 * eventually use for unit testing
 */
export const props = { id: 'test-123' };

export const mocks = [
  {
    request: {
      query: 'PRESS_PACKAGE_QUERY',
      variables: { id: props.id }
    },
    result: {
      data: {
        package: {
          __typename: 'Package',
          id: props.id,
          createdAt: '2019-11-12T13:07:49.364Z',
          updatedAt: '2019-11-12T13:08:28.830Z',
          publishedAt: '',
          type: 'DAILY_GUIDANCE',
          title: 'Final Guidance mm-dd-yy',
          desc: '',
          visibility: 'INTERNAL',
          categories: [pressJournalism],
          tags: [tag1, tag2],
          documents: [
            {
              __typename: 'DocumentFile',
              id: '1',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'Lesotho National Day.docx',
              filetype: 'Statement',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/lesotho_national_day.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/lesotho_national_day.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th1',
                  filename: 'lesotho_national_day.png',
                  url: `2019/11/${props.id}/lesotho_national_day.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/lesotho_national_day.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Statement' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag1]
            },
            {
              __typename: 'DocumentFile',
              id: '2',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event.docx',
              filetype: 'Media Note',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th2',
                  filename: 'us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png',
                  url: `2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/us_pakistan_womens_council_advances_womens_economic_empowerment_at_houston_event.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Media Note' ),
              bureaus,
              categories: [globalIssues, humanRights],
              tags: []
            },
            {
              __typename: 'DocumentFile',
              id: '3',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'Rewards for Justice: Reward Offer for Those Involved in the 2017 “Tongo Tongo” Ambush in Niger.docx',
              filetype: 'Media Note',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th3',
                  filename: 'rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.png',
                  url: `2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/rewards_for_justice_reward_offer_for_those_involved_in_the_2017_tongo_tongo_ambush_in_niger.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Media Note' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag2]
            },
            {
              __typename: 'DocumentFile',
              id: '4',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'First Meeting of the U.S.-Canada Critical Minerals Working Group.docx',
              filetype: 'Media Note',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/first_meeting_of_the_us_canada_critical_minerals_working_group.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/first_meeting_of_the_us_canada_critical_minerals_working_group.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th4',
                  filename: 'first_meeting_of_the_us_canada_critical_minerals_working_group.png',
                  url: `2019/11/${props.id}/first_meeting_of_the_us_canada_critical_minerals_working_group.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/first_meeting_of_the_us_canada_critical_minerals_working_group.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Media Note' ),
              bureaus,
              categories: [],
              tags: [tag2]
            },
            {
              __typename: 'DocumentFile',
              id: '5',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'United States and India Launch Flexible Resources Initiative—Growth through Clean Energy.docx',
              filetype: 'Media Note',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/united_states_and_india_launch_flexible_resources_initiative_growth_through_clean_energy.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/united_states_and_india_launch_flexible_resources_initiative_growth_through_clean_energy.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th5',
                  filename: 'united_states_and_india_launch_flexible_resources_initiative_growth_through_clean_energy.png',
                  url: `2019/11/${props.id}/united_states_and_india_launch_flexible_resources_initiative_growth_through_clean_energy.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/united_states_and_india_launch_flexible_resources_initiative_growth_through_clean_energy.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Media Note' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag1, tag2]
            },
            {
              __typename: 'DocumentFile',
              id: '6',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'United States Announces $25 Million to Support Emergency Cash Transfer Program in Yemen.docx',
              filetype: 'Media Note',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/unites_states_announces_25_million_to_support_emergency_cash_transfer_program_in_yemen.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/united_states_announces_25_million_to_support_emergency_cash_transfer_program_in_yemen.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th6',
                  filename: 'united_states_announces_25_million_to_support_emergency_cash_transfer_program_in_yemen.png',
                  url: `2019/11/${props.id}/united_states_announces_25_million_to_support_emergency_cash_transfer_program_in_yemen.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/united_states_announces_25_million_to_support_emergency_cash_transfer_program_in_yemen.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Media Note' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag1]
            },
            {
              __typename: 'DocumentFile',
              id: '7',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'Ambassador Nathan A. Sales Travels to Kazakhstan to Discuss Counterterrorism and Repatriation.docx',
              filetype: 'Media Note',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/ambassador_nathan_a_sales_travels_to_kazakhstan_to_discuss_counterterrorism_and_repatriation.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/ambassador_nathan_a_sales_travels_to_kazakhstan_to_discuss_counterterrorism_and_repatriation.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th7',
                  filename: 'ambassador_nathan_a_sales_travels_to_kazakhstan_to_discuss_counterterrorism_and_repatriation.png',
                  url: `2019/11/${props.id}/ambassador_nathan_a_sales_travels_to_kazakhstan_to_discuss_counterterrorism_and_repatriation.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/ambassador_nathan_a_sales_travels_to_kazakhstan_to_discuss_counterterrorism_and_repatriation.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Media Note' ),
              bureaus,
              categories: [globalIssues],
              tags: []
            },
            {
              __typename: 'DocumentFile',
              id: '8',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'Secretary Pompeo Travels to Greece to Deepen Our Historic Alliance.docx',
              filetype: 'Fact Sheet',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/secretary_pomeo_travels_to_greece_to_deepen_our_historic_alliance.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/secretary_pomeo_travels_to_greece_to_deepen_our_historic_alliance.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th8',
                  filename: 'secretary_pomeo_travels_to_greece_to_deepen_our_historic_alliance.png',
                  url: `2019/11/${props.id}/secretary_pomeo_travels_to_greece_to_deepen_our_historic_alliance.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/secretary_pomeo_travels_to_greece_to_deepen_our_historic_alliance.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Fact Sheet' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag1]
            },
            {
              __typename: 'DocumentFile',
              id: '9',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'Strengthening Our Alliance with Montenegro.docx',
              filetype: 'Fact Sheet',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/strengthening_our_alliance_with_montenegro.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/strengthening_our_alliance_with_montenegro.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th9',
                  filename: 'strengthening_our_alliance_with_montenegro.png',
                  url: `2019/11/${props.id}/strengthening_our_alliance_with_montenegro.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/strengthening_our_alliance_with_montenegro.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Fact Sheet' ),
              bureaus,
              categories: [globalIssues],
              tags: []
            },
            {
              __typename: 'DocumentFile',
              id: '10',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'Reestablishment of U.S Embassy Mogadishu.docx',
              filetype: 'Press Guidance',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/reestablishment_of_us_embassy_mogadishu.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/reestablishment_of_us_embassy_mogadishu.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th10',
                  filename: 'reestablishment_of_us_embassy_mogadishu.png',
                  url: `2019/11/${props.id}/reestablishment_of_us_embassy_mogadishu.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/reestablishment_of_us_embassy_mogadishu.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Press Guidance' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag1, tag2]
            },
            {
              __typename: 'DocumentFile',
              id: '11',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'Iraq Protests.docx',
              filetype: 'Press Guidance',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/iraq_protests.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/iraq_protests.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th11',
                  filename: 'iraq_protests.png',
                  url: `2019/11/${props.id}/iraq_protests.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/iraq_protests.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Press Guidance' ),
              bureaus,
              categories: [globalIssues],
              tags: [tag2]
            },
            {
              __typename: 'DocumentFile',
              id: '12',
              createdAt: '2019-11-12T13:07:49.364Z',
              updatedAt: '2019-11-12T13:08:28.830Z',
              publishedAt: '',
              language,
              filename: 'Ecuador: National Demonstrations and State of Exception.docx',
              filetype: 'Press Guidance',
              filesize: 25000,
              text: 'The guidance text. The guidance text. The guidance text. The guidance text. The guidance text. The guidance text.',
              url: `2019/11/${props.id}/ecuador_national_demonstrations_and_state_of_exception.docx`,
              signedUrl: `${AWS_URL}/2019/11/${props.id}/ecuador_national_demonstrations_and_state_of_exception.docx${AWS_SIGNED_URL_QUERY_STRING}`,
              visibility: 'INTERNAL',
              image: [
                {
                  ...image,
                  id: 'th12',
                  filename: 'ecuador_national_demonstrations_and_state_of_exception.png',
                  url: `2019/11/${props.id}/ecuador_national_demonstrations_and_state_of_exception.png`,
                  signedUrl: testImage
                  // signedUrl: `${AWS_URL}/2019/11/${props.id}/ecuador_national_demonstrations_and_state_of_exception.png${AWS_SIGNED_URL_QUERY_STRING}`
                }
              ],
              use: getDocumentUseObj( 'Press Guidance' ),
              bureaus,
              categories: [globalIssues],
              tags: []
            }
          ]
        }
      }
    }
  }
];
