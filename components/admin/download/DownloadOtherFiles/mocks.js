import { VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY } from './DownloadOtherFiles';

export const props = {
  id: '123',
  instructions: 'Download Other File(s)',
  isPreview: false,
};

export const mocks = [
  {
    request: {
      query: VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY,
      variables: { id: props.id },
    },
    result: {
      data: {
        project: {
          id: props.id,
          files: [
            {
              id: 'pdf89',
              filename: 'file-1.pdf',
              filetype: 'application/pdf',
              url: `2019/06/${props.id}/file-1.pdf`,
              language: {
                id: 'en23',
                displayName: 'English',
              },
            },
            {
              id: 'au56',
              filename: 'audio-1.mp3',
              filetype: 'audio/x-mpeg-3',
              url: `2019/06/${props.id}/audio-1.mp3`,
              language: {
                id: 'en23',
                displayName: 'English',
              },
            },
          ],
          thumbnails: [
            {
              id: 'th765',
              filename: 'thumbnail-1.jpg',
              filetype: 'image/jpeg',
              url: `2019/06/${props.id}/thumbnail-1.jpg`,
              language: {
                id: 'en23',
                displayName: 'English',
              },
            },
            {
              id: 'th865',
              filename: 'thumbnail-2.jpg',
              filetype: 'image/jpeg',
              url: `2019/06/${props.id}/thumbnail-2.jpg`,
              language: {
                id: 'en23',
                displayName: 'English',
              },
            },
          ],
        },
      },
    },
  },
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
];

export const nullProjectMocks = [
  {
    ...mocks[0],
    result: { data: { project: null } },
  },
];

export const emptyProjectMocks = [
  {
    ...mocks[0],
    result: { data: { project: {} } },
  },
];

export const noFilesMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        project: {
          ...mocks[0].result.data.project,
          files: [],
          thumbnails: [],
        },
      },
    },
  },
];
