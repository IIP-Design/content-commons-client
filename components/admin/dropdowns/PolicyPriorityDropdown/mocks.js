import { POLICY_PRIORITIES_QUERY } from './PolicyPriorityDropdown';

export const mocks = [
  {
    request: {
      query: POLICY_PRIORITIES_QUERY,
    },
    result: {
      data: {
        policyPriorities: [
          {
            id: 'ckobsp13100ai0720m6siypm6',
            name: 'Alliances and Partnerships',
            theme: null,
          },
          {
            id: 'ckobspmrk00an072049k2byiz',
            name: 'China Relations',
            theme: null,
          },
          {
            id: 'ckobspzp700as0720zgqv3wbs',
            name: 'Climate Crisis',
            theme: null,
          },
          {
            id: 'ckobsqf4w00ax07202yr52c6s',
            name: 'Covid-19 Recovery',
            theme: null,
          },
          {
            id: 'ckobsqqu800b20720m0qvikzh',
            name: 'Human Rights',
            theme: null,
          },
          {
            id: 'ckobsrbys00b7072074yigv0t',
            name: 'Refugees and Migration',
            theme: null,
          },
        ],
      },
    },
  },
  {
    request: {
      query: POLICY_PRIORITIES_QUERY,
      variables: {
        where: {
          name_in: ['Alliances and Partnerships', 'Covid-19 Recovery'],
        },
      },
    },
    result: {
      data: {
        policyPriorities: [
          {
            id: 'ckobsp13100ai0720m6siypm6',
            name: 'Alliances and Partnerships',
            theme: null,
          },
          {
            id: 'ckobsqf4w00ax07202yr52c6s',
            name: 'Covid-19 Recovery',
            theme: null,
          },
        ],
      },
    },
  },
];

export const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
  {
    ...mocks[1],
    result: {
      errors: [{ message: 'There was an error.' }],
    },
  },
];

export const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { policyPriorities: null },
    },
  },
  {
    ...mocks[1],
    result: {
      data: { policyPriorities: null },
    },
  },
];

export const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { policyPriorities: [] },
    },
  },
  {
    ...mocks[1],
    result: {
      data: { policyPriorities: [] },
    },
  },
];
