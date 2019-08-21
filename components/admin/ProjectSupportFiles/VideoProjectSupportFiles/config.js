export const config = {
  supportFiles: {
    // query: VIDEO_PROJECT_QUERY,
    types: {
      srt: {
        headline: 'SRT Files',
        extensions: ['.srt'],
        popupMsg: 'Some info about what SRT files are.'
      },
      other: {
        headline: 'Additional Files',
        extensions: ['.png', '.jpeg', '.jpg', '.svg'],
        popupMsg: 'Additional files that can be used with this video, e.g., audio file, pdf.',
        iconMsg: 'Checking this prevents people from downloading and using your images. Useful if your images are licensed.',
        iconSize: 'small',
        iconType: 'info circle'
      }
    }
  }
};
