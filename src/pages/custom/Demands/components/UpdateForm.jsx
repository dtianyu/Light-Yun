import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Switch, DatePicker, Button, Radio} from 'antd';
import {utcFormat} from "@/pages/comm";
import SystemUser from "@/pages/modal/SystemUser";
import Department from "@/pages/modal/Department";
import SystemNameSelect from "@/pages/components/SystemNameSelect";

const FormItem = Form.Item;
const {TextArea} = Input;

const UpdateForm = props => {

  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const [form] = Form.useForm();

  const {modalVisible, modalWidth, onFinish: handleUpdate, onCancel, values, readOnly, syncTask} = props;

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

  const formButtonLayout = {
    wrapperCol: {
      xs: {span: 12, offset: 12},
      sm: {span: 16, offset: 6},
    },
  };

  return (
    <>
      <Modal
        destroyOnClose
        title={readOnly === true ? "View" : "Modify"}
        visible={modalVisible}
        width={modalWidth ? modalWidth : 800}
        onOk={() => {
          form.validateFields().then(fieldsValue => {
            // form.resetFields();
            // console.log(fieldsValue);
            const values = {
              ...fieldsValue,
              'planStartDate': fieldsValue.planStartDate ? utcFormat(fieldsValue.planStartDate) : null,
              'planOverDate': fieldsValue.planOverDate ? utcFormat(fieldsValue.planOverDate) : null,
              'realStartDate': fieldsValue.realStartDate ? utcFormat(fieldsValue.realStartDate) : null,
              'realOverDate': fieldsValue.realOverDate ? utcFormat(fieldsValue.realOverDate) : null,
            }
            handleUpdate(values);
          })
        }}
        onCancel={() => onCancel()}
        okButtonProps={readOnly === true ? {disabled: true} : {}}
      >
        <Form form={form} {...formItemLayout} initialValues={values}>
          <FormItem
            label="需求编号"
            name="formid"
            rules={[
              {
                required: true,
                message: '请输入需求编号',
              },
            ]}>
            <Input placeholder="需求编号" disabled={true}/>
          </FormItem>
          <FormItem
            label="需求简述"
            name="demandResume"
            rules={[
              {
                required: true,
                message: '请输入需求简述，最多20个字',
                min: 4
              },
            ]}>
            <Input placeholder="需求简述" disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="系统名称"
            name="systemName"
            rules={[
              {
                required: true,
                message: '请选择系统名称',
              },
            ]}>
            <SystemNameSelect
              width='100%' disabled={readOnly}>
            </SystemNameSelect>
          </FormItem>
          <FormItem
            label="需求内容"
            name="demandContent"
            rules={[
              {
                required: true,
                message: '请输入需求内容',
              },
            ]}>
            <TextArea placeholder="需求内容" rows={4} disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="紧急度"
            name="emergencyDegree"
            rules={[
              {
                required: true,
                message: '请输入紧急度',
              },
            ]}>
            <Radio.Group disabled={readOnly}>
              <Radio value="1">高</Radio>
              <Radio value="2">中</Radio>
              <Radio value="3">低</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem label="负责人" style={{marginBottom: 0}} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="directorID"
                rules={[{required: true}]}>
                <Input placeholder="负责人ID" disabled={readOnly} readOnly={true}/>
              </FormItem>
              <FormItem
                name="directorName"
                rules={[{required: true}]}>
                <Input placeholder="负责人" disabled={readOnly} readOnly={true}/>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={() => setUserModalVisible(true)} disabled={readOnly}>查询</Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="负责部门" style={{marginBottom: 0}} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="directorDeptID"
                rules={[{required: true}]}>
                <Input placeholder="负责部门ID" disabled={readOnly} readOnly={true}/>
              </FormItem>
              <FormItem
                name="directorDeptName"
                rules={[{required: true}]}>
                <Input placeholder="负责部门" disabled={readOnly} readOnly={true}/>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={() => setDeptModalVisible(true)} disabled={readOnly}>查询</Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem
            label="计划开始"
            name="planStartDate"
            rules={[{required: true}]}>
            <DatePicker disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="计划完成"
            name="planOverDate"
            rules={[{required: true}]}>
            <DatePicker disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="实际开始"
            name="realStartDate">
            <DatePicker disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="实际完成"
            name="realOverDate">
            <DatePicker disabled={readOnly}/>
          </FormItem>
        </Form>
        <FormItem {...formButtonLayout}>
          <Button type="primary" onClick={() => {
            form.validateFields().then(fieldsValue => {
              // console.log(fieldsValue);
              const values = {
                ...fieldsValue,
                'planStartDate': fieldsValue.planStartDate ? utcFormat(fieldsValue.planStartDate) : null,
                'planOverDate': fieldsValue.planOverDate ? utcFormat(fieldsValue.planOverDate) : null,
                'realStartDate': fieldsValue.realStartDate ? utcFormat(fieldsValue.realStartDate) : null,
                'realOverDate': fieldsValue.realOverDate ? utcFormat(fieldsValue.realOverDate) : null,
              }
              syncTask(values);
            })
          }}>
            同步任务
          </Button>
        </FormItem>
      </Modal>
      <SystemUser
        title="员工查询"
        width={860}
        visible={userModalVisible}
        selectType="radio"
        onCancel={() => setUserModalVisible(false)}
        onHandle={data => {
          if (data.length === 1) {
            form.setFieldsValue({
              directorID: data[0].userid,
              directorName: data[0].username,
              directorDeptID: data[0].deptno,
              directorDeptName: data[0].dept.dept,
            });
          }
          setUserModalVisible(false);
        }}>
      </SystemUser>
      <Department
        title="部门查询"
        width={860}
        visible={deptModalVisible}
        selectType="radio"
        onCancel={() => setDeptModalVisible(false)}
        onHandle={data => {
          if (data.length === 1) {
            form.setFieldsValue({
              directorDeptID: data[0].deptno,
              directorDeptName: data[0].dept,
            });
          }
          setDeptModalVisible(false);
        }}>
      </Department>
    </>
  );

};

export default UpdateForm;
