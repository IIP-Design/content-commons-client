import {
  COUNTRIES_REGIONS_QUERY,
  DOCUMENT_USE_QUERY,
  BUREAUS_OFFICES_QUERY,
} from 'lib/graphql/queries/document';

export const countriesQueryMocks = [
  {
    request: {
      query: COUNTRIES_REGIONS_QUERY,
    },
    result: {
      data: {
        countries: [
          {
            __typename: 'Country',
            id: 'ck6krp96x3f3m0720yet8wkch',
            name: 'Antigua and Barbuda',
            abbr: 'WHA',
            region: {
              __typename: 'Region',
              id: 'ck6krp96o3f3k0720aoufd395',
              name: 'Bureau of Western Hemisphere Affairs',
              abbr: 'WHA',
            },
          },
          {
            __typename: 'Country',
            id: 'ck6krp96x3f3n0720q1289gee',
            name: 'Angola',
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
            id: 'ck6krp96y3f3o0720mg6m44hb',
            name: 'Algeria',
            abbr: 'NEA',
            region: {
              __typename: 'Region',
              id: 'ck6krp96o3f3i07201zo5ai59',
              name: 'Bureau of Near Eastern Affairs',
              abbr: 'NEA',
            },
          },
          {
            __typename: 'Country',
            id: 'ck6krp96y3f3p0720ncj81nes',
            name: 'Albania',
            abbr: 'EUR',
            region: {
              __typename: 'Region',
              id: 'ck6krp96o3f3h07201q3rj4n7',
              name: 'Bureau of European and Eurasian Affairs',
              abbr: 'EUR',
            },
          },
        ],
      },
    },
  },
];

export const documentUsesQueryMock = [
  {
    request: {
      query: DOCUMENT_USE_QUERY,
    },
    result: {
      data: {
        documentUses: [
          {
            id: 'ck2xf4dtd00ew0735yz37vkxm',
            name: 'Background Briefing',
          },
          {
            id: 'ck2xf4dtv00f30735hep3rysr',
            name: 'Department Press Briefing',
          },
          {
            id: 'ck2xf4dum00fa0735gzc1glw0',
            name: 'Fact Sheet',
          },
          {
            id: 'ck2xf4dvp00fj07357dhj48zu',
            name: 'Interview',
          },
        ],
      },
    },
  },
];

export const bureausOfficesQueryMock = [
  {
    request: {
      query: BUREAUS_OFFICES_QUERY,
    },
    result: {
      data: {
        bureaus: [
          {
            id: 'ck52kids1093m0835latg8zzg',
            name: 'Bureau of Administration',
          },
          {
            id: 'ck52kids8093p0835atpqri31',
            name: 'Bureau of African Affairs',
          },
          {
            id: 'ck52kids8093q08354wi55vnx',
            name: 'Bureau of Budget and Planning',
          },
          {
            id: 'ck52kids8093r0835xx5w8jwt',
            name: 'Bureau of Consular Affairs',
          },
        ],
      },
    },
  },
];

