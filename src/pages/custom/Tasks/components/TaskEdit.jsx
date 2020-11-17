import React, { Fragment, useEffect, useState } from 'react';
import { connect, history, Link } from 'umi';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Radio,
  Row,
  Slider,
  Table,
  TimePicker,
} from 'antd';
import { local2UTC, uploadURL, utc2Local } from '@/pages/comm';
import FileUpload from '@/pages/components/FileUpload';
import SystemUser from '@/pages/components/EAP/SystemUser';
import Department from '@/pages/components/EAP/Department';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SystemUserSelect from '@/pages/components/EAP/SystemUserSelect';
import TaskSplit from '@/pages/custom/Tasks/components/TaskSpilt';
import styles from '@/pages/custom/Tasks/style.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const columns = [
  {
    title: '内容',
    dataIndex: 'name',
    key: 'name',
    width: 300,
  },
  {
    title: '执行人',
    dataIndex: 'executor',
    key: 'executor',
  },
  {
    title: '计划开始',
    dataIndex: 'plannedStartDate',
    key: 'plannedStartDate',
    valueType: 'date',
    render: (_, item) =>
      item.plannedStartDate ? (
        <span>{utc2Local(item.plannedStartDate, { localFormat: 'YYYY-MM-DD' })}</span>
      ) : null,
  },
  {
    title: '计划完成',
    dataIndex: 'plannedFinishDate',
    key: 'plannedFinishDate',
    valueType: 'date',
    render: (_, item) =>
      item.plannedFinishDate ? (
        <span>{utc2Local(item.plannedFinishDate, { localFormat: 'YYYY-MM-DD' })}</span>
      ) : null,
  },
  {
    title: '进度',
    dataIndex: 'progress',
    key: 'progress',
    render: (value) => {
      return (
        <Progress
          percent={value}
          strokeWidth={6}
          style={{
            width: 120,
          }}
        />
      );
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    fixed: 'right',
    valueEnum: {
      all: { text: '全部' },
      N: { text: '未完成', status: 'Default' },
      P: { text: '处理中', status: 'Processing' },
      S: { text: '暂停中', status: 'Warning' },
      T: { text: '测试中', status: 'Processing' },
      Y: { text: '已完成', status: 'Success' },
      V: { text: '已结案', status: 'Success' },
      W: { text: '已取消', status: 'Default' },
    },
    order: 80,
  },
];

