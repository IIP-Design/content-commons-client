export const config = {
  heading: {
    options: [
      {
        model: 'heading1',
        view: 'h2',
        title: 'Heading 1',
        'class': 'ck-heading_heading1',
      },
      {
        model: 'heading2',
        view: 'h3',
        title: 'Heading 2',
        'class': 'ck-heading_heading2',
      },
      {
        model: 'heading3',
        view: 'h4',
        title: 'Heading 3',
        'class': 'ck-heading_heading3',
      },
      {
        model: 'paragraph',
        title: 'Normal',
        'class': 'ck-heading_paragraph',
      },
    ],
  },
  image: {
    styles: [
      'alignLeft', 'alignCenter', 'alignRight',
    ],
    toolbar: [
      'imageTextAlternative',
      '|',
      'imageStyle:alignLeft',
      'imageStyle:alignCenter',
      'imageStyle:alignRight',
      '|',
      'linkImage',
    ],
  },
  language: 'en',
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      'underline',
      '|',
      'alignment:left',
      'alignment:right',
      'alignment:center',
      'alignment:justify',
      '|',
      'link',
      '|',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'undo',
      'redo',
    ],
    shouldNotGroupWhenFull: true, // wrap toolbar
  },
};
