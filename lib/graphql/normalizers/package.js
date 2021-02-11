import { v4 } from 'uuid';

/**
 * Normalizes files to be added. For each file selected,
 * create/init a file object with applicable props & add.
 * Generate a file id to track changes to file
 * @param {array-like} files selected files from file selection dialogue
 */
export const normalize = files => {
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
        use: '',
        bureaus: [],
        input: file,
        loaded: 0,
      };
    }

    // saved file being changed
    const {
      id, filename, use, bureaus, url,
    } = file;

    return {
      id,
      name: filename,
      use: use ? use.id : '',
      bureaus: bureaus ? bureaus.map( bureau => bureau.id ) : [],
      url,
    };
  } );
};

/*
  Check to see if all required dropdowns are completed
  when the the files state changes. Save button becomes active when all
  complete
  */

export const isComplete = files => files.every( file => !!file.use && !!file.bureaus && !!file.bureaus.length );
