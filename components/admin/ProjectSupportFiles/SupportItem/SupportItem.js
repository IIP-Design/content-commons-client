/**
 *
 * SupportItem
 *
 */
import React, {
  useState, useEffect, useRef, useContext
} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Loader, Popup } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import Focusable from 'components/Focusable/Focusable';
import ApolloError from 'components/errors/ApolloError';
import GeneralError from 'components/errors/GeneralError/GeneralError';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
// import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import { LANGUAGES_QUERY } from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import { getCount } from 'lib/utils';
import { isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import { UploadContext } from '../../ProjectEdit/VideoEdit/VideoEdit';

import './SupportItem.scss';

/* eslint-disable react/prefer-stateless-function */
const SupportItem = props => {
  const MAX_FILE_NAME_LENGTH = 45;
  const ITEM_LANG_PROPORTION = 0.3;
  const DELAY_INTERVAL = 1000;

  const listEl = useRef( null );
  const languageEl = useRef( null );
  const mounted = useRef( true );

  const uploadInProgress = useContext( UploadContext );

  const [error, setError] = useState( false );
  const [widths, setWidths] = useState( {
    listItem: 0,
    itemLang: 0
  } );

  const { item } = props;
  const { listItem, itemLang } = widths;

  const updateWidths = () => {
    if ( mounted.current ) {
      setWidths( {
        listItem: ( listEl.current && listEl.current.offsetWidth ) || 0,
        itemLang: ( languageEl.current && languageEl.current.offsetWidth ) || 0
      } );
    }
  };

  const debounceResize = debounce( updateWidths, DELAY_INTERVAL );

  const checkFileUrlStatus = async () => {
    if ( item && item.signedUrl ) {
      try {
        const options = {
          headers: {
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            Range: 'bytes=0-0'
          }
        };

        // the head req was not working with the signed url so using get and
        // simulating a head req but only returning 1 byte (see Range header above).
        // Rather hacky so should research a better way
        axios.get( item.signedUrl, options )
          .catch( err => {
            console.dir( err );
            setError( err.isAxiosError );
          } );
      } catch ( err ) {
        console.log( '' );
      }
    }
  };

  const hasError = () => {
    if ( item && typeof item.error !== 'undefined' ) {
      setError( item.error );
      return;
    }
    checkFileUrlStatus();
  };

  useEffect( () => {
    window.addEventListener( 'resize', debounceResize );
    updateWidths();

    return () => {
      window.removeEventListener( 'resize', debounceResize );
      mounted.current = false;
    };
  }, [] );

  useEffect( () => {
    hasError();
  }, [item.signedUrl] );

  if ( !item || !getCount( item ) ) return null;
  if ( props.data.loading ) return 'Loading...';
  if ( props.data.error ) return <ApolloError error={ props.data.error } />;

  /**
   * Truncates long strings with ellipsis
   * @param {string} str the string
   * @param {number} start index for first cutoff point
   * @param {number} end index for ending cutoff point
   * @param {*} replaceWith char to replace subset of string, default is ellipsis
   * @return truncated string
   */
  const getShortFileName = ( str, start, end, replaceWith = '...' ) => (
    `${str.substr( 0, start )}${replaceWith}${str.substr( -end )}`
  );

  /**
   * Determines an integer proportional
   * to a reference number
   * @param {number} reference
   * @return {number}
   */
  const getProportionalNumber = ( reference, proportion ) => (
    Math.floor( reference * proportion )
  );

  const isLongName = ( name = '', maxLength = MAX_FILE_NAME_LENGTH ) => {
    if ( name && typeof name === 'string' ) {
      return name.length > Math.abs( maxLength );
    }
    return false;
  };

  const isLongLang = ( itemWidth, reference, proportion ) => (
    reference > 0 && itemWidth >= getProportionalNumber( reference, proportion )
  );


  const normalizeLanguage = lang => {
    if ( typeof ( lang ) === 'string' ) { // will be object if coming from graphql
      return props.data.languages.filter( l => l.id === lang )[0];
    }
    return lang;
  };

  const normalizeItem = ( prop, defaultValue ) => {
    const fileProp = item[prop];

    if ( fileProp ) {
      return fileProp;
    } if ( item.input ) {
      return item.input[prop.replace( 'file', '' )];
    }
    return defaultValue;
  };

  const filename = normalizeItem( 'filename', '' );
  const filesize = normalizeItem( 'filesize', 0 );
  const language = normalizeLanguage( item.language );
  const strCutoff = isWindowWidthLessThanOrEqualTo( 900 ) ? 12 : 16;
  const shortFileName = getShortFileName( filename, strCutoff, strCutoff );
  const isLongFileName = isLongName( filename );
  const isLongLangName = isLongLang( itemLang, listItem, ITEM_LANG_PROPORTION );
  const isUploading = uploadInProgress && ( item.loaded < filesize );

  const popupStyle = {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    msWordBreak: 'break-all',
    wordBreak: 'break-word'
  };

  const renderName = ( str = '', isLang = false ) => {
    if ( ( !isLang && isLongFileName ) || ( isLang && isLongLangName ) ) {
      return (
        <Popup
          content={ str }
          size="mini"
          inverted
          on={ [
            'hover',
            'focus'
          ] }
          trigger={ (
            <span>
              <Focusable>
                { isLang ? str : shortFileName }
              </Focusable>
            </span>
            ) }
          style={ popupStyle }
        />
      );
    }
    return str;
  };

  return (
    <li
      key={ `${item.id}-${language.id}` }
      className={ `support-item ${( item.loaded < filesize ) ? 'new' : ''}` }
      ref={ listEl }
    >
      <span className="item-name" style={ error ? { color: '#cd2026' } : {} }>
        { isLongFileName && <VisuallyHidden>{ filename }</VisuallyHidden> }
        <span
          className={
            `item-name-wrap${isLongFileName ? ' hasEllipsis' : ''}`
          }
          aria-hidden={ isLongFileName }
        >
          { error
            ? <GeneralError msg={ renderName( filename ) } />
            : renderName( filename ) }
        </span>

        <Loader active={ isUploading } inline size="mini" style={ { marginLeft: '.5rem' } } />

      </span>

      <span className={ `item-lang${error ? ' error' : ''}` }>
        { error
          ? (
            null
            /* <FileRemoveReplaceButtonGroup
              onRemove={ () => console.log( 'removed' ) }
            /> */
          )
          : (
            <b
              className={
                `item-lang-wrap${isLongLangName ? ' hasEllipsis' : ''}`
              }
              ref={ languageEl }
            >
              { renderName( language.displayName, true ) }
            </b>
          ) }
      </span>
    </li>
  );
};


SupportItem.propTypes = {
  item: PropTypes.object,
  data: PropTypes.object
};

export default compose(
  graphql( LANGUAGES_QUERY )
)( SupportItem );
