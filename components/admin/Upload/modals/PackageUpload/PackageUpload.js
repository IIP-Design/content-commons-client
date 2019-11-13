import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tab, Dimmer, Loader } from 'semantic-ui-react';
import PackageType from './PackageType/PackageType';
import PackageFiles from './PackageFiles/PackageFiles';
import './PackageUpload.scss';

const PackageUpload = props => {
  const { closeModal, updateModalClassname } = props;

  const [activeIndex, setActiveIndex] = useState( 0 );
  const [files, setFiles] = useState( [] );

  const goNext = () => {
    setActiveIndex( 1 );
  };

  const addPackageFiles = filesFromInputSelection => {
    const fileList = Array.from( filesFromInputSelection );
    console.log({fileList});
    setFiles( [...fileList] );
  };

  const accept = '.doc, .docx, .docm, .docb, .dotx, .dotm, .pdf';

  const panes = [
    {
      menuItem: 'Create New Package',
      render: () => (
        <Tab.Pane>
          <PackageType
            closeModal={ closeModal }
            updateModalClassname={ updateModalClassname }
            accept={ accept }
            goNext={ goNext }
            addPackageFiles={ addPackageFiles }
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: '',
      render: () => (
        <Tab.Pane>
          <PackageFiles
            closeModal={ closeModal }
            updateModalClassname={ updateModalClassname }
            accept={ accept }
            files={ files }
          />
        </Tab.Pane>
      )
    }
  ];

  return (
    <Tab
      activeIndex={ activeIndex }
      panes={ panes }
      className="packageUpload"
    />
  );
};

PackageUpload.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func
};

export default PackageUpload;
