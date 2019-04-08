/**
 *
 * SupportItem
 *
 */
import React, { Fragment } from 'react';
import { object, string } from 'prop-types';
import {
  Icon, Loader, Popup, Progress
} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import debounce from 'lodash/debounce';

import Focusable from 'components/Focusable/Focusable';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import './SupportItem.scss';

/* eslint-disable react/prefer-stateless-function */
class SupportItem extends React.PureComponent {
  constructor( props ) {
    super( props );

    /**
     * @todo simulate upload for dev purposes;
     * replace for production
     * 1MB = 1,048,576 Bytes
     */
    this.MEGABYTE = 1048576;
    this.MIN_INTERVAL = 500;
    this.MAX_INTERVAL = 1500;
    this.MIN_MB_SEC = 1;
    this.MAX_MB_SEC = 5;
    this.STR_INDEX_PROPORTION = 0.04;
    this.ITEM_NAME_PROPORTION = 0.625;
    this.ITEM_LANG_PROPORTION = 0.3;
    this.DELAY_INTERVAL = 1000;
    this.debounceResize = debounce( this.resetWidths, this.DELAY_INTERVAL );
    this._isMounted = false;

    this.state = {
      bytesUploaded: 0,
      nIntervId: null,
      isUploading: false,
      listItemWidth: null,
      itemNameWidth: null,
      itemLangWidth: null
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    /**
     * @todo simulate upload for dev purposes;
     * replace for production
     * min, max interval in milliseconds
     */
    const interval = this.getRandomInt( this.MIN_INTERVAL, this.MAX_INTERVAL );
    const nIntervId = setInterval( this.uploadItem, interval );
    this.setState( { nIntervId } );

    window.addEventListener( 'resize', this.debounceResize );
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    clearInterval( this.state.nIntervId );
    window.removeEventListener( 'resize', this.debounceResize );
  }

  /**
   * @todo simulate upload for dev purposes;
   * replace for production
   */
  getRandomInt = ( min, max ) => {
    const minNum = Math.ceil( min );
    const maxNum = Math.floor( max );
    return (
      Math.floor( Math.random() * ( ( maxNum - minNum ) + 1 ) ) + minNum
    );
  }

  getRemainingUnits = ( totalUnits, unitsUploaded ) => (
    totalUnits - unitsUploaded
  )

  /**
   * Truncates long strings with ellipsis
   * @param {string} str the string
   * @param {number} start index for first cutoff point
   * @param {number} end index for ending cutoff point
   * @return truncated string
   */
  getShortFileName = ( str, index ) => (
    <Fragment>
      { `${str.substr( 0, index )}` }&hellip;{ `${str.substr( -index )}` }
    </Fragment>
  );

  /**
   * Determines an integer proportional
   * to a reference number
   * @param {number} reference
   * @return {number}
   */
  getProportionalNumber = ( reference, proportion ) => (
    Math.floor( reference * proportion )
  )

  /**
   * Declares a React ref & sets its width in state
   * @param {node} React node
   * @param {string} name of React ref
   */
  setRefWidth = ( node, ref ) => {
    if ( node ) {
      this.setState( prevState => {
        if ( !prevState[`${ref}Width`] ) {
          return ( {
            [`${ref}Width`]: Math.ceil( node.offsetWidth )
          } );
        }
      } );
    }
  }

  resetWidths = () => {
    if ( this._isMounted ) {
      this.setState( {
        listItemWidth: null,
        itemNameWidth: null,
        itemLangWidth: null
      } );
    }
  }

  isLongName = ( itemWidth, reference, proportion ) => (
    itemWidth >= this.getProportionalNumber( reference, proportion )
  );

  incrementUpload = ( unit, min, max ) => (
    this[unit] * this.getRandomInt( min, max )
  )

  endUpload = intervId => {
    clearInterval( intervId );
  };

  uploadItem = () => {
    /**
     * @todo simulate upload for dev purposes;
     * replace for production
     * min, max increment in megabytes
     */
    this.setState( nextState => {
      const { filesize } = this.props.data.supportItem;
      const { bytesUploaded } = nextState;
      let increment = this.incrementUpload( 'MEGABYTE', this.MIN_MB_SEC, this.MAX_MB_SEC );
      const remainingBytes = this.getRemainingUnits( filesize, bytesUploaded );

      if ( remainingBytes < increment ) {
        increment = remainingBytes;
      }

      // continue uploading
      if ( bytesUploaded < filesize ) {
        return {
          isUploading: true,
          bytesUploaded: this.state.bytesUploaded + increment
        };
      }

      // stop uploading
      this.endUpload( nextState.nIntervId );
      return { isUploading: false };
    } );
  }

  render() {
    const {
      fileType,
      data: { error, loading, supportItem }
    } = this.props;

    if ( loading ) {
      return (
        <li>
          <Loader active inline size="mini" />
          <span style={ { marginLeft: '0.5em', fontSize: '0.75em' } }>
            Preparing file for upload...
          </span>
        </li>
      );
    }

    if ( error ) {
      return (
        <li className="support-item error">
          <p>
            <Icon
              color="red"
              name="exclamation triangle"
              size="small"
            />
            <span>
              { `${error ? 'Loading ' : 'Uploading '}error` }
            </span>
          </p>
        </li>
      );
    }

    if ( !supportItem || !Object.keys( supportItem ).length ) return null;

    const { filename, filesize, language } = supportItem;

    const {
      bytesUploaded,
      isUploading,
      listItemWidth,
      itemNameWidth,
      itemLangWidth
    } = this.state;

    const uploadingClass = isUploading ? ' isUploading' : '';

    const charIndex = this.getProportionalNumber( listItemWidth, this.STR_INDEX_PROPORTION );

    const shortFileName = this.getShortFileName( filename, charIndex );

    const isLongFileName = this.isLongName( itemNameWidth, listItemWidth, this.ITEM_NAME_PROPORTION );

    const isLongLangName = this.isLongName( itemLangWidth, listItemWidth, this.ITEM_LANG_PROPORTION );

    const popupStyle = {
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      msWordBreak: 'break-all',
      wordBreak: 'break-word'
    };

    if ( isUploading ) {
      return (
        <li key={ `${fileType}-${language.displayName}` } className={ `support-item${uploadingClass}` }>
          <Progress
            value={ bytesUploaded }
            total={ filesize }
            color="blue"
            size="small"
            active
            progress
            precision={ 0 }
          />
          <span>Uploading item</span>
        </li>
      );
    }

    return (
      <li
        key={ `${fileType}-${language.displayName}` }
        className="support-item"
        ref={ node => this.setRefWidth( node, 'listItem' ) }
      >
        <span className="item-name">
          { isLongFileName && <VisuallyHidden>{ filename }</VisuallyHidden> }
          <span
            className={
              `item-name-wrap${isLongFileName ? ' hasEllipsis' : ''}`
            }
            aria-hidden={ isLongFileName }
            ref={ node => this.setRefWidth( node, 'itemName' ) }
          >
            { isLongFileName
              ? (
                <Popup
                  content={ filename }
                  size="mini"
                  inverted
                  on={ [
                    'hover',
                    'click',
                    'focus'
                  ] }
                  trigger={ (
                    <span>
                      <Focusable>{ shortFileName }</Focusable>
                    </span>
                  ) }
                  style={ popupStyle }
                />
              ) : filename }
          </span>
        </span>

        <span className="item-lang">
          <b
            className={
              `item-lang-wrap${isLongLangName ? ' hasEllipsis' : ''}`
            }
            ref={ node => this.setRefWidth( node, 'itemLang' ) }
          >
            { isLongLangName
              ? (
                <Popup
                  trigger={ (
                    <span>
                      <Focusable>{ language.displayName }</Focusable>
                    </span>
                  ) }
                  content={ language.displayName }
                  on={ [
                    'hover',
                    'click',
                    'focus'
                  ] }
                  inverted
                  size="mini"
                  style={ popupStyle }
                />
              ) : language.displayName }
          </b>
        </span>
      </li>
    );
  }
}

SupportItem.propTypes = {
  data: object.isRequired,
  fileType: string.isRequired
};

const SUPPORT_ITEM_QUERY = gql`
  query SupportItem($id: ID!) {
    supportItem: supportFile(id: $id) {
      id
      filename
      filesize
      language {
        displayName
      }
    }
  }
`;

export default graphql( SUPPORT_ITEM_QUERY, {
  options: props => ( {
    variables: {
      id: props.itemId
    },
  } )
} )( SupportItem );

export { SUPPORT_ITEM_QUERY };
