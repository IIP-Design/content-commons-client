import { useRef, useState, useEffect } from 'react';

const useCKEditor = () => {
  const editorRef = useRef();
  const [isEditorLoaded, setIsEditorLoaded] = useState( false );
  const { CKEditor, Editor } = editorRef.current || {};

  useEffect( () => {
    editorRef.current = {
      /* eslint-disable node/global-require */
      CKEditor: require( '@ckeditor/ckeditor5-react' ).CKEditor,
      Editor: require( 'ckeditor5-custom-build/build/ckeditor' ),
    };

    setIsEditorLoaded( true );
  }, [] );

  return {
    isEditorLoaded,
    CKEditor,
    Editor,
  };
};

export default useCKEditor;
