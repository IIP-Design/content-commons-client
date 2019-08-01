import { VIDEO_PROJECT_PREVIEW_SRTS_QUERY } from './DownloadSrt';

export const props = {
  id: '123',
  instructions: 'Download SRT(s)',
  isPreview: false
};

export const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_SRTS_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        project: {
          id: props.id,
          files: [
            {
              id: 'srt89',
              url: `2019/06/${props.id}/srt-1.srt`,
              language: {
                id: 'en23',
                displayName: 'English'
              }
            },
            {
              id: 'srt99',
              url: `2019/06/${props.id}/srt-2.srt`,
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

export const emptyProjectMocks = [
  {
    ...mocks[0],
    result: { data: { project: {} } }
  }
];

export const noFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          files: []
        }
      }
    }
  }
];
