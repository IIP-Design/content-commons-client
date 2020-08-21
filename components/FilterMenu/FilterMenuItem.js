import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import difference from 'lodash/difference';
import intersection from 'lodash/intersection';
import union from 'lodash/union';
import { connect } from 'react-redux';
import { Form, Icon } from 'semantic-ui-react';
import { withRouter } from 'next/router';

import { fetchQueryString } from 'lib/searchQueryString';

import './FilterMenuItem.scss';

const FilterMenuItem = props => {
  const [filterItemOpen, setFilterItemOpen] = useState( false );
  const [selected, setSelected] = useState( [] );

  /**
   * Format data into state that drop-downs will use
   */
  const formatOptions = ( opts, filterName ) => {
    let filterOptions = opts.map( option => ( {
      label: option.display_name,
      value: option.key,
      count: option.count,
      ...( option.submenu ? { submenu: option.submenu } : {} ),
    } ) );

    /* Sort Source filter alphabetically */
    if ( filterName === 'Source' ) {
      filterOptions = filterOptions.sort( ( a, b ) => a.label.localeCompare( b.label ) );
    }

    return filterOptions;
  };

  // only close menu if not on menu
  const hideFilterMenu = e => {
    if ( e && e.target ) {
      const menu = document.querySelector( `[data-menuname='menu-${props.name}']` );

      if ( !menu.contains( e.target ) ) {
        setFilterItemOpen( false );
      }
    }
  };

  const showFilterMenu = () => {
    setFilterItemOpen( true );
  };

  const toggleFilterMenu = () => {
    if ( filterItemOpen ) {
      hideFilterMenu();
    } else {
      showFilterMenu();
    }
  };

  /**
   * Reload results page with updated query params
   * @param {array|string} value - updated filter value
   * @param {string} submenu - submenu filter value to update
   */
  const executeQuery = ( value, submenu = false ) => {
    const filtered = props.name === 'postTypes' ? value.filter( val => val !== 'package' ) : value;
    
    // Add term from search reducer to ensure that it does not get removed from the query string
    const query = fetchQueryString( {
      ...props.filterStore,
      [props.name]: filtered,
      ...submenu ? { [submenu]: [] } : {},
      term: props.term,
      language: props.language,
    } );

    props.router.replace( {
      pathname: '/results',
      query,
    } );
  };

  const handleCheckboxChange = async ( e, { value, checked, submenu } ) => {    
    if ( selected.includes( value ) ) {
      setSelected( selected.filter( s => s !== value ) );
    } else {
      setSelected( [...selected, value] );
    }

    // make copy of selected filter array, i.e. categories
    const arr = props.filterStore[props.name]?.slice( 0 );

    // Some values have multiple search terms within the input value
    // i.e. YALI appears as Young African Leaders Initiative|Young African Leaders Initiative Network
    // so we split the value into array and add/remove each to search array
    const values = value.split( '|' );

    let updatedArr;

    if ( checked ) {
      // create array of unique values within arr & values
      updatedArr = union( arr, values );
    } else {
      // create array of values not included in values array
      updatedArr = difference( arr, values );
    }

    executeQuery( updatedArr, submenu );
  };

  const handleRadioChange = async ( e, { value } ) => {
    executeQuery( value );
  };

  const renderRadio = option => (
    <Form.Radio
      key={ option.value }
      name={ props.name }
      label={ option.label }
      value={ option.value }
      count={ option.count }
      checked={ props.selected === option.value }
      onChange={ handleRadioChange }
    />
  );

  const renderCheckbox = option => {
    // Some values have multiple search terms within the input value
    // i.e. YALI appears as Young African Leaders Initiative|Young African Leaders Initiative Network
    // so we split the value into array and add/remove each to search array
    const values = option?.value?.split( '|' );
    const checked = !!intersection( selected, values ).length;

    return (
      <Form.Checkbox
        key={ `${option.value}_${option.label}` }
        name={ props.name }
        label={ option.label }
        value={ option.value }
        count={ option.count }
        checked={ checked }
        { ...( option.submenu ? { submenu: option.submenu } : {} ) }
        onChange={ handleCheckboxChange }
      />
    );
  };

  const toggleEventListener = isOpen => {
    if ( isOpen ) {
      document.addEventListener( 'click', hideFilterMenu );
    } else {
      document.removeEventListener( 'click', hideFilterMenu );
    }
  };

  useEffect( () => {
    // toggle listener won menu show/hide
    toggleEventListener( filterItemOpen );

    // Clean up the listener on unmount
    return () => {
      toggleEventListener( false );
    };
  }, [filterItemOpen] );

  useEffect( () => {
    setSelected( props.selected );
  }, [props.selected] );

  const {
    className, formItem, options, filter, searchInput,
  } = props;

  return (
    <div
      className="filterMenu"
      data-menuname={ `menu-${props.name}` }
    >
      <span
        className={ filterItemOpen ? 'filterMenu_label active' : 'filterMenu_label' }
        onClick={ toggleFilterMenu }
        onKeyDown={ toggleFilterMenu }
        role="menuitem"
        tabIndex={ 0 }
      >
        { filter }
        {' '}
        <Icon name={ filterItemOpen ? 'chevron up' : 'chevron down' } />
      </span>
      <Form className={ `${filterItemOpen ? 'filterMenu_options show' : 'filterMenu_options'} ${className}` }>

        { searchInput }

        <Form.Group>
          { formatOptions( options, filter ).map(
            option => {
              if ( formItem === 'checkbox' ) {
                return renderCheckbox( option );
              }

              return renderRadio( option );
            },
          ) }

          { options.length === 0
            && (
              <span
                style={ {
                  paddingTop: '3px',
                  color: '#112e51',
                  fontSize: '0.77rem',
                  textAlign: 'center',
                } }
              >
                None Available
              </span>
            ) }
        </Form.Group>
      </Form>
    </div>
  );
};

FilterMenuItem.defaultProps = {
  className: '',
  searchInput: null,
};

FilterMenuItem.propTypes = {
  className: PropTypes.string,
  formItem: PropTypes.string,
  filter: PropTypes.string,
  options: PropTypes.array,
  router: PropTypes.object,
  filterStore: PropTypes.object,
  name: PropTypes.string,
  term: PropTypes.string,
  language: PropTypes.string,
  searchInput: PropTypes.oneOfType( [PropTypes.node, () => null] ),
  /* eslint-disable-next-line react/no-unused-prop-types */
  selected: PropTypes.oneOfType( [PropTypes.string, PropTypes.array] ),
};

const mapStateToProps = state => ( {
  filterStore: state.filter,
  term: state.search.term,
  language: state.search.language,
} );

export default withRouter( connect( mapStateToProps )( FilterMenuItem ) );
