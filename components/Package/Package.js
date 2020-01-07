import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { formatDate } from 'lib/utils';
import './Package.scss';

const Package = ( { item } ) => {
  const {
    logo,
    published,
    modified,
    owner,
    documents
  } = item;

  const formattedModifiedDate = formatDate( modified, 'en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  } );

  const formattedModifiedTime = formatDate( modified, 'en-US', {
    hour: 'numeric',
    minute: '2-digit'
  } );

  return (
    <Card className="package_card">
      <Card.Content>
        <Card.Header>
          <p>Guidance Package</p>
          <p>{ formatDate( published ) }</p>
        </Card.Header>
        <Card.Meta>{ documents.length } files</Card.Meta>
        <Card.Meta>{ `Updated: ${formattedModifiedTime}, ${formattedModifiedDate}` }</Card.Meta>
        <Card.Meta className="package_card_logo">
          <img src={ logo } alt="U.S. Department of State Seal" className="package_card_logo_img" />
          <span className="package_card_logo_source">{ `GPA ${owner}` }</span>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

Package.propTypes = {
  item: PropTypes.object,
};

export default Package;
