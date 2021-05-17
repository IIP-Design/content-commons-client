import propTypes from 'prop-types';

import styles from './TexturedSection.module.scss';

const TexturedSection = ( { aria, children, description, narrow } ) => (
  <section
    className={ styles.texture }
    aria-label={ aria }
  >
    { description && <small className={ styles.description }>{ description }</small> }
    <div className={ narrow ? `${styles.container} ${styles.narrow}` : styles.container }>
      { children }
    </div>
  </section>
);

TexturedSection.propTypes = {
  aria: propTypes.string,
  children: propTypes.element,
  description: propTypes.string,
  narrow: propTypes.bool,
};

export default TexturedSection;
