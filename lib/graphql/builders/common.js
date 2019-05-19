
export const buildSupportFileTree = files => {
  const tree = files.map( file => {
    const { input } = file;
    return ( {
      filename: input.name,
      filesize: input.size,
      filetype: file.contentType,
      url: file.s3Path,
      language: {
        connect: {
          id: file.language
        }
      }
    } );
  } );

  return tree;
};


export const buildImageFileTree = files => {
  const tree = files.map( file => {
    const { input } = file;
    return ( {
      filename: input.name,
      filesize: input.size,
      filetype: file.contentType,
      dimensions: {
        create: {
          width: file.width,
          height: file.height,
        }
      },
      use: {
        connect: {
          id: file.use
        }
      },
      url: file.s3Path,
      language: {
        connect: {
          id: file.language
        }
      }
    } );
  } );

  return tree;
};


export const buildThumbnailTree = thumbnail => ( {
  thumbnails: {
    create: [{
      image: {
        connect: {
          id: thumbnail.id
        }
      }
    }]
  }
} );
