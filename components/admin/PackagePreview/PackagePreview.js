import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Card, Loader } from 'semantic-ui-react';
import moment from 'moment';

import { PACKAGE_QUERY } from 'lib/graphql/queries/package';

import ApolloError from 'components/errors/ApolloError';
import DownloadPkgFiles from 'components/admin/download/DownloadPkgFiles/DownloadPkgFiles';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import ModalItem from 'components/modals/ModalItem/ModalItem';
import Notification from 'components/Notification/Notification';
import PackageItemPreview from 'components/admin/PackagePreview/PackageItemPreview/PackageItemPreview';
import Popup from 'components/popups/Popup';
import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from 'components/popups/PopupTabbed';
import Share from 'components/Share/Share';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import { getCount, getPluralStringOrNot } from 'lib/utils';

import './PackagePreview.scss';

const PackagePreview = ( { id } ) => {
  const { loading, error, data } = useQuery( PACKAGE_QUERY, {
    partialRefetch: true,
    variables: { id },
    displayName: 'PackageQuery',
    skip: !id
  } );

  if ( loading ) {
    return (
      <div
        className="preview-package-loader"
        style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
        />
        <p>Loading the package preview...</p>
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !data ) return null;

  const { pkg } = data;
  if ( !getCount( pkg ) ) return null;

  const {
    createdAt, updatedAt, title, team, type, documents
  } = pkg;

  // in future: const files = documents || files || etc.
  const files = documents;

  const isUpdated = updatedAt > createdAt;
  const dateTimeStamp = isUpdated ? updatedAt : createdAt;
  const dateTimeTerms = [
    {
      definition: <time dateTime={ dateTimeStamp }>{ `${moment( dateTimeStamp ).format( 'LT, l' )}` }</time>,
      displayName: isUpdated ? 'Updated' : 'Created',
      name: isUpdated ? 'Updated' : 'Created'
    }
  ];

  const previewMsgStyles = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    // match Semantic UI border-radius
    borderTopLeftRadius: '0.28571429rem',
    borderTopRightRadius: '0.28571429rem',
    padding: '1em 1.5em',
    fontSize: '1em',
    backgroundColor: '#fdb81e'
  };

  return (
    <ModalItem
      className="package-preview"
      headline={ title }
      textDirection="LTR" // use LTR since pkg have no lang field
    >
      <Notification
        el="p"
        show
        customStyles={ previewMsgStyles }
        msg="This is a preview of your package on Content Commons."
      />

      <MetaTerms className="date-time" unitId={ id } terms={ dateTimeTerms } />

      <div className="modal_options">
        <div className="trigger-container">
          <PopupTrigger
            tooltip="Share package"
            icon={ { img: shareIcon, dim: 18 } }
            show
            content={ (
              <Popup title="Share this package.">
                <Share
                  id={ id }
                  isPreview
                  language="en-us" // use en since pkg have no lang field
                  link="The direct link to the package will appear here."
                  site=""
                  title={ title }
                  type="package"
                />
              </Popup>
            ) }
          />

          <PopupTrigger
            tooltip={ getPluralStringOrNot( documents, 'Download file' ) }
            icon={ { img: downloadIcon, dim: 18 } }
            position="right"
            show
            content={ (
              <PopupTabbed
                title={ getPluralStringOrNot( documents, 'Package File' ) }
                panes={ [
                  {
                    title: getPluralStringOrNot( documents, 'Document' ),
                    component: (
                      <DownloadPkgFiles
                        files={ documents }
                        instructions={ getPluralStringOrNot( documents, 'Download Package File' ) }
                        isPreview
                      />
                    )
                  }
                ] }
              />
            ) }
          />
          <span className="file-count">
            { `(${getCount( documents )})` }
            <VisuallyHidden> documents in this package</VisuallyHidden>
          </span>
        </div>
      </div>

      <div className="package-items">
        <Card.Group>
          { getCount( files )
            ? files.map( file => (
              <PackageItemPreview
                key={ file.id }
                file={ file }
                team={ team }
                type={ type }
              />
            ) )
            : 'There are no files associated with this package.' }
        </Card.Group>
      </div>
    </ModalItem>
  );
};

PackagePreview.propTypes = {
  id: PropTypes.string
};

export default PackagePreview;
