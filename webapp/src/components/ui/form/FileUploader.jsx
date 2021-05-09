import React, {useEffect} from 'react';
import {useDropzone} from "react-dropzone";
import styled from "@emotion/styled";


const FileSelectorWrap = styled.div`
  background-color: white;
  padding:1rem;
  max-width: 550px;
  h4 {
    font-weight: 600;
    margin-bottom: 1rem;
  }
  .dropzone {
    border: 2px dashed rgba(0,0,0,0.4);
    padding: 5vh 2.5vw;
    border-radius: 0.5rem;
    button {
        border-radius: 0.25rem;
        font-size: 1.25rem;
        background: #AF0C3E;
        color: white;
    }
  }
`;

const FileUploader = ({
    formats, onUpload
}) => {

    const {getRootProps, getInputProps, open, acceptedFiles} = useDropzone({
        noClick: true, noKeyboard: true,
        accept: formats
    });

    const getFileURL = (file) => {
        const fileSize = file.size / (1024 * 1024);
        if(fileSize < 50) return URL.createObjectURL(file);
        else return null;
    };

    const processFile = (file) => {
        return { file, url: getFileURL(file), };
    };

    useEffect(() => {
        if(acceptedFiles && acceptedFiles.length>0) {
            onUpload(processFile(acceptedFiles[0]));
        }
    }, [acceptedFiles]);

    return <FileSelectorWrap>
        <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <div className="d-flex align-items-center justify-content-center">
                <div>
                    <div className="d-flex justify-content-center">
                        <button
                            aria-label="Select Files to Send"
                            title="Select Files to Send"
                            className="btn rounded-0 px-5 py-3 shadow-lg"
                            type="button"
                            onClick={open}
                        >
                            Select File
                        </button>
                    </div>
                    <div className="p-2 mt-3 d-none d-md-block">
                        <span>You may also drag and drop the file here.</span>
                    </div>
                </div>
            </div>
        </div>
    </FileSelectorWrap>

};

export default FileUploader;