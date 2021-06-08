import PropTypes from 'prop-types';
import Link from 'next/link';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import styles from './PreviewLink.module.scss';

const PreviewLink = ( { content, disabled, url } ) => {
  if ( disabled ) {
    return (
      <a className={ `${styles.link} ${styles.placeholder}` }>
        { `${content} ` }
        <VisuallyHidden el="span">(disabled link)</VisuallyHidden>
      </a>
    );
  }

  return (
    <Link href={ url }>
      <a className={ styles.link }>{ content }</a>
    </Link>
  );
};

PreviewLink.defaultProps = {
  content: 'Preview',
  disabled: false,
};

PreviewLink.propTypes = {
  content: PropTypes.string,
  disabled: PropTypes.bool,
  url: PropTypes.string.isRequired,
};

export default PreviewLink;
