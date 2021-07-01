import PropTypes from 'prop-types';
import Link from 'next/link';
import MediaObject from 'components/MediaObject/MediaObject';
import DosSeal from 'static/images/dos_seal.svg';
import { formatDateTime } from 'lib/utils';

import styles from './PlaybookCard.module.scss';

const PlaybookCard = ( { cardTheme, heading: Heading, item } ) => {
  const {
    id,
    type,
    title,
    desc,
    modified,
    // published,
    policy,
    owner,
  } = item;

  const dateArgs = {
    dateString: modified,
    options: {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/New_York',
    },
  };

  return (
    <article
      key={ id }
      className={ `${styles.card} ${styles[cardTheme]}` }
      style={ { '--policy-theme': policy?.theme } }
    >
      <div className={ styles.header }>
        <Heading className={ styles.title }>
          <Link href={ `/package/playbook/${id}` }>
            <a>{ title }</a>
          </Link>
        </Heading>
        <p className={ styles.type }>{ type }</p>
        <p className={ styles.description }>{ desc }</p>
        <p className={ styles['date-time'] }>
          Updated:
          <time dateTime={ modified }>
            { ` ${formatDateTime( dateArgs )}` }
          </time>
        </p>
      </div>

      <svg
        aria-hidden="true"
        className={ styles.wave }
        focusable="false"
        preserveAspectRatio="none"
        role="img"
        viewBox="-0.27000001072883606 0 500.53997802734375 37.033424377441406"
      >
        <path d="M 0 17 C 256.49 -34.97 257.05 77.45 500.27 21.2 L 500 0 L 0 0 Z" />
      </svg>

      <div className={ styles.footer }>
        <p className={ styles.policy }>{ policy?.name }</p>
        <MediaObject
          body={ <span style={ { fontSize: '11px' } }>{ owner }</span> }
          className={ styles.source }
          img={ {
            src: DosSeal,
            alt: '',
            style: { height: '16px', width: '16px' },
          } }
        />
      </div>
    </article>
  );
};

PlaybookCard.defaultProps = {
  cardTheme: 'dark',
  heading: 'h2',
};

PlaybookCard.propTypes = {
  cardTheme: PropTypes.oneOf( ['dark', 'light'] ),
  heading: PropTypes.string,
  item: PropTypes.object,
};

export default PlaybookCard;
