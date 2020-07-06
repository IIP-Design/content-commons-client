import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import Filename from 'components/admin/Filename/Filename';
import { getFileExt } from 'lib/utils';
import removeIcon from 'static/icons/icon_remove.svg';
import styles from './EditFileGridRow.module.scss';


/**
 * Row within a grid used to edit, update and delete files
 */
const EditFileGridRow = ( {
  screen,
  file,
  showCompletionTracker,
  onUpdate,
  onRemove,
} ) => {
  const [fieldsToComplete, setFieldsToComplete] = useState( screen.length );

  useEffect( () => {
    if ( showCompletionTracker ) {
      if ( file ) {
        const fields = screen?.filter( _screen => {
          const value = file[_screen.name];

          // if field is not applicable, mark as complete
          if ( _screen?.allowedFiles?.length ) {
            if ( !_screen.allowedFiles?.includes( getFileExt( file.name ) ) ) {
              return false;
            }
          }

          return Array.isArray( value )
            ? !value.length
            : !value;
        } );

        setFieldsToComplete( fields.length );
      }
    }
  }, [
    screen, file, showCompletionTracker,
  ] );

  const onChange = data => {
    onUpdate( data );
  };

  const remove = () => {
    onRemove( file );
  };

  const isLast = ( select, i ) => !( i < screen.length - 1 );

  const renderLabel = ( select, i ) => (
    <div
      key={ select.label }
      className={ `${styles.selectBox} ${isLast( select, i ) ? '' : styles.marginRight}` }
    >
      {select.label}
      <span className={ styles.required }>*</span>
    </div>
  );

  const renderSelectBox = ( select, i ) => {
    const Component = select.component;
    const { name, allowedFiles, props } = select;
    const value = file[name];

    if ( allowedFiles?.length ) {
      if ( !allowedFiles?.includes( getFileExt( file.name ) ) ) {
        return (
          <div
            key={ `notApplicable_${select.label}` }
            className={ `${styles.selectBox} ${styles.notApplicable} ${
              isLast( select, i ) ? '' : styles.marginRight
            }` }
          >
            Not Applicable
          </div>
        );
      }
    }

    return (
      <Component
        key={ `selectBox_${select?.label?.toLowerCase()}` }
        id={ file.id }
        className={ `${styles.selectBox} ${isLast( select, i ) ? '' : styles.marginRight}` }
        // onChange={ ( _, data ) => onChange( data ) }
        onChange={ ( e, data ) => {
          console.log( e?.target.textContent );
          if ( data.name === 'style' ) {
            const dropdownSelectionText = e?.target.textContent;
            const dataWithSelectionName = {
              ...data,
              styleSelection: dropdownSelectionText || '',
            };

            onChange( dataWithSelectionName );

            return;
          }
          onChange( data );
        } }
        filename={ file.name }
        value={ value }
        { ...props }
      />
    );
  };


  // If there is no file object, assume this is a header row
  if ( !file ) {
    return (
      <div
        className={ `${styles.grid} ${styles.header} ${
          showCompletionTracker ? styles.completion : ''
        }` }
      >
        {showCompletionTracker && <div />}
        <div className={ styles.filename }>Filename</div>
        <div className={ styles.label }>{screen?.map( ( _screen, i ) => renderLabel( _screen, i ) )}</div>
        <div />
      </div>
    );
  }

  return (
    <div className={ `${styles.grid}  ${showCompletionTracker ? styles.completion : ''}` }>
      {/* number of fields left to conplete  */}
      {showCompletionTracker && (
        <div>
          <span
            className={ styles.indicator }
            style={ { display: `${fieldsToComplete ? 'flex' : 'none'}` } }
            aria-hidden={ !!fieldsToComplete }
            aria-label="Fields left to complete"
          >
            {fieldsToComplete}
          </span>
          <Icon
            className={ styles.indicator }
            style={ { display: `${fieldsToComplete ? 'none' : 'flex'}` } }
            circular
            size="tiny"
            inverted
            color="green"
            name="check"
            aria-label="All fields completed"
          />
        </div>
      )}

      <Filename className={ styles.filename }>{file?.name}</Filename>

      <div className={ styles.selectBoxesContainer }>
        {screen?.map( ( _screen, i ) => renderSelectBox( _screen, i ) )}
      </div>

      {/* delete file  */}
      <Button onClick={ remove } className={ styles.cancel }>
        <span tooltip="Remove">
          <img src={ removeIcon } alt="Remove File Button" />
        </span>
      </Button>
    </div>
  );
};


EditFileGridRow.defaultProps = {};

EditFileGridRow.propTypes = {
  screen: PropTypes.oneOfType( [PropTypes.object, PropTypes.array] ),
  file: PropTypes.object,
  showCompletionTracker: PropTypes.bool,
  onUpdate: PropTypes.func,
  onRemove: PropTypes.func,
};

export default EditFileGridRow;

