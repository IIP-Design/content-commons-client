/**
 *
 * PreviewProject
 *
 */

import withModal from 'components/admin/ProjectEdit/withModal/withModal';

const PreviewProject = props => {
  const { modalTrigger, modalContent, options } = props;

  return withModal( props, modalTrigger, modalContent, options );
};

export default PreviewProject;
