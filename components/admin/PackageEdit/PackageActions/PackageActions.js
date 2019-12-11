import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import './PackageActions.scss';

const PackageActions = props => {
  const {
    handlePublish,
    handleUnPublish,
    notPublished,
    publishedAndUpdated,
    publishedAndNotUpdated,
    status
  } = props;

  return (
    <section className="edit-package__actions">
      <h3 className="headline">
        { publishedAndUpdated && 'It looks like you made changes to your package. Do you want to publish changes?' }
        { notPublished && 'Your package looks great! Are you ready to Publish?' }
        { publishedAndNotUpdated && 'Not ready to share with the world yet?' }
      </h3>

      <ButtonAddFiles className="basic action-btn btn--add-more" accept=".doc, .docx" onChange={ () => {} } multiple>+ Add Files</ButtonAddFiles>
      { !publishedAndNotUpdated && (
        <Button
          className={ `action-btn btn--${publishedAndUpdated ? 'edit' : 'publish'}` }
          onClick={ handlePublish }
        >
          Publish{ publishedAndUpdated && ' Changes' }
        </Button>
      ) }
      { status !== 'DRAFT' && <Button className="action-btn btn--publish" onClick={ handleUnPublish }>Unpublish</Button> }
    </section>
  );
};

PackageActions.propTypes = {
  handlePublish: PropTypes.func,
  handleUnPublish: PropTypes.func,
  notPublished: PropTypes.bool,
  publishedAndUpdated: PropTypes.bool,
  publishedAndNotUpdated: PropTypes.bool,
  status: PropTypes.string
};

export default PackageActions;
