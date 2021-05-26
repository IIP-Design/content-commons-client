import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useCKEditor from 'lib/hooks/useCKEditor';
import { config } from './config';
import styles from './TextEditor.module.scss';

const TextEditor = ( { id, content } ) => {
  // useCKEditor allows CKEditor to work with SSR
  const { CKEditor, Editor, isEditorLoaded } = useCKEditor();
  const [editorData, setEditorData] = useState( '' );

  const handleChange = ( _, editor ) => (
    setEditorData( editor.getData() )
  );

  const handleReady = editor => {
    if ( content ) {
      editor.setData( content );
    }
  };

  // temp: mock mutation
  const updatePlaybook = async obj => ( {
    id,
    type: 'PLAYBOOK',
    content: {
      id: 'contentId123',
      html: obj.variables.data.content.update.html,
    },
  } );

  const autoSaveConfig = {
    autosave: {
      waitingTime: 5000,
      save: async editor => {
        if ( !editor.getData() ) return;

        try {
          const response = await updatePlaybook( {
            variables: {
              data: {
                content: {
                  update: {
                    html: editor.getData(),
                  },
                },
              },
              where: { id },
            },
          } );

          if ( response ) {
            console.log( 'Saved: ', response );
          }
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
  content: PropTypes.string,
};

export default TextEditor;
