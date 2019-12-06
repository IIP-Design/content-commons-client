import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import './PackageActions.scss';

const PackageActions = props => {
  const { handlePublish } = props;
  return (
    <section className="edit-package__actions">
      <h3 className="headline">
        { /* publishedAndUpdated */ false && 'It looks like you made changes to your package. Do you want to publish changes?' }
        { /* notPublished */ true && 'Your package looks great! Are you ready to Publish?' }
        { /* publishedAndNotUpdated */ false && 'Not ready to share with the world yet?' }
      </h3>

      <ButtonAddFiles className="basic edit-package__btn--add-more" accept=".doc, .docx" onChange={ () => {} } multiple>+ Add Files</ButtonAddFiles>
      { /* !publishedAndNotUpdated */ true && (
        <Button
          className={ `edit-package__btn--${/* publishedAndUpdated */false ? 'edit' : 'publish'}` }
          onClick={ handlePublish }
        >
          Publish{ /* publishedAndUpdated */ false && ' Changes' }
        </Button>
      ) }
    </section>
  );
};

PackageActions.propTypes = {
  handlePublish: PropTypes.func
};

export default PackageActions;
