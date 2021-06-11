import PropTypes from 'prop-types';
import Link from 'next/link';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import styles from './ButtonLink.module.scss';

const ButtonLink = ( { content, disabled, theme, url } ) => {
  if ( disabled ) {
    return (
      <a className={ `${styles.link} ${styles[theme]} ${styles.placeholder}` }>
        { `${content} ` }
        <VisuallyHidden el="span">(disabled link)</VisuallyHidden>
      </a>
    );
  }

  return (
    <Link href={ url } prefetch={ false }>
      <a className={ `${styles.link} ${styles[theme]}` }>{ content }</a>
    </Link>
  );
};

ButtonLink.defaultProps = {
  disabled: false,
  theme: 'primary',
};

ButtonLink.propTypes = {
  content: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  theme: PropTypes.oneOf( ['primary'] ),
  url: PropTypes.string.isRequired,
};

export default ButtonLink;
