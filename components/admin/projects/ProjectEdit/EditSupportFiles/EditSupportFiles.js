/**
 *
 * EditSupportFiles
 *
 */

import withModal from 'components/admin/projects/ProjectEdit/withModal/withModal';

const EditSupportFiles = props => {
  const { modalTrigger, modalContent, options } = props;
  return withModal( props, modalTrigger, modalContent, options );
};

export default EditSupportFiles;
