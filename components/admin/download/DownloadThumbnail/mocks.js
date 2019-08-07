import { VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY } from './DownloadThumbnail';

export const props = {
  id: '123',
  instructions: 'Download Thumbnail(s)',
  isPreview: false
};

export const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          id: props.id,
          thumbnails: [
            {
              id: 'th765',
              url: `2019/06/${props.id}/thumbnail-1.jpg`,
              language: {
                id: 'en23',
                displayName: 'English'
              }
            },
            {
              id: 'th865',
              url: `2019/06/${props.id}/thumbnail-2.jpg`,
              language: {
                id: 'en23',
                displayName: 'English'
              }
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

export const nullProjectMocks = [
  {
    ...mocks[0],
    result: { data: { project: null } }
  }
];

export const noFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          thumbnails: []
        }
      }
    }
  }
];

export const emptyProjectMocks = [
  {
    ...mocks[0],
    result: { data: { project: {} } }
  }
];
