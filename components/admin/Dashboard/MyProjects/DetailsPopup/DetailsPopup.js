import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash/debounce';
import { Popup } from 'semantic-ui-react';
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

const renderPopup = ( projectType, id ) => {
  if ( projectType === 'video' ) {
    return <VideoDetailsPopup id={ id } />;
  }
  if ( projectType === 'image' ) {
    return <ImageDetailsPopup id={ id } />;
  }
};

const DetailsPopup = props => {
  const { id, windowWidth } = props;
  const [detailsPopupOpen, setDetailsPopupOpen] = useState( false );

  const handleResize = debounce( () => {
    handleClose();
  }, 50, { leading: false, trailing: true } );

  const handleTableScroll = debounce( () => {
    handleClose();
  }, 500, { leading: true, trailing: false } );

  const handleOpen = () => {
    setDetailsPopupOpen( true );
    window.addEventListener( 'resize', handleResize );

    const itemsTable = document.querySelector( '.items_table' );
    itemsTable.addEventListener( 'scroll', handleTableScroll );
  };

  const handleClose = () => {
    setDetailsPopupOpen( false );
    window.removeEventListener( 'resize', handleResize );

    const itemsTable = document.querySelector( '.items_table' );
    itemsTable.removeEventListener( 'scroll', handleTableScroll );
  };

  return (
    <Query query={ CHECK_PROJECT_TYPE_QUERY } variables={ { id: props.id } }>
      {
        ( { loading, error, data } ) => {
          if ( loading ) return <p>Loading....</p>;
          if ( error ) return <ApolloError error={ error } />;

          if ( data.videoProject ) {
            // const { projectType } = data.videoProject;
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
                content={ renderPopup( 'video', id ) } // TEMP UNTIL DATA MODEL EDIT
                on="click"
                position={ windowWidth <= 767 ? 'bottom right' : 'bottom center' }
                hideOnScroll
                keepInViewPort={ false }
                open={ detailsPopupOpen }
                onOpen={ handleOpen }
                onClose={ handleClose }
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
  id: PropTypes.string,
  windowWidth: PropTypes.number
};

export default DetailsPopup;
