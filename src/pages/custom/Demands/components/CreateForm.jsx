import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, DatePicker, Button, Radio} from 'antd';
import {local2UTC} from "@/pages/comm";
import SystemUser from "@/pages/components/EAP/SystemUser";
import * as moment from "moment";
import Department from "@/pages/components/EAP/Department";
import SystemNameSelect from "@/pages/components/EAP/SystemNameSelect";


const FormItem = Form.Item;
const {TextArea} = Input;

const CreateForm = props => {

  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const [form] = Form.useForm();

  const {modalVisible, modalWidth, onFinish: handleAdd, onCancel} = props;

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
        title="Create"
        visible={modalVisible}
        width={modalWidth ? modalWidth : 800}
        onOk={() => {
          form.validateFields().then(fieldsValue => {
            form.resetFields();
            // console.log(fieldsValue);
            const values = {
              ...fieldsValue,
              'formid': '',
              'formdate': moment.utc().format(),
              'demandDate': fieldsValue.demandDate ? local2UTC(fieldsValue.demandDate) : null,
              'status': 'N',
            };
            handleAdd(values);
          });
        }}
        onCancel={() => onCancel()}
      >
        <Form form={form} {...formItemLayout}>
          <FormItem
            label="需求简述"
            name="demandResume"
            rules={[
              {
                required: true,
                message: '请输入需求简述，最多40个字',
                max: 40
              },
            ]}>
            <Input placeholder="需求简述"/>
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
              width='100%'>
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
            <TextArea placeholder="需求内容" rows={4}/>
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
            <Radio.Group>
              <Radio value="1">高</Radio>
              <Radio value="2">中</Radio>
              <Radio value="3">低</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem label="需求人" style={{marginBottom: 0}} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="demanderID"
                rules={[
                  {
                    required: true,
                    message: '请输入需求人',
                  }]}>
                <Input placeholder="需求人ID"/>
              </FormItem>
              <FormItem
                name="demanderName"
                rules={[{required: true}]}
              >
                <Input placeholder="需求人"/>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={() => setUserModalVisible(true)}>查询</Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="需求部门" style={{marginBottom: 0}}>
            <Input.Group compact={true}>
              <FormItem
                name="demanderDeptID"
                rules={[
                  {
                    required: true,
                    message: '请输入需求部门',
                  }]}>
                <Input placeholder="需求部门ID"/>
              </FormItem>
              <FormItem
                name="demanderDeptName"
                rules={[{required: true}]}
              >
                <Input placeholder="需求部门"/>
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={() => setDeptModalVisible(true)}>查询</Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem
            label="需求日期"
            name="demandDate"
            rules={[{required: true}]}
          >
            <DatePicker/>
          </FormItem>
        </Form>
      </Modal>
      <SystemUser
        title="员工查询"
        width={860}
        visible={userModalVisible}
        selectType="radio"
        onCancel={() => setUserModalVisible(false)}
        onHandle={async data => {
          if (data.length === 1) {
            form.setFieldsValue({
              salesman: data[0].userid,
              salesmanName: data[0].username,
            });
            if (data[0].deptno) {
              form.setFieldsValue({
                deptno: data[0].deptno,
                dept: data[0].dept.dept,
              });
            }
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
              demanderDeptID: data[0].deptno,
              demanderDeptName: data[0].dept,
            });
          }
          setDeptModalVisible(false);
        }}>
      </Department>
    </>
  );
};

export default CreateForm;
