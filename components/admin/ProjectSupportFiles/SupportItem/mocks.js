import { LANGUAGES_QUERY } from 'components/admin/dropdowns/LanguageDropdown';

export const props = {
  item: {
    id: 'cjzts5akb1aj90720hvrhep1t',
    createdAt: '2019-08-27T12:01:34.796Z',
    updatedAt: '2019-08-27T12:01:34.796Z',
    filename: 'image-1.png',
    filetype: 'image/png',
    filesize: 42093736,
    url: '2019/08/cjzts3ele1ahx0720t7u9hf9i/image-1.png',
    alt: null,
    language: {
      id: 'cjsq439dz005607560gwe7k3m',
      locale: 'en-us',
      languageCode: 'en',
      displayName: 'English',
      textDirection: 'LTR',
      nativeName: 'English',
      __typename: 'Language'
    },
    __typename: 'ImageFile'
  }
};

export const preUploadProps = {
  item: {
    language: 'cjsq439dz005607560gwe7k3m',
    use: 'cjtkdq8kr0knf07569goo9eqe',
    quality: '',
    videoBurnedInStatus: '',
    input: {
      lastModified: 1517162382000,
      lastModifiedDate: {},
      name: 'image-1.png',
      size: 42093736,
      type: 'image/png',
      webkitRelativePath: ''
    },
    id: '6ec96575-03e7-4575-af94-05003ddf28ba',
    loaded: 0,
    error: false
  }
};

export const uploadErrorProps = {
  item: {
    ...preUploadProps.item,
    error: true
  }
};

export const postUploadProps = {
  item: {
    ...preUploadProps.item,
    loaded: props.item.filesize
  }
};

export const emptyItemProps = {
  item: {}
};

export const nullItemProps = {
  item: null
};

export const mocks = [
  {
    request: {
      query: LANGUAGES_QUERY
    },
    result: {
      data: {
        languages: [
          {
            id: 'cjsq439dz005607560gwe7k3m',
            displayName: 'English',
            locale: 'en-us',
            __typename: 'Language'
          },
          {
            id: 'cjsq4565v005c0756f0lqbfe4',
            displayName: 'French',
            locale: 'fr-fr',
            __typename: 'Language'
          },
          {
            id: 'cjsq47fum005i0756qlhc0wta',
            displayName: 'Arabic',
            locale: 'ar',
            __typename: 'Language'
          },
          {
            id: 'cjsq4967o005o0756gvpl1f5k',
            displayName: 'Chinese (Simplified)',
            locale: 'zh-cn',
            __typename: 'Language'
          },
          {
            id: 'cjsuxnpv700dl0756wg4adr6k',
            displayName: 'Spanish',
            locale: 'es-es',
            __typename: 'Language'
          },
          {
            id: 'cjt06xh0e02q70756dnuo3g8e',
            displayName: 'Russian',
            locale: 'ru-ru',
            __typename: 'Language'
          },
          {
            id: 'cjt5qc65o04020756oius55mh',
            displayName: 'Portuguese (Brazil)',
            locale: 'pt-br',
            __typename: 'Language'
          },
          {
            id: 'cjt5qmm4504090756sy269uhs',
            displayName: 'Vietnamese',
            locale: 'vi-vn',
            __typename: 'Language'
          },
          {
            id: 'cjt5qnpem040e07567msmql7j',
            displayName: 'Urdu',
            locale: 'ur',
            __typename: 'Language'
          },
          {
            id: 'cjt5qp676040j07560v969u9p',
            displayName: 'Korean',
            locale: 'ko-kr',
            __typename: 'Language'
          },
          {
            id: 'cjt5qq47h040p0756fjlu2dvy',
            displayName: 'Japanese',
            locale: 'ja-jp',
            __typename: 'Language'
          },
          {
            id: 'cjt5qviod040v0756m5yhxs05',
            displayName: 'Bahasa Indonesia',
            locale: 'id-id',
            __typename: 'Language'
          },
          {
            id: 'cjt5r1hpl0411075624l76vvy',
            displayName: 'Persian',
            locale: 'fa',
            __typename: 'Language'
          },
          {
            id: 'cjubbldh20uqa07560u70yc0k',
            displayName: 'Japanese',
            locale: 'ja',
            __typename: 'Language'
          },
          {
            id: 'cjubbldhj0uqh0756pco0zk2r',
            displayName: 'Persian',
            locale: 'fa-ir',
            __typename: 'Language'
          },
          {
            id: 'cjubbldi10uqj0756oxctum4f',
            displayName: 'Vietnamese',
            locale: 'vi',
            __typename: 'Language'
          }
        ]
      }
    }
  }
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

export const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { languages: [] }
    }
  }
];

export const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { languages: null }
    }
  }
];
