import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ApolloError from 'components/errors/ApolloError';
import './DetailsPopup.scss';

const CHECK_PROJECT_TYPE_QUERY = gql`
  query CheckProjectType( $id: ID! ) {
    videoProject( id: $id ) {
      id
      projectType
    }
  }
`;

const VideoDetailsPopup = dynamic( () => import( './VideoDetailsPopup' ) );
const ImageDetailsPopup = dynamic( () => import( './ImageDetailsPopup' ) );

const DetailsPopup = props => (
  <Query query={ CHECK_PROJECT_TYPE_QUERY } variables={ { id: props.id } }>
    {
      ( { loading, error, data } ) => {
        if ( loading ) return <p>Loading....</p>;
        if ( error ) return <ApolloError error={ error } />;

        const { projectType } = data.videoProject;
        if ( projectType === 'video' ) {
          return <VideoDetailsPopup id={ props.id } />;
        }
        if ( projectType === 'image' ) {
          return <ImageDetailsPopup id={ props.id } />;
        }
        return <p>There are no supporting files for this project.</p>;
      }
    }
  </Query>
);

DetailsPopup.propTypes = {
  id: PropTypes.string
};

export default DetailsPopup;
