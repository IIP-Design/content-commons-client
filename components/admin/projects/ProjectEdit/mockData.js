const categoryData = [
  {
    value: 'about-america',
    text: 'About America'
  },
  {
    value: 'arts-and-culture',
    text: 'Arts & Culture'
  },
  {
    value: 'democracy-and-civil-society',
    text: 'Democracy & Civil Society'
  },
  {
    value: 'economic-issues',
    text: 'Economic Issues'
  },
  {
    value: 'education',
    text: 'Education'
  },
  {
    value: 'environment',
    text: 'Environment'
  },
  {
    value: 'geography',
    text: 'Geography'
  },
  {
    value: 'global-issues',
    text: 'Global Issues'
  },
  {
    value: 'good-governance',
    text: 'Good Governance'
  },
  {
    value: 'health',
    text: 'Health'
  },
  {
    value: 'human-rights',
    text: 'Human Rights'
  },
  {
    value: 'press-and-journalism',
    text: 'Press & Journalism'
  },
  {
    value: 'religion-and-values',
    text: 'Religion & Values'
  },
  {
    value: 'science-and-technology',
    text: 'Science & Technology'
  },
  {
    value: 'sports',
    text: 'Sports'
  }
];

const languages = [
  { value: 'arabic', text: 'Arabic' },
  { value: 'chinese', text: 'Chinese' },
  { value: 'english', text: 'English' },
  { value: 'french', text: 'French' },
  { value: 'portuguese', text: 'Portuguese' },
  { value: 'russian', text: 'Russian' },
  { value: 'spanish', text: 'Spanish' }
];

const privacyOptions = [
  {
    value: 'anyone',
    text: 'Anyone can see this project'
  },
  {
    value: 'embargoed',
    text: 'Embargoed'
  }
];

const supportFilesConfig = {
  srt: {
    headline: 'SRT Files',
    fileType: 'srt',
    popupMsg: 'Some info about what SRT files are.'
  },
  other: {
    headline: 'Additional Files',
    fileType: 'other',
    popupMsg: 'Additional files that can be used with this video, e.g., audio file, pdf.',
    checkBoxLabel: 'Disable right-click to protect your images',
    checkBoxName: 'protectImages',
    iconMsg: 'Checking this prevents people from downloading and using your images. Useful if your images are licensed.',
    iconSize: 'small',
    iconType: 'info circle'
  }
};

