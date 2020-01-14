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
import iconPost from 'static/icons/icon_32px_post.png';

import { hasCssSupport } from 'lib/browser';
import { getCount, getTransformedLangTaxArray } from 'lib/utils';

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
    createdAt, updatedAt, content, use
  } = doc;

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
    // (\x23\s*){3}/g regex is unsafe, so commenting out for now
    // const end = getIndex( paragraphs, /(\x23\s*){3}/g ) || -1;

    const longestParagraph = paragraphs
      // .slice( start === 0 ? start : start + 1, end )
      .slice( start === 0 ? start : start + 1 )
      .reduce( ( longest, p ) => {
        if ( p.length && p.length > longest.length ) {
          longest = p; // eslint-disable-line
        }
        return longest;
      }, '' );

    return `${longestParagraph}</p>`;
  };

  // disallow <script></script> tags
  const parseHtml = htmlParser( {
    isValidNode: node => node.type !== 'script'
  } );

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
            body={ <span>{ use?.name || '' }</span> }
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
          { content?.html
            ? (
              <Fragment>
                <p>Excerpt:</p>
                <ReactMarkdown
                  className="excerpt"
                  source={ getLongestParagraph() }
                  // must sanitize html during docx conversion
                  escapeHtml={ false }
                  astPlugins={ [parseHtml] }
                />
              </Fragment>
            )
            : <p>No text available</p> }
        </Card.Content>

        <Card.Meta as="footer">
          <MetaTerms
            className="date-time"
            unitId={ doc.id }
            terms={ getDateTimeTerms( createdAt, updatedAt, 'LL' ) }
          />

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
