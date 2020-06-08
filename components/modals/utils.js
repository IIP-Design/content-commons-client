import Video from 'components/Video/Video';
import Post from 'components/Post/Post';

/**
 * Check content type of an item and passes in the correct component to the modal
 * @param {Object} item data from the selected item
 */
export const getModalContent = item => {
  const noContent = <div>No content currently available</div>;

  if ( item ) {
    switch ( item.type ) {
      case 'video':
        return <Video item={ item } />;

      case 'post':
        return <Post item={ item } />;

      default:
        return noContent;
    }
  }

  return noContent;
};
