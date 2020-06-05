import difference from 'lodash/difference';

export const buildSupportFile = file => {
  const { input } = file;

  const supportFile = {
    filename: input.name,
    filesize: input.size,
    filetype: file.contentType,
    url: file.s3Path,
    visibility: file.visibility || 'PUBLIC',
    editable: file.editable || false,
  };

  if ( file.language ) {
    supportFile.language = {
      connect: {
        id: file.language,
      },
    };
  }

  return supportFile;
};

export const buildSupportFileTree = files => {
  const tree = files.map( file => buildSupportFile( file ) );

  return tree;
};

export const buildImageFile = file => {
  const { input } = file;
  const imageFile = {
    title: input.name,
    filename: input.name,
    filesize: input.size,
    filetype: file.contentType,
    dimensions: {
      create: {
        width: file.width,
        height: file.height,
      },
    },
    url: file.s3Path,
    language: {
      connect: {
        id: file.language,
      },
    },
  };

  if ( file.use ) {
    imageFile.use = {
      connect: {
        id: file.use,
      },
    };
  }

  if ( file.style ) {
    imageFile.style = {
      connect: {
        id: file.style,
      },
    };
  }

  if ( file.social ) {
    imageFile.social = {
      connect: file.social.map( socialId => ( { id: socialId } ) ),
    };
  }

  return imageFile;
};


export const buildImageFileTree = files => {
  const tree = files.map( file => buildImageFile( file ) );

  return tree;
};


export const buildThumbnail = thumbnail => ( {
  create: {
    image: {
      connect: {
        id: thumbnail.id,
      },
    },
  },
} );


// This needs to be refactored.  Leaving to ensure nothing current blows
export const buildThumbnailTree = thumbnail => ( {
  thumbnails: {
    create: {
      image: {
        connect: {
          id: thumbnail.id,
        },
      },
    },
  },
} );

export const buildConnectionTree = ( values, prevValues = [] ) => {
  const valuesToDisconnect = difference( prevValues, values );
  const tree = {};

  if ( valuesToDisconnect.length ) {
    tree.disconnect = valuesToDisconnect.map( value => ( { id: value } ) );
  }

  if ( values.length ) {
    tree.connect = values.map( value => ( { id: value } ) );
  }

  return tree;
};

export const buildTagTree = tags => {
  let tree = {};

  if ( tags && tags.length ) {
    const tagArr = tags.map( tag => ( { id: tag } ) );

    tree = {
      connect: tagArr,
    };
  }

  return tree;
};
