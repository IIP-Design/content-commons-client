import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import { truncateAndReplaceStr } from 'lib/utils';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import './EditSupportFileRow.scss';

// Optimize re-renders as component could potentially have many rows
const areEqual = ( prevProps, nextProps ) => {
  const nextFile = nextProps.file;

  //  check for prop differences
  const entries = Object.entries( prevProps.file );
  const same = entries.every( ( [prop, value] ) => {
    if ( prop === 'id' ) {
      return true;
    }
    return nextFile[prop] === value;
  } );
  return same;
};

const EditSupportFileRow = props => {
  const {
    file: { id, name, language }, update, removeFile, replaceFile, accept
  } = props;

  // extract file type, i.e. get 'image' from the incoming type 'image/*' for example
  // item in first index shows the first capturing group in regex
  // let fileType = /(\w+)\/(\w+)/.exec( type );
  // fileType = ( fileType ) ? fileType[1] : '';
  const filename = ( name && name.length > 25 ) ? truncateAndReplaceStr( name, 25, 8 ) : name;

  return (
    <Grid.Row>

      { /* Filename */ }
      <Grid.Column width={ 8 } className="column">
        <div className="filename">
          { filename !== name
            ? (
              <Fragment>
                <span tooltip={ name }>{ filename }</span>
                <VisuallyHidden el="span">{ name }</VisuallyHidden>
              </Fragment>
            )
            : <span>{ name }</span>
          }
        </div>
      </Grid.Column>

      { /* Language */ }
      <Grid.Column width={ 6 }>
        <LanguageDropdown id={ id } value={ language } onChange={ update } required />
      </Grid.Column>

      { /* Actions */ }
      <Grid.Column width={ 2 } only="tablet computer" style={ { paddingLeft: 0 } }>
        <FileRemoveReplaceButtonGroup
          onReplace={ e => { replaceFile( id, e.target.files[0] ); } }
          onRemove={ () => { removeFile( id, name ); } }
          accept={ accept }
        />

      </Grid.Column>
    </Grid.Row>
  );
};


EditSupportFileRow.propTypes = {
  file: PropTypes.shape( {
    id: PropTypes.string,
    name: PropTypes.string,
    language: PropTypes.string,
  } ),
  accept: PropTypes.string,
  update: PropTypes.func,
  replaceFile: PropTypes.func,
  removeFile: PropTypes.func
};


export default React.memo( EditSupportFileRow, areEqual );
