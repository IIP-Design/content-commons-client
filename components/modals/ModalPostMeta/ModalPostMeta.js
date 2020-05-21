import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { contentRegExp } from 'lib/utils';
import PressSourceMeta from 'components/PressSourceMeta/PressSourceMeta';

import './ModalPostMeta.scss';

const ModalPostMeta = ( {
  type,
  author,
  sourcelink,
  logo,
  source,
  datePublished,
  originalLink,
  releaseType,
  textDirection,
} ) => {
  const isRTL = textDirection === 'rtl';
  const isDocument = type && type === 'document';
  const contentSite = contentRegExp( sourcelink );

  const renderSourceItem = () => {
    if ( isDocument ) {
      return (
        <PressSourceMeta author={ author } logo={ logo } source={ source } releaseType={ releaseType } />
      );
    }

    // check if content from content*.america.gov
    if ( contentSite ) return null;

    const logoOnlySources = ['VOA Editorials'];

    let sourceItem = null;

    const onlyLogo = !source || logoOnlySources.includes( source );
    const withSourceName = source && !logoOnlySources.includes( source ) && !sourcelink;

    const logoImg = (
      <img
        src={ logo }
        alt={ source || '' }
        className={ `modal_postmeta_logo${withSourceName ? '--withSource_img' : ''}` }
        style={ withSourceName ? { [isRTL ? 'marginLeft' : 'marginRight']: '6px' } : {} }
      />
    );

    // Logo (with or without source and sourcelink)
    if ( logo ) {
      if ( sourcelink ) { // Logo and sourcelink (with or without source)
        sourceItem = (
          <a href={ sourcelink } target="_blank" rel="noopener noreferrer">
            { logoImg }
          </a>
        );
      } else if ( !onlyLogo ) { // Logo and source, no sourcelink
        sourceItem = (
          <span className="modal_postmeta_logo--withSource">
            { logoImg }
            <span className="modal_postmeta_logo--withSource_source">{ source }</span>
          </span>
        );
      } else {
        sourceItem = logoImg; // Logo, no source or sourcelink
      }
    }

    // No logo
    if ( !logo ) {
      sourceItem = (
        <span className="modal_postmeta_content">
          { sourcelink && source && ( // No logo, source & sourcelink
            <Fragment>
              { 'Source: ' }
              <a href={ sourcelink } target="_blank" rel="noopener noreferrer">{ source }</a>
            </Fragment>
          ) }
          { sourcelink && !source && ( // No logo or source, sourcelink
            <Fragment>
              { 'Source: ' }
              <a href={ sourcelink } target="_blank" rel="noopener noreferrer">{ sourcelink }</a>
            </Fragment>
          ) }
          { !sourcelink && source && `Source: ${source}` /* No logo or sourcelink, source */ }
        </span>
      );
    }

    return sourceItem;
  };

  return (
    <section className="modal_section modal_section--postMeta">
      { renderSourceItem() }
      { /* Author displayed only on Dashboard */ }
      { author?.firstName && author?.lastName && (
        <span className="modal_postmeta_content">
          { `Author: ${author.firstName} ${author.lastName}` }
        </span>
      ) }
      <span className="modal_postmeta_content">
        { datePublished
          ? `Date Published: ${moment( datePublished ).format( 'MMMM DD, YYYY' )}`
          : 'Date Published: '}
      </span>
      {
        originalLink
        && !contentSite
        && <a href={ originalLink } target="_blank" rel="noopener noreferrer">View Original</a>
      }
    </section>
  );
};

ModalPostMeta.propTypes = {
  textDirection: PropTypes.string,
  type: PropTypes.string,
  releaseType: PropTypes.string,
  sourcelink: PropTypes.string,
  author: PropTypes.oneOfType( [
    PropTypes.string,
    PropTypes.object,
  ] ),
  logo: PropTypes.string,
  source: PropTypes.string,
  datePublished: PropTypes.string,
  originalLink: PropTypes.string,
};

export default ModalPostMeta;
