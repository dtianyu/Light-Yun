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
import { local2UTC, utc2Local } from '@/pages/comm';

const FormItem = Form.Item;

const PlanTable = ({
  value,
  onChange,
  onCreate: handleAdd,
  onUpdate: handleUpdate,
  onRemove: handleRemove,
  loading,
}) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentObject, setCurrentObject] = useState({});

  const columns = [
    {
      title: '序号',
      key: 'seq',
      dataIndex: 'seq',
      width: 80,
    },
    {
      title: '制令编号',
      key: 'manufactureId',
      dataIndex: 'manufactureId',
      width: 120,
    },
    {
      title: '制令日期',
      dataIndex: 'manufactureDate',
      key: 'manufactureDate',
      width: 120,
      render: (_, item) =>
        item.manufactureDate ? (
          <span>{utc2Local(item.manufactureDate, { localFormat: 'YYYY-MM-DD' })}</span>
        ) : null,
    },
    {
      title: '制令数量',
      dataIndex: 'manqty',
      key: 'manqty',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, item) => {
        return (
          <span>
            <a
              onClick={(e) => {
                setUpdateModalVisible(true);
                setCurrentObject({
                  ...item,
                  manufactureDate: item.manufactureDate ? utc2Local(item.manufactureDate) : null,
                });
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => handleRemove(item.id)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <>
      <Table loading={loading} columns={columns} dataSource={value} pagination={false} />
      <Button
        style={{
          width: '100%',
          marginTop: 16,
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
      <PlanCreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            setCreateModalVisible(false);
          }
        }}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {currentObject && Object.keys(currentObject).length ? (
        <PlanUpdateForm
          onFinish={async (value) => {
            const success = await handleUpdate({ ...currentObject, ...value });

            if (success) {
              setUpdateModalVisible(false);
              setCurrentObject({});
            }
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
            setCurrentObject({});
          }}
          modalVisible={updateModalVisible}
          values={currentObject}
        />
      ) : null}
    </>
  );
};

const PlanCreateForm = (props) => {
  const [form] = Form.useForm();

  const { modalVisible, modalWidth, onFinish: handleAdd, onCancel } = props;

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 16,
      },
    },
  };

  return (
    <Modal
      destroyOnClose
      title="Create"
      visible={modalVisible}
      width={modalWidth ? modalWidth : 600}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((fieldsValue) => {
          form.resetFields();
          const values = {
            ...fieldsValue,
            manufactureDate: fieldsValue.manufactureDate
              ? local2UTC(fieldsValue.manufactureDate)
              : null,
          };
          handleAdd(values);
        });
      }}
    >
      <Form form={form} {...formItemLayout}>
        <FormItem
          label="序号"
          name="seq"
          rules={[
            {
              required: true,
              message: '请输入序号',
            },
          ]}
        >
          <InputNumber placeholder="数字" />
        </FormItem>
        <FormItem label="制令编号" name="manufactureId" rules={[]}>
          <Input />
        </FormItem>
        <FormItem
          label="制令日期"
          name="manufactureDate"
          rules={[
            {
              required: true,
              message: '请输入制令日期',
            },
          ]}
        >
          <DatePicker />
        </FormItem>
        <FormItem
          label="制令数量"
          name="manqty"
          rules={[
            {
              required: true,
              message: '请输入制令数量',
            },
          ]}
          required={true}
        >
          <InputNumber placeholder="数字" />
        </FormItem>
      </Form>
    </Modal>
  );
};

const PlanUpdateForm = (props) => {
  const [form] = Form.useForm();

  const { values, readOnly, modalVisible, modalWidth, onFinish: handleUpdate, onCancel } = props;

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 16,
      },
    },
  };

  return (
    <Modal
      destroyOnClose
      title="Update"
      visible={modalVisible}
      width={modalWidth ? modalWidth : 600}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((fieldsValue) => {
          form.resetFields();
          const values = {
            ...fieldsValue,
            manufactureDate: fieldsValue.manufactureDate
              ? local2UTC(fieldsValue.manufactureDate)
              : null,
          };
          handleUpdate(values);
        });
      }}
    >
      <Form form={form} {...formItemLayout} initialValues={values}>
        <FormItem
          label="序号"
          name="seq"
          rules={[
            {
              required: true,
              message: '请输入序号',
            },
          ]}
        >
          <InputNumber placeholder="数字" />
        </FormItem>
        <FormItem
          label="制令编号"
          name="manufactureId"
          rules={[
            {
              required: true,
              message: '请输入制令编号',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="制令日期"
          name="manufactureDate"
          rules={[
            {
              required: true,
              message: '请输入制令日期',
            },
          ]}
        >
          <DatePicker />
        </FormItem>
        <FormItem
          label="制令数量"
          name="manqty"
          rules={[
            {
              required: true,
              message: '请输入制令数量',
            },
          ]}
          required={true}
        >
          <InputNumber placeholder="数字" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default PlanTable;
