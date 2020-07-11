import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Switch, DatePicker, TimePicker, Button, Radio, Slider} from 'antd';
import {local2UTC} from "@/pages/comm";
import SystemUser from "@/pages/modal/SystemUser";
import Department from "@/pages/modal/Department";

const FormItem = Form.Item;
const {TextArea} = Input;

const UpdateForm = props => {

  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [finished, setFinished] = useState(false);

  const [form] = Form.useForm();

  const progressChanged = value => {
    if (!isNaN(value) && value === 100) {
      setFinished(true);
    } else {
      setFinished(false);
    }
  }

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
              'plannedStartDate': fieldsValue.plannedStartDate ? local2UTC(fieldsValue.plannedStartDate) : null,
              'plannedStartTime': fieldsValue.plannedStartTime ? local2UTC(fieldsValue.plannedStartTime) : null,
              'plannedFinishDate': fieldsValue.plannedFinishDate ? local2UTC(fieldsValue.plannedFinishDate) : null,
              'plannedFinishTime': fieldsValue.plannedFinishTime ? local2UTC(fieldsValue.plannedFinishTime) : null,
              'actualStartDate': fieldsValue.actualStartDate ? local2UTC(fieldsValue.actualStartDate) : null,
              'actualStartTime': fieldsValue.actualStartTime ? local2UTC(fieldsValue.actualStartTime) : null,
              'actualFinishDate': fieldsValue.actualFinishDate ? local2UTC(fieldsValue.actualFinishDate) : null,
              'actualFinishTime': fieldsValue.actualFinishTime ? local2UTC(fieldsValue.actualFinishTime) : null,
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
          <FormItem label="计划开始" style={{marginBottom: 0}} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="plannedStartDate"
                rules={[{required: true}]}
              >
                <DatePicker disabled={readOnly}/>
              </FormItem>
              <FormItem
                name="plannedStartTime"
                rules={[{required: true}]}
              >
                <TimePicker format={'HH:mm'} disabled={readOnly}/>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="计划完成" style={{marginBottom: 0}} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="plannedFinishDate"
                rules={[{required: true}]}
              >
                <DatePicker disabled={readOnly}/>
              </FormItem>
              <FormItem
                name="plannedFinishTime"
                rules={[{required: true}]}
              >
                <TimePicker format={'HH:mm'} disabled={readOnly}/>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="实际开始" style={{marginBottom: 0}}>
            <Input.Group compact={true}>
              <FormItem
                name="actualStartDate">
                <DatePicker disabled={readOnly}/>
              </FormItem>
              <FormItem
                name="actualStartTime"
              >
                <TimePicker format={'HH:mm'} disabled={readOnly}/>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="实际完成" style={{marginBottom: 0}}>
            <Input.Group compact={true}>
              <FormItem
                name="actualFinishDate">
                <DatePicker disabled={readOnly || !finished}/>
              </FormItem>
              <FormItem
                name="actualFinishTime"
              >
                <TimePicker format={'HH:mm'} disabled={readOnly || !finished}/>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="实际进度" name="progress">
            <Slider
              min={0}
              max={100}
              onChange={progressChanged}
              tooltipVisible
              disabled={readOnly}
            />
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
