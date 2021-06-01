import PropTypes from 'prop-types';

import Filename from 'components/admin/Filename/Filename';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';

import styles from './FileList.module.scss';

const FileList = ( { files, onRemove, projectId } ) => (
  <ul className={ styles.list }>
    { files.map( file => {
      const { id, filename, input } = file;
      const _filename = projectId ? filename : input?.name;

      return (
        <li key={ id } className={ `${styles.item} ${projectId ? 'available' : styles.unavailable}` }>
          <span className={ styles.filename }>
            <Filename
              children={ _filename }
              filenameLength={ 48 }
              numCharsBeforeBreak={ 20 }
              numCharsAfterBreak={ 28 }
            />
          </span>

          <FileRemoveReplaceButtonGroup
            onRemove={ () => onRemove( id ) }
          />
        </li>
      );
    } ) }
  </ul>
);

FileList.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
  projectId: PropTypes.string,
};

export default FileList;
