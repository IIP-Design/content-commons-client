import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import moment from 'moment';

import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';
import MediaObject from 'components/MediaObject/MediaObject';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import TagsList from 'components/modals/ModalPostTags/ModalPostTags';

import DosSeal from 'static/images/dos_seal.svg';
import iconDocument from 'static/icons/icon_32px_document-white.png';

import { hasCssSupport } from 'lib/browser';
import { getCount } from 'lib/utils';

import './PressPackageItem.scss';

export const getDateTimeTerms = ( createdAt, updatedAt, format ) => {
  const isDocUpdated = updatedAt > createdAt;
  const dateTimeStamp = isDocUpdated ? updatedAt : createdAt;
  const label = isDocUpdated ? 'Updated' : 'Created';
  return [
    {
      definition: <time dateTime={ dateTimeStamp }>{ `${moment( dateTimeStamp ).format( format )}` }</time>,
      displayName: label,
      name: label
    }
  ];
};

const PressPackageItem = props => {
  const { file: doc, handleClick } = props;
  if ( !doc || !getCount( doc ) ) return null;

  const {
    id,
    published,
    modified,
    title,
    documentUse,
    excerpt,
    tags,
    owner,
  } = doc;

  // disallow <script></script> tags
  const parseHtml = htmlParser( {
    isValidNode: node => node.type !== 'script'
  } );

  return (
    <Card
      key={ id }
      as="button"
      className="press-package-item"
      type="button"
      { ...( handleClick ? { onClick: handleClick } : {} ) }
      { ...( hasCssSupport( 'display', 'grid' )
        ? { fluid: true }
        : { centered: true } ) }
    >
      <article className="container">
        <MediaObject
          className="document-use"
          body={ <span>{ documentUse }</span> }
          img={ {
            src: iconDocument,
            alt: 'document icon',
            style: { height: '30px', width: '30px' }
          } }
        />

        <InternalUseDisplay />

        <Card.Header as="header">
          <h2 className="title">{ title }</h2>
        </Card.Header>

        <Card.Content>
          { excerpt
            ? (
              <Fragment>
                <p>Excerpt:</p>
                <ReactMarkdown
                  className="excerpt"
                  source={ excerpt }
                  escapeHtml={ false }
                  astPlugins={ [parseHtml] }
                />
              </Fragment>
            )
            : <p>No excerpt available</p> }
        </Card.Content>

        <Card.Meta as="footer">
          <MetaTerms
            className="date-time"
            unitId={ id }
            terms={ getDateTimeTerms( published, modified, 'LL' ) }
          />

          { getCount( tags ) > 0 && <TagsList tags={ tags } /> }

          <MediaObject
            body={ <span>{ owner || 'U.S. Department of State' }</span> }
            className="seal"
            img={ {
              src: DosSeal,
              alt: `${owner || 'U.S. Department of State'} seal`,
              style: { height: '24px', width: '24px' }
            } }
          />
        </Card.Meta>
      </article>
    </Card>
  );
};

PressPackageItem.propTypes = {
  file: PropTypes.object,
  handleClick: PropTypes.func
};

export default PressPackageItem;
