/**
 *
 * SupportFileTypeList
 *
 */

import React, { Fragment } from 'react';
import {
  array, bool, object, string
} from 'prop-types';
import { Button } from 'semantic-ui-react';

import EditSupportFiles from 'components/admin/projects/ProjectEdit/EditSupportFiles/EditSupportFiles';
import EditSupportFilesContent from 'components/admin/projects/ProjectEdit/EditSupportFilesContent/EditSupportFilesContent';
import IconPopup from 'components/admin/projects/ProjectEdit/IconPopup/IconPopup';
import SupportItem from 'components/admin/projects/ProjectEdit/SupportItem/SupportItem';
import Placeholder from 'components/admin/projects/shared/Placeholder/Placeholder';

/* eslint-disable react/prefer-stateless-function */
class SupportFileTypeList extends React.PureComponent {
  state = {}

  toggleEditModal = () => (
    this.setState( prevState => (
      { isEditing: !prevState.isEditing }
    ) )
  )

  renderSupportItem = item => {
    const {
      projectId,
      fileType,
      hasSubmittedData
    } = this.props;

    if ( hasSubmittedData ) {
      return (
        <SupportItem
          key={ `${fileType}-${item.id}` }
          projectId={ { ...projectId } }
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
  }

  render() {
    const {
      headline,
      fileType,
      popupMsg,
      data,
      hasSubmittedData,
      hasUploaded
    } = this.props;

    if ( !data.length ) return null;

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
                        onClick: this.toggleEditModal
                      } }
                      contentProps={ {
                        data,
                        fileType,
                        closeEditModal: this.toggleEditModal
                      } }
                      modalTrigger={ Button }
                      modalContent={ EditSupportFilesContent }
                      options={ {
                        closeIcon: true,
                        onClose: this.toggleEditModal,
                        open: this.state.isEditing
                      } }
                    />
                  ) }
              </Fragment>
            ) }
        </h3>
        <ul>
          { data.map( this.renderSupportItem ) }
        </ul>
      </Fragment>
    );
  }
}

SupportFileTypeList.propTypes = {
  headline: string,
  projectId: object.isRequired,
  fileType: string,
  popupMsg: string,
  data: array.isRequired,
  hasSubmittedData: bool,
  hasUploaded: bool
};

export default SupportFileTypeList;
