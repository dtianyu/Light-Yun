import React from 'react';
import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;

const CreateForm = props => {

  const [form] = Form.useForm();

  const {modalVisible, onSubmit: handleAdd, onCancel} = props;

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
      onOk={() => {
        form.validateFields().then(fieldsValue => {
          form.resetFields();
          handleAdd(fieldsValue);
        });
      }}
      onCancel={() => onCancel()}
    >
      <Form form={form} {...formItemLayout}>
        <FormItem
          label="公司代号"
          name="company"
          rules={[
            {
              required: true,
              message: '请输入公司代号',
              max: 2
            },
          ]}>
          <Input placeholder="1-2个英文字母或数字"/>
        </FormItem>
        <FormItem
          label="公司简称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入公司简称，至少3个字',
              min: 3,
            },
          ]}>
          <Input placeholder="至少3个字"/>
        </FormItem>
        <FormItem
          label="公司全称"
          name="fullname"
          rules={[
            {
              required: true,
              message: '请输入公司全称',
            },
          ]}>
          <Input placeholder="公司全称"/>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
