import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal } from 'semantic-ui-react';
import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';

import PackageCard from 'components/Package/PackageCard/PackageCard';
import PlaybookCard from 'components/Playbook/PlaybookCard/PlaybookCard';
import DocumentCard from 'components/Document/DocumentCard/DocumentCard';
import GraphicCard from 'components/GraphicProject/GraphicCard/GraphicCard';
import useSignedUrl from 'lib/hooks/useSignedUrl';
import { getModalContent } from 'components/modals/utils';
import { contentRegExp } from 'lib/utils';

import logoDos from 'static/images/dos_seal.svg';

import './ResultItem.scss';
import './ResultItemRTL.scss';

const ResultItem = ( { item } ) => {
  const { signedUrl } = useSignedUrl( item.thumbnail );

  const getItemSource = direction => {
    let source;
    const textDir = direction === 'ltr' ? 'left' : 'right';

    if ( item.logo ) {
      source = (
        <div
          style={ {
            background: `url( ${item.logo} ) no-repeat ${textDir}`,
            backgroundSize: 'contain',
            height: '20px',
            margin: '6px 0 0',
            marginLeft: '-1px',
          } }
          alt={ item.site }
        />
      );
    }
    const dosOwners = [
      'GPA Video',
      'GPA Media Strategy',
      'GPA Design & Editorial',
      'U.S. Missions',
      'Bureau of African Affairs (AF)',
    ];

    if ( !source && item.type === 'video' && dosOwners.includes( item.owner ) ) {
      source = (
        <div style={ { display: 'block', marginTop: '2px' } }>
          <div
            style={ {
              background: `url( ${logoDos} ) no-repeat`,
              height: '16px',
              width: '16px',
              'float': textDir,
              marginLeft: textDir === 'left' ? '0' : '0.3em',
            } }
            alt={ item.owner }
          />
          <span style={ { marginTop: '1px', 'float': textDir } }>{ item.owner }</span>
        </div>
      );
    }
    if ( !source && item.type === 'video' ) source = item.owner;
    if ( !source && contentRegExp( item.site ) ) source = item.owner;
    if ( !source ) source = item.site;

    return item.type === 'video' || contentRegExp( item.site )
      ? source
      : <a target="_blank" rel="noopener noreferrer" href={ item.sourcelink }>{ source }</a>;
  };

  const renderCategory = ( category, index, arr ) => {
    let { name } = category;
    const key = `cat_${index}`;

    if ( index > 2 ) {
      return undefined;
    }
    if ( arr.length - 1 !== index && index < 2 ) {
      name += '  ·';
    }

    return <span key={ key }>{ name.toLowerCase() }</span>;
  };

  let textDirection = 'ltr';

  if ( item.selectedLanguageUnit ) {
    textDirection = item.selectedLanguageUnit.language.text_direction;
  } else if ( item.language && item.language.text_direction ) {
    textDirection = item.language.text_direction;
  }

  const action = `openModal - ${item.title}`;

  if ( item.type === 'package' ) {
    return <PackageCard item={ item } stretch />;
  }

  if ( item.type === 'playbook' ) {
    return <PlaybookCard item={ item } />;
  }

  if ( item.type === 'document' ) {
    return <DocumentCard file={ item } />;
  }

  if ( item.type === 'graphic' ) {
    return <GraphicCard item={ item } />;
  }

  return (
    <article className="ui card">
      <Modal
        closeIcon
        trigger={ (
          <div className="card_imgWrapper">
            <img src={ signedUrl } width="100%" height="100%" alt={ item?.title || '' } />
            <img data-action={ action } src={ item.icon } className="card_postIcon" alt={ item?.type ? `${item.type} icon` : '' } />
          </div>
        ) }
      >
        <Modal.Content>{ getModalContent( item ) }</Modal.Content>
      </Modal>
      <div className={ `content ${textDirection}` }>
        <header className="header card_header">
          { item?.visibility === 'INTERNAL'
            && <InternalUseDisplay style={ { margin: '0.5em auto .5em 0', fontWeight: 'normal' } } /> }
          <Modal closeIcon trigger={ <h2><button data-action={ action } type="button">{ item.title }</button></h2> }>
            <Modal.Content>{ getModalContent( item ) }</Modal.Content>
          </Modal>
        </header>
        <p className="description card_excerpt">
          { item.description }
        </p>
        <footer className="card_metadata">
          <time className="meta" dateTime={ item.published }>{ moment( item.published ).format( 'MMMM DD, YYYY' ) }</time>
          <p className="meta">{ item.categories && item.categories.map( renderCategory ) }</p>
          <p className="meta">{ getItemSource( textDirection ) }</p>
        </footer>
      </div>
    </article>
  );
};

ResultItem.propTypes = {
  item: PropTypes.object,
};

export default ResultItem;

/*
example: search lang = french
Is there a video marked as fr w/o burned in eng captions?
YES
  original =  french video + french SRT file"
  with Captions = french video w/burned in french captions + french SRT file"
NO
  original =  eng video + french SRT file"
  with Subtitles = eng video w/burned in french captions + french SRT file"

More = all available SRT files
*/
