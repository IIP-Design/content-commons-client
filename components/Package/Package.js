import React from 'react';
import { Card } from 'semantic-ui-react';
import dosSeal from 'static/images/dos_seal.svg';

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

const Package = props => (
  <Card style={ { width: '100%', borderRadius: '8px' } }>
    <Card.Content style={ { paddingBottom: '0.5em' } }>
      <Card.Header style={ styles.header }>
        <p>Guidance Package</p>
        <p>October 7, 2019</p>
      </Card.Header>
      <Card.Meta style={ styles.meta }>12 files</Card.Meta>
      <Card.Meta style={ styles.meta }>Updated: 12:08 PM, 10/14/19</Card.Meta>
      <Card.Meta style={ { marginTop: '3px' } }>
        <img src={ dosSeal } alt="U.S. Department of State Seal" style={ styles.logo.img } />
        <span style={ styles.logo.source }>GPA Press Office</span>
      </Card.Meta>
    </Card.Content>
  </Card>
);

export default Package;
