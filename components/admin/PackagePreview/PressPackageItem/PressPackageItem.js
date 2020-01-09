import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

import moment from 'moment';
import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';
import MediaObject from 'components/MediaObject/MediaObject';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import TagsList from 'components/modals/ModalPostTags/ModalPostTags';

import DosSeal from 'static/images/dos_seal.svg';
import iconPost from 'static/icons/icon_32px_post.png';

import { hasCssSupport } from 'lib/browser';
import { getCount } from 'lib/utils';

import './PressPackageItem.scss';

const PressPackageItem = props => {
  const { file: doc, handleClick } = props;
  if ( !doc || !getCount( doc ) ) return null;

  const { content, use } = doc;
  const isDocUpdated = doc.updatedAt > doc.createdAt;
  const docDateTime = isDocUpdated ? doc.updatedAt : doc.createdAt;
  const docDateTimeTerms = [
    {
      definition: <time dateTime={ docDateTime }>{ `${moment( docDateTime ).format( 'LL' )}` }</time>,
      displayName: isDocUpdated ? 'Updated' : 'Created',
      name: isDocUpdated ? 'Updated' : 'Created'
    }
  ];

  const getMarkup = () => {
    if ( content && content.html && typeof content.html === 'string' ) {
      /**
       * Arbitrarily display the first 8 paragraphs.
       * a better way?
       */
      return content.html.split( /\s*<\/p>/, 8 ).filter( n => n ).join( '' );
    }
    return '';
  };

  const getEnglishTags = tags => (
    tags.reduce( ( acc, tag ) => {
      const englishTag = ( tag && tag.translations && tag.translations.find( t => t.language.locale === 'en-us' ) ) || [];

      if ( getCount( englishTag ) && tag.id ) {
        acc.push( { id: tag.id, name: englishTag.name } );
      }
      return acc;
    }, [] )
  );

  return (
    <Card
      key={ doc.id }
      className="press-package-item"
      onClick={ handleClick }
      { ...( handleClick ? { onClick: handleClick } : {} ) }
      { ...( hasCssSupport( 'display', 'grid' )
        ? { fluid: true }
        : { centered: true } ) }
    >
      <article className="container">
        <div className="use-container">
          <MediaObject
            body={ <span>{ use && use.name ? use.name : '' }</span> }
            className="seal"
            img={ {
              src: DosSeal,
              alt: 'U.S. Department of State seal',
              style: { height: '30px', width: '30px' }
            } }
          />
          <img src={ iconPost } alt="document icon" className="icon" />
        </div>

        <InternalUseDisplay />

        <Card.Header as="header">
          <h2 className="title">{ doc.title || '' }</h2>
        </Card.Header>

        <Card.Content>
          { /* dangerouslySetInnerHTML for now */ }
          { content
            ? <div dangerouslySetInnerHTML={ { __html: getMarkup() } } /> // eslint-disable-line
            : <p>No text available</p> }
        </Card.Content>

        <Card.Meta as="footer">
          <MetaTerms className="date-time" unitId={ doc.id } terms={ docDateTimeTerms } />

          { Array.isArray( doc.tags )
            && getCount( doc.tags ) > 0
            && <TagsList tags={ getEnglishTags( doc.tags ) } /> }

          <MediaObject
            body={ <span>U.S. Department of State</span> }
            className="seal"
            img={ {
              src: DosSeal,
              alt: 'U.S. Department of State seal',
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
