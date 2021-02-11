import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Card } from 'semantic-ui-react';

import Package from 'components/Package/Package';
import Popover from 'components/popups/Popover/Popover';
import FileListDisplay from 'components/FileListDisplay/FileListDisplay';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import MediaObject from 'components/MediaObject/MediaObject';
import { getPluralStringOrNot } from 'lib/utils';
import useAPIRequest from 'lib/hooks/useAPIRequest';
import DosSeal from 'static/images/dos_seal.svg';
import { getDateTimeTerms, getElasticPkgDocs } from '../utils';

import './PackageCard.scss';

const PackageCard = ( { item, stretch } ) => {
  const {
    id,
    published,
    modified,
    owner,
    title,
    documents,
  } = item;

  const { response: fetchedDocs, error } = useAPIRequest( getElasticPkgDocs, [documents] );
  const documentFilesCountDisplay = `${documents.length} ${getPluralStringOrNot( documents, 'file' )}`;

  return (
    <Card className={ `package_card ${stretch ? 'stretch' : ''}` }>
      <Card.Content>
        <Modal
          closeIcon
          size="fullscreen"
          trigger={ (
            <Card.Header>
              <button id={ `packageCard_trigger_${id}` } className="title" type="button">
                <h2>{ title }</h2>
              </button>
            </Card.Header>
          ) }
        >
          <Modal.Content
            role="dialog"
            aria-modal="true"
            aria-labelledby={ `packageCard_trigger_${id}` }
          >
            <Package item={ { ...item, documents: fetchedDocs } } displayAsModal />
          </Modal.Content>
        </Modal>
        <Card.Meta className="meta--popup">
          <Popover id={ id } trigger={ documentFilesCountDisplay }>
            <FileListDisplay files={ fetchedDocs } fileType="document" error={ error } />
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
              style: { height: '16px', width: '16px' },
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
