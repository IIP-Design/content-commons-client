export const mockVideoItem = {
  author: 'Marek',
  categories: [],
  description: 'Sample description text.',
  duration: undefined,
  icon: 'data:image/png;base64,i',
  id: 'ck893abpy01la0988nbwcji29',
  indexId: 'k7WNe3IByyfW9jJFJG5E',
  link: '',
  logo: '',
  modified: '2020-06-03T19:02:48.577Z',
  owner: 'GPA Video',
  published: '2020-06-03T19:02:48.577Z',
  selectedLanguageUnit: {
    source: [
      {
        burnedInCaptions: 'false',
        downloadUrl: 'https://staticcdpdev.s3.amazonaws.com/2020/03/commons.america.gov_ck893abpy01la0988nbwcji29/egghead.mov',
        duration: '40.333333',
        filetype: 'video/quicktime',
        size: { width: 2756, bitrate: 5408846, filesize: 27301894, height: 1676 },
        stream: {
          link: 'https://vimeo.com/425607090',
          site: 'vimeo',
          uid: '425607090',
          url: 'https://player.vimeo.com/video/425607090',
        },
      },
    ],
  },
  site: 'localhost',
  sourcelink: 'https://localhost',
  supportFiles: [],
  tags: [],
  thumbnail: 'https://staticcdpdev.s3.amazonaws.com/2020/03/commons.america.gov_ck893abpy01la0988nbwcji29/20122268454784734_20.jpg',
  title: 'Marek Dev',
  type: 'video',
  units: [],
};

export const mockMissingFieldsItem = {
  ...mockVideoItem,
  description: '',
  selectedLanguageUnit: {},
  title: '',
};

export const mockNonVideoItem = {
  ...mockVideoItem,
  type: document,
  visibility: 'INTERNAL',
};
