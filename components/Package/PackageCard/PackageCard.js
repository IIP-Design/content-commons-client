import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getPluralStringOrNot } from 'lib/utils';
import { Modal, Card, Loader, Dimmer, Segment } from 'semantic-ui-react';
import Package from 'components/Package/Package';
import Popover from 'components/popups/Popover/Popover';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import MediaObject from 'components/MediaObject/MediaObject';
import DosSeal from 'static/images/dos_seal.svg';
import { getDateTimeTerms, getElasticPkgDocs } from '../utils';
import './PackageCard.scss';

const PackageCard = ( { item, stretch } ) => {
  const {
    id,
    published,
    modified,
    owner,
    documents
  } = item;

  const [isLoading, setIsLoading] = useState( false );
  const [fetchedDocs, setFetchedDocs] = useState( [] );

  useEffect( () => {
    const fetchDocs = async () => {
      setIsLoading( true );
      const docs = await getElasticPkgDocs( documents );
      setFetchedDocs( docs );
      setIsLoading( false );
    };
    fetchDocs();
  }, [] );

  const formattedPublishedDate = (
    <time dateTime={ published }>{ moment( published ).format( 'LL' ) }</time>
  );

  const documentFilesCountDisplay = `${documents.length} ${getPluralStringOrNot( documents, 'file' )}`;

  return (
    <Card className={ `package_card ${stretch ? 'stretch' : ''}` }>
      <Card.Content>
        <Modal
          closeIcon
          size="fullscreen"
          trigger={ (
            <Card.Header>
              <button
                id={ `packageCard_trigger_${id}` }
                className="title"
                type="button"
              >
                <h2>Guidance Package</h2>
                <p>{ formattedPublishedDate }</p>
              </button>
            </Card.Header>
          ) }
        >
          <Modal.Content
            role="dialog"
            aria-modal="true"
            aria-labelledby={ `packageCard_trigger_${id}` }
          >
            <Package item={ item } displayAsModal />
          </Modal.Content>
        </Modal>
        <Card.Meta className="meta--popup">
          <Popover
            className="fileList"
            trigger={ documentFilesCountDisplay }
          >
            <ul>
              { isLoading && <Segment><Dimmer active inverted><Loader>Loading...</Loader></Dimmer></Segment> }
              { !isLoading && fetchedDocs.map( doc => <li key={ doc.id }>{ doc.filename }</li> ) }
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
