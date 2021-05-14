import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Playbook from 'components/Playbook/Playbook';
import { mockItem } from 'components/Playbook/mocks';

const PlaybookPage = () => (
  <ContentPage fullWidth item={ mockItem }>
    <Playbook item={ mockItem } />
  </ContentPage>
);

export default PlaybookPage;
