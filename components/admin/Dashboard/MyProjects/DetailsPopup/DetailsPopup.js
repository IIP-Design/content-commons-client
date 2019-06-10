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
  if ( projectType === 'VideoProject' ) {
    return <VideoDetailsPopup id={ id } />;
  }
  if ( projectType === 'ImageProject' ) {
    return <ImageDetailsPopup id={ id } />;
  }
};

const DetailsPopup = props => {
  const { id } = props;
  const [detailsPopupOpen, setDetailsPopupOpen] = useState( false );

  const handleResize = debounce( () => {
    /* eslint-disable no-use-before-define */
    handleClose();
  }, 500, { leading: true, trailing: false } );

  const handleTableScroll = debounce( () => {
    /* eslint-disable no-use-before-define */
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
            const { __typename } = data.videoProject;
            return (
              // 06/10/19 - Updating button text from "Details" to "Files"
              // if DetailsPopup will contain content other than files in future,
              // will add conditional to display "Details" text along with "Files"/"Other Content"
              // subheaders within popup
              <Popup
                className="detailsFiles_popup"
                trigger={ (
                  <button
                    type="button"
                    className="linkStyle myProjects_data_actions_action"
                    data-projectitempopup="detailsPopup"
                  >
                    Files
                  </button>
                ) }
                content={ renderPopup( __typename, id ) }
                on="click"
                position="bottom left"
                keepInViewPort
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
  id: PropTypes.string
};

export default DetailsPopup;
