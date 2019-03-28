/**
 *
 * SupportFileTypeList
 *
 */

import React, { Fragment, useState } from 'react';
import { array, bool, string } from 'prop-types';
import { Button } from 'semantic-ui-react';

import IconPopup from 'components/popups/IconPopup/IconPopup';
import Placeholder from 'components/Placeholder/Placeholder';
import EditSupportFiles from 'components/admin/projects/ProjectEdit/EditSupportFiles/EditSupportFiles';
import EditSupportFilesContent from 'components/admin/projects/ProjectEdit/EditSupportFilesContent/EditSupportFilesContent';
import SupportItem from 'components/admin/projects/ProjectEdit/SupportItem/SupportItem';

const SupportFileTypeList = props => {
  const [isEditing, setEditing] = useState( false );

  const {
    headline,
    data,
    fileType,
    projectId,
    popupMsg,
    hasSubmittedData,
    hasUploaded
  } = props;

  if ( !data.length ) return null;

  const toggleEditModal = () => {
    setEditing( prevIsEditing => !prevIsEditing );
  };

  const renderSupportItem = item => {
    if ( hasSubmittedData ) {
      return (
        <SupportItem
          key={ `${fileType}-${item.id}` }
          projectId={ projectId }
          fileType={ fileType }
          itemId={ item.id }
        />
      );
    }

    return (
      <Placeholder
        key={ `${fileType}-${item.id}` }
        parentEl="li"
        childEl="span"
        parentStyles={ {
          display: 'flex',
          justifyContent: 'space-between'
        } }
        childStyles={ {
          fileName: { width: '75%' },
          language: {
            width: '20%',
            marginRight: '0',
            backgroundColor: '#5b616b'
          }
        } }
      />
    );
  };

  return (
    <Fragment>
      <h3>{ `${headline} ` }
        { hasSubmittedData
          && (
            <Fragment>
              <IconPopup
                message={ popupMsg }
                iconSize="small"
                iconType="info circle"
                popupSize="mini"
              />
              { hasUploaded
                && (
                  <EditSupportFiles
                    triggerProps={ {
                      className: 'btn--edit',
                      content: 'Edit',
                      size: 'small',
                      basic: true,
                      onClick: toggleEditModal
                    } }
                    contentProps={ {
                      fileType,
                      projectId,
                      field: fileType === 'srt' ? 'filetype' : 'filetype_not',
                      closeEditModal: toggleEditModal
                    } }
                    modalTrigger={ Button }
                    modalContent={ EditSupportFilesContent }
                    options={ {
                      closeIcon: true,
                      onClose: toggleEditModal,
                      open: isEditing
                    } }
                  />
                ) }
            </Fragment>
          ) }
      </h3>
      <ul>
        { data.map( renderSupportItem ) }
      </ul>
    </Fragment>
  );
};

SupportFileTypeList.propTypes = {
  headline: string,
  projectId: string.isRequired,
  fileType: string,
  popupMsg: string,
  data: array.isRequired,
  hasSubmittedData: bool,
  hasUploaded: bool
};

export default SupportFileTypeList;
