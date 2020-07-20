import React from 'react';
import {Modal, Form, Input, Switch} from 'antd';

const FormItem = Form.Item;
const {TextArea} = Input;

const UpdateForm = props => {

  const [form] = Form.useForm();

  const {modalVisible, onSubmit: handleUpdate, onCancel, values, readOnly} = props;

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
      title={readOnly === true ? "View" : "Modify"}
      visible={modalVisible}
      onOk={() => {
        form.validateFields().then(fieldsValue => {
          form.resetFields();
          handleUpdate(fieldsValue);
        })
      }}
      onCancel={() => onCancel()}
      okButtonProps={readOnly === true ? {disabled: true} : {}}
    >
      <Form form={form} {...formItemLayout} initialValues={values}>
        <FormItem
          label="公司代号"
          name="company"
          rules={[
            {
              required: true,
              message: '请输入公司代号',
            },
          ]}>
          <Input placeholder="公司代号" disabled={readOnly}/>
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
          <Input placeholder="公司简称" disabled={readOnly}/>
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
          <Input placeholder="公司全称" disabled={readOnly}/>
        </FormItem>
        <FormItem
          label="联系地址"
          name="address">
          <TextArea rows={4} placeholder="联系地址" disabled={readOnly}/>
        </FormItem>
        <FormItem
          label="电话"
          name="tel">
          <Input disabled={readOnly}/>
        </FormItem>
        <FormItem
          label="传真"
          name="fax">
          <Input disabled={readOnly}/>
        </FormItem>
        <FormItem
          label="启用EAM"
          name="hasEAM"
          valuePropName="checked">
          <Switch checkedChildren="1" unCheckedChildren="0" disabled={readOnly}/>
        </FormItem>
        <FormItem
          label="启用KPI"
          name="hasKPI"
          valuePropName="checked">
          <Switch checkedChildren="1" unCheckedChildren="0" disabled={readOnly}/>
        </FormItem>
      </Form>
    </Modal>
  );

};

export default UpdateForm;

