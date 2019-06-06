import React from 'react';
import moment from 'moment';
import { string } from 'prop-types';
import { contentRegExp } from 'lib/utils';
import './ModalPostMeta.scss';

const ModalPostMeta = props => {
  const {
    author,
    sourcelink,
    logo,
    source,
    datePublished,
    originalLink
  } = props;

  const contentSite = contentRegExp( sourcelink );
  let sourceItem = <div />;
  if ( logo && sourcelink && !contentSite ) {
    sourceItem = (
      <a href={ sourcelink } target="_blank" rel="noopener noreferrer">
        <img src={ logo } alt={ source } className="modal_postmeta_logo" />
      </a>
    );
  } else if ( logo ) {
    sourceItem = <img src={ logo } alt={ source } className="modal_postmeta_logo" />;
  } else if ( sourcelink && !contentSite ) {
    sourceItem = (
      <span className="modal_postmeta_content">
        Source:
        { ' ' }
        <a href={ sourcelink } target="_blank" rel="noopener noreferrer">{ source }</a>
      </span>
    );
  } else {
    sourceItem = ( source && !contentSite )
      ? <span className="modal_postmeta_content">Source: { source }</span>
      : <div />;
  }

  return (
    <section className="modal_section modal_section--postMeta">
      { sourceItem }
      { author
        && (
        <span className="modal_postmeta_content">
          { `Author: ${author}` }
        </span>
        )
      }
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
  author: string,
  sourcelink: string,
  logo: string,
  source: string,
  datePublished: string,
  originalLink: string
};

export default ModalPostMeta;
