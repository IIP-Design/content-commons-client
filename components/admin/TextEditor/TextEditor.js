import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useCKEditor from 'lib/hooks/useCKEditor';
import useTimeout from 'lib/hooks/useTimeout';
import { config } from './config';
import styles from './TextEditor.module.scss';

const TextEditor = ( { id, content, query, type, updateMutation } ) => {
  // useCKEditor allows CKEditor to work with SSR
  const { CKEditor, Editor, isEditorLoaded } = useCKEditor();
  const [editorData, setEditorData] = useState( '' );
  const [initializing, setIsInitializing] = useState( true );

  const handleChange = ( _, editor ) => (
    setEditorData( editor.getData() )
  );

  const handleReady = editor => {
    editor.setData( content?.html || '' );
    setIsInitializing( false );
  };

  const handleSave = useCallback( async () => {
    try {
      await updateMutation( {
        variables: {
          data: {
            type,
            content: {
              upsert: {
                create: {
                  html: editorData,
                },
                update: {
                  html: editorData,
                },
              },
            },
          },
          where: { id },
        },
        update: cache => {
          try {
            cache.writeQuery( {
              query,
              data: {
                content: {
                  html: editorData,
                },
              },
            } );
          } catch ( error ) {
            console.log( error );
          }
        },
      } );
    } catch ( err ) {
      console.log( err );
    }
  }, [
    id, editorData, query, type, updateMutation,
  ] );

  const { startTimeout } = useTimeout( handleSave, 500 );

  useEffect( () => {
    if ( initializing || editorData === content?.html ) return;

    startTimeout();
  }, [
    content, editorData, initializing, startTimeout,
  ] );

  return (
    <section className={ styles.container } aria-label="Body">
      <h2>Body</h2>

      <div className={ styles.editor }>
        { isEditorLoaded
          ? (
            <CKEditor
              id={ id }
              config={ config }
              data={ editorData }
              editor={ Editor }
              onChange={ handleChange }
              onError={ error => console.error( error ) }
              onReady={ handleReady }
            />
          )
          : <p>The text editor is unavailable.</p> }
      </div>
    </section>
  );
};

TextEditor.propTypes = {
  id: PropTypes.string,
  content: PropTypes.object,
  query: PropTypes.object,
  type: PropTypes.string,
  updateMutation: PropTypes.func,
};

export default TextEditor;
