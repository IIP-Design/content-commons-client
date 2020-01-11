import React, { Fragment } from 'react';
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
import { getCount, getTransformedLangTaxArray } from 'lib/utils';

import './PressPackageItem.scss';

const PressPackageItem = props => {
  const { file: doc, handleClick } = props;
  if ( !doc || !getCount( doc ) ) return null;

  const { content, use } = doc;
  const isDocUpdated = doc.updatedAt > doc.createdAt;
  const dateTimeStamp = isDocUpdated ? doc.updatedAt : doc.createdAt;
  const label = isDocUpdated ? 'Updated' : 'Created';
  const dateTimeTerms = [
    {
      definition: <time dateTime={ dateTimeStamp }>{ `${moment( dateTimeStamp ).format( 'LL' )}` }</time>,
      displayName: label,
      name: label
    }
  ];

  const getIndex = ( array, regex ) => (
    array.reduce( ( ret, p, i ) => {
      if ( regex.test( p ) ) {
        ret = i; // eslint-disable-line
      }
      return ret;
    }, 0 )
  );

  const getLongestParagraph = () => {
    // is there a better way to get an excerpt?
    const paragraphs = content.html.split( /\s*<\/p>/ );

    /**
     * To improve chances of returning a relevant body
     * paragraph, slice the array to remove boilerplate
     * headings at top and clearances at bottom.
     */
    const start = getIndex( paragraphs, /(For Immediate Release)/g );
    // index for # # # line, ( # === \x23 hex value )
    const end = getIndex( paragraphs, /(\x23\s*){3}/g ) || -1;

    const longestParagraph = paragraphs
      .slice( start === 0 ? start : start + 1, end )
      .reduce( ( longest, p ) => {
        if ( p.length && p.length > longest.length ) {
          longest = p; // eslint-disable-line
        }
        return longest;
      }, '' );

    return `${longestParagraph}</p>`;
  };

  return (
    <Card
      key={ doc.id }
      as="button"
      className="press-package-item"
      onClick={ handleClick }
      type="button"
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
          { content && content.html
            ? (
              <Fragment>
                <p>Excerpt:</p>
                { /* eslint-disable-next-line */ }
                <div className="markup" dangerouslySetInnerHTML={ { __html: getLongestParagraph() } } />
              </Fragment>
            )
            : <p>No text available</p> }
        </Card.Content>

        <Card.Meta as="footer">
          <MetaTerms className="date-time" unitId={ doc.id } terms={ dateTimeTerms } />

          { Array.isArray( doc.tags )
            && getCount( doc.tags ) > 0
            && <TagsList tags={ getTransformedLangTaxArray( doc.tags ) } /> }

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
