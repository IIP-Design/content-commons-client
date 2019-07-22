import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Popup } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';

const UNPUBLISH_VIDEO_PROJECTS_MUTATION = gql`
  mutation UnpublishManyVideoProjects(
    $where: VideoProjectWhereInput) {
    unpublish: unpublishManyVideoProjects(where: $where) {
      count
    }
  }
`;

const UnpublishProjects = props => {
  const {
    handleResetSelections,
    handleUnpublish,
    handleUnpublishCacheUpdate,
    showConfirmationMsg
  } = props;

  return (
    <Mutation
      mutation={ UNPUBLISH_VIDEO_PROJECTS_MUTATION }
      update={ handleUnpublishCacheUpdate }
      onCompleted={ () => {
        handleResetSelections();
        showConfirmationMsg();
      } }
    >
      { ( unpublish, { error } ) => {
        if ( error ) return <ApolloError error={ error } />;
        return (
          <Popup
            trigger={ (
              <Button
                className="unpublish"
                size="mini"
                basic
                onClick={
                  () => handleUnpublish( unpublish )
                }
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
      } }
    </Mutation>
  );
};

UnpublishProjects.propTypes = {
  handleResetSelections: PropTypes.func,
  handleUnpublish: PropTypes.func,
  handleUnpublishCacheUpdate: PropTypes.func,
  showConfirmationMsg: PropTypes.func
};

export default UnpublishProjects;

export { UNPUBLISH_VIDEO_PROJECTS_MUTATION };
