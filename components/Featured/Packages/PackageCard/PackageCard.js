import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getPluralStringOrNot } from 'lib/utils';
import { getDateTimeTerms } from 'components/admin/PackagePreview/PressPackageItem/PressPackageItem';
import { Modal, Card } from 'semantic-ui-react';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import MediaObject from 'components/MediaObject/MediaObject';
import DosSeal from 'static/images/dos_seal.svg';
import './PackageCard.scss';

const PackageCard = ( { item } ) => {
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
    <Modal
      closeIcon
      trigger={ (
        <Card className="package_card">
          <Card.Content>
            <Card.Header>
              <h2>Guidance Package</h2>
              <p>{ formattedPublishedDate }</p>
            </Card.Header>
            <Card.Meta>{ documentFilesCountDisplay }</Card.Meta>
            <Card.Meta>
              <MetaTerms
                className="date-time"
                unitId={ id }
                terms={ getDateTimeTerms( published, modified, 'LT, l' ) }
              />
            </Card.Meta>
            <Card.Meta>
              <MediaObject
                body={ <span style={ { fontSize: '12px' } }>{ owner }</span> }
                className="seal"
                img={ {
                  src: DosSeal,
                  alt: `${owner} Seal`,
                  style: { height: '20px', width: '20px' }
                } }
              />
            </Card.Meta>
          </Card.Content>
        </Card>
      ) }
      content="PACKAGE MODAL"
    />
  );
};

PackageCard.propTypes = {
  item: PropTypes.object,
};

export default PackageCard;
