import { v4 } from 'uuid';

/**
 * Normalizes files to be added. For each file selected,
 * create/init a file object with applicable props & add.
 * Generate a file id to track changes to file
 * @param {array-like|array} files selected files from file selection dialogue
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
        size: file.size,
        language: '',
        style: '',
        social: [],
        input: file,
        loaded: 0,
      };
    }

    // saved file being changed
    const { id, filename, filesize, language, style, social, url } = file;

    return {
      id,
      name: filename,
      size: filesize,
      language: language ? language.id : '',
      style: style ? style.id : '',
      social: social ? social.map( _social => _social.id ) : [],
      url,
    };
  } );
};

/*
  Check to see if all required dropdowns are completed
  when the the files state changes. Save button becomes active when all
  complete
  */
export const isComplete = files => files.every(
  file => !!file.language && !!file.style && !!file.social && !!file.social.length,
);


/**
 * Utility to export all methods
 */
export const dataManager = { normalize, isComplete };
