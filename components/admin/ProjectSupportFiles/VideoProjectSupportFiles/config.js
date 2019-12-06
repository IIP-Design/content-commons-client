export const config = {
  supportFiles: {
    // query: VIDEO_PROJECT_QUERY,
    types: {
      captions: {
        headline: 'Caption Files',
        extensions: ['.srt', '.vtt'],
        popupMsg: 'Caption files for videos.',
        editTitle: 'Edit caption files in this project'
      },
      other: {
        headline: 'Additional Files',
        extensions: ['.png', '.jpeg', '.jpg'],
        popupMsg: 'Additional files that can be used with this video, e.g., audio file, pdf.',
        iconMsg: 'Checking this prevents people from downloading and using your images. Useful if your images are licensed.',
        iconSize: 'small',
        iconType: 'info circle',
        editTitle: 'Edit thumbnail files in this project'
      }
    }
  }
};
