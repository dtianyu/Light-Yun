import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  List,
  Menu,
  message,
  Modal,
  notification,
  Progress,
  Radio,
  Row, Table
} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect, Link} from 'umi';
import TaskNew from './components/TaskNew';
import {utc2Local} from "@/pages/comm";
import * as PropTypes from "prop-types";
import moment from "moment";
import styles from "@/pages/custom/Tasks/style.less";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const RowOperation = ({item, operate}) => (
  <Dropdown
    overlay={
      <Menu onClick={({key}) => operate(key, item)}>
        <Menu.Item key="0">查看</Menu.Item>
        {item.status !== 'V' ? (<Menu.Item key="e">修改</Menu.Item>) : null}
        {item.status !== 'V' ? (<Menu.Item key="d">删除</Menu.Item>) : null}
        {item.status !== 'V' ? (<Menu.Item key="v">结案</Menu.Item>) : null}
        {item.status === 'V' ? (<Menu.Item key="r">还原</Menu.Item>) : null}
      </Menu>
    }
  >
    <a>
      操作 <DownOutlined/>
    </a>
  </Dropdown>
);

RowOperation.propTypes = {
  item: PropTypes.object.isRequired,
  operate: PropTypes.func.isRequired,
};

const Info = ({title, value, bordered}) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em/>}
  </div>
);

const ListContent = ({data: {plannedStartDate, plannedFinishDate, actualStartDate, actualFinishDate, progress, status}}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>计划开始时间</span>
      <p>{utc2Local(plannedStartDate, {localFormat: 'YYYY-MM-DD'})}</p>
      <span>计划完成时间</span>
      <p>{utc2Local(plannedFinishDate, {localFormat: 'YYYY-MM-DD'})}</p>
    </div>
    <div className={styles.listContentItem}>
      <Progress
        percent={progress}
        status={status}
        strokeWidth={6}
        style={{
          width: 120,
        }}
      />
    </div>
    <div className={styles.listContentItem}>
      <span>实际开始时间</span>
      <p>{actualStartDate ? utc2Local(actualStartDate, {localFormat: 'YYYY-MM-DD'}) : 'null'}</p>
      <span>实际完成时间</span>
      <p>{actualFinishDate ? utc2Local(actualFinishDate, {localFormat: 'YYYY-MM-DD'}) : 'null'}</p>
    </div>
  </div>
);

