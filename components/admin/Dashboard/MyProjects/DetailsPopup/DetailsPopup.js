import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Popup } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { isWindowWidthLessThanOrEqualTo } from 'lib/browser';
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

const renderPopup = ( projectType, id ) => {
  if ( projectType === 'video' ) {
    return <VideoDetailsPopup id={ id } />;
  }
  if ( projectType === 'image' ) {
    return <ImageDetailsPopup id={ id } />;
  }
};

const DetailsPopup = props => {
  const { id } = props;
  const [windowWidth, setWindowWidth] = useState( 0 );
  const [detailsPopupOpen, setDetailsPopupOpen] = useState( false );

  useEffect( () => {
    const handleResize = () => {
      setWindowWidth( isWindowWidthLessThanOrEqualTo( 400 ) );
      setDetailsPopupOpen( false );
    };
    window.addEventListener( 'resize', handleResize );

    const itemsTable = document.querySelector( '.items_table' );
    const handleTableScroll = () => setDetailsPopupOpen( false );
    itemsTable.addEventListener( 'scroll', handleTableScroll );

    return () => {
      window.removeEventListener( 'resize', handleResize );
      itemsTable.removeEventListener( 'scroll', handleTableScroll );
    };
  } );

  return (
    <Query query={ CHECK_PROJECT_TYPE_QUERY } variables={ { id: props.id } }>
      {
        ( { loading, error, data } ) => {
          if ( loading ) return <p>Loading....</p>;
          if ( error ) return <ApolloError error={ error } />;

          if ( data.videoProject ) {
            const { projectType } = data.videoProject;
            return (
              <Popup
                className="detailsFiles_popup"
                trigger={ (
                  <button
                    type="button"
                    className="linkStyle myProjects_data_actions_action"
                    data-projectitempopup="detailsPopup"
                  >
                    Details
                  </button>
                ) }
                content={ renderPopup( projectType, id ) }
                on="click"
                position={ windowWidth <= 400 ? 'bottom right' : 'bottom center' }
                hideOnScroll
                keepInViewPort={ false }
                open={ detailsPopupOpen }
                onOpen={ () => setDetailsPopupOpen( true ) }
                onClose={ () => setDetailsPopupOpen( false ) }
              />
            );
          }

          return <p>There are no supporting files for this project.</p>;
        }
      }
    </Query>
  );
};

DetailsPopup.propTypes = {
  id: PropTypes.string
};

export default DetailsPopup;
