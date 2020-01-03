import { useMutation } from '@apollo/react-hooks';
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
export const useCrudActionsDocument = () => {
  const [updatePackage] = useMutation( UPDATE_PACKAGE_MUTATION );
  const { uploadFile } = useFileUpload();

  const createFile = async ( pkg, file, callback ) => {
    try {
      // upload file if File input exists
      if ( file.input ) {
        await uploadFile( pkg.assetPath, file, callback );
      }

      updatePackage( {
        variables: {
          data: {
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
