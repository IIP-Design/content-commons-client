/* eslint-disable no-bitwise */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from '@apollo/client/react/components';
import sortBy from 'lodash/sortBy';
import { gql } from '@apollo/client';

import { addEmptyOption } from 'lib/utils';

import '../dropdown.scss';

const LANGUAGES_QUERY = gql`
  query LANGUAGES_QUERY {
    languages {
      id
      displayName
      locale
    }
  }
`;

const LANGUAGE_BY_NAME_QUERY = gql`
  query LANGUAGE_BY_NAME_QUERY($displayName: String!) {
    languages(where: { displayName: $displayName }) {
      id
      displayName
      locale
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => (
  prevProps.value === nextProps.value && prevProps.disabled === nextProps.disabled
);

const getIds = ( languages, selected ) => {
  const _languages = selected.map( _selected => {
    const _language = languages.find( lang => lang.displayName.toLowerCase() === _selected );

    return _language?.id;
  } );

  return _languages.length ? _languages : [];
};

const getLanguageId = ( languages = [], language ) => {
  if ( Array.isArray( language ) ) {
    return getIds( languages, language );
  }

  const _language = languages.find( lang => lang.displayName.toLowerCase().includes( language ) );

  return _language ? _language.id : '';
};


const LanguageDropdown = props => {
  const { filename, onChange, multiple } = props;

  const getLanguage = fn => {
    const file = fn.toLowerCase();
    let language = multiple ? ['english'] : 'english';

    if ( ~file.indexOf( 'arabic' ) || ~file.indexOf( 'ar_ar' ) || ~file.indexOf( 'ar-ar' ) ) {
      language = multiple ? [...language, language] : 'arabic';
    }

    if ( ~file.indexOf( 'chinese' ) || ~file.indexOf( 'zh_cn' ) || ~file.indexOf( 'zh-cn' ) ) {
      language = multiple ? [...language, language] : 'chinese';
    }

    if ( ~file.indexOf( 'indonesia' ) || ~file.indexOf( 'id_id' ) || ~file.indexOf( 'id-id' ) ) {
      language = multiple ? [...language, language] : 'indonesia';
    }

    if ( ~file.indexOf( 'french' ) || ~file.indexOf( 'fr_fr' ) || ~file.indexOf( 'fr-fr' ) ) {
      language = multiple ? [...language, language] : 'french';
    }

    if ( ~file.indexOf( 'hebrew' ) || ~file.indexOf( 'he_il' ) || ~file.indexOf( 'he-il' ) ) {
      language = multiple ? [...language, language] : 'hebrew';
    }

    if ( ~file.indexOf( 'japanese' ) || ~file.indexOf( 'ja_jp' ) || ~file.indexOf( 'ja-jp' ) ) {
      language = multiple ? [...language, language] : 'japanese';
    }

    if ( ~file.indexOf( 'korean' ) || ~file.indexOf( 'ko_kr' ) || ~file.indexOf( 'ko-kr' ) ) {
      language = multiple ? [...language, language] : 'korean';
    }

    if ( ~file.indexOf( 'persian' ) || ~file.indexOf( 'fa_ir' ) || ~file.indexOf( 'fa-ir' ) ) {
      language = multiple ? [...language, language] : 'persian';
    }

    if (
      ~file.indexOf( 'portuguese' )
      || ~file.indexOf( '_port' )
      || ~file.indexOf( '-port' )
      || ~file.indexOf( 'pt_br' )
      || ~file.indexOf( 'pt-br' )
    ) {
      language = multiple ? [...language, language] : 'portuguese';
    }

    if ( ~file.indexOf( 'russian' ) || ~file.indexOf( 'ru_ru' ) || ~file.indexOf( 'ru-ru' ) ) {
      language = multiple ? [...language, language] : 'russian';
    }

    if (
      ~file.indexOf( 'spanish' )
      || ~file.indexOf( 'es_la' )
      || ~file.indexOf( 'es-la' )
      || ~file.indexOf( 'es_es' )
      || ~file.indexOf( 'es-es' )
    ) {
      language = multiple ? [...language, language] : 'spanish';
    }

    if ( ~file.indexOf( 'turkish' ) || ~file.indexOf( 'tr_tr' ) || ~file.indexOf( 'tr-tr' ) ) {
      language = multiple ? [...language, language] : 'turkish';
    }

    if ( ~file.indexOf( 'urdu' ) || ~file.indexOf( 'ur_pk' ) || ~file.indexOf( 'ur-pk' ) ) {
      language = multiple ? [...language, language] : 'urdu';
    }

    if ( ~file.indexOf( 'vietnamese' ) || ~file.indexOf( 'vi_vn' ) || ~file.indexOf( 'vi-vn' ) ) {
      language = multiple ? [...language, language] : 'vietnamese';
    }

    return {
      language,
      id: languages => getLanguageId( languages, language ),
    };
  };


  return (
    <Query
      query={ LANGUAGES_QUERY }
      onCompleted={ data => {
        // if filename present, attempt to auto-select based on filename
        if ( filename ) {
          const value = getLanguage( filename ).id( data.languages );

          // select the value
          if ( typeof onChange === 'function' ) {
            onChange( null, { id: props.id, name: 'language', value } );
          }
        }
      } }
    >
      { ( { data, loading, error } ) => {
        if ( error ) return `Error! ${error.message}`;

        let options = [];

        if ( data?.languages ) {
          const getFilteredList = allLangs => allLangs.filter( lang => {
            const { locale } = lang;

            return props.locales.includes( locale );
          } );

          const languages = props.locales ? getFilteredList( data.languages ) : data.languages;

          options = sortBy( languages, lang => lang.displayName ).map( lang => ( {
            key: lang.id,
            text: lang.displayName,
            value: lang.id,
          } ) );
        }

        addEmptyOption( options );

        return (
          <Fragment>
            { !props.label && (
              <VisuallyHidden>
                <label htmlFor={ props.id }>{ `${props.id} language` }</label>
              </VisuallyHidden>
            ) }

            <Form.Dropdown
              id={ props.id }
              name="language"
              options={ options }
              placeholder="–"
              loading={ loading }
              fluid
              search
              selection
              { ...props }
            />
          </Fragment>
        );
      } }
    </Query>
  );
};

LanguageDropdown.defaultProps = {
  id: '',
};

LanguageDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  locales: PropTypes.array,
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  filename: PropTypes.string,
};

export default React.memo( LanguageDropdown, areEqual );
export { LANGUAGES_QUERY, LANGUAGE_BY_NAME_QUERY };
