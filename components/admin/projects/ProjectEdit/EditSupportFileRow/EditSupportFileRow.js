/**
 *
 * EditSupportFileRow
 *
 */
import React, { Fragment } from 'react';
import {
  array, func, object, string
} from 'prop-types';
import {
  Button, Dropdown, Popup, Table
} from 'semantic-ui-react';
import debounce from 'lodash/debounce';

import Focusable from 'components/admin/projects/shared/Focusable/Focusable';
import VisuallyHidden from 'components/admin/projects/shared/VisuallyHidden/VisuallyHidden';

import './EditSupportFileRow.scss';

const languages = [
  { value: 'arabic', text: 'Arabic' },
  { value: 'chinese', text: 'Chinese' },
  { value: 'english', text: 'English' },
  { value: 'french', text: 'French' },
  { value: 'portuguese', text: 'Portuguese' },
  { value: 'russian', text: 'Russian' },
  { value: 'spanish', text: 'Spanish' }
];

/* eslint-disable react/prefer-stateless-function */
class EditSupportFileRow extends React.PureComponent {
  constructor( props ) {
    super( props );

    this.DELAY_INTERVAL = 1000;
    this.STR_INDEX_PROPORTION = 0.04;
    this.ITEM_NAME_PROPORTION = 0.85;
    this.debounceResize = debounce( this.resetWidths, this.DELAY_INTERVAL );
    this._isMounted = false;

    this.state = {
      cellWidth: null,
      fileNameWidth: null
    };
  }

  componentDidMount = () => {
    this._isMounted = true;
    window.addEventListener( 'resize', this.debounceResize );
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    window.removeEventListener( 'resize', this.debounceResize );
  }

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

  setReplaceFileRef = input => {
    this.addReplaceFileRef = input;
  }

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
        cellWidth: null,
        fileNameWidth: null
      } );
    }
  }

  isLongName = ( itemWidth, reference, proportion ) => (
    itemWidth >= this.getProportionalNumber( reference, proportion )
  );

  handleReplaceFile = () => {
    console.log( 'replace file' );
    this.addReplaceFileRef.click();
  }

  handleDeleteFile = () => {
    console.log( 'delete file' );
  }

  renderIcons = () => {
    const { fileExtensions, fileType } = this.props;
    const isSingleType = fileExtensions.length === 1;
    const isOther = fileType === 'other';
    const acceptedTypes = isSingleType && !isOther ? fileExtensions[0] : '';

    return (
      <Button.Group basic size="large">
        <Popup
          content="Replace"
          size="mini"
          inverted
          on={ [
            'hover',
            'click',
            'focus'
          ] }
          trigger={ (
            <Button
              className="replace"
              icon="refresh"
              onClick={ this.handleReplaceFile }
              basic
              aria-label="replace file"
            />
          ) }
        />
        <VisuallyHidden>
          { /* eslint-disable jsx-a11y/label-has-for */
            /* eslint-disable jsx-a11y/label-has-associated-control */ }
          <label htmlFor="upload-file--single">upload file</label>
          <input
            id="upload-file--single"
            ref={ this.setReplaceFileRef }
            type="file"
            accept={ acceptedTypes }
            tabIndex={ -1 }
          />
        </VisuallyHidden>
        <Popup
          content="Delete"
          size="mini"
          inverted
          on={ [
            'hover',
            'click',
            'focus'
          ] }
          trigger={ (
            <Button
              className="delete"
              icon="delete"
              onClick={ this.handleDeleteFile }
              basic
              aria-label="delete file"
            />
          ) }
        />
      </Button.Group>
    );
  }

  render() {
    const { file, handleChange, selectedLanguage } = this.props;
    const { file: fileName, id } = file;
    const { cellWidth, fileNameWidth } = this.state;

    const charIndex = this.getProportionalNumber( fileNameWidth, this.STR_INDEX_PROPORTION );

    const shortFileName = this.getShortFileName( fileName, charIndex );

    const isLongFileName = this.isLongName( fileNameWidth, cellWidth, this.ITEM_NAME_PROPORTION );

    const popupStyle = {
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      msWordBreak: 'break-all',
      wordBreak: 'break-word'
    };

    return (
      <Table.Row>
        <Table.Cell>
          <div
            className="file-name"
            ref={ node => this.setRefWidth( node, 'cell' ) }
          >
            { isLongFileName && <VisuallyHidden>{ fileName }</VisuallyHidden> }
            <span
              className={
                `file-name-wrap${isLongFileName ? ' hasEllipsis' : ''}`
              }
              aria-hidden={ isLongFileName }
              ref={ node => this.setRefWidth( node, 'fileName' ) }
            >
              { isLongFileName
                ? (
                  <Popup
                    trigger={ (
                      <span>
                        <Focusable>{ shortFileName }</Focusable>
                      </span>
                    ) }
                    content={ fileName }
                    on={ [
                      'hover', 'click', 'focus'
                    ] }
                    inverted
                    size="mini"
                    style={ popupStyle }
                  />
                )
                : fileName }
            </span>
          </div>
        </Table.Cell>

        <Table.Cell>
          { /* eslint-disable jsx-a11y/label-has-for */
            <VisuallyHidden>
              <label htmlFor={ `file-${id}` }>
                { `${fileName} language` }
              </label>
            </VisuallyHidden> }
          <Dropdown
            id={ id }
            onChange={ handleChange }
            options={ languages }
            placeholder="–"
            text={ selectedLanguage }
            value={ selectedLanguage }
            error={ !selectedLanguage }
            fluid
            required
            selection
          />
        </Table.Cell>

        <Table.Cell>{ this.renderIcons() }</Table.Cell>
      </Table.Row>
    );
  }
}

EditSupportFileRow.propTypes = {
  handleChange: func,
  file: object,
  fileExtensions: array,
  fileType: string,
  selectedLanguage: string
};

export default EditSupportFileRow;
