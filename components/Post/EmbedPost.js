import React from 'react';
import { string } from 'prop-types';
import Embed from '../Embed';
// import { Checkbox, Icon, Popup } from 'semantic-ui-react';
// import colors from '../../../utils/colors';

// const embedPopupStyles = {
//   fontSize: '12px',
//   color: colors.grey,
//   backgroundColor: colors.lightGrey
// };

const PostEmbed = props => (
  <div>
    <Embed instructions={ props.instructions } embedItem={ props.embedItem }>
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
  embedItem: string,
  instructions: string
};

export default PostEmbed;
