import React from 'react';
import PropTypes from 'prop-types';
import './MetaTerms.scss';

const MetaTerms = props => {
  const { className, terms, unitId } = props;

  return (
    <dl className={ `terms ${className}` }>
      { terms.map( term => {
        const { definition, displayName, name } = term;

        return (
          <div key={ `${name}-${unitId}` }>
            <dt>{ displayName }</dt>
            <dd>{ definition }</dd>
          </div>
        );
      } ) }
    </dl>
  );
};

MetaTerms.defaultProps = {
  className: '',
};

MetaTerms.propTypes = {
  className: PropTypes.string,
  terms: PropTypes.array,
  unitId: PropTypes.string,
};

export default MetaTerms;
