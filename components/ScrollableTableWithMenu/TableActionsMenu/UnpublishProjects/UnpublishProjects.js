import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Button, Popup } from 'semantic-ui-react';
import { UNPUBLISH_VIDEO_PROJECT_MUTATION } from 'lib/graphql/queries/video';
import { UNPUBLISH_PACKAGE_MUTATION } from 'lib/graphql/queries/package';

const UnpublishProjects = props => {
  const {
    team,
    handleResetSelections,
    handleActionResult,
    showConfirmationMsg,
    selections,
  } = props;

  // Determine which Query to run
  const setGraphQuery = () => {
    let query;
    const { contentTypes } = team;
    if ( contentTypes.includes( 'VIDEO' ) ) query = UNPUBLISH_VIDEO_PROJECT_MUTATION;
    if ( contentTypes.includes( 'PACKAGE' ) ) query = UNPUBLISH_PACKAGE_MUTATION;
    return query;
  };
  const graphQuery = setGraphQuery();

  const [unpublishDashboardProject, { loading, error }] = useMutation( graphQuery );

  const published = selections.filter( p => p.status === 'PUBLISHED' );

  const unpublishProject = async project => {
    const result = await unpublishDashboardProject( { variables: { id: project.id } } ).catch( error => ( {
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
  team: PropTypes.object,
  handleActionResult: PropTypes.func,
  handleResetSelections: PropTypes.func,
  showConfirmationMsg: PropTypes.func,
  selections: PropTypes.array,
};

export default UnpublishProjects;
