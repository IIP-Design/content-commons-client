import React from 'react';
import PropTypes from 'prop-types';
import './DocumentationSidebar.scss';
import { List } from 'semantic-ui-react';


const DocumentationSidebar = ( { setURL } ) => {
  const sidebarItems = [
    {
      name: 'DOWNLOADINGDOC_URL',
      to: 'downloadingcontent',
      label: 'Downloading Content'
    },
    {
      name: 'EMBEDDINGDOC_URL',
      to: 'embeddingcontent',
      label: 'Embedding Content'
    },
    {
      name: 'searchingcontent',
      to: 'searchingcontent',
      label: 'Searching for Content'
    },
    {
      name: 'uploadingvideo',
      to: 'uploadingvideo',
      label: 'Uploading a Video'
    },
    {
      name: 'signingup',
      to: 'loggingin',
      label: 'Signing Up and Logging In'
    }
  ];
  return (
    <List horizontal divided className="sidebar-nav">
      { sidebarItems.map( item => (
        <List.Item key={ item.name }>
          { /* eslint-disable-next-line */ }
          <p className="item" onClick={() => setURL(item)}> { item.label }</p>
        </List.Item>
      ) ) }
    </List>

  );
};

DocumentationSidebar.propTypes = {
  setURL: PropTypes.func,
};
export default DocumentationSidebar;
