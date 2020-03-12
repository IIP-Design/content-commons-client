import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const ButtonPublish = props => {
  const {
    handlePublish,
    handleUnPublish,
    publishing,
    status,
    updated
  } = props;

  const setButtonState = btn => `action-btn btn--${btn} ${publishing ? 'loading' : ''}`;

  return (
    <Fragment>
      { status === 'DRAFT'
        ? <Button className={ setButtonState( 'publish' ) } onClick={ handlePublish }>Publish</Button>
        : (
          <Fragment>
            { ( ( status === 'PUBLISHED' || status === 'PUBLISHING' ) && updated )
              && (
                <Button className={ setButtonState( 'edit basic' ) } onClick={ handlePublish }>Publish Changes</Button>
              ) }
            <Button className="action-btn btn--publish" onClick={ handleUnPublish }>Unpublish</Button>
          </Fragment>
        ) }
    </Fragment>
  );
};

ButtonPublish.defaultProps = {
  publishing: false
};

ButtonPublish.propTypes = {
  handlePublish: PropTypes.func,
  handleUnPublish: PropTypes.func,
  publishing: PropTypes.bool,
  status: PropTypes.string,
  updated: PropTypes.bool,
};

export default ButtonPublish;
