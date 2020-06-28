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

  const {modalVisible, modalWidth, onFinish: handleUpdate, onCancel, values, readOnly} = props;

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
              'plannedStartDate': fieldsValue.plannedStartDate ? utcFormat(fieldsValue.plannedStartDate) : null,
              'plannedFinishDate': fieldsValue.plannedFinishDate ? utcFormat(fieldsValue.plannedFinishDate) : null,
              'actualStartDate': fieldsValue.actualStartDate ? utcFormat(fieldsValue.actualStartDate) : null,
              'actualFinishDate': fieldsValue.actualFinishDate ? utcFormat(fieldsValue.actualFinishDate) : null,
            }
            handleUpdate(values);
          })
        }}
        onCancel={() => onCancel()}
        okButtonProps={readOnly === true ? {disabled: true} : {}}
      >
        <Form form={form} {...formItemLayout} initialValues={values}>
          <FormItem
            label="任务名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入任务名称，最多20个字',
                max: 20
              },
            ]}>
            <Input placeholder="任务名称" disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="任务描述"
            name="description"
          >
            <TextArea placeholder="任务描述" rows={4} disabled={readOnly}/>
          </FormItem>

          <FormItem
            label="紧急度"
            name="priority"
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
          <FormItem label="执行人" style={{marginBottom: 0}} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="executorId"
                rules={[
                  {
                    required: true,
                    message: '请输入执行人ID',
                  }]}>
                <Input placeholder="执行人ID" disabled={readOnly} readOnly={true}/>
              </FormItem>
              <FormItem
                name="executor"
                rules={[
                  {
                    required: true,
                    message: '请输入执行人姓名',
                  }]}>
                <Input placeholder="执行人姓名" disabled={readOnly} readOnly={true}/>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={() => setUserModalVisible(true)} disabled={readOnly}>查询</Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="执行部门" style={{marginBottom: 0}}>
            <Input.Group compact={true}>
              <FormItem
                name="deptId"
              >
                <Input placeholder="执行部门ID" disabled={readOnly}/>
              </FormItem>
              <FormItem
                name="dept"
              >
                <Input placeholder="执行部门" disabled={readOnly}/>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={() => setDeptModalVisible(true)} disabled={readOnly}>查询</Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem
            label="计划开始"
            name="plannedStartDate">
            <DatePicker disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="计划完成"
            name="plannedFinishDate">
            <DatePicker disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="实际开始"
            name="actualStartDate">
            <DatePicker disabled={readOnly}/>
          </FormItem>
          <FormItem
            label="实际完成"
            name="actualFinishDate">
            <DatePicker disabled={readOnly}/>
          </FormItem>
        </Form>
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
              executorId: data[0].userid,
              executor: data[0].username,
              deptId: data[0].deptno,
              dept: data[0].dept.dept,
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
              deptId: data[0].deptno,
              dept: data[0].dept,
            });
          }
          setDeptModalVisible(false);
        }}>
      </Department>
    </>
  );

};

export default UpdateForm;
