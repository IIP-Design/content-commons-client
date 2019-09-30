import React from 'react';
import Link from 'next/link';
import { List } from 'semantic-ui-react';

import './DocumentationMenu.scss';

const DocumentationSidebar = () => {
  const sidebarItems = [
    {
      name: 'downloadingcontent',
      to: '/documentation/download',
      label: 'Downloading Content'
    },
    {
      name: 'embeddingcontent',
      to: '/documentation/embed',
      label: 'Embedding Content'
    },
    {
      name: 'searchingcontent',
      to: '/documentation/search',
      label: 'Searching for Content'
    },
    {
      name: 'uploadingvideo',
      to: '/documentation/uploadingvideo',
      label: 'Uploading a Video'
    },
    {
      name: 'signingup',
      to: '/documentation/login',
      label: 'Signing Up and Logging In'
    }
  ];
  return (
    <List horizontal divided className="documentation-nav">
      { sidebarItems.map( item => (
        <List.Item key={ item.name }>
          <Link href={ item.to }>
            <a className="footer_link"> { item.label }</a>
          </Link>
        </List.Item>
      ) ) }
    </List>
  );
};

export default DocumentationSidebar;
