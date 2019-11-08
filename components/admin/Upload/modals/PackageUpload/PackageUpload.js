import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tab, Dimmer, Loader } from 'semantic-ui-react';
import PackageType from './PackageType/PackageType';
import './PackageUpload.scss';

const PackageUpload = props => {
  const { closeModal, updateModalClassname } = props;

  const [activeIndex, setActiveIndex] = useState( 0 );

  const panes = [
    {
      menuItem: 'Create New Package',
      render: () => (
        <Tab.Pane>
          <PackageType
            closeModal={ closeModal }
            updateModalClassname={ updateModalClassname }
          />
        </Tab.Pane>
      )
    },
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
