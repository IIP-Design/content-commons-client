import React from 'react';
import PropTypes from 'prop-types';

import './ModalPostTags.scss';

const renderCategory = ( category, index, arr ) => {
  let { name } = category;
  const key = `cat_${index}`;

  if ( index > 2 ) {
    return undefined;
  }

  if ( arr.length - 1 !== index && index < 2 ) {
    name += '  · ';
  }

  return (
    <span key={ key } className="modal_postTag">
      { ` ${name.toLowerCase()} ` }
    </span>
  );
};

const ModalPostTags = ( { tags } ) => {
  let postTags = '';

  if ( typeof tags === 'string' ) {
    const tagsWithEllipses = tags.replace( ',', '  · ' );

    postTags = <span className="modal_postTag">{ tagsWithEllipses }</span>;
  } else {
    postTags = tags.map( renderCategory );
  }

  return (
    <section className="modal_section modal_section--postTags">
      { postTags }
    </section>
  );
};

ModalPostTags.propTypes = {
  tags: PropTypes.oneOfType( [PropTypes.array, PropTypes.string] ),
};

export default ModalPostTags;
