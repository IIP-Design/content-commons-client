import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import debounce from 'lodash/debounce';
import { Popup } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import './DetailsPopup.scss';

const VideoDetailsPopup = dynamic( () => import( './VideoDetailsPopup' ) );
const PackageDetailsPopup = dynamic( () => import( './PackageDetailsPopup' ) );

const CHECK_PROJECT_TYPE_QUERY = gql`
  query CheckProjectType( $id: ID! ) {
    videoProject( id: $id ) {
      id
      projectType
    }
  }
`;

// const CHECK_TYPE_QUERY = gql`
//   query CheckTypeQuery( $id: ID! ) {
//     videoProject( id: $id ) {
//       id
//       projectType
//     }
//     package( id: $id ) {
//       id
//     }
//   }
// `;

const renderPopup = ( projectType, id ) => {
  if ( projectType === 'VideoProject' ) {
    return <VideoDetailsPopup id={ id } />;
  }
  if ( projectType === 'Package' ) {
    return <PackageDetailsPopup id={ id } />;
  }
};

const DetailsPopup = props => {
  const { id } = props;
  const [detailsPopupOpen, setDetailsPopupOpen] = useState( false );

  /**
   * Handle popup behavior on scroll instead of native Popup component hideOnScroll prop
   * Allows to scroll popup (Files) w/ scrollbars w/o immediately closing
   */
  useEffect( () => {
    const handlePopupScroll = () => setDetailsPopupOpen( false );
    window.addEventListener( 'scroll', handlePopupScroll );
    return () => window.removeEventListener( 'scroll', handlePopupScroll );
  }, [] );

  /**
   * Handle memory leak with set state fn call
   * (i.e., setDetailsPopupOpen) on unmounted component.
   */
  let isMounted = true;
  useEffect( () => () => { isMounted = false; }, [] );

  const handleResize = debounce( () => {
    /* eslint-disable no-use-before-define */
    handleClose();
  }, 500, { leading: true, trailing: false } );

  const handleOpen = () => {
    setDetailsPopupOpen( true );
    window.addEventListener( 'resize', handleResize );
  };

  const handleClose = () => {
    window.removeEventListener( 'resize', handleResize );
    const itemsTable = document.querySelector( '.items_table' );
    if ( itemsTable && isMounted ) {
      setDetailsPopupOpen( false );
    }
  };

  const { loading, error, data } = useQuery( CHECK_PROJECT_TYPE_QUERY, {
    variables: { id: props.id }
  } );

  if ( loading ) return <p>Loading....</p>;
  if ( error ) return <ApolloError error={ error } />;
  // if ( !data.videoProject && !data.package ) return null;

  // TEMP
  if ( id === 'package123' ) {
    data.package = {
      __typename: 'Package',
      id,
    };
  }

  // const { __typename } = data.videoProject;
  let __typename;
  if ( data.videoProject != null ) __typename = data.videoProject.__typename;
  if ( data.package != null ) __typename = data.package.__typename;

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
          className="linkStyle projects_data_actions_action"
          data-projectitempopup="detailsPopup"
        >
          Files
        </button>
      ) }
      content={ renderPopup( __typename, id ) }
      on="click"
      position="bottom left"
      open={ detailsPopupOpen }
      onOpen={ handleOpen }
      onClose={ handleClose }
    />
  );
};

DetailsPopup.propTypes = {
  id: PropTypes.string
};

export default DetailsPopup;
