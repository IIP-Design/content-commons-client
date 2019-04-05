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

const visibilityOptions = [
  {
    value: 'PUBLIC',
    text: 'Anyone can see this project'
  },
  {
    value: 'INTERNAL',
    text: 'need text for this'
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
    projectId: 'cjsyv49bs026u0756io3wvqe4',
    updated: '',
    saveStatus: {
      error: false,
      success: false
    },
    projectData: {
      projectTitle: '',
      author: '',
      team: '',
      visibility: 'Anyone can see this project',
      categories: [],
      tags: [],
      descPublic: '',
      descInternal: '',
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

const units = [
  {
    id: '1111',
    title: 'Video Title (English)',
    descPublic: 'the English description',
    language: {
      languageCode: 'en',
      displayName: 'English',
      textDirection: 'LTR'
    },
    files: [
      {
        id: 'aaaa',
        filename: 'video-filename-english.mp4',
        url: 'https://video-download-url.com',
        filesize: 662595174,
        videoBurnedInStatus: 'CLEAN',
        dimensions: {
          width: 1920,
          height: 1080
        },
        stream: {
          site: 'YouTube',
          embedUrl: 'https://www.youtube.com/embed/1a1a1a'
        }
      }
    ]
  },
  {
    id: '2222',
    title: 'Video Title (French)',
    descPublic: 'the French description',
    language: {
      languageCode: 'fr',
      displayName: 'French',
      textDirection: 'LTR'
    },
    files: [
      {
        id: 'bbbb',
        filename: 'video-filename-french.mp4',
        url: 'https://video-download-url.com',
        filesize: 662595174,
        videoBurnedInStatus: 'CLEAN',
        dimensions: {
          width: 1920,
          height: 1080
        },
        stream: {
          site: 'YouTube',
          embedUrl: 'https://www.youtube.com/embed/1a1a1a'
        }
      }
    ]
  }
];

const videoProjectPreview = {
  id: '123',
  createdAt: '2019-03-20T15:09:24.975Z',
  updatedAt: '2019-04-02T16:28:31.888Z',
  projectType: 'video',
  thumbnails: [
    {
      alt: 'A man wearing a hardhat walks through an empty factory.',
      url: 'https://staticcdp.s3.amazonaws.com/2018/05/courses.america.gov_1481/b3b38d194ff80d06dd837f57a41fe16f.jpg'
    }
  ],
  team: {
    name: 'IIP Video Production'
  },
  units: [
    {
      id: 'cjsx8fj5h01ez0756cd0t6r30',
      title: 'Made in America',
      descPublic: 'The value and meaning of the words “Made in America” come from a rich history of innovation and perseverance. Stay for a brief history of manufacturing in the USA and hear some of the positive impacts it has brought to the world and how its benefits are felt today.',
      thumbnails: [
        {
          image: {
            alt: 'A man wearing a hardhat walks through an empty factory.',
            url: 'https://staticcdp.s3.amazonaws.com/2018/05/courses.america.gov_1481/b3b38d194ff80d06dd837f57a41fe16f.jpg'
          }
        }
      ],
      language: {
        languageCode: 'en',
        displayName: 'English',
        textDirection: 'LTR'
      },
      files: [
        {
          id: 'cjsw7urxd00oc0756llfh4ihs',
          filename: 'madeinamerica_english_asdkjaf_al;kdflkeori_erpoiuzx,mnvz.mp4',
          url: 'https://video-download-url.com',
          filesize: 662595174,
          videoBurnedInStatus: 'CLEAN',
          dimensions: {
            width: 1920,
            height: 1080
          },
          stream: {
            site: 'YouTube',
            embedUrl: 'https://www.youtube.com/embed/1evw4fRu3bo'
          }
        }
      ]
    },
    {
      id: 'cjt01xotk02fu0756743g45a8',
      title: 'Fabriqué en Amérique',
      descPublic: 'La valeur et le sens de l’expression Fabriqué en Amérique, ont leur origine dans un passé riche d’innovation et de persévérance. Découvrez une partie de l’histoire de l’industrie manufacturière aux États-Unis et l’influence positive qu’elle a eue sur le monde, dans le passé et encore aujourd’hui.',
      thumbnails: [
        {
          image: {
            alt: 'A man wearing a hardhat walks through an empty factory.',
            url: 'https://staticcdp.s3.amazonaws.com/2018/05/courses.america.gov_1481/b3b38d194ff80d06dd837f57a41fe16f.jpg'
          }
        }
      ],
      language: {
        languageCode: 'fr',
        displayName: 'French',
        textDirection: 'LTR'
      },
      files: [
        {
          id: 'cjsxe6k6w01z7075657wt2ork',
          filename: 'madeinamerica_french.mp4',
          url: 'https://video-download-url.com',
          filesize: 662595174,
          videoBurnedInStatus: 'CLEAN',
          dimensions: {
            width: 1920,
            height: 1080
          },
          stream: {
            site: 'YouTube',
            embedUrl: 'https://www.youtube.com/embed/1evw4fRu3bo'
          }
        }
      ]
    }
  ]
};

export {
  categoryData,
  languages,
  visibilityOptions,
  supportFilesConfig,
  projects,
  units,
  videoProjectPreview
};
