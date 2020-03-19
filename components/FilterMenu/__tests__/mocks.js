export const pkgDocState = {
  search: {
    currentPage: 1,
    endIndex: 2,
    endPage: 1,
    error: false,
    isFetching: false,
    pageSize: 12,
    pages: [
      1
    ],
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
              index: 'languages_20200225'
            }
          },
          {
            shard: 0,
            index: 'owners_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: '7RO59BSCQZu0H1ITi-4hfA',
              index: 'owners_20200225'
            }
          },
          {
            shard: 0,
            index: 'posts_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: 'iaIL7TCIS_KRo-x5IPIzQA',
              index: 'posts_20200225'
            }
          },
          {
            shard: 0,
            index: 'taxonomy_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: 'sisQy2WZSO-D5Gv7fL4zHA',
              index: 'taxonomy_20200225'
            }
          },
          {
            shard: 0,
            index: 'videos_20200225',
            node: 'Zmki1T_5SOq6rezGFoYWYw',
            reason: {
              type: 'query_shard_exception',
              reason: 'No mapping found for [published] in order to sort on',
              index_uuid: '-biq4uWtTwCg4zX5kvO_9g',
              index: 'videos_20200225'
            }
          }
        ]
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
                native_name: 'English'
              },
              filename: 'EAP Voluntary Press Guidance.docx',
              filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              title: 'EAP Voluntary Press Guidance',
              url: 'https://cdp-video-tst.s3.amazonaws.com/daily_guidance/2020/03/commons.america.gov_ck7uu4v7005g40720q6w0uw7g/EAP_Voluntary_Press_Guidance.docx',
              use: 'Press Guidance',
              tags: [],
              content: {
                rawText: 'the text',
                html: '<p>the text</p>'
              },
              bureaus: [
                {
                  id: 'ck5cvpjcw01ke0720l576an2h',
                  name: 'Bureau of Global Public Affairs',
                  abbr: 'GPA'
                }
              ],
              countries: [
                {
                  id: 'ck6krp9723f3x07209et0evkp',
                  name: 'Australia',
                  abbr: 'EAP'
                }
              ]
            },
            sort: [
              1584385437263
            ]
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
                  type: 'document'
                },
                {
                  id: 'ck7uu5fvh05hh07208x01labm',
                  type: 'document'
                }
              ]
            },
            sort: [
              1584385437263
            ]
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
                native_name: 'English'
              },
              filename: 'Anti-Government Protests in Colombia.docx',
              filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              title: 'Anti-Government Protests in Colombia',
              url: 'https://cdp-video-tst.s3.amazonaws.com/daily_guidance/2020/03/commons.america.gov_ck7uu4v7005g40720q6w0uw7g/Anti-Government_Protests_in_Colombia.docx',
              use: 'Background Briefing',
              tags: [],
              content: {
                rawText: 'the text',
                html: '<p>the text</p>'
              },
              bureaus: [
                {
                  id: 'ck5cvpjcu01k80720d2eouy43',
                  name: 'Bureau of African Affairs',
                  abbr: 'AF'
                }
              ],
              countries: [
                {
                  id: 'ck6krp97y3f5f07206fm9bso2',
                  name: 'Colombia',
                  abbr: 'WHA'
                }
              ]
            },
            sort: [
              1584385437263
            ]
          }
        ]
      }
    },
    sort: 'published',
    language: 'en-us',
    startIndex: 0,
    startPage: 1,
    total: 3,
    totalPages: 1
  },
  filter: {
    categories: [],
    countries: [
      'Australia'
    ],
    sources: [],
    postTypes: [
      'package',
      'document'
    ],
    dateFrom: '2020-03-18T17:23:31.152Z',
    dateTo: '2020-03-18T17:23:31.152Z',
    date: 'recent'
  },
  global: {
    languages: {
      error: false,
      list: [
        {
          key: 'en-us',
          display_name: 'English',
          count: 3
        }
      ],
      loading: false
    },
    categories: {
      error: false,
      list: [],
      loading: false
    },
    countries: {
      error: false,
      list: [
        {
          count: 1,
          display_name: 'Australia',
          key: 'Australia'
        },
        {
          count: 1,
          display_name: 'Colombia',
          key: 'Colombia'
        }
      ],
      loading: false
    },
    postTypes: {
      error: false,
      list: [
        {
          key: 'document',
          display_name: 'Document',
          count: 2
        },
        {
          key: 'package',
          display_name: 'Guidance Packages',
          count: 1
        }
      ],
      loading: false
    },
    sources: {
      error: false,
      list: [
        {
          key: 'GPA Press Office',
          display_name: 'GPA Press Office',
          count: 3
        }
      ],
      loading: false
    },
    dates: {
      list: [
        {
          key: 'recent',
          display_name: 'Any Time'
        },
        {
          key: 'now-1d',
          display_name: 'Past 24 Hours'
        },
        {
          key: 'now-1w',
          display_name: 'Past Week'
        },
        {
          key: 'now-1M',
          display_name: 'Past Month'
        },
        {
          key: 'now-1y',
          display_name: 'Past Year'
        }
      ]
    }
  }
};

export const nonPkgState = {
  ...pkgDocState,
  filter: {
    ...pkgDocState.filter,
    countries: [],
    postTypes: ['video'],
    categories: ['test-category-1']
  },
  global: {
    ...pkgDocState.global,
    countries: {
      error: false,
      list: [],
      loading: false
    },
    categories: {
      error: false,
      list: [
        {
          count: 1,
          display_name: 'test-category-1',
          key: 'test-category-1'
        },
        {
          count: 1,
          display_name: 'test-category-2',
          key: 'test-category-2'
        }
      ],
      loading: false
    },
    sources: {
      error: false,
      list: [
        {
          key: 'GPA Video',
          display_name: 'GPA Video',
          count: 3
        }
      ],
      loading: false
    },
    postTypes: {
      error: false,
      list: [
        {
          key: 'video',
          display_name: 'Video',
          count: 2
        }
      ],
      loading: false
    }
  }
};
