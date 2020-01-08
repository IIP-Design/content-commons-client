import React from 'react';
import moment from 'moment';
import { string } from 'prop-types';
import { contentRegExp } from 'lib/utils';
import PressSourceMeta from 'components/PressSourceMeta/PressSourceMeta';
import './ModalPostMeta.scss';

const ModalPostMeta = props => {
  const {
    type,
    author,
    sourcelink,
    logo,
    source,
    datePublished,
    originalLink,
    releaseType,
    textDirection,
  } = props;

  const isRTL = textDirection === 'RTL';
  const isDocumentOrPackage = type && ( type === 'document' || type === 'package' );
  const contentSite = contentRegExp( sourcelink );

  const renderSourceItem = () => {
    if ( isDocumentOrPackage ) {
      return (
        <PressSourceMeta logo={ logo } source={ source } releaseType={ releaseType } />
      );
    }

    // check if content from content*.america.gov
    if ( contentSite ) return null;

    const logoOnlySources = [
      'VOA Editorials',
    ];

    let sourceItem = <div />;

    // logo w/ sourcelink
    const logoAndSourcelink = logo && sourcelink;
    // logo w/ source name
    const logoWithSourceName = logo && source && !logoOnlySources.includes( source ) && !sourcelink;
    // only logo
    const onlyLogo = logo && ( !source || logoOnlySources.includes( source ) ) && !sourcelink;
    // only sourcelink
    const onlySourceLink = !logo && sourcelink;
    // only source name
    const onlySourceName = !logo && source && !sourcelink;

    if ( logoAndSourcelink ) {
      sourceItem = (
        <a href={ sourcelink } target="_blank" rel="noopener noreferrer">
          <img src={ logo } alt={ source } className="modal_postmeta_logo" />
        </a>
      );
    }
    if ( logoWithSourceName ) {
      sourceItem = (
        <span className="modal_postmeta_logo--withSource">
          <img
            src={ logo }
            alt={ source }
            className="modal_postmeta_logo--withSource_img"
            style={ { [isRTL ? 'marginLeft' : 'marginRight']: '6px' } }
          />
          <span className="modal_postmeta_logo--withSource_source">{ source }</span>
        </span>
      );
    }
    if ( onlyLogo ) {
      sourceItem = <img src={ logo } alt={ source } className="modal_postmeta_logo" />;
    }
    if ( onlySourceLink ) {
      sourceItem = (
        <span className="modal_postmeta_content">
          Source:
          { ' ' }
          <a href={ sourcelink } target="_blank" rel="noopener noreferrer">{ source }</a>
        </span>
      );
    }
    if ( onlySourceName ) {
      sourceItem = <span className="modal_postmeta_content">Source: { source }</span>;
    }

    return sourceItem;
  };

  return (
    <section className="modal_section modal_section--postMeta">
      { renderSourceItem() }
      { /* Author displayed only on Dashboard */ }
      { author && (
        <span className="modal_postmeta_content">{ `Author: ${author.firstName} ${author.lastName}` }</span>
      ) }
      <span className="modal_postmeta_content">
        { `Date Published: ${moment( datePublished ).format( 'MMMM DD, YYYY' )}` }
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
  textDirection: string,
  type: string,
  releaseType: string,
  sourcelink: string,
  author: string,
  logo: string,
  source: string,
  datePublished: string,
  originalLink: string
};

export default ModalPostMeta;
