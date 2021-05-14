import moment from 'moment';
import propTypes from 'prop-types';

import TexturedSection from 'components/TexturedSection/TexturedSection';

import styles from './Playbook.module.scss';

const desc = 'This Playbook is for use by U.S. diplomatic missions and senior State Department officials.\nPlease treat this document as you would Daily Press Guidance.';

const Playbook = ( { item } ) => (
  <div className={ styles.container }>
    <header className={ styles.header }>
      <h1 className={ styles.title }>{ item.title }</h1>
      { item.updatedAt && (
        <p>{ `Updated: ${moment( item.updatedAt ).format( 'MMMM DD, YYYY' )}` }</p>
      ) }
    </header>
    { item.policy && (
      <div className={ styles['policy-container'] }>
        <span
          className={ styles.policy }
          style={ { backgroundColor: item.policy.theme } }
        >
          { item.policy.name }
        </span>
      </div>
    ) }
    <TexturedSection description={ desc } narrow>
      <div
        className={ styles.content }
        dangerouslySetInnerHTML={ { __html: item.content } } // eslint-disable-line react/no-danger
      />
    </TexturedSection>
    <div>
      <h3 className={ styles['resources-title'] }>Additional Resources</h3>
      <div>
        <div>
          <h4>Downloadable attachments.</h4>
          <em>Download the attached files related to this Playbook.</em>
          { }
        </div>
      </div>
    </div>
  </div>
);

Playbook.propTypes = {
  item: propTypes.object,
};

export default Playbook;
