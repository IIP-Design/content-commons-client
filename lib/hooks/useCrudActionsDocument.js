import { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  UPDATE_PACKAGE_MUTATION
} from 'lib/graphql/queries/package';

import { useFileUpload } from 'lib/hooks/useFileUpload';
import {
  buildCreateDocument,
  buildUpdateDocumentConnectionTree
} from 'lib/graphql/builders/document';


/**
 * Hook that exposes document CRUD actions on the package content type
 */
export const useCrudActionsDocument = ( { pollQuery, variables } ) => {
  const { data, startPolling, stopPolling } = useQuery( pollQuery, { variables } );

  const [updatePackage] = useMutation( UPDATE_PACKAGE_MUTATION );
  const { uploadFile } = useFileUpload();

  /**
   * Checks to see if document conversion is complete.
   * Is complete if there is a image prop exists or
   * it is UNAVAILABLE indictating a processing error
   * @param {array} documents package documents
   */
  const isFileProcessingComplete = documents => {
    if ( documents ) {
      const notCompleted = documents.filter( document => {
        if ( document?.image === 'UNAVAILABLE' ) {
          return false;
        }
        return !document?.image?.length;
      } );
      if ( notCompleted.length ) {
        return false;
      }
    }

    return true;
  };

  // when the data changes, check for document processing
  // completing.  If complete, stopPolling, else restart
  // restart is added in the event a user is reentering the
  // page with documents that are still processing
  useEffect( () => {
    if ( isFileProcessingComplete( data?.pkg?.documents ) ) {
      stopPolling();
    } else {
      startPolling( 1000 );
    }
  }, [data] );

  // stopPolling on unmount
  useEffect( () => () => {
    stopPolling();
  }, [] );

  const createFile = async ( pkg, file, callback ) => {
    startPolling( 1000 );

    try {
      // upload file if File input exists
      if ( file.input ) {
        await uploadFile( pkg.assetPath, file, callback );
      }

      updatePackage( {
        variables: {
          data: {
            assetPath: pkg.assetPath,
            documents: {
              create: buildCreateDocument( file )
            }
          },
          where: { id: pkg.id }
        }
      } );
    } catch ( err ) {
      console.log( err );
    }
  };

  const deleteFile = async ( pkg, file ) => {
    try {
      updatePackage( {
        variables: {
          data: {
            // update the parent (package) to ensure that package is marked as updated if all documents are deleted
            // to trigger the display of 'Publish Changes' button
            title: pkg.title,
            assetPath: pkg.assetPath,
            documents: {
              delete: { id: file.id }
            }
          },
          where: { id: pkg.id }
        }
      } );
    } catch ( err ) {
      console.log( err );
    }
  };

  const updateFile = async ( pkg, file ) => {
    try {
      updatePackage( {
        variables: {
          data: {
            // update the parent (package) to ensure that package is marked as updated if all documents are deleted
            // to trigger the display of 'Publish Changes' button
            title: pkg.title,
            documents: {
              update: {
                where: {
                  id: file.id
                },
                data: buildUpdateDocumentConnectionTree(
                  file,
                  pkg.documents.find( document => document.id === file.id )
                )
              }
            }
          },
          where: { id: pkg.id }
        }
      } );
    } catch ( err ) {
      console.log( err );
    }
  };


  return {
    createFile,
    updateFile,
    deleteFile
  };
};
