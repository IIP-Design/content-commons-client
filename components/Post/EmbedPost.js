import React from 'react';
import PropTypes from 'prop-types';
import Embed from '../Embed';
// import { Checkbox, Icon, Popup } from 'semantic-ui-react';
// import colors from '../../../utils/colors';

// const embedPopupStyles = {
//   fontSize: '12px',
//   color: colors.grey,
//   backgroundColor: colors.lightGrey
// };

const PostEmbed = ( { embedItem, instructions } ) => (
  <div>
    <Embed instructions={ instructions } embedItem={ embedItem }>
      { /* <Checkbox className="embed_keepStyles" label="Maintain original page styling" />
      <Popup
        trigger={ <Icon name="info circle" className="embed_tooltip" /> }
        content="Check the box to embed this article with its original styling from the source site.
        Leave unchecked to embed with default styling."
        position="bottom center"
        style={ embedPopupStyles }
        className="embed_popup"
      /> */ }
    </Embed>
  </div>
);

PostEmbed.propTypes = {
  embedItem: PropTypes.string,
  instructions: PropTypes.string,
};

export default PostEmbed;
