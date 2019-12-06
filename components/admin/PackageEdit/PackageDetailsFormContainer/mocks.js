import { mocks as pkgFiles } from 'components/admin/PackageEdit/PackageFiles/mocks';
import { language } from 'components/admin/PackageEdit/mocks';
import { PACKAGE_QUERY } from 'lib/graphql/queries/package';

const { documents } = pkgFiles[0].result.data.package;

const tag1 = {
  __typename: 'Tag',
  id: 'ck2lzgu1i0rei07206gvy1ygg',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfzwr0iey0720hrigffxo',
      name: 'american culture',
      language
    }
  ]
};

const tag2 = {
  __typename: 'Tag',
  id: 'ck2lzgu2s0rer07208jc6y6ww',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzg1900iui0720q28le4rs',
      name: 'leadership',
      language
    }
  ]
};

/**
 * mock data for UI development
 * eventually use for unit testing
 */
export const props = { id: 'test-123' };

export const mocks = [
  {
    request: {
      query: PACKAGE_QUERY,
      variables: { id: props.id }
    },
    result: {
      data: {
        package: {
          __typename: 'Package',
          id: props.id,
          createdAt: '2019-11-12T13:07:49.364Z',
          updatedAt: '2019-11-12T13:08:28.830Z',
          publishedAt: '',
          type: 'DAILY_GUIDANCE',
          title: 'Final Guidance mm-dd-yy',
          desc: '',
          visibility: 'INTERNAL',
          tags: [tag1, tag2],
          documents
        }
      }
    }
  },
  {
    request: {
      query: 'UPDATE_PACKAGE_MUTATION',
      variables: {
        data: { title: 'New Title' },
        where: { id: props.id }
      }
    },
    result: {
      data: {
        updatePackage: {
          __typename: 'Package',
          id: props.id,
          title: 'New Title'
        }
      }
    }
  }
];
