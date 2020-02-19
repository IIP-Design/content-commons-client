import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getPluralStringOrNot } from 'lib/utils';
import { Modal, Card } from 'semantic-ui-react';
import Package from 'components/Package/Package';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import MediaObject from 'components/MediaObject/MediaObject';
import DosSeal from 'static/images/dos_seal.svg';
import './PackageCard.scss';

import Popover from 'components/popups/Popover/Popover';
import { getDateTimeTerms } from '../utils';

const PackageCard = ( { item, stretch } ) => {
  const {
    id,
    published,
    modified,
    owner,
    documents
  } = item;

  const formattedPublishedDate = (
    <time dateTime={ published }>{ moment( published ).format( 'LL' ) }</time>
  );

  const documentFilesCountDisplay = `${documents.length} ${getPluralStringOrNot( documents, 'file' )}`;

  return (
    <Card className={ `package_card ${stretch ? 'stretch' : ''}` }>
      <Card.Content>
        <Modal
          closeIcon
          trigger={ (
            <Card.Header>
              <h2>Guidance Package</h2>
              <p>{ formattedPublishedDate }</p>
            </Card.Header>
          ) }
        >
          <Modal.Content><Package item={ item } displayAsModal /></Modal.Content>
        </Modal>
        <Card.Meta className="meta--popup">
          <Popover
            className="fileList"
            trigger={ documentFilesCountDisplay }
          >
            <ul>
              { documents.map( doc => <li key={ doc.id }>{ doc.filename }</li> ) }
            </ul>
          </Popover>
        </Card.Meta>
        <Card.Meta>
          <MetaTerms
            className="date-time"
            unitId={ id }
            terms={ getDateTimeTerms( published, modified, 'LT, l' ) }
          />
        </Card.Meta>
        <Card.Meta>
          <MediaObject
            body={ <span style={ { fontSize: '11px' } }>{ owner }</span> }
            className="seal"
            img={ {
              src: DosSeal,
              alt: `${owner} Seal`,
              style: { height: '16px', width: '16px' }
            } }
          />
        </Card.Meta>
      </Card.Content>
    </Card>
  );
};

PackageCard.propTypes = {
  stretch: PropTypes.bool,
  item: PropTypes.object,
};

export default PackageCard;
