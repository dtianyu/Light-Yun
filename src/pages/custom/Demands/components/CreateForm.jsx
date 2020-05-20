import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Col, Row, DatePicker, Button, Select, Spin} from 'antd';
import {utcFormat} from "@/pages/comm";
import SystemUser from "@/pages/modal/SystemUser";
import * as moment from "moment";
import Department from "@/pages/modal/Department";
import {queryList as querySystemName} from "@/pages/modal/SystemName/service";
import SystemNameSelect from "@/pages/components/SystemNameSelect";


const FormItem = Form.Item;
const {Option} = Select;
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
              'demandDate': fieldsValue.demandDate ? utcFormat(fieldsValue.demandDate) : null,
              'status': 'N',
            }
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
                message: '请输入需求简述，最多20个字',
                max: 20
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
          <FormItem label="需求人" style={{marginBottom: 0}}>
            <Input.Group compact={true}>
              <FormItem
                name="demanderID"
                rules={[{required: true}]}>
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
                rules={[{required: true}]}>
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
              demanderID: data[0].userid,
              demanderName: data[0].username,
              demanderDeptID: data[0].deptno,
              demanderDeptName: data[0].dept.dept,
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