const projects = [
  {
    projectType: 'video',
    projectId: '234',
    updated: '',
    saveStatus: {
      error: false,
      success: false
    },
    projectData: {
      title: '',
      author: '',
      owner: '',
      visibility: 'Anyone can see this project',
      categories: [],
      tags: [],
      publicDesc: '',
      internalDesc: '',
      termsConditions: false,
      protectImages: false
    },
    supportFiles: {
      srt: [
        {
          id: '5678',
          lang: 'Arabic',
          file: 'madeinamerica_arabic.srt',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 24576
          }
        },
        {
          id: '5679',
          lang: 'Chinese (Simplified)',
          file: 'madeinamerica_chinese_ljhlkjhl_kjhlkjh_aslkfja;lskjfweoij.srt',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 24576
          }
        },
        {
          id: '5680',
          lang: 'English',
          file: 'madeinamerica_english.srt',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 24576
          }
        },
        {
          id: '5681',
          lang: 'French',
          file: 'madeinamerica_french.srt',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 24576
          }
        }
      ],
      other: [
        {
          id: '5682',
          lang: 'Arabic',
          file: 'madeinamerica_arabic.jpg',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 58368
          }
        },
        {
          id: '5683',
          lang: 'Chinese (Simplified)',
          file: 'madeinamerica_chinese.jpg',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 58368
          }
        },
        {
          id: '5684',
          lang: 'English',
          file: 'madeinamerica_english.jpg',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 58368
          }
        },
        {
          id: '5685',
          lang: 'French',
          file: 'madeinamerica_french.jpg',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 58368
          }
        },
        {
          id: '5686',
          lang: 'English',
          file: 'madeinamerica_english.mp3',
          uploadStatus: {
            error: false,
            success: false
          },
          size: {
            filesize: 5242880
          }
        }
      ]
    },
    videos: [
      {
        id: '3728',
        title: 'Made in America',
        uploadStatus: {
          error: false,
          success: false
        },
        thumbnail: 'https://staticcdp.s3.amazonaws.com/2018/05/courses.america.gov_1481/b3b38d194ff80d06dd837f57a41fe16f.jpg',
        alt: 'Man walking through factory (State Dept.)',
        language: {
          language_code: 'en',
          locale: 'en-us',
          display_name: 'English',
          native_name: 'English',
          text_direction: 'ltr'
        },
        other: [
          {
            fileName: 'madeinamerica_english.mp3',
            fileType: 'mp3',
            md5: '',
            srcUrl: 'https://other-download-url.com'
          }
        ],
        source: [
          {
            burnedInCaptions: 'false',
            downloadUrl: 'https://video-download-url.com',
            duration: '9:16',
            filetype: '',
            md5: '',
            fileName: 'madeinamerica_english.mp4',
            size: {
              bitrate: 9832917,
              filesize: 662595174,
              height: '1080',
              width: '1920'
            },
            stream: {
              link: '',
              site: '',
              thumbnail: null,
              uid: '',
              url: ''
            },
            streamUrl: [
              {
                site: 'youtube',
                url: 'https://youtu.be/1evw4fRu3bo'
              }
            ],
            video_quality: 'web'
          }
        ],
        srt: {
          md5: '',
          srcUrl: 'https://srt-download-url.com'
        },
        transcript: {
          md5: '',
          srcUrl: ''
        },
        fileName: 'madeinamerica_english_asdkjaf_al;kdflkeori_erpoiuzx,mnvz.mp4',
        uploaded: '2018-04-13T15:45:00Z',
        desc: 'The value and meaning of the words “Made in America” come from a rich history of innovation and perseverance. Stay for a brief history of manufacturing in the USA and hear some of the positive impacts it has brought to the world and how its benefits are felt today.'
      },
      {
        id: '3729',
        title: 'Fabriqué en Amérique',
        uploadStatus: {
          error: false,
          success: false
        },
        thumbnail: 'https://staticcdp.s3.amazonaws.com/2018/05/courses.america.gov_1481/b3b38d194ff80d06dd837f57a41fe16f.jpg',
        alt: '',
        language: {
          language_code: 'fr',
          locale: 'fr-fr',
          display_name: 'French',
          native_name: 'Français',
          text_direction: 'ltr'
        },
        other: [
          {
            fileName: '',
            fileType: '',
            md5: '',
            srcUrl: ''
          }
        ],
        source: [
          {
            burnedInCaptions: 'false',
            downloadUrl: 'https://video-download-url.com',
            duration: '9:16',
            filetype: '',
            md5: '',
            fileName: 'madeinamerica_french.mp4',
            size: {
              bitrate: 9832917,
              filesize: 662595174,
              height: '1080',
              width: '1920'
            },
            stream: {
              link: '',
              site: '',
              thumbnail: null,
              uid: '',
              url: ''
            },
            streamUrl: [
              {
                site: 'youtube',
                url: 'https://youtu.be/1evw4fRu3bo'
              }
            ],
            video_quality: 'web'
          }
        ],
        srt: {
          md5: '',
          srcUrl: 'https://srt-download-url.com'
        },
        transcript: {},
        fileName: 'madeinamerica_french.mp4',
        uploaded: '2018-04-13T15:45:00Z',
        desc: 'La valeur et le sens de l’expression Fabriqué en Amérique, ont leur origine dans un passé riche d’innovation et de persévérance. Découvrez une partie de l’histoire de l’industrie manufacturière aux États-Unis et l’influence positive qu’elle a eue sur le monde, dans le passé et encore aujourd’hui.',
        additionalKeywords: [
          'la valeur', 'innovation', 'ipsum'
        ]
      },
      {
        id: '3730',
        title: 'عنوان: امریکی ساختہ',
        uploadStatus: {
          error: false,
          success: false
        },
        thumbnail: 'https://staticcdp.s3.amazonaws.com/2018/05/courses.america.gov_1481/b3b38d194ff80d06dd837f57a41fe16f.jpg',
        alt: '',
        language: {
          language_code: 'ar',
          locale: 'ar',
          display_name: 'Arabic',
          native_name: 'العربية',
          text_direction: 'rtl'
        },
        other: [
          {
            fileName: '',
            fileType: '',
            md5: '',
            srcUrl: ''
          }
        ],
        source: [
          {
            burnedInCaptions: 'false',
            downloadUrl: 'https://video-download-url.com',
            duration: '9:16',
            filetype: '',
            md5: '',
            fileName: 'madeinamerica_arabic.mp4',
            size: {
              bitrate: 9832917,
              filesize: 662595174,
              height: '1080',
              width: '1920'
            },
            stream: {
              link: '',
              site: '',
              thumbnail: null,
              uid: '',
              url: ''
            },
            streamUrl: [
              {
                site: 'youtube',
                url: 'https://youtu.be/1evw4fRu3bo'
              }
            ],
            video_quality: 'web'
          }
        ],
        srt: {
          md5: '',
          srcUrl: 'https://srt-download-url.com'
        },
        transcript: {},
        fileName: 'madeinamerica_arabic.mp4',
        uploaded: '2018-04-13T15:45:00Z',
        desc: 'امریکی ساختہ کی قدر اور مفہوم نے جدت طرازی اور استقامت کی شاندار تاریخ سے جنم لیا ہے۔ امریکہ میں مصنوعات سازی کی مختصر تاریخ سے آگہی حاصل کریں اور دنیا پر مرتب ہونے والے اس کے مثبت اثرات میں سے چند ایک کا احوال سنیں اور دیکھیں کہ آج اس کے فوائد کس طرح محسوس کیے جا رہے ہیں۔',
        additionalKeywords: ['ساختہ']
      }
    ]
  }
];

export {
  categoryData,
  languages,
  privacyOptions,
  supportFilesConfig,
  projects
};
