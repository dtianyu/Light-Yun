import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Dropdown, Menu, message, Modal} from 'antd';
import React, {useState, useRef} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {queryList, add, update, remove, syncTask} from './service';
import CreateForm from './components/CreateForm';
import UpdateForm from "./components/UpdateForm";
import {utc2Local} from "@/pages/comm";
import * as PropTypes from "prop-types";
import moment from "moment";

/**
 * 添加
 * @param fields
 */
const handleAdd = async fields => {
  message.loading('正在添加');
  try {
    const res = await add(
      fields
    );
    const {code, msg} = res;
    if (code < "300") {
      message.success('添加成功');
      return true;
    } else {
      message.error(msg);
      return false;
    }
  } catch (error) {
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新
 * @param fields
 */
const handleUpdate = async fields => {
  message.loading('正在更新');
  try {
    const res = await update({
      ...fields
    });
    const {code, msg} = res;
    if (code < "300") {
      message.success('更新成功');
      return true;
    } else {
      message.error(msg);
      return false;
    }
  } catch (error) {
    message.error('更新失败,请重试');
    return false;
  }
};

/**
 *  删除
 * @param id
 */
const handleRemove = async id => {
  if (!id) return true;
  message.loading('正在删除');
  try {
    const res = await remove(id);
    const {code, msg} = res;
    if (code < "300") {
      message.success('删除成功');
      return true;
    } else {
      message.error(msg);
      return false;
    }
  } catch (error) {
    message.error('删除失败,请重试');
    return false;
  }
};

/**
 * 添加任务
 * @param fields
 */
const handleAddTask = async fields => {
  message.loading('正在添加');
  try {
    const res = await syncTask(
      fields
    );
    const {code, msg} = res;
    if (code < "300") {
      message.success('添加任务成功');
      return true;
    } else {
      message.error(msg);
      return false;
    }
  } catch (error) {
    message.error('添加任务失败请重试！');
    return false;
  }
};

const RowOperation = ({item, operate}) => (
  <Dropdown
    overlay={
      <Menu onClick={async ({key}) => operate(key, item)}>
        <Menu.Item key="0">查看</Menu.Item>
        {item.status !== 'V' ? (<Menu.Item key="e">修改</Menu.Item>) : null}
        {item.status !== 'V' ? (<Menu.Item key="d">删除</Menu.Item>) : null}
        {item.status !== 'W' && item.status !== 'V' ? (<Menu.Item key="c">取消</Menu.Item>) : null}
        {item.status !== 'S' && item.status !== 'V' ? (<Menu.Item key="s">暂停</Menu.Item>) : null}
        {item.status !== 'T' && item.status !== 'V' ? (<Menu.Item key="t">测试</Menu.Item>) : null}
        {item.status === 'Y' ? (<Menu.Item key="v">结案</Menu.Item>) : null}
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

const Demands = () => {

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const [currentObject, setCurrentObject] = useState({});
  const actionRef = useRef();

  const operate = async (key, item) => {
    const value = {...item};
    const {formid} = item;
    let changed;
    switch (key) {
      case '0':
        // read
        setUpdateModalVisible(true);
        setModalReadOnly(true);
        setCurrentObject({
          ...item,
          'planStartDate': item.planStartDate ? utc2Local(item.planStartDate) : null,
          'planOverDate': item.planOverDate ? utc2Local(item.planOverDate) : null,
          'realStartDate': item.realStartDate ? utc2Local(item.realStartDate) : null,
          'realOverDate': item.realOverDate ? utc2Local(item.realOverDate) : null,
        });
        break;
      case 'e':
        // edit
        setUpdateModalVisible(true);
        setModalReadOnly(false);
        setCurrentObject({
          ...item,
          'planStartDate': item.planStartDate ? utc2Local(item.planStartDate) : null,
          'planOverDate': item.planOverDate ? utc2Local(item.planOverDate) : null,
          'realStartDate': item.realStartDate ? utc2Local(item.realStartDate) : null,
          'realOverDate': item.realOverDate ? utc2Local(item.realOverDate) : null,
        });
        break;
      case 'd':
        // delete
        Modal.confirm({
          title: '删除',
          content: `确定删除${formid}吗？`,
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
      case 'c':
        // cancel
        changed = {
          status: 'W',
        };

        Modal.confirm({
          title: '取消',
          content: `确定取消${formid}吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleUpdate({...value, ...changed});

            if (success) {
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        });
        break;
      case 's':
        // suspend
        changed = {
          status: 'S',
          optdate: moment.utc().format(),
        };

        Modal.confirm({
          title: '暂停',
          content: `确定暂停${formid}吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleUpdate({...value, ...changed});

            if (success) {
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        });
        break;
      case 't':
        // test
        changed = {
          status: 'T',
          optdate: moment.utc().format(),
        };

        Modal.confirm({
          title: '测试',
          content: `确定进行${formid}测试吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleUpdate({...value, ...changed});

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
        value.status = 'V';

        Modal.confirm({
          title: '确认',
          content: `确定结案${formid}吗？`,
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
      case 'r':
        // revoke
        value.status = 'Y';

        Modal.confirm({
          title: '还原',
          content: `确定还原${formid}吗？`,
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

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '需求编号',
      dataIndex: 'formid',
      width: 120,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: '需求简述',
      dataIndex: 'demandResume',
      width: 300,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '登记日期',
      dataIndex: 'formdate',
      valueType: 'dateRange',
      render: (_, item) => (
        item.formdate ? <span>{utc2Local(item.formdate, {localFormat: 'YYYY-MM-DD'})}</span> : null
      ),
      order: 100,
    },
    {
      title: '需求内容',
      dataIndex: 'demandContent',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '需求部门ID',
      dataIndex: 'demanderDeptID',
    },
    {
      title: '需求部门',
      dataIndex: 'demanderDeptName',
      hideInSearch: true,
    },
    {
      title: '需求人ID',
      dataIndex: 'demanderID',
      hideInSearch: true,
    },
    {
      title: '需求人',
      dataIndex: 'demanderName',
    },
    {
      title: '需求日期',
      dataIndex: 'demandDate',
      valueType: 'date',
      hideInSearch: true,
      render: (_, item) => (
        item.demandDate ? <span>{utc2Local(item.demandDate, {localFormat: 'YYYY-MM-DD'})}</span> : null
      ),
    },
    {
      title: '紧急度',
      dataIndex: 'emergencyDegree',
      hideInSearch: true,
      valueEnum: {
        1: {text: '高', status: 'Warning',},
        2: {text: '中', status: 'Processing',},
        3: {text: '低', status: 'Default',},
      },
    },
    {
      title: '系统名称',
      dataIndex: 'systemName',
      ellipsis: true,
    },
    {
      title: '负责部门ID',
      dataIndex: 'directorDeptID',
    },
    {
      title: '负责部门',
      dataIndex: 'directorDeptName',
      hideInSearch: true,
    },
    {
      title: '负责人ID',
      dataIndex: 'directorID',
      hideInSearch: true,
    },
    {
      title: '负责人',
      dataIndex: 'directorName',
    },
    {
      title: '计划开始',
      dataIndex: 'planStartDate',
      valueType: 'date',
      hideInSearch: true,
      render: (_, item) => (
        item.planStartDate ? <span>{utc2Local(item.planStartDate, {localFormat: 'YYYY-MM-DD'})}</span> : null
      ),
    },
    {
      title: '计划完成',
      dataIndex: 'planOverDate',
      valueType: 'dateRange',
      render: (_, item) => (
        item.planOverDate ? <span>{utc2Local(item.planOverDate, {localFormat: 'YYYY-MM-DD'})}</span> : null
      ),
    },
    {
      title: '实际开始',
      dataIndex: 'realStartDate',
      valueType: 'date',
      hideInSearch: true,
      render: (_, item) => (
        item.realStartDate ? <span>{utc2Local(item.realStartDate, {localFormat: 'YYYY-MM-DD'})}</span> : null
      ),
    },
    {
      title: '实际完成',
      dataIndex: 'realOverDate',
      valueType: 'dateRange',
      render: (_, item) => (
        item.realOverDate ? <span>{utc2Local(item.realOverDate, {localFormat: 'YYYY-MM-DD'})}</span> : null
      ),
      order: 90,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      fixed: 'right',
      valueEnum: {
        all: {text: '全部',},
        N: {text: '未完成', status: 'Default',},
        P: {text: '处理中', status: 'Processing',},
        S: {text: '暂停中', status: 'Warning',},
        T: {text: '测试中', status: 'Processing',},
        Y: {text: '已完成', status: 'Success',},
        V: {text: '已结案', status: 'Success',},
        W: {text: '已取消', status: 'Default',},
      },
      order: 80,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_, item) => (
        <>
          <RowOperation item={item} operate={operate}/>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="资料列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, {selectedRows}) => [
          <Button icon={<PlusOutlined/>} type="primary" onClick={() => setCreateModalVisible(true)}>
            新建
          </Button>,
        ]}
        request={params => queryList(params)}
        columns={columns}
        pagination={{
          showSizeChanger: true,
        }}
        scroll={{x: 2800}}
        expandable={{
          expandedRowRender: record => <p style={{margin: 0}}>{record.demandContent}</p>,
          rowExpandable: record => record.demandContent,
        }}
      />
      <CreateForm
        onFinish={async value => {
          const success = await handleAdd(value);

          if (success) {
            setCreateModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
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
            const success = await handleUpdate({...currentObject, ...value});

            if (success) {
              setUpdateModalVisible(false);
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            setUpdateModalVisible(false);
            setCurrentObject({});
          }}
          syncTask={async value => {
            const success = await handleAddTask({...currentObject, ...value});

            if (success) {
              setUpdateModalVisible(false);
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          modalVisible={updateModalVisible}
          values={currentObject}
          readOnly={modalReadOnly}
        />
      ) : null}
    </PageHeaderWrapper>
  );

};

export default Demands;
