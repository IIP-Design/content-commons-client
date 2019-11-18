import { mocks as pkgFiles } from 'components/admin/PackageEdit/PackageFiles/mocks';

const { documents } = pkgFiles[0].result.data.package;

const language = {
  __typename: 'Language',
  id: 'ck2lzfx710hkq07206thus6pt',
  languageCode: 'en',
  locale: 'en-us',
  textDirection: 'LTR',
  displayName: 'English',
  nativeName: 'English'
};

const pressJournalism = {
  id: 'ck2lzgu1e0red072066m25ldt',
  translations: [
    {
      id: 'ck2lzfz0d0i580720g3mg0xut',
      name: 'press & journalism',
      language
    },
    {
      id: 'ck2lzfz0y0i5f0720az8sehv4',
      name: 'Prensa y periodismo',
      language: {
        id: 'ck2lzfx7o0hl707205uteku77',
        languageCode: 'es',
        locale: 'es-es',
        textDirection: 'LTR',
        displayName: 'Spanish',
        nativeName: 'Español'
      }
    },
    {
      id: 'ck2lzfz1i0i5m0720wa9pemol',
      name: 'Presse et journalisme',
      language: {
        id: 'ck2lzfx710hkp07206oo0icbv',
        languageCode: 'fr',
        locale: 'fr-fr',
        textDirection: 'LTR',
        displayName: 'French',
        nativeName: 'Français'
      }
    }
  ]
};

const tag1 = {
  id: 'ck2lzgu1i0rei07206gvy1ygg',
  translations: [
    {
      id: 'ck2lzfzwr0iey0720hrigffxo',
      name: 'american culture',
      language
    }
  ]
};

const tag2 = {
  id: 'ck2lzgu2s0rer07208jc6y6ww',
  translations: [
    {
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
      query: 'PACKAGE_QUERY',
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
          categories: [pressJournalism],
          tags: [tag1, tag2],
          documents
        }
      }
    }
  },
  {
    request: {
      query: 'CREATE_PACKAGE_MUTATION',
      variables: {
        data: {
          __typename: 'Package',
          createdAt: '2019-11-15T13:07:49.364Z',
          updatedAt: '2019-11-15T13:32:28.830Z',
          type: 'DAILY_GUIDANCE',
          title: 'Just a new press package'
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
