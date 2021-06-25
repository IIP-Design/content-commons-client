import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useCKEditor from 'lib/hooks/useCKEditor';
import { config } from './config';
import styles from './TextEditor.module.scss';

const TextEditor = ( { id, content, query, type, updateMutation } ) => {
  // useCKEditor allows CKEditor to work with SSR
  const { CKEditor, Editor, isEditorLoaded } = useCKEditor();
  const [editorData, setEditorData] = useState( '' );

  const handleChange = ( _, editor ) => (
    setEditorData( editor.getData() )
  );

  const handleReady = editor => {
    if ( content?.html ) {
      editor.setData( content.html );
    }
  };

  const autoSaveConfig = {
    autosave: {
      waitingTime: 500,
      save: async editor => {
        const isInitializing = editor.getData() === content?.html;

        if ( !editor.getData() || isInitializing ) return;

        try {
          await updateMutation( {
            variables: {
              data: {
                type,
                content: {
                  upsert: {
                    create: {
                      html: editor.getData(),
                    },
                    update: {
                      html: editor.getData(),
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
                      html: editor.getData(),
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
      },
    },
  };

  return (
    <section className={ styles.container } aria-label="Body">
      <h2>Body</h2>

      <div className={ styles.editor }>
        { isEditorLoaded
          ? (
            <CKEditor
              id={ id }
              config={ { ...config, ...autoSaveConfig } }
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
