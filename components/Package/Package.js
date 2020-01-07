import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { formatDate } from 'lib/utils';

const styles = {
  header: {
    padding: '2.6em 1em',
    marginBottom: '5px',
    textAlign: 'center',
    fontSize: '15px',
    fontWeight: '400',
    color: '#fff',
    backgroundColor: '#112e51',
  },
  meta: {
    fontSize: '11px',
    lineHeight: '1.428',
    color: '#050505',
  },
  logo: {
    img: {
      width: '20px',
      marginRight: '4px',
    },
    source: {
      fontSize: '12px',
      color: '#050505',
    }
  },
};

const Package = ( { item } ) => {
  const {
    logo,
    published,
    modified,
    owner,
    documents
  } = item;

  const formattedModfiedDate = formatDate( modified, 'en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  } );

  const formattedModfiedTime = formatDate( modified, 'en-US', {
    hour: 'numeric',
    minute: '2-digit'
  } );

  return (
    <Card style={ { width: '100%', borderRadius: '8px' } }>
      <Card.Content style={ { paddingBottom: '0.5em' } }>
        <Card.Header style={ styles.header }>
          <p>Guidance Package</p>
          <p>{ formatDate( published ) }</p>
        </Card.Header>
        <Card.Meta style={ styles.meta }>{ documents.length } files</Card.Meta>
        <Card.Meta style={ styles.meta }>{ `Updated: ${formattedModfiedTime}, ${formattedModfiedDate}` }</Card.Meta>
        <Card.Meta style={ { marginTop: '3px' } }>
          <img src={ logo } alt="U.S. Department of State Seal" style={ styles.logo.img } />
          <span style={ styles.logo.source }>{ `GPA ${owner}` }</span>
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

Package.propTypes = {
  item: PropTypes.object,
};

export default Package;
