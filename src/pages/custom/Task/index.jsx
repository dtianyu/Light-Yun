import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Dropdown, Menu, message, Modal} from 'antd';
import React, {useState, useRef} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {queryList, add, update, remove} from './service';
import CreateForm from './components/CreateForm';
import UpdateForm from "./components/UpdateForm";
import {utcDate} from "@/pages/comm";
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

const RowOperation = ({item, operate}) => (
  <Dropdown
    overlay={
      <Menu onClick={async ({key}) => operate(key, item)}>
        <Menu.Item key="0">查看</Menu.Item>
        {item.status !== 'V' ? (<Menu.Item key="e">修改</Menu.Item>) : null}
        {item.status !== 'V' ? (<Menu.Item key="d">删除</Menu.Item>) : null}
        {item.status !== 'W' && item.status !== 'V' ? (<Menu.Item key="c">取消</Menu.Item>) : null}
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

const Task = () => {

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
          'plannedStartDate': item.plannedStartDate ? moment(item.plannedStartDate) : null,
          'plannedFinishDate': item.plannedFinishDate ? moment(item.plannedFinishDate) : null,
          'actualStartDate': item.actualStartDate ? moment(item.actualStartDate) : null,
          'actualFinishDate': item.actualFinishDate ? moment(item.actualFinishDate) : null,
        });
        break;
      case 'e':
        // edit
        setUpdateModalVisible(true);
        setModalReadOnly(false);
        setCurrentObject({
          ...item,
          'plannedStartDate': item.plannedStartDate ? moment(item.plannedStartDate) : null,
          'plannedFinishDate': item.plannedFinishDate ? moment(item.plannedFinishDate) : null,
          'actualStartDate': item.actualStartDate ? moment(item.actualStartDate) : null,
          'actualFinishDate': item.actualFinishDate ? moment(item.actualFinishDate) : null,
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
          optdate: moment.utc().format(),
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
      title: '任务',
      dataIndex: 'name',
      width: 300,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: '任务描述',
      dataIndex: 'description',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '执行人ID',
      dataIndex: 'executorId',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      width: 100,
    },
    {
      title: '紧急度',
      dataIndex: 'priority',
      hideInSearch: true,
      valueEnum: {
        1: {text: '高', status: 'Warning',},
        2: {text: '中', status: 'Processing',},
        3: {text: '低', status: 'Default',},
      },
    },
    {
      title: '计划开始',
      dataIndex: 'plannedStartDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '计划完成',
      dataIndex: 'plannedFinishDate',
      valueType: 'dateRange',
      render: (_, item) => (
        item.plannedFinishDate ? <span>{utcDate(item.plannedFinishDate)}</span> : null
      ),
    },
    {
      title: '实际开始',
      dataIndex: 'actualStartDate',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '实际完成',
      dataIndex: 'actualFinishDate',
      valueType: 'dateRange',
      render: (_, item) => (
        item.actualFinishDate ? <span>{utcDate(item.actualFinishDate)}</span> : null
      ),
      order: 90,
    },
    {
      title: '来源',
      dataIndex: 'contextObject',
      width: 80,
      valueEnum: {
        all: {text: '全部',},
        P: {text: '项目', status: 'Processing',},
        D: {text: '需求', status: 'Warning',},
        T: {text: '任务', status: 'Default',},
      },
      order: 70,
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
        Y: {text: '已完成', status: 'Success',},
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
        scroll={{x: 1300}}
        expandable={{
          expandedRowRender: record => <p style={{margin: 0}}>{record.description}</p>,
          rowExpandable: record => record.description,
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
          modalVisible={updateModalVisible}
          values={currentObject}
          readOnly={modalReadOnly}
        />
      ) : null}
    </PageHeaderWrapper>
  );

};

export default Task;
