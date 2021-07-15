export const mocks = {
  search: {
    currentPage: 1,
    endIndex: 1,
    endPage: 1,
    error: false,
    isFetching: false,
    pageSize: 12,
    pages: [1],
    response: {
      took: 102,
      timed_out: false,
      _shards: {
        total: 45,
        successful: 45,
        skipped: 0,
        failed: 0,
      },
      hits: {
        total: {
          value: 2,
          relation: 'eq',
        },
        max_score: 17.204853,
        hits: [
          {
            _index: 'graphics_20200624',
            _type: '_doc',
            _id: 'dDoFsngB3NQyV_fD5EZV',
            _score: 17.204853,
            _source: {
              id: 'ckn90jtv10x880720yn3lk378',
              site: 'commons.america.gov',
              title: 'ddd',
              type: 'graphic',
              published: '2021-04-08T15:07:12.553Z',
              modified: '2021-04-08T15:07:12.553Z',
              copyright: 'COPYRIGHT',
              visibility: 'PUBLIC',
              owner: 'GPA Design & Editorial',
              supportFiles: [],
              images: [
                {
                  title: 'Mexico City 2.jpg',
                  visibility: 'PUBLIC',
                  filename: 'Mexico City 2.jpg',
                  filetype: 'image/jpeg',
                  filesize: 1030591,
                  height: 0,
                  width: 0,
                  alt: '',
                  url: 'https://staticcdpdev.s3.amazonaws.com/social_media/2021/04/commons.america.gov_ckn90jtv10x880720yn3lk378/Mexico_City_2.jpg',
                  language: {
                    language_code: 'en',
                    locale: 'en-us',
                    text_direction: 'ltr',
                    display_name: 'English',
                    native_name: 'English',
                  },
                  style: 'Quote',
                  social: ['WhatsApp'],
                },
              ],
              categories: [
                {
                  id: 'eqO6fXABg9RjisyQvmSr',
                  name: 'health',
                },
              ],
              tags: [],
              descPublic: {
                content: '',
                visibility: 'PUBLIC',
              },
              descInternal: {
                content: '',
                visibility: 'INTERNAL',
              },
            },
          },
          {
            _index: 'videos_20200225',
            _type: '_doc',
            _id: '8l5LW3gBW8ACTXPZZzxO',
            _score: 10.589139,
            _source: {
              post_id: 'ckeil4ftm02fi0720cxayp43z',
              site: 'commons.america.gov',
              type: 'video',
              published: '2021-03-25T14:27:31.643Z',
              modified: '2021-03-25T14:27:31.643Z',
              visibility: 'INTERNAL',
              supportFiles: [
                {
                  visibility: 'PUBLIC',
                  srcUrl: 'https://staticcdpdev.s3.amazonaws.com/2020/08/commons.america.gov_ckeil4ftm02fi0720cxayp43z/Mexico_City_1.srt',
                  supportFileType: 'srt',
                  language: {
                    language_code: 'en',
                    text_direction: 'ltr',
                    locale: 'en-us',
                    display_name: 'English',
                    native_name: 'English',
                  },
                },
              ],
              unit: [
                {
                  thumbnail: 'https://staticcdpdev.s3.amazonaws.com/2020/08/commons.america.gov_ckeil4ftm02fi0720cxayp43z/Mexico_City_2.jpg',
                  transcript: {
                    visibility: 'PUBLIC',
                    srcUrl: '',
                    text: '',
                  },
                  srt: {
                    visibility: 'PUBLIC',
                    srcUrl: '',
                  },
                  language: {
                    language_code: 'en',
                    text_direction: 'ltr',
                    locale: 'en-us',
                    display_name: 'English',
                    native_name: 'English',
                  },
                  categories: [
                    {
                      name: 'geography',
                      id: 'bqO6fXABg9RjisyQvWTf',
                    },
                    {
                      name: 'global issues',
                      id: 'c6O6fXABg9RjisyQvmQR',
                    },
                  ],
                  source: [
                    {
                      streamUrl: [
                        {
                          uid: '453367676',
                          site: 'vimeo',
                          link: 'https://vimeo.com/453367676',
                          url: 'https://player.vimeo.com/video/453367676',
                        },
                      ],
                      duration: '14.889875',
                      filetype: 'video/mp4',
                      burnedInCaptions: 'false',
                      visibility: 'PUBLIC',
                      size: {
                        width: 1920,
                        bitrate: 8503602,
                        filesize: 15829673,
                        height: 1080,
                      },
                      stream: {
                        uid: '453367676',
                        site: 'vimeo',
                        link: 'https://vimeo.com/453367676',
                        url: 'https://player.vimeo.com/video/453367676',
                      },
                      use: 'Full Video',
                      video_quality: 'BROADCAST',
                      downloadUrl: 'https://staticcdpdev.s3.amazonaws.com/2020/08/commons.america.gov_ckeil4ftm02fi0720cxayp43z/Mexico_City_6.mp4',
                    },
                  ],
                  title: 'just a test ddd',
                  desc: 'test',
                  tags: [
                    {
                      name: 'american culture',
                      id: 'DqO6fXABg9RjisyQuGTk',
                    },
                    {
                      name: 'agriculture',
                      id: 'QKO6fXABg9RjisyQu2SS',
                    },
                  ],
                },
                {
                  thumbnail: 'https://staticcdpdev.s3.amazonaws.com/2020/08/commons.america.gov_ckeil4ftm02fi0720cxayp43z/Mexico_City_2.jpg',
                  transcript: {
                    visibility: 'PUBLIC',
                    srcUrl: '',
                    text: '',
                  },
                  srt: {
                    visibility: 'PUBLIC',
                    srcUrl: '',
                  },
                  language: {
                    language_code: 'ar',
                    text_direction: 'rtl',
                    locale: 'ar',
                    display_name: 'Arabic',
                    native_name: 'العربية',
                  },
                  categories: [
                    {
                      name: 'جغرافية',
                      id: 'bqO6fXABg9RjisyQvWTf',
                    },
                    {
                      name: 'قضايا عالمية',
                      id: 'c6O6fXABg9RjisyQvmQR',
                    },
                  ],
                  source: [
                    {
                      streamUrl: [
                        {
                          uid: '453410880',
                          site: 'vimeo',
                          link: 'https://vimeo.com/453410880',
                          url: 'https://player.vimeo.com/video/453410880',
                        },
                      ],
                      duration: '14.889875',
                      filetype: 'video/mp4',
                      burnedInCaptions: 'true',
                      visibility: 'PUBLIC',
                      size: {
                        width: 1920,
                        bitrate: 8503602,
                        filesize: 15829673,
                        height: 1080,
                      },
                      stream: {
                        uid: '453410880',
                        site: 'vimeo',
                        link: 'https://vimeo.com/453410880',
                        url: 'https://player.vimeo.com/video/453410880',
                      },
                      use: 'Web Chat',
                      video_quality: 'WEB',
                      downloadUrl: 'https://staticcdpdev.s3.amazonaws.com/2020/08/commons.america.gov_ckeil4ftm02fi0720cxayp43z/Mexico_City_1.mp4',
                    },
                  ],
                  title: 'just a test',
                  desc: '',
                  tags: [],
                },
              ],
              owner: 'GPA Video',
              author: 'Edwin Mah',
              thumbnail: {
                name: 'Mexico City 2.jpg',
                alt: '',
                caption: '',
                longdesc: '',
                visibility: 'PUBLIC',
                sizes: {
                  small: null,
                  medium: null,
                  large: null,
                  full: {
                    url: 'https://staticcdpdev.s3.amazonaws.com/2020/08/commons.america.gov_ckeil4ftm02fi0720cxayp43z/Mexico_City_2.jpg',
                    width: 1920,
                    height: 1080,
                    orientation: 'landscape',
                  },
                },
              },
              categories: [],
            },
          },
        ],
      },
    },
    sort: 'relevance',
    term: 'ddd',
    language: 'en-us',
    currentTerm: 'ddd',
    startIndex: 0,
    startPage: 1,
    total: 2,
    totalPages: 1,
  },
};
