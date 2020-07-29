import React, {useEffect, useState} from "react";
import {connect, history} from 'umi';
import {Button, DatePicker, Form, Input, Modal, Radio, Slider, TimePicker} from "antd";
import {local2UTC, uploadURL, utc2Local} from "@/pages/comm";
import FileUpload from "@/pages/components/FileUpload";
import SystemUser from "@/pages/modal/SystemUser";
import Department from "@/pages/modal/Department";
import {PageHeaderWrapper} from "@ant-design/pro-layout";

const FormItem = Form.Item;
const {TextArea} = Input;

const TaskEdit = props => {

  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [finished, setFinished] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [uploadList, setUploadList] = useState([]);

  const [form] = Form.useForm();
  const {currentUser, currentObject, dispatch} = props;

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

  useEffect(() => {
    // console.log(props.location);
    if (props.location.state) {
      const {id, readOnly} = props.location.state;
      dispatch({
        type: 'tasksModel/fetchCurrent',
        payload: {
          executorId: currentUser.userid,
          id: id,
        },
      })
    } else {
      history.push('/404')
    }
  }, []);

  useEffect(() => {
    if (currentObject && Object.keys(currentObject).length !== 0) {
      form.setFieldsValue({
        ...currentObject,
        'plannedStartDate': currentObject.plannedStartDate ? utc2Local(currentObject.plannedStartDate) : null,
        'plannedStartTime': currentObject.plannedStartTime ? utc2Local(currentObject.plannedStartTime) : null,
        'plannedFinishDate': currentObject.plannedFinishDate ? utc2Local(currentObject.plannedFinishDate) : null,
        'plannedFinishTime': currentObject.plannedFinishTime ? utc2Local(currentObject.plannedFinishTime) : null,
        'actualStartDate': currentObject.actualStartDate ? utc2Local(currentObject.actualStartDate) : null,
        'actualStartTime': currentObject.actualStartTime ? utc2Local(currentObject.actualStartTime) : null,
        'actualFinishDate': currentObject.actualFinishDate ? utc2Local(currentObject.actualFinishDate) : null,
        'actualFinishTime': currentObject.actualFinishTime ? utc2Local(currentObject.actualFinishTime) : null,
      });
    }
  }, [currentObject]);

  const progressChanged = value => {
    if (!isNaN(value) && value === 100) {
      setFinished(true);
    } else {
      setFinished(false);
    }
  }

  return (
    <>
      <Form form={form} {...formItemLayout}>
        <PageHeaderWrapper title='编辑任务'>
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
        </PageHeaderWrapper>
      </Form>
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

export default connect(({user, tasksModel: {currentObject}, loading}) => ({
  currentUser: user.currentUser,
  currentObject,
  loading: loading.effects['tasksModel/fetchCurrent'],
}))(TaskEdit);
