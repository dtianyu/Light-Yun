import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Modal,
  Form,
  Button,
  Divider,
  Input,
  Popconfirm,
  Table,
  DatePicker,
  message,
  InputNumber,
} from 'antd';

const FormItem = Form.Item;

const SubstituteTable = (props) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentObject, setCurrentObject] = useState({});
  const [currentPart, setCurrentPart] = useState({});

  const [form] = Form.useForm();

  const {
    values,
    readOnly,
    modalVisible,
    modalWidth,
    onCreate: handleAdd,
    onUpdate: handleUpdate,
    onRemove: handleRemove,
    onCancel,
    loading,
  } = props;

  const columns = [
    {
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: 90,
      hideInSearch: true,
    },
    {
      title: '品号',
      key: 'itemno',
      dataIndex: 'itemno',
      hideInSearch: true,
    },
    {
      title: '品名',
      key: 'itemDesc',
      dataIndex: 'itemDesc',
      hideInSearch: true,
    },
    {
      title: '简名',
      key: 'itemModel',
      dataIndex: 'itemModel',
      hideInSearch: true,
    },
    {
      title: '数量',
      key: 'qty',
      dataIndex: 'qty',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, item) => {
        return (
          <span>
            <a
              onClick={(e) => {
                if (readOnly) {
                  return;
                }
                setUpdateModalVisible(true);
                setCurrentPart(item);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => {}} disabled={readOnly}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <Modal
      destroyOnClose
      title="替代料"
      visible={modalVisible}
      width={modalWidth ? modalWidth : 960}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((fieldsValue) => {
          form.resetFields();
          handleAdd(fieldsValue);
        });
      }}
    >
      <Table columns={columns} dataSource={values} pagination={false} loading={loading} />
      <Button
        style={{
          width: '100%',
          marginTop: 8,
          marginBottom: 8,
        }}
        type="dashed"
        onClick={() => {
          setCreateModalVisible(true);
        }}
      >
        <PlusOutlined />
        新增
      </Button>
    </Modal>
  );
};

export default SubstituteTable;
