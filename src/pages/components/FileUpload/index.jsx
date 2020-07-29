import React, {useState} from 'react';
import {Upload, Button} from 'antd';
import styles from './index.less';
import {UploadOutlined} from '@ant-design/icons';

const FileUpload = (props) => {

  const {action, fileList, onChange} = props;

  const p = {
    name: 'file',
    action: action,
    method: 'POST',
    listType: 'text',
    className: 'upload-list-inline',
    onChange: onChange,
    onDownload: (file) => {
      const link = document.createElement('a');
      link.style.display = 'none';
      link.target = '_blank';
      link.href = file.url;
      link.setAttribute(
        'download',
        file.name
      );
      document.body.appendChild(link);
      link.click();
    },
  };
  return (
    <div className={styles.container}>
      <div id="components-upload-demo-picture-style">
        <div>
          <Upload {...p} fileList={fileList}>
            <Button>
              <UploadOutlined/> Upload
            </Button>
          </Upload>
        </div>
      </div>
    </div>
  );

}

export default FileUpload;
