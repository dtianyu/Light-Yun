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
  Row
} from 'antd';
import React, {useState, useRef, useEffect} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {connect} from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from "./components/UpdateForm";
import {utcDate} from "@/pages/comm";
import * as PropTypes from "prop-types";
import moment from "moment";
import styles from "@/pages/custom/Tasks/style.less";

// /**
//  * 删除
//  * @param id
//  */
// const handleRemove = async id => {
//   if (!id) return true;
//   message.loading('正在删除');
//   try {
//     const res = await remove(id);
//     const {code, msg} = res;
//     if (code < "300") {
//       message.success('删除成功');
//       return true;
//     } else {
//       message.error(msg);
//       return false;
//     }
//   } catch (error) {
//     message.error('删除失败,请重试');
//     return false;
//   }
// };

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

const ListContent = ({data: {executor, plannedStartDate, plannedFinishDate, progress, status}}) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      <span>Owner</span>
      <p>{executor}</p>
    </div>
    <div className={styles.listContentItem}>
      <span>计划开始时间</span>
      <p>{utcDate(plannedStartDate)}</p>
      <span>计划完成时间</span>
      <p>{utcDate(plannedFinishDate)}</p>
    </div>
    <div className={styles.listContentItem}>
      <Progress
        percent={progress}
        status={status}
        strokeWidth={6}
        style={{
          width: 160,
        }}
      />
    </div>
  </div>
);

const Tasks = props => {

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const [currentObject, setCurrentObject] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [range, setRange] = useState('N');
  const [number, setNumber] = useState(1);
  const actionRef = useRef();

  const {currentUser, data, total, loading, dispatch,} = props;

  const operate = (key, item) => {
    const value = {...item};
    const {name} = item;
    let changed;
    switch (key) {
      case '0':
        // read
        setUpdateModalVisible(true);
        setModalReadOnly(true);
        setCurrentObject({
          ...item,
          'plannedStartDate': item.plannedStartDate ? moment(item.plannedStartDate) : null,
          'plannedStartTime': item.plannedStartTime ? moment(item.plannedStartTime) : null,
          'plannedFinishDate': item.plannedFinishDate ? moment(item.plannedFinishDate) : null,
          'plannedFinishTime': item.plannedFinishTime ? moment(item.plannedFinishTime) : null,
          'actualStartDate': item.actualStartDate ? moment(item.actualStartDate) : null,
          'actualStartTime': item.actualStartTime ? moment(item.actualStartTime) : null,
          'actualFinishDate': item.actualFinishDate ? moment(item.actualFinishDate) : null,
          'actualFinishTime': item.actualFinishTime ? moment(item.actualFinishTime) : null,
        });
        break;
      case 'e':
        // edit
        setUpdateModalVisible(true);
        setModalReadOnly(false);
        setCurrentObject({
          ...item,
          'plannedStartDate': item.plannedStartDate ? moment(item.plannedStartDate) : null,
          'plannedStartTime': item.plannedStartTime ? moment(item.plannedStartTime) : null,
          'plannedFinishDate': item.plannedFinishDate ? moment(item.plannedFinishDate) : null,
          'plannedFinishTime': item.plannedFinishTime ? moment(item.plannedFinishTime) : null,
          'actualStartDate': item.actualStartDate ? moment(item.actualStartDate) : null,
          'actualStartTime': item.actualStartTime ? moment(item.actualStartTime) : null,
          'actualFinishDate': item.actualFinishDate ? moment(item.actualFinishDate) : null,
          'actualFinishTime': item.actualFinishTime ? moment(item.actualFinishTime) : null,
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
            const success = await handleRemove(item.id);

            if (success) {
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
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
        value.status = 'Y';

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
    }
  }, []);

  /**
   * 查询
   */
  const handleFetch = (filters) => {
    const {range, number} = filters;
    // console.log(range);
    if (range && range !== 'all' && range !== 'progress') {
      dispatch({
        type: 'tasksModel/fetchRange',
        payload: {
          executorId: currentUser.userid,
          ...filters,
        },
      });
    } else {
      dispatch({
        type: 'tasksModel/fetchList',
        payload: {
          executorId: currentUser.userid,
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
            executorId: currentUser.userid,
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
            executorId: currentUser.userid,
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

  const handleChange = e => {
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
      default:
        handleFetch({current: page, pageSize: pageSize, status: 'N'});
    }
  };

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup onChange={handleChange} defaultValue="progress">
        <RadioButton value="nextWeek">下一周</RadioButton>
        <RadioButton value="nextTwoWeeks">下两周</RadioButton>
        <RadioButton value="progress">进行中</RadioButton>
        <RadioButton value="all">所有的</RadioButton>
      </RadioGroup>
    </div>
  );

  return (
    <div>
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="我的待办" value="8个任务" bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本月完成任务" value="7个" bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="今年完成任务" value="221个任务"/>
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
                    title={<a href={item.href}>{item.name}</a>}
                    description={item.description}
                  />
                  <ListContent data={item}/>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
      <CreateForm
        onFinish={async value => {
          const success = handleAdd(value);
          if (success) {
            setCreateModalVisible(false);
          }
        }}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {currentObject && Object.keys(currentObject).length ? (
        <UpdateForm
          onFinish={async value => {
            if (value.realOverDate && value.status !== 'V') {
              value.status = 'Y';
            } else {
              value.status = 'N';
            }
            const success = handleUpdate({...currentObject, ...value});

            if (success) {
              setUpdateModalVisible(false);
              setCurrentObject({});
            }
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
            setCurrentObject({});
          }}
          modalVisible={updateModalVisible}
          values={currentObject}
          readOnly={modalReadOnly}
        />
      ) : null}
    </div>
  );

};

export default connect(({user, tasksModel, loading}) => ({
  currentUser: user.currentUser,
  data: tasksModel.data,
  total: tasksModel.total,
  loading: loading.effects['tasksModel/fetch'],
}))(Tasks);
