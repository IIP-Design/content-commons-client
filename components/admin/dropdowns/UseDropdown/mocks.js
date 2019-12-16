import { VIDEO_USE_QUERY, IMAGE_USE_QUERY, DOCUMENT_USE_QUERY } from './UseDropdown';

export const mocks = [
  {
    request: {
      query: VIDEO_USE_QUERY
    },
    result: {
      data: {
        videoUses: [
          {
            id: 'cjsw78q6p00lp07566znbyatd',
            name: 'Full Video'
          },
          {
            id: 'cjubbldgd0uq3075628v0917u',
            name: 'Video Assets (B-Roll)'
          },
          {
            id: 'cjubbldgj0uq50756f9el8l5j',
            name: 'Event Video'
          },
          {
            id: 'cjubbldgj0uq60756vtilh8w1',
            name: 'Promotional Teaser'
          }
        ]
      }
    }
  },
  {
    request: {
      query: IMAGE_USE_QUERY
    },
    result: {
      data: {
        imageUses: [
          {
            id: 'cjtkdq8kr0knf07569goo9eqe',
            name: 'Thumbnail/Cover Image'
          },
          {
            id: 'cjtkdqqjs0knk07565mgduq36',
            name: 'Social Media Graphic'
          },
          {
            id: 'cjtkdr7j40knp0756ppap6gqm',
            name: 'Email Graphic'
          },
          {
            id: 'cjtkdrndt0knu0756gha65mhd',
            name: 'Website Hero Image'
          },
          {
            id: 'cjubblddu0upq0756ioyonu50',
            name: 'Infographic'
          },
          {
            id: 'cjubbldfl0upu0756imis0hxp',
            name: 'Memes'
          },
          {
            id: 'cjubbldfo0upx0756pldnc0k0',
            name: '3D Graphics'
          }
        ]
      }
    }
  },
  {
    request: {
      query: DOCUMENT_USE_QUERY
    },
    result: {
      data: {
        documentUses: [
          {
            id: 'ck2wbvj5h10kq0720hr0nkfgz',
            name: 'Background Briefing'
          },
          {
            id: 'ck2wbvj6010kz0720c358mbrt',
            name: 'Department Press Briefing'
          },
          {
            id: 'ck2wbvj6w10l80720gzhwlr9s',
            name: 'Fact Sheet'
          },
          {
            id: 'ck2wbvj7b10lg0720htdvmgru',
            name: 'Interview'
          },
          {
            id: 'ck2wbvj7u10lo07207aa55qmz',
            name: 'Media Note'
          },
          {
            id: 'ck2wbvj8810lx0720ruj5eylz',
            name: 'Notice to the Press'
          },
          {
            id: 'ck2wbvj8n10m50720eu2ob3pq',
            name: 'On-the-record Briefing'
          },
          {
            id: 'ck2wbvj8y10md0720vsuqxq87',
            name: 'Press Guidance'
          },
          {
            id: 'ck2wbvj9b10ml0720245vk3uy',
            name: 'Remarks'
          },
          {
            id: 'ck2wbvj9v10mt0720hwq7013q',
            name: 'Speeches'
          },
          {
            id: 'ck2wbvjaa10n20720fg5ayhn9',
            name: 'Statement'
          },
          {
            id: 'ck2wbvjao10na0720ncwefnm6',
            name: 'Taken Questions'
          },
          {
            id: 'ck2wbvjb210nj07205m16k3xx',
            name: 'Travel Alert'
          },
          {
            id: 'ck2wbvjbf10nr0720o6zpopyt',
            name: 'Readout'
          },
          {
            id: 'ck2wbvjbu10nz072060p67wk5',
            name: 'Travel Warning'
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
  },
  {
    ...mocks[1],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  },
  {
    ...mocks[2],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

export const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { videoUses: null }
    }
  },
  {
    ...mocks[1],
    result: {
      data: { imageUses: null }
    }
  },
  {
    ...mocks[2],
    result: {
      data: { documentUses: null }
    }
  }
];

export const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { videoUses: [] }
    }
  },
  {
    ...mocks[1],
    result: {
      data: { imageUses: [] }
    }
  },
  {
    ...mocks[2],
    result: {
      data: { documentUses: [] }
    }
  }
];
