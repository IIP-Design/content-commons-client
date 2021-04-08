import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types'; import { getFileExt } from 'lib/utils';
import { Button } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import DynamicConfirm from 'components/admin/DynamicConfirm/DynamicConfirm';
import EditFileGridRow from 'components/admin/EditFileGridRow/EditFileGridRow';
import styles from './EditFileGrid.module.scss';

const EditFileGrid = ( {
  screens,
  files,
  allowedFiles,
  duplicateConfirm,
  removeConfirm,
  cancelConfirm,
  showHeader,
  showCompletionTracker,
  continueBtn,
  onContinue,
  onCancel,
  onAdd,
  onUpdate,
  onRemove,
} ) => {
  const [activeScreen, setActiveScreen] = useState( 0 );
  const [confirm, setConfirm] = useState( {} );

  const checkForDuplicateFiles = filesToAdd => {
    const duplicates = filesToAdd.filter( file => {
      const found = files.find( f => f.name === file.name );

      if ( found ) {
        return found.size === file.size;
      }

      return false;
    } );

    return duplicates;
  };

  // Close confirm dialogue
  const close = () => {
    setConfirm( { open: false } );
  };

  // Display applicable screen
  const go = screen => {
    setActiveScreen( screen );
  };

  // Add files to state
  const _add = fileList => {
    onAdd( fileList );
    go( 0 );
  };

  /**
   * Adds files.  Optionally displays a confirm dialogue
   * @param {object} e  browser event obj
   */
  const add = e => {
    const _files = Array.from( e.target.files );

    if ( duplicateConfirm ) {
      const duplicates = checkForDuplicateFiles( _files );
      const duplicatesStr = duplicates.reduce( ( acc, cur ) => `${acc} ${cur.name}\n`, '' );

      if ( duplicates.length ) {
        setConfirm( {
          open: true,
          headline: 'It appears that duplicate files are being added.',
          content: `Do you want to add these files?\n${duplicatesStr}`,
          cancelButton: 'No, do not add duplicate files',
          confirmButton: 'Yes, add duplicate files',
          onCancel: () => {
            // add the unique files
            const uniqFiles = _files.filter( file => !duplicates.includes( file ) );

            _add( uniqFiles );
            close();
          },
          onConfirm: () => {
            _add( _files );
            close();
          },
        } );
      } else {
        _add( _files );
      }
    } else {
      _add( _files );
    }
  };


  /**
   * Remove a file.  Optionally displays a confirm dialogue
   * @param {object} file  file to remove
   */
  const remove = file => {
    if ( removeConfirm ) {
      setConfirm( {
        open: true,
        headline: 'The following file will be removed. Ok?',
        content: file.name,
        cancelButton: 'No, take me back',
        confirmButton: 'Yes, remove',
        onCancel: () => {
          close();
        },
        onConfirm: () => {
          onRemove( file );
          close();
        },
      } );
    } else {
      onRemove( file );
    }
  };

  /**
   * Close EditFile modal.  Optionally displays a confirm dialogue
   */
  const cancel = () => {
    if ( cancelConfirm ) {
      setConfirm( {
        open: true,
        headline: 'Are you sure you want to cancel uploading these files?',
        cancelButton: 'No, continue ',
        confirmButton: 'Yes, cancel',
        onCancel: () => {
          close();
        },
        onConfirm: () => {
          onCancel();
          close();
        },
      } );
    } else {
      onCancel();
    }
  };

  const isLast = index => index === screens.length - 1;
  const isActive = index => index === activeScreen;

  /**
   * Display applicable step
   * @param {number} index screen index
   */
  const renderStep = index => (
    <div key={ `step${index}` }>
      <span className={ `${styles.step} ${isActive( index ) ? styles.active : ''}` }>
        { `Step ${index + 1}` }
      </span>
      { !isLast( index ) && <span className={ styles.arrow }>&gt;</span> }
    </div>
  );


  const renderRow = ( screen, file ) => (
    <EditFileGridRow
      key={ file.id }
      screen={ screen }
      file={ file }
      showCompletionTracker={ !!showCompletionTracker }
      onUpdate={ onUpdate }
      onRemove={ remove }
    />
  );

  const renderHeaderRow = screen => (
    <EditFileGridRow
      key={ `header_${screen.name}` }
      screen={ screen }
      showCompletionTracker={ !!showCompletionTracker }
    />
  );

  const renderScreen = ( screen, i ) => (
    <div key={ `screen${i}` } className={ activeScreen === i ? styles.show : styles.hide }>
      { showHeader && renderHeaderRow( screen ) }
      { files.map( file => renderRow( screen, file ) ) }
    </div>
  );

  // Does the grd have action buttons?
  const hasActions = () => onCancel || onContinue || screens?.length > 1;

  /**
   * Checks to see if all fields on an applicable screen are complete
   * @param {object} screen
   */
  const screenFieldsCompleted = screen => {
    if ( !files.length ) {
      return true;
    }

    const fileFieldToComplete = files.filter( file => {
      // Loop thru fields associated with a screen &
      // if a field does not have a value, add file
      // to array of uncompleted screen file fields
      const fields = screen.filter( field => {
        const value = file[field.name];

        // if field is not applicable, mark as complete
        if ( !field.allowedFiles?.includes( getFileExt( file.name ) ) ) {
          return false;
        }

        return Array.isArray( value ) ? !value.length : !value;
      } );

      return fields.length;
    } );

    return fileFieldToComplete.length;
  };

  /**
   * Checks to see if all fields on all screens are complete
   */
  const allScreensFieldsCompleted = () => {
    const filesToComplete = screens.filter( screen => !!screenFieldsCompleted( screen ) );

    return !!filesToComplete.length;
  };


  return (
    <div>
      { screens?.length > 1
        && <div className={ styles.steps }>{ screens?.map( ( screen, index ) => renderStep( index ) ) }</div> }

      { /* grid(s) */ }
      { screens?.map( ( screen, i ) => renderScreen( screen, i ) ) }

      { typeof onAdd === 'function' && (
        /*
         Kind of screwy here as this button is using semantic and
         not a commons button.  Pulling in 'secondary' class and
         enhancing with 'secondary' css module class. This will not
         appear properly in storybook. Should rewrite as commons button
        */
        <ButtonAddFiles
          className={ `${styles.secondary} secondary` } // fix
          multiple
          accept={ allowedFiles }
          onChange={ add }
        >
          + Add Files
        </ButtonAddFiles>
      ) }

      { /* optional actions bar */ }
      { hasActions() && (
        <div className={ styles.actions }>
          { typeof onCancel === 'function' && (
            <Button className={ styles.link } onClick={ cancel }>
              Cancel
            </Button>
          ) }
          { screens?.length > 1 && (
            <Fragment>
              <Button
                className="primary"
                style={ { display: `${activeScreen ? 'none' : 'flex'}` } }
                disabled={ !!screenFieldsCompleted( screens[activeScreen] ) }
                onClick={ () => go( activeScreen + 1 ) }
              >
                Next
              </Button>
              <Button
                className="secondary"
                style={ { display: `${activeScreen ? 'flex' : 'none'}` } }
                onClick={ () => go( activeScreen - 1 ) }
              >
                Previous
              </Button>
            </Fragment>
          ) }

          { typeof onContinue === 'function' && (
            <Button
              className="primary"
              disabled={ allScreensFieldsCompleted() }
              style={ { display: `${activeScreen === screens.length - 1 ? 'flex' : 'none'}` } }
              onClick={ onContinue }
            >
              { continueBtn }
            </Button>
          ) }
        </div>
      ) }

      <DynamicConfirm { ...confirm } />
    </div>
  );
};

EditFileGrid.defaultProps = {
  continueBtn: 'Save',
};

EditFileGrid.propTypes = {
  screens: PropTypes.array,
  files: PropTypes.array,
  allowedFiles: PropTypes.string,
  duplicateConfirm: PropTypes.bool,
  removeConfirm: PropTypes.bool,
  cancelConfirm: PropTypes.bool,
  showHeader: PropTypes.bool,
  showCompletionTracker: PropTypes.bool,
  continueBtn: PropTypes.string,
  onContinue: PropTypes.func,
  onCancel: PropTypes.func,
  onAdd: PropTypes.func,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
};

export default EditFileGrid;