const TaskEdit = (props) => {
  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [finished, setFinished] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [participantList, setParticipantList] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);
  const [details, setDetails] = useState([]);

  const [form] = Form.useForm();
  const { currentUser, currentObject, extData, dispatch, loading, submitting } = props;

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
      const { id, readOnly } = props.location.state;
      dispatch({
        type: 'tasksModel/fetchCurrent',
        payload: {
          executorId: currentUser.userid,
          id: id,
        },
      });
      if (readOnly) {
        setReadOnly(readOnly);
      }
    } else {
      history.push('/404');
    }
  }, []);

  useEffect(() => {
    if (currentObject && Object.keys(currentObject).length !== 0) {
      if (currentObject.status === 'V') {
        setReadOnly(readOnly || true);
      }
      // console.log(currentObject);
      currentObject.participants.map((p, index) => {
        p.key = p.participantId;
        p.value = p.participantId;
        p.label = [p.participantId, p.participant];
      });
      form.setFieldsValue({
        ...currentObject,
        plannedStartDate: currentObject.plannedStartDate
          ? utc2Local(currentObject.plannedStartDate)
          : null,
        plannedStartTime: currentObject.plannedStartTime
          ? utc2Local(currentObject.plannedStartTime)
          : null,
        plannedFinishDate: currentObject.plannedFinishDate
          ? utc2Local(currentObject.plannedFinishDate)
          : null,
        plannedFinishTime: currentObject.plannedFinishTime
          ? utc2Local(currentObject.plannedFinishTime)
          : null,
        actualStartDate: currentObject.actualStartDate
          ? utc2Local(currentObject.actualStartDate)
          : null,
        actualStartTime: currentObject.actualStartTime
          ? utc2Local(currentObject.actualStartTime)
          : null,
        actualFinishDate: currentObject.actualFinishDate
          ? utc2Local(currentObject.actualFinishDate)
          : null,
        actualFinishTime: currentObject.actualFinishTime
          ? utc2Local(currentObject.actualFinishTime)
          : null,
      });
      setAttachmentList(currentObject.attachments);
    }
  }, [currentObject]);

  useEffect(() => {
    if (extData) {
      setDetails(extData.details);
    }
  }, [extData]);

  /**
   * 添加
   * @param fields
   */
  const handleAdd = (fields) => {
    message.loading('正在添加');
    try {
      dispatch({
        type: 'tasksModel/add',
        payload: {
          data: fields,
        },
      });
      return true;
    } catch (error) {
      message.error('添加失败请重试！');
      return false;
    }
  };

  const fileUploadOnChange = (info) => {
    // console.log(info);
    const { file } = info;
    let fileList = [...info.fileList];
    if (file.status === 'done') {
      fileList = fileList.map((f) => {
        if (f.response && f.response.files) {
          f.url = f.response.files[0].url;
          f.uid = f.response.files[0].uid;
        }
        return f;
      });
    }
    setAttachmentList(fileList);
  };

  const progressOnChange = (value) => {
    if (!isNaN(value) && value === 100) {
      setFinished(true);
    } else {
      setFinished(false);
    }
  };

  const systemUserOnChange = (value) => {
    // console.log(value);
    setParticipantList(value);
    currentObject.participants = participantList;
  };

  const onTabChange = (e) => {
    setActiveTab(e);
  };

  const tabContent = {
    main: (
      <div>
        <Form
          form={form}
          {...formItemLayout}
          onFinish={async (fieldsValue) => {
            if (
              fieldsValue.actualFinishDate &&
              fieldsValue.progress === 100 &&
              fieldsValue.status !== 'V'
            ) {
              fieldsValue.status = 'V';
            } else {
              fieldsValue.status = 'N';
            }
            fieldsValue.participants.map((p, index) => {
              p.pid = currentObject.id;
              p.seq = index + 1;
              p.participantId = p.value;
              p.participant = p.label[1];
            });
            let attachments = [];
            attachmentList.map((a, index) => {
              let f = {
                pid: currentObject.id,
                seq: index + 1,
                uid: a.uid,
                name: a.name,
                url: a.url,
              };
              attachments.push(f);
            });
            const values = {
              ...currentObject,
              ...fieldsValue,
              plannedStartDate: fieldsValue.plannedStartDate
                ? local2UTC(fieldsValue.plannedStartDate)
                : null,
              plannedStartTime: fieldsValue.plannedStartTime
                ? local2UTC(fieldsValue.plannedStartTime)
                : null,
              plannedFinishDate: fieldsValue.plannedFinishDate
                ? local2UTC(fieldsValue.plannedFinishDate)
                : null,
              plannedFinishTime: fieldsValue.plannedFinishTime
                ? local2UTC(fieldsValue.plannedFinishTime)
                : null,
              actualStartDate: fieldsValue.actualStartDate
                ? local2UTC(fieldsValue.actualStartDate)
                : null,
              actualStartTime: fieldsValue.actualStartTime
                ? local2UTC(fieldsValue.actualStartTime)
                : null,
              actualFinishDate: fieldsValue.actualFinishDate
                ? local2UTC(fieldsValue.actualFinishDate)
                : null,
              actualFinishTime: fieldsValue.actualFinishTime
                ? local2UTC(fieldsValue.actualFinishTime)
                : null,
              attachments: attachments,
            };
            // console.log(values);
            message.loading('正在更新');
            try {
              dispatch({
                type: 'tasksModel/update',
                payload: {
                  data: values,
                },
              });
            } catch (error) {
              message.error('更新失败,请重试');
            }
          }}
        >
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
              >
                <FormItem
                  label="任务名称"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: '请输入任务名称，最多20个字',
                      max: 20,
                    },
                  ]}
                >
                  <Input placeholder="任务名称" disabled={readOnly} />
                </FormItem>
                <FormItem label="任务描述" name="description">
                  <TextArea placeholder="任务描述" rows={4} disabled={readOnly} />
                </FormItem>
                <FormItem
                  label="紧急度"
                  name="priority"
                  rules={[
                    {
                      required: true,
                      message: '请输入紧急度',
                    },
                  ]}
                >
                  <Radio.Group disabled={readOnly}>
                    <Radio value="1">高</Radio>
                    <Radio value="2">中</Radio>
                    <Radio value="3">低</Radio>
                  </Radio.Group>
                </FormItem>
                <FormItem label="执行人" style={{ marginBottom: 0 }} required={true}>
                  <Input.Group compact={true}>
                    <FormItem
                      name="executorId"
                      rules={[
                        {
                          required: true,
                          message: '请输入执行人ID',
                        },
                      ]}
                    >
                      <Input placeholder="执行人ID" disabled={readOnly} readOnly={true} />
                    </FormItem>
                    <FormItem
                      name="executor"
                      rules={[
                        {
                          required: true,
                          message: '请输入执行人姓名',
                        },
                      ]}
                    >
                      <Input placeholder="执行人姓名" disabled={readOnly} readOnly={true} />
                    </FormItem>
                    <FormItem>
                      <Button
                        type="primary"
                        onClick={() => setUserModalVisible(true)}
                        disabled={readOnly}
                      >
                        查询
                      </Button>
                    </FormItem>
                  </Input.Group>
                </FormItem>
                <FormItem label="执行部门" style={{ marginBottom: 0 }}>
                  <Input.Group compact={true}>
                    <FormItem name="deptId">
                      <Input placeholder="执行部门ID" disabled={readOnly} />
                    </FormItem>
                    <FormItem name="dept">
                      <Input placeholder="执行部门" disabled={readOnly} />
                    </FormItem>
                    <FormItem>
                      <Button
                        type="primary"
                        onClick={() => setDeptModalVisible(true)}
                        disabled={readOnly}
                      >
                        查询
                      </Button>
                    </FormItem>
                  </Input.Group>
                </FormItem>
                <FormItem label="计划开始" style={{ marginBottom: 0 }} required={true}>
                  <Input.Group compact={true}>
                    <FormItem name="plannedStartDate" rules={[{ required: true }]}>
                      <DatePicker disabled={readOnly} />
                    </FormItem>
                    <FormItem name="plannedStartTime" rules={[{ required: true }]}>
                      <TimePicker format={'HH:mm'} disabled={readOnly} />
                    </FormItem>
                  </Input.Group>
                </FormItem>
                <FormItem label="计划完成" style={{ marginBottom: 0 }} required={true}>
                  <Input.Group compact={true}>
                    <FormItem name="plannedFinishDate" rules={[{ required: true }]}>
                      <DatePicker disabled={readOnly} />
                    </FormItem>
                    <FormItem name="plannedFinishTime" rules={[{ required: true }]}>
                      <TimePicker format={'HH:mm'} disabled={readOnly} />
                    </FormItem>
                  </Input.Group>
                </FormItem>
                <FormItem label="实际开始" style={{ marginBottom: 0 }}>
                  <Input.Group compact={true}>
                    <FormItem name="actualStartDate">
                      <DatePicker disabled={readOnly} />
                    </FormItem>
                    <FormItem name="actualStartTime">
                      <TimePicker format={'HH:mm'} disabled={readOnly} />
                    </FormItem>
                  </Input.Group>
                </FormItem>
                <FormItem label="实际完成" style={{ marginBottom: 0 }}>
                  <Input.Group compact={true}>
                    <FormItem name="actualFinishDate">
                      <DatePicker disabled={readOnly || !finished} />
                    </FormItem>
                    <FormItem name="actualFinishTime">
                      <TimePicker format={'HH:mm'} disabled={readOnly || !finished} />
                    </FormItem>
                  </Input.Group>
                </FormItem>
                <FormItem label="实际进度" name="progress">
                  <Slider
                    min={0}
                    max={100}
                    onChange={progressOnChange}
                    tooltipVisible
                    disabled={readOnly}
                  />
                </FormItem>
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
                title="参与人员"
              >
                <FormItem name="participants">
                  <SystemUserSelect
                    mode="multiple"
                    onChange={systemUserOnChange}
                    disabled={readOnly}
                  />
                </FormItem>
              </Card>
              <Card
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
                title="相关资料"
              >
                <FileUpload
                  action={uploadURL}
                  onChange={fileUploadOnChange}
                  fileList={attachmentList}
                  disabled={readOnly}
                />
              </Card>
            </Col>
          </Row>
        </Form>
        <SystemUser
          title="员工查询"
          width={860}
          visible={userModalVisible}
          selectType="radio"
          onCancel={() => setUserModalVisible(false)}
          onHandle={(data) => {
            if (data.length === 1) {
              form.setFieldsValue({
                executorId: data[0].userid,
                executor: data[0].username,
                deptId: data[0].deptno,
                dept: data[0].dept.dept,
              });
            }
            setUserModalVisible(false);
          }}
        ></SystemUser>
        <Department
          title="部门查询"
          width={860}
          visible={deptModalVisible}
          selectType="radio"
          onCancel={() => setDeptModalVisible(false)}
          onHandle={(data) => {
            if (data.length === 1) {
              form.setFieldsValue({
                deptId: data[0].deptno ? data[0].deptno : '',
                dept: data[0].dept ? data[0].dept : '',
              });
            }
            setDeptModalVisible(false);
          }}
        ></Department>
        <TaskSplit
          onFinish={async (value) => {
            const success = handleAdd(value);
            if (success) {
              setSplitModalVisible(false);
            }
          }}
          onCancel={() => setSplitModalVisible(false)}
          modalVisible={splitModalVisible}
          data={currentObject}
        />
      </div>
    ),
    rel: (
      <div>
        <Card
          bordered={false}
          style={{
            marginTop: 24,
          }}
          bodyStyle={{
            padding: '0 32px 40px 32px',
          }}
        >
          <Table loading={loading} dataSource={details} columns={columns} />
        </Card>
      </div>
    ),
  };

  return (
    <PageHeaderWrapper
      title={'任务详情'}
      onBack={() => window.history.back()}
      tabActiveKey={activeTab}
      onTabChange={onTabChange}
      tabList={[
        {
          key: 'main',
          tab: '任务内容',
        },
        {
          key: 'rel',
          tab: '关联任务',
        },
      ]}
      extra={
        <Fragment>
          <Button
            type="primary"
            onClick={() => {
              setSplitModalVisible(true);
            }}
            disabled={readOnly}
          >
            分解
          </Button>
          <Button
            type="primary"
            onClick={() => form?.submit()}
            loading={submitting}
            disabled={readOnly}
          >
            提交
          </Button>
        </Fragment>
      }
    >
      {tabContent[activeTab]}
    </PageHeaderWrapper>
  );
};

export default connect(({ user, tasksModel, loading }) => ({
  currentUser: user.currentUser,
  currentObject: tasksModel.currentObject,
  extData: tasksModel.extData,
  loading: loading.effects['tasksModel/fetchCurrent'],
  submitting: loading.effects['tasksModel/update'],
}))(TaskEdit);
