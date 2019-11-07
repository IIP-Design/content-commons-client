/**
 * mock data for UI development
 * eventually use for unit testing
 */
export const props = { id: 'test-123' };

export const mocks = [
  {
    request: {
      query: 'PRESS_PACKAGE_QUERY',
      variables: { id: props.id }
    },
    result: {
      data: {
        package: {
          id: props.id,
          packageTitle: 'Final Guidance mm-dd-yy',
          packageType: 'Press Guidance',
          files: [
            {
              id: '1',
              releaseType: 'STATEMENT',
              fileName: 'Lesotho National Day',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '2',
              releaseType: 'MEDIA NOTE',
              fileName: 'U.S.-Pakistan Women’s Council Advances Women’s Economic Empowerment at Houston Event',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '3',
              releaseType: 'MEDIA NOTE',
              fileName: 'Rewards for Justice: Reward Offer for Those Involved in the 2017 “Tongo Tongo” Ambush in Niger',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '4',
              releaseType: 'MEDIA NOTE',
              fileName: 'First Meeting of the U.S.-Canada Critical Minerals Working Group',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '5',
              releaseType: 'MEDIA NOTE',
              fileName: 'United States and India Launch Flexible Resources Initiative—Growth through Clean Energy',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '6',
              releaseType: 'MEDIA NOTE',
              fileName: 'United States Announces $25 Million to Support Emergency Cash Transfer Program in Yemen',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '7',
              releaseType: 'MEDIA NOTE',
              fileName: 'Ambassador Nathan A. Sales Travels to Kazakhstan to Discuss Counterterrorism and Repatriation',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '8',
              releaseType: 'FACT SHEET',
              fileName: 'Secretary Pompeo Travels to Greece to Deepen Our Historic Alliance',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '9',
              releaseType: 'FACT SHEET',
              fileName: 'Strengthening Our Alliance with Montenegro',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '10',
              releaseType: 'PRESS GUIDANCE',
              fileName: 'Reestablishment of U.S Embassy Mogadishu',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '11',
              releaseType: 'PRESS GUIDANCE',
              fileName: 'Iraq Protests',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            },
            {
              id: '12',
              releaseType: 'PRESS GUIDANCE',
              fileName: 'Ecuador: National Demonstrations and State of Exception',
              visibility: 'INTERNAL',
              thumbnails: [
                {
                  id: 'th1',
                  url: 'https://picsum.photos/224/290?grayscale',
                  alt: 'thumbnail of guidance document'
                }
              ],
              bureaus: [],
              categories: [],
              tags: []
            }
          ]
        }
      }
    }
  }
];
