import {
  tag1, tag2, mocks as pkgFiles
} from 'components/admin/PackageEdit/PackageFiles/mocks';
import { PACKAGE_QUERY, DELETE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';

const { documents } = pkgFiles[0].result.data.pkg;

const pressJournalism = {
  __typename: 'Category',
  id: 'ck2lzgu1e0red072066m25ldt',
  translations: [
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfz0d0i580720g3mg0xut',
      name: 'press & journalism',
      language: {
        __typename: 'Language',
        id: 'ck2lzfx710hkq07206thus6pt',
        languageCode: 'en',
        locale: 'en-us',
        textDirection: 'LTR',
        displayName: 'English',
        nativeName: 'English'
      }
    },
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfz0y0i5f0720az8sehv4',
      name: 'Prensa y periodismo',
      language: {
        __typename: 'Language',
        id: 'ck2lzfx7o0hl707205uteku77',
        languageCode: 'es',
        locale: 'es-es',
        textDirection: 'LTR',
        displayName: 'Spanish',
        nativeName: 'Español'
      }
    },
    {
      __typename: 'LanguageTranslation',
      id: 'ck2lzfz1i0i5m0720wa9pemol',
      name: 'Presse et journalisme',
      language: {
        __typename: 'Language',
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

export const props = {
  router: {
    push: jest.fn(),
    query: {
      id: 'test-123'
    }
  }
};

export const mocks = [
  {
    request: {
      query: PACKAGE_QUERY,
      variables: { id: props.router.query.id }
    },
    result: {
      data: {
        pkg: {
          __typename: 'Package',
          id: props.router.query.id,
          createdAt: '2019-11-12T13:07:49.364Z',
          updatedAt: '2019-11-12T13:08:28.830Z',
          publishedAt: '',
          type: 'DAILY_GUIDANCE',
          assetPath: '',
          author: {
            __typename: 'User',
            id: 'ck2m042xo0rnp0720nb4gxjix',
            firstName: 'First',
            lastName: 'Last'
          },
          team: {
            __typename: 'Team',
            id: 'ck2qgfbku0ubh0720iwhkvuyn',
            name: 'GPA Press Office'
          },
          title: 'Final Guidance mm-dd-yy',
          desc: '',
          status: 'DRAFT',
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
      query: DELETE_PACKAGE_MUTATION,
      variables: { id: props.router.query.id }
    },
    result: {
      data: {
        deletePackage: {
          __typename: 'Package',
          id: props.router.query.id
        }
      }
    }
  },
  // {
  //   request: {
  //     query: 'UPDATE_PACKAGE_MUTATION',
  //     variables: {
  //       data: { title: 'New Title' },
  //       where: { id: props.router.query.id }
  //     }
  //   },
  //   result: {
  //     data: {
  //       updatePackage: {
  //         __typename: 'Package',
  //         id: props.router.query.id,
  //         title: 'New Title'
  //       }
  //     }
  //   }
  // }
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  },
  { ...mocks[1] }
];

export const publishedMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        package: {
          ...mocks[0].result.data.package,
          publishedAt: '2019-11-13T13:08:28.830Z'
        }
      }
    }
  },
  {
    request: {
      query: 'DELETE_PACKAGE_MUTATION',
      variables: { id: props.router.query.id }
    },
    result: {
      data: {
        deletePackage: {
          __typename: 'Package',
          id: props.router.query.id
        }
      }
    }
  },
  // {
  //   request: {
  //     query: 'UPDATE_PACKAGE_MUTATION',
  //     variables: {
  //       data: { title: 'New Title' },
  //       where: { id: props.router.query.id }
  //     }
  //   },
  //   result: {
  //     data: {
  //       updatePackage: {
  //         __typename: 'Package',
  //         id: props.router.query.id,
  //         title: 'New Title'
  //       }
  //     }
  //   }
  // }
];

export const noDocumentsMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        pkg: {
          ...mocks[0].result.data.pkg,
          documents: []
        }
      }
    }
  },
  { ...mocks[1] }
];
