export const mockData = {
  videoProjects: [
    {
      id: 'ck990wnr705ne0788lwfvaep7',
      createdAt: '2020-04-20T22:00:42.307Z',
      updatedAt: '2020-04-20T22:00:42.307Z',
      team: {
        id: 'ck80ddxkt00550888sv0cc0vw',
        name: 'GPA Video',
        __typename: 'Team'
      },
      author: {
        id: 'ck80d14os00150888zfvwrmqc',
        firstName: 'Jane',
        lastName: 'Doe',
        __typename: 'User'
      },
      projectTitle: 'Test 2',
      status: 'DRAFT',
      visibility: 'PUBLIC',
      thumbnails: [],
      categories: [],
      __typename: 'VideoProject'
    },
    {
      id: 'ck990vslc05n40788x7ocpml9',
      createdAt: '2020-04-20T22:00:01.920Z',
      updatedAt: '2020-04-20T22:00:01.920Z',
      team: {
        id: 'ck80ddxkt00550888sv0cc0vw',
        name: 'GPA Video',
        __typename: 'Team'
      },
      author: {
        id: 'ck80d14os00150888zfvwrmqc',
        firstName: 'John',
        lastName: 'Doe',
        __typename: 'User'
      },
      projectTitle: 'Test 2',
      status: 'DRAFT',
      visibility: 'PUBLIC',
      thumbnails: [],
      categories: [],
      __typename: 'VideoProject'
    }
  ]
};

export const mockProjects = {
  docProject: {
    __typename: 'DocumentFile',
    title: 'Doc Title'
  },
  packageProject: {
    __typename: 'Package',
    title: 'Package Title'
  },
  videoProject: {
    __typename: 'VideoProject',
    projectTitle: 'Video Title'
  },
  nullProject: {
    __typename: 'null',
    title: 'Null Title'
  }
};
