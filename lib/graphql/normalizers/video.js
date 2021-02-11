import { v4 } from 'uuid';

/**
 * Normalizes files to be added.  For each file selected,
 * create/init a file object with applicable props & add.
 * Generate a file id to track changes to file
 * @param {array-like} files selected files from file selection dialogue
 */
export const normalize = ( files, defaultUse ) => {
  let fileList = files;

  if ( !Array.isArray( fileList ) ) {
    fileList = Array.from( files );
  }

  return fileList.map( file => {
    const isFile = file instanceof File;

    // new file being added
    if ( isFile ) {
      return {
        id: v4(),
        name: file.name,
        language: '',
        use: defaultUse || '',
        quality: '',
        videoBurnedInStatus: '',
        input: file,
        loaded: 0,
      };
    }

    // saved file being changed
    const {
      id, filename, language, quality, videoBurnedInStatus, use, url,
    } = file;

    return {
      id,
      name: filename,
      language: language ? language.id : '',
      use: use ? use.id : '',
      quality,
      videoBurnedInStatus,
      url,
    };
  } );
};
