import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown/VideoBurnedInStatusDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown/UseDropdown';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown/QualityDropdown';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import { truncateAndReplaceStr } from 'lib/utils';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { FilesContext } from '../EditPojectFilesModal';
import './EditVideoFileRow.scss';

// Optimize re-renders as component could potentially have many rows
// const areEqual = ( prevProps, nextProps ) => {
//   const nextFile = nextProps.file;

//   //  check for prop differences
//   const entries = Object.entries( prevProps.file );
//   const same = entries.every( ( [prop, value] ) => {
//     if ( prop === 'id' ) {
//       return true;
//     }
//     return nextFile[prop] === value;
//   } );
//   return same;
// };

const EditVideoFileRow = props => {
  const {
    file: {
      id, name, language, use, quality, videoBurnedInStatus
    }, update, removeFile, accept, step
  } = props;

  const files = useContext( FilesContext );

  // extract file type, i.e. get 'image' from the incoming type 'image/*' for example
  // item in first index shows the first capturing group in regex
  // let fileType = /(\w+)\/(\w+)/.exec( type );
  // fileType = ( fileType ) ? fileType[1] : '';
  const filename = ( name && name.length > 25 ) ? truncateAndReplaceStr( name, 20, 8 ) : name;

  return (
    <Grid.Row>

      { /* Filename */ }
      <Grid.Column width={ 6 } className="column">
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

      { step === 1 && (
      <Fragment>
        { /* Language */ }
        <Grid.Column width={ 4 }>
          <LanguageDropdown id={ id } value={ language } onChange={ update } required />
        </Grid.Column>

        { /* VideoBurnedInStatus */ }
        <Grid.Column width={ 4 }>
          <VideoBurnedInStatusDropdown id={ id } value={ videoBurnedInStatus } onChange={ update } required />
        </Grid.Column>
      </Fragment>
      )
      }

      { step === 2 && (
        <Fragment>
          { /* Type/use */ }
          <Grid.Column width={ 4 }>
            <UseDropdown id={ id } type="video" value={ use } onChange={ update } required />
          </Grid.Column>

          { /* Quality */ }
          <Grid.Column width={ 4 }>
            <QualityDropdown id={ id } type="video" value={ quality } onChange={ update } required />
          </Grid.Column>
        </Fragment>
      )
      }


      { /* Actions */ }
      <Grid.Column width={ 2 } style={ { paddingLeft: 0 } }>
        <FileRemoveReplaceButtonGroup
          onRemove={ () => { removeFile( id, name ); } }
          disableRemove={ ( files.length === 1 ) }
          accept={ accept }
        />

      </Grid.Column>
    </Grid.Row>
  );
};


EditVideoFileRow.propTypes = {
  file: PropTypes.shape( {
    id: PropTypes.string,
    name: PropTypes.string,
    language: PropTypes.string,
  } ),
  accept: PropTypes.string,
  step: PropTypes.number,
  update: PropTypes.func,
  removeFile: PropTypes.func
};


// export default React.memo( EditVideoFileRow, areEqual );

export default EditVideoFileRow;