export const noCategories = {
  search: {
    currentPage: 1,
    endIndex: 2,
    endPage: 1,
    error: false,
    isFetching: false,
    pageSize: 12,
    pages: [1],
    response: {
      took: 35,
      timed_out: false,
      _shards: {
        total: 35,
        successful: 10,
        skipped: 0,
        failed: 25,
        failures: [
          {
            shard: 0,
            index: 'languages_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: 'tYZ4l-T_S-uyGbTjZFMFbA',
              index: 'languages_20200225',
            },
          },
          {
            shard: 0,
            index: 'owners_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: '7RO59BSCQZu0H1ITi-4hfA',
              index: 'owners_20200225',
            },
          },
          {
            shard: 0,
            index: 'posts_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: 'iaIL7TCIS_KRo-x5IPIzQA',
              index: 'posts_20200225',
            },
          },
          {
            shard: 0,
            index: 'taxonomy_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: 'sisQy2WZSO-D5Gv7fL4zHA',
              index: 'taxonomy_20200225',
            },
          },
          {
            shard: 0,
            index: 'videos_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: '-biq4uWtTwCg4zX5kvO_9g',
              index: 'videos_20200225',
            },
          },
        ],
      },
      hits: {
        total: 3,
        max_score: null,
        hits: [
          {
            _index: 'documents_20200225',
            _type: 'document',
            _id: 'rN275HABgFNJoTSTL0hX',
            _score: null,
            _source: {
              id: 'ck7uu5fvh05hh07208x01labm',
              site: 'localhost',
              type: 'document',
              published: '2020-03-16T19:03:57.263Z',
              modified: '2020-03-16T19:03:57.263Z',
              visibility: 'INTERNAL',
              owner: 'GPA Press Office',
              language: {
                language_code: 'en',
                locale: 'en-us',
                text_direction: 'ltr',
                display_name: 'English',
                native_name: 'English',
              },
              filename: 'EAP Voluntary Press Guidance.docx',
              filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              title: 'EAP Voluntary Press Guidance',
              url: 'https://cdp-video-tst.s3.amazonaws.com/daily_guidance/2020/03/commons.america.gov_ck7uu4v7005g40720q6w0uw7g/EAP_Voluntary_Press_Guidance.docx',
              use: 'Press Guidance',
              tags: [],
              content: {
                rawText: 'the text',
                html: '<p>the text</p>',
              },
              bureaus: [
                {
                  id: 'ck5cvpjcw01ke0720l576an2h',
                  name: 'Bureau of Global Public Affairs',
                  abbr: 'GPA',
                },
              ],
              countries: [
                {
                  id: 'ck6krp9723f3x07209et0evkp',
                  name: 'Australia',
                  abbr: 'EAP',
                },
              ],
            },
            sort: [1584385437263],
          },
          {
            _index: 'packages_20200225',
            _type: 'package',
            _id: 'rd275HABgFNJoTSTMEiK',
            _score: null,
            _source: {
              id: 'ck7uu4v7005g40720q6w0uw7g',
              site: 'localhost',
              title: 'Guidance Package 03-16-20',
              desc: '',
              type: 'package',
              published: '2020-03-16T19:03:57.263Z',
              modified: '2020-03-16T19:03:57.263Z',
              visibility: 'INTERNAL',
              owner: 'GPA Press Office',
              items: [
                {
                  id: 'ck7uu5fvh05hg0720xj2fzl60',
                  type: 'document',
                },
                {
                  id: 'ck7uu5fvh05hh07208x01labm',
                  type: 'document',
                },
              ],
            },
            sort: [1584385437263],
          },
          {
            _index: 'documents_20200225',
            _type: 'document',
            _id: 'q9275HABgFNJoTSTL0hY',
            _score: null,
            _source: {
              id: 'ck7uu5fvh05hg0720xj2fzl60',
              site: 'localhost',
              type: 'document',
              published: '2020-03-16T19:03:57.263Z',
              modified: '2020-03-16T19:03:57.263Z',
              visibility: 'INTERNAL',
              owner: 'GPA Press Office',
              language: {
                language_code: 'en',
                locale: 'en-us',
                text_direction: 'ltr',
                display_name: 'English',
                native_name: 'English',
              },
              filename: 'Anti-Government Protests in Colombia.docx',
              filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              title: 'Anti-Government Protests in Colombia',
              url: 'https://cdp-video-tst.s3.amazonaws.com/daily_guidance/2020/03/commons.america.gov_ck7uu4v7005g40720q6w0uw7g/Anti-Government_Protests_in_Colombia.docx',
              use: 'Background Briefing',
              tags: [],
              content: {
                rawText: 'the text',
                html: '<p>the text</p>',
              },
              bureaus: [
                {
                  id: 'ck5cvpjcu01k80720d2eouy43',
                  name: 'Bureau of African Affairs',
                  abbr: 'AF',
                },
              ],
              countries: [
                {
                  id: 'ck6krp97y3f5f07206fm9bso2',
                  name: 'Colombia',
                  abbr: 'WHA',
                },
              ],
            },
            sort: [1584385437263],
          },
        ],
      },
    },
    sort: 'published',
    language: 'en-us',
    startIndex: 0,
    startPage: 1,
    total: 3,
    totalPages: 1,
  },
  filter: {
    categories: [],
    countries: ['Australia'],
    documentUses: ['Background Briefing', 'Department Press Briefing'],
    bureausOffices: ['Bureau of Administration', 'Bureau of African Affairs'],
    sources: [],
    postTypes: [
      'package',
      'document',
    ],
    dateFrom: '2020-03-18T17:23:31.152Z',
    dateTo: '2020-03-18T17:23:31.152Z',
    date: 'recent',
  },
  global: {
    languages: {
      error: false,
      list: [
        {
          key: 'en-us',
          display_name: 'English',
          count: 3,
        },
      ],
      loading: false,
    },
    categories: {
      error: false,
      list: [],
      loading: false,
    },
    countries: {
      error: false,
      list: [
        {
          count: 1,
          display_name: 'Australia',
          key: 'Australia',
        },
        {
          count: 1,
          display_name: 'Colombia',
          key: 'Colombia',
        },
      ],
      loading: false,
    },
    documentUses: {
      error: false,
      list: [
        {
          display_name: 'Background Briefing',
          key: 'Background Briefing',
          submenu: 'document',
        },
        {
          display_name: 'Department Press Briefing',
          key: 'Department Press Briefing',
          submenu: 'document',
        },
        {
          display_name: 'Fact Sheet',
          key: 'Fact Sheet',
          submenu: 'document',
        },
        {
          display_name: 'Interview',
          key: 'Interview',
          submenu: 'document',
        },
      ],
      loading: false,
    },
    bureausOffices: {
      error: false,
      list: [
        {
          display_name: 'Bureau of Administration',
          key: 'Bureau of Administration',
          submenu: 'document',
        },
        {
          display_name: 'Bureau of African Affairs',
          key: 'Bureau of African Affairs',
          submenu: 'document',
        },
        {
          display_name: 'Bureau of Budget and Planning',
          key: 'Bureau of Budget and Planning',
          submenu: 'document',
        },
        {
          display_name: 'Bureau of Consular Affairs',
          key: 'Bureau of Consular Affairs',
          submenu: 'document',
        },
      ],
      loading: false,
    },
    postTypes: {
      error: false,
      list: [
        {
          key: 'document',
          display_name: 'Document',
          count: 2,
        },
        {
          key: 'package',
          display_name: 'Guidance Packages',
          count: 1,
        },
      ],
      loading: false,
    },
    sources: {
      error: false,
      list: [
        {
          key: 'GPA Press Office',
          display_name: 'GPA Press Office',
          count: 3,
        },
      ],
      loading: false,
    },
    dates: {
      list: [
        {
          key: 'recent',
          display_name: 'Any Time',
        },
        {
          key: 'now-1d',
          display_name: 'Past 24 Hours',
        },
        {
          key: 'now-1w',
          display_name: 'Past Week',
        },
        {
          key: 'now-1M',
          display_name: 'Past Month',
        },
        {
          key: 'now-1y',
          display_name: 'Past Year',
        },
      ],
    },
  },
};

export const noDocumentPostType = {
  ...noCategories,
  global: {
    ...noCategories.global,
    postTypes: {
      error: false,
      list: [
        {
          key: 'video',
          display_name: 'Video',
          count: 2,
        },
      ],
      loading: false,
    },
    categories: {
      error: false,
      list: [
        {
          count: 1,
          display_name: 'test-category-1',
          key: 'test-category-1',
        },
        {
          count: 1,
          display_name: 'test-category-2',
          key: 'test-category-2',
        },
      ],
      loading: false,
    },
  },
};

export const documentTypePlusCategories = {
  ...noCategories,
  global: {
    ...noCategories.global,
    postTypes: {
      error: false,
      list: [
        {
          key: 'video',
          display_name: 'Video',
          count: 2,
        },
        {
          key: 'document',
          display_name: 'Document',
          count: 2,
        },
        {
          key: 'package',
          display_name: 'Guidance Packages',
          count: 1,
        },
      ],
      loading: false,
    },
    categories: {
      error: false,
      list: [
        {
          count: 1,
          display_name: 'test-category-1',
          key: 'test-category-1',
        },
        {
          count: 1,
          display_name: 'test-category-2',
          key: 'test-category-2',
        },
      ],
      loading: false,
    },
  },
};