const Tasks = props => {

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const [currentObject, setCurrentObject] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [range, setRange] = useState('progress');
  const [number, setNumber] = useState(1);

  const [activeTab, setActiveTab] = useState('my');

  const actionRef = useRef();

  const {currentUser, data, total, subData, subTotal, loading, dispatch,} = props;
  const {progress: {thisYearFinished, thisMonthFinished, unfinished}} = props;
  const {subProgress: {thisYearFinished: subThisYearFinished, thisMonthFinished: subThisMonthFinished, unfinished: subUnfinished}} = props;

  const operate = (key, item) => {
    const value = {...item};
    const {name} = item;
    switch (key) {
      case '0':
        // read
        props.history.push({
          pathname: '/custom/tasks/taskEdit',
          state: {
            id: item.id,
            readOnly: true,
          }
        });
        break;
      case 'e':
        // edit
        props.history.push({
          pathname: '/custom/tasks/taskEdit',
          state: {
            id: item.id,
            readOnly: modalReadOnly,
          }
        });
        break;
      case 'd':
        // delete
        Modal.confirm({
          title: '删除',
          content: `确定删除${name}吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const success = handleRemove(item.id);

            if (success) {
              setCurrentObject({});
            }
          }
        });
        break;
      case 'v':
        // verify
        if (value.actualStartDate && value.actualStartTime) {
          value.status = 'V';
          value.actualFinishDate = moment.utc().format();
          value.actualFinishTime = moment.utc().format();

          Modal.confirm({
            title: '确认',
            content: `确定结案${name}吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              const success = await handleUpdate({...value});

              if (success) {
                setCurrentObject({});

                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }
          });
        } else {
          notification["error"]({
            message: '系统提示',
            description:
              '实际完成时间不可空.',
          });
        }
        break;
      case 'r':
        // revoke
        value.status = 'N';

        Modal.confirm({
          title: '还原',
          content: `确定还原${name}吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleUpdate({...value});

            if (success) {
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        });
        break;
      default:
        break;
    }

  };

  useEffect(() => {
    if (currentUser && dispatch) {
      handleFetch({current: page, pageSize: pageSize, status: 'N'});
      fetchProgress();
      return () => {
        dispatch({
          type: 'tasksModel/clear',
        });
      };
    }
  }, []);

  const fetchProgress = () => {
    dispatch({
      type: 'tasksModel/fetchProgress',
      payload: {
        userId: currentUser.userid,
      },
    });
    dispatch({
      type: 'tasksModel/fetchSubProgress',
      payload: {
        userId: currentUser.userid,
      },
    });
  };

  /**
   * 查询
   */
  const handleFetch = (filters) => {
    const {range} = filters;
    // console.log(range);
    if (range && range !== 'all' && range !== 'progress') {
      dispatch({
        type: 'tasksModel/fetchRange',
        payload: {
          userId: currentUser.userid,
          ...filters,
        },
      });
      dispatch({
        type: 'tasksModel/fetchSubRange',
        payload: {
          userId: currentUser.userid,
          ...filters,
        },
      });
    } else {
      dispatch({
        type: 'tasksModel/fetchList',
        payload: {
          userId: currentUser.userid,
          ...filters,
        },
      });
      dispatch({
        type: 'tasksModel/fetchSubList',
        payload: {
          userId: currentUser.userid,
          ...filters,
        },
      });
    }
  }

  /**
   * 添加
   * @param fields
   */
  const handleAdd = fields => {
    message.loading('正在添加');
    try {
      dispatch({
        type: 'tasksModel/add',
        payload: {
          data: fields,
          params: {
            userId: currentUser.userid,
            status: 'N',
            current: page,
            pageSize: pageSize,
            range: range,
            number: number,
          },
        }
      });
      return true;
    } catch (error) {
      message.error('添加失败请重试！');
      return false;
    }
  };

  /**
   * 更新
   * @param fields
   */
  const handleUpdate = fields => {
    message.loading('正在更新');
    try {
      dispatch({
        type: 'tasksModel/update',
        payload: {
          data: fields,
          params: {
            userId: currentUser.userid,
            status: 'N',
            current: page,
            pageSize: pageSize,
            range: range,
            number: number,
          },
        }
      });
      return true;
    } catch (error) {
      message.error('更新失败,请重试');
      return false;
    }
  };

  /**
   * 删除
   * @param id
   */
  const handleRemove = id => {
    if (!id) return true;
    message.loading('正在删除');
    try {
      dispatch({
        type: 'tasksModel/remove',
        payload: {
          id: id,
          params: {
            userId: currentUser.userid,
            status: 'N',
            current: page,
            pageSize: pageSize,
            range: range,
            number: number,
          },
        }
      })
      return true;
    } catch (error) {
      message.error('删除失败,请重试');
      return false;
    }
  };

  const handleRangeChange = e => {
    switch (e.target.value) {
      case 'all':
        setRange('all');
        handleFetch({current: page, pageSize: pageSize});
        break;
      case 'progress':
        setRange('progress');
        handleFetch({current: page, pageSize: pageSize, status: 'N'});
        break;
      case 'nextWeek':
        setRange('next_weeks');
        setNumber(1);
        handleFetch({current: 1, pageSize: pageSize, range: 'next_weeks', number: 1});
        break;
      case 'nextTwoWeeks':
        setRange('next_weeks');
        setNumber(2);
        handleFetch({current: 1, pageSize: pageSize, range: 'next_weeks', number: 2});
        break;
      case 'pastWeek':
        setRange('past_weeks');
        setNumber(1);
        handleFetch({current: 1, pageSize: pageSize, range: 'past_weeks', number: 1});
        break;
      case 'pastTwoWeeks':
        setRange('past_weeks');
        setNumber(2);
        handleFetch({current: 1, pageSize: pageSize, range: 'past_weeks', number: 2});
        break;
      default:
        handleFetch({current: page, pageSize: pageSize, status: 'N'});
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup onChange={handleRangeChange} defaultValue="progress">
        <RadioButton value="nextWeek">下一周</RadioButton>
        <RadioButton value="nextTwoWeeks">下两周</RadioButton>
        <RadioButton value="progress">进行中</RadioButton>
        <RadioButton value="pastWeek">上一周</RadioButton>
        <RadioButton value="pastTwoWeeks">上两周</RadioButton>
        <RadioButton value="all">所有的</RadioButton>
      </RadioGroup>
    </div>
  );

  const onTabChange = e => {
    setActiveTab(e);
  };

  const tabContent = {
    my: (
      <div className={styles.standardList}>
        <Card bordered={false}>
          <Row>
            <Col sm={8} xs={24}>
              {unfinished ? <Info title="我的待办任务" value={unfinished + "个"} bordered/> : null}
            </Col>
            <Col sm={8} xs={24}>
              {thisMonthFinished ? <Info title="本月完成任务" value={thisMonthFinished + "个"} bordered/> : null}
            </Col>
            <Col sm={8} xs={24}>
              {thisYearFinished ? <Info title="今年完成任务" value={thisYearFinished + "个"}/> : null}
            </Col>
          </Row>
        </Card>
        <Card
          className={styles.listCard}
          bordered={false}
          title="任务列表"
          style={{
            marginTop: 24,
          }}
          bodyStyle={{
            padding: '0 32px 40px 32px',
          }}
          extra={extraContent}
        >
          <Button
            type="dashed"
            style={{
              width: '100%',
              marginBottom: 8,
            }}
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined/>
            添加
          </Button>
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              pageSize: pageSize,
              total: total,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
                if (range === 'all') {
                  handleFetch({current: page, pageSize: pageSize});
                } else if (range === 'progress') {
                  handleFetch({current: page, pageSize: pageSize, status: 'N'});
                } else {
                  handleFetch({current: page, pageSize: pageSize, range: range, number: number});
                }
              },
              onShowSizeChange: (current, size) => {
                setPage(current);
                setPageSize(size);
                if (range === 'all') {
                  handleFetch({current: current, pageSize: size});
                } else if (range === 'progress') {
                  handleFetch({current: current, pageSize: size, status: 'N'});
                } else {
                  handleFetch({current: current, pageSize: size, range: range, number: number});
                }
              },
            }}
            dataSource={data}
            renderItem={item => (
              <List.Item
                actions={[
                  <RowOperation item={item} operate={operate}/>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.logo} shape="square" size="large"/>}
                  title={
                    <Link to={{
                      pathname: '/custom/tasks/taskEdit',
                      state: {
                        id: item.id,
                        readOnly: modalReadOnly,
                      }
                    }}>{item.name}
                      <span style={{marginLeft: 20}}>执行人:{item.executor}</span>
                    </Link>}
                  description={item.description}
                />
                <ListContent data={item}/>
              </List.Item>
            )}
          />
        </Card>
      </div>
    ),
    sub: (
      <div className={styles.standardList}>
        <Card bordered={false}>
          <Row>
            <Col sm={8} xs={24}>
              {subUnfinished ? <Info title="下属待办任务" value={subUnfinished + "个"} bordered/> : null}
            </Col>
            <Col sm={8} xs={24}>
              {subThisMonthFinished ?
                <Info title="下属本月完成" value={subThisMonthFinished + "个"} bordered/> : null}
            </Col>
            <Col sm={8} xs={24}>
              {subThisYearFinished ? <Info title="下属今年完成" value={subThisYearFinished + "个"}/> : null}
            </Col>
          </Row>
        </Card>
        <Card
          className={styles.listCard}
          bordered={false}
          title="任务列表"
          style={{
            marginTop: 24,
          }}
          bodyStyle={{
            padding: '0 32px 40px 32px',
          }}
          extra={extraContent}
        >
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              pageSize: pageSize,
              total: subTotal,
              onChange: (page, pageSize) => {
                setPage(page);
                setPageSize(pageSize);
                if (range === 'all') {
                  handleFetch({current: page, pageSize: pageSize});
                } else if (range === 'progress') {
                  handleFetch({current: page, pageSize: pageSize, status: 'N'});
                } else {
                  handleFetch({current: page, pageSize: pageSize, range: range, number: number});
                }
              },
              onShowSizeChange: (current, size) => {
                setPage(current);
                setPageSize(size);
                if (range === 'all') {
                  handleFetch({current: current, pageSize: size});
                } else if (range === 'progress') {
                  handleFetch({current: current, pageSize: size, status: 'N'});
                } else {
                  handleFetch({current: current, pageSize: size, range: range, number: number});
                }
              },
            }}
            dataSource={subData}
            renderItem={item => (
              <List.Item
                actions={[
                  <RowOperation item={item} operate={operate}/>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.logo} shape="square" size="large"/>}
                  title={
                    <Link to={{
                      pathname: '/custom/taskEdit',
                      state: {
                        id: item.id,
                        readOnly: modalReadOnly,
                      }
                    }}>{item.name}
                      <span style={{marginLeft: 20}}>执行人:{item.executor}</span>
                    </Link>}
                  description={item.description}
                />
                <ListContent data={item}/>
              </List.Item>
            )}
          />
        </Card>
      </div>
    ),
  };

  return (
    <div>
      <PageHeaderWrapper
        tabActiveKey={activeTab}
        onTabChange={onTabChange}
        tabList={[
          {
            key: 'my',
            tab: '我的任务',
          },
          {
            key: 'sub',
            tab: '下属任务',
          },
        ]}>
        {tabContent[activeTab]}
      </PageHeaderWrapper>
      <TaskNew
        onFinish={async value => {
          const success = handleAdd(value);
          if (success) {
            setCreateModalVisible(false);
          }
        }}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </div>
  );

};

export default connect(({user, tasksModel, loading}) => ({
  currentUser: user.currentUser,
  data: tasksModel.data,
  total: tasksModel.total,
  progress: tasksModel.progress,
  subData: tasksModel.subData,
  subTotal: tasksModel.subTotal,
  subProgress: tasksModel.subProgress,
  loading: loading.effects['tasksModel/fetchList'] || loading.effects['tasksModel/fetchRange'],
}))(Tasks);
