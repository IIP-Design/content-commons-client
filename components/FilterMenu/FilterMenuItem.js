import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { Form, Icon } from 'semantic-ui-react';
import { fetchQueryString } from 'lib/searchQuery';
import difference from 'lodash/difference';
import union from 'lodash/union';
import intersection from 'lodash/intersection';
import { connect } from 'react-redux';

import './FilterMenuItem.scss';

const FilterMenuItem = props => {
  const [filterItemOpen, setFilterItemOpen] = useState( false );
  const [selected, setSelected] = useState( props.selected );

  /**
   * Format data into state that dopdowns will use
   */
  const formatOptions = ( opts, filterName ) => {
    let filterOptions = opts.map( option => ( {
      label: option.display_name,
      value: option.key,
      count: option.count
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

  const showFilterMenu = e => {
    setFilterItemOpen( true );
  };

  const toggleFilterMenu = () => {
    if ( filterItemOpen ) {
      hideFilterMenu();
    } else {
      showFilterMenu();
    }
  };

  const executeQuery = value => {
    const query = fetchQueryString( { ...props.filterStore, [props.name]: value } );

    props.router.replace( {
      pathname: '/results',
      query
    } );
  };

  const handleCheckboxChange = async ( e, { value, checked } ) => {
    const arr = props.filterStore[props.name].slice( 0 );
    // Some values have mutliple search terms, i.e. YALI & YLAI so we
    // split the value and add/remove each to search array
    const values = value.split( '|' );

    let updatedArr;
    if ( checked ) {
      updatedArr = union( arr, values );
    } else {
      updatedArr = difference( arr, values );
    }

    setSelected( updatedArr );
    executeQuery( updatedArr );
  };

  const handleRadioChange = async ( e, { value } ) => {
    setSelected( value );
    executeQuery( value );
  };


  const renderRadio = option => (
    <Form.Radio
      key={ option.value }
      name={ props.name }
      label={ option.label }
      value={ option.value }
      count={ option.count }
      checked={ selected === option.value }
      onChange={ handleRadioChange }
    />
  );

  const renderCheckbox = option => {
    // Some values have mutliple search terms, i.e. YALI & YLAI so we
    // split the value and test new array against selected array
    const values = option.value.split( '|' );
    const checked = !!( intersection( selected, values ).length );

    return (
      <Form.Checkbox
        key={ option.value }
        name={ props.name }
        label={ option.label }
        value={ option.value }
        count={ option.count }
        checked={ checked }
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
    // togglel listener won menu show/hide
    toggleEventListener( filterItemOpen );

    // Clean up the listener on unmount
    return () => {
      toggleEventListener( false );
    };
  }, [filterItemOpen] );


  const {
    formItem, options, filter
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
        { props.filter } <Icon name={ filterItemOpen ? 'chevron up' : 'chevron down' } />
      </span>
      <Form className={ filterItemOpen ? 'filterMenu_options show' : 'filterMenu_options' }>
        <Form.Group>
          {
           formatOptions( options, filter ).map( option => ( ( formItem === 'checkbox' )
             ? renderCheckbox( option )
             : renderRadio( option ) ) )
        }
        </Form.Group>
      </Form>
    </div>
  );
};


FilterMenuItem.propTypes = {
  formItem: PropTypes.string,
  filter: PropTypes.string,
  options: PropTypes.array,
  selected: PropTypes.oneOfType( [PropTypes.array, PropTypes.string] ),
  router: PropTypes.object,
  filterStore: PropTypes.object,
  name: PropTypes.string,
};

const mapStateToProps = state => ( {
  filterStore: state.filter
} );

export default withRouter( connect( mapStateToProps )( FilterMenuItem ) );
