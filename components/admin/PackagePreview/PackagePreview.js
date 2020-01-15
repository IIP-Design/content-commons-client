import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Card, Loader } from 'semantic-ui-react';

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
import { getDateTimeTerms } from 'components/admin/PackagePreview/PressPackageItem/PressPackageItem';
import Share from 'components/Share/Share';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

import Package from 'components/Package/Package';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import { getCount, getPluralStringOrNot, getPreviewNotificationStyles } from 'lib/utils';

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

  // Structure obj for use in Package component
  const pkgItem = {
    id,
    published: createdAt,
    modified: updatedAt,
    team,
    type,
    title,
    packageFiles: documents
  };

  return <Package item={ pkgItem } isAdminPreview />;

  // return (
  //   <ModalItem
  //     className="package-preview"
  //     headline={ title }
  //     textDirection="LTR" // use LTR since pkg have no lang field
  //   >
  //     <Notification
  //       el="p"
  //       show
  //       customStyles={ getPreviewNotificationStyles() }
  //       msg="This is a preview of your package on Content Commons."
  //     />

  //     <MetaTerms
  //       className="date-time"
  //       unitId={ id }
  //       terms={ getDateTimeTerms( createdAt, updatedAt, 'LT, l' ) }
  //     />

  //     <div className="modal_options">
  //       <div className="trigger-container">
  //         <PopupTrigger
  //           tooltip="Share package"
  //           icon={ { img: shareIcon, dim: 18 } }
  //           show
  //           content={ (
  //             <Popup title="Share this package.">
  //               <Share
  //                 id={ id }
  //                 isPreview
  //                 language="en-us" // use en since pkg have no lang field
  //                 link="The direct link to the package will appear here."
  //                 site=""
  //                 title={ title }
  //                 type="package"
  //               />
  //             </Popup>
  //           ) }
  //         />

  //         <PopupTrigger
  //           tooltip={ getPluralStringOrNot( documents, 'Download file' ) }
  //           icon={ { img: downloadIcon, dim: 18 } }
  //           position="right"
  //           show
  //           content={ (
  //             <PopupTabbed
  //               title={ getPluralStringOrNot( documents, 'Package File' ) }
  //               panes={ [
  //                 {
  //                   title: getPluralStringOrNot( documents, 'Document' ),
  //                   component: (
  //                     <DownloadPkgFiles
  //                       files={ documents }
  //                       instructions={ getPluralStringOrNot( documents, 'Download Package File' ) }
  //                       isPreview
  //                     />
  //                   )
  //                 }
  //               ] }
  //             />
  //           ) }
  //         />
  //         <span className="file-count">
  //           { `(${getCount( documents )})` }
  //           <VisuallyHidden> documents in this package</VisuallyHidden>
  //         </span>
  //       </div>
  //     </div>

  //     <div className="package-items">
  //       <Card.Group>
  //         { getCount( files )
  //           ? files.map( file => (
  //             <PackageItemPreview
  //               key={ file.id }
  //               file={ file }
  //               team={ team }
  //               type={ type }
  //             />
  //           ) )
  //           : 'There are no files associated with this package.' }
  //       </Card.Group>
  //     </div>
  //   </ModalItem>
  // );
};

PackagePreview.propTypes = {
  id: PropTypes.string
};

export default PackagePreview;
