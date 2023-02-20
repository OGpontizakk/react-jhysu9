import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import './style.css';
const QuillNoSSRWrapper = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill');
    const { default: htmlEditButton } = await import('quill-html-edit-button');
    const { default: ImageUploader } = await import('quill-image-uploader');
    RQ.Quill.register('modules/htmlEditButton', htmlEditButton);
    RQ.Quill.register('modules/imageUploader', ImageUploader);
    return function forwardRef({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} {...props} />;
    };
  },
  {
    ssr: false,
  }
);

const sectionModules = {
  toolbar: [
    [{ size: [] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],

    ['link', 'image', 'video'],

    ['clean'], // remove formatting button
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: true,
  },
  htmlEditButton: {
    debug: true, // logging, default:false
    msg: 'Edit the content in HTML format', //Custom message to display in the editor, default: Edit HTML here, when you click "OK" the quill editor's contents will be replaced
    okText: 'Ok', // Text to display in the OK button, default: Ok,
    cancelText: 'Cancel', // Text to display in the cancel button, default: Cancel
    buttonHTML: '&lt;&gt;', // Text to display in the toolbar button, default: <>
    buttonTitle: 'Show HTML source', // Text to display as the tooltip for the toolbar button, default: Show HTML source
    syntax: false, // Show the HTML with syntax highlighting. Requires highlightjs on window.hljs (similar to Quill itself), default: false
    prependSelector: 'div#myelement', // a string used to select where you want to insert the overlayContainer, default: null (appends to body),
    editorModules: {}, // The default mod
  },
  imageUploader: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);

        fetch(
          'https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22',
          {
            method: 'POST',
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            resolve(result.data.url);
          })
          .catch((error) => {
            reject('Upload failed');
            console.error('Error:', error);
          });
      });
    },
  },
};

export default function App() {
  const [value, setValue] = React.useState('');
  return (
    <QuillNoSSRWrapper
      modules={sectionModules}
      theme="snow"
      value={value}
      onChange={setValue}
    />
  );
}
