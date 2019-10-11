import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { Button, Popup } from 'semantic-ui-react';
import { UNPUBLISH_VIDEO_PROJECT_MUTATION } from 'lib/graphql/queries/video';

const UnpublishProjects = props => {
  const {
    handleResetSelections,
    handleActionResult,
    showConfirmationMsg,
    unpublishVideoProject,
    selections,
  } = props;

  const published = selections.filter( p => p.status === 'PUBLISHED' );

  const unpublishProject = async project => {
    const result = await unpublishVideoProject( { variables: { id: project.id } } ).catch( error => ( {
      error,
      project,
      action: 'unpublish',
    } ) );
    handleActionResult( result );
  };

  const handleUnpublishProjects = async () => {
    await Promise.all( published.map( unpublishProject ) );
    handleResetSelections();
    showConfirmationMsg();
  };

  return (
    <Popup
      trigger={ (
        <Button
          className="unpublish"
          size="mini"
          basic
          onClick={ handleUnpublishProjects }
        >
          <span className="unpublish--text">Unpublish</span>
        </Button>
      ) }
      content="Unpublish Selection(s)"
      hideOnScroll
      inverted
      on={ ['hover', 'focus'] }
      size="mini"
    />
  );
};

UnpublishProjects.propTypes = {
  handleActionResult: PropTypes.func,
  handleResetSelections: PropTypes.func,
  showConfirmationMsg: PropTypes.func,
  unpublishVideoProject: PropTypes.func,
  selections: PropTypes.array,
};

export default graphql( UNPUBLISH_VIDEO_PROJECT_MUTATION, {
  name: 'unpublishVideoProject'
} )( UnpublishProjects );
