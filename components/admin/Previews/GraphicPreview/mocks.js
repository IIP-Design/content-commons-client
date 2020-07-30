export const mockData = {
  alt: 'some alt text',
  author: 'John Doe',
  categories: 'environment, global issues',
  copyright: 'COPYRIGHT',
  createdAt: '2020-06-12T20:33:04.384Z',
  desc: 'Blah Blah Public',
  descInternal: 'Blah Blah Internal',
  id: 'ckbco441s07ch0a88i3029k1j',
  images: [],
  projectTitle: 'Save and Exit',
  projectType: 'SOCIAL_MEDIA',
  status: 'PUBLISHED',
  supportFiles: [],
  team: 'GPA Design & Editorial',
  thumbnail: {
    signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/social&Signature=MHVgP6',
    alt: null,
  },
  updatedAt: '2020-06-15T16:15:38.719Z',
  visibility: 'PUBLIC',
  __typename: 'GraphicProject',
};

export const mockGraphicItem = {
  alt: 'some alt text',
  author: 'John Doe',
  categories: 'environment, global issues',
  copyright: 'COPYRIGHT',
  createdAt: '2020-06-12T20:33:04.384Z',
  desc: 'Blah Blah Public',
  descInternal: 'Blah Blah Internal',
  id: 'ckbco441s07ch0a88i3029k1j',
  images: [],
  projectTitle: 'Save and Exit',
  projectType: 'SOCIAL_MEDIA',
  status: 'PUBLISHED',
  supportFiles: [],
  team: {
    name: 'GPA Design & Editorial',
  },
  thumbnail: {
    signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/social&Signature=MHVgP6',
    alt: null,
  },
  updatedAt: '2020-06-15T16:15:38.719Z',
  visibility: 'PUBLIC',
  __typename: 'GraphicProject',
};

export const mockState = {
  'default': {
    error: false,
    loading: false,
  },
  error: {
    error: { message: 'Error' },
    loading: false,
  },
  loading: {
    error: false,
    loading: true,
  },
};
