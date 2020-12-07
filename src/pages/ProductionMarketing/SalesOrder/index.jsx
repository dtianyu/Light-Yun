import React, { useState, useRef } from 'react';
import * as PropTypes from 'prop-types';
import { connect, history } from 'umi';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, message, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryList, add, update, remove } from '../services/SalesOrder';
import { utc2Local } from '@/pages/comm';
import CreateForm from '@/pages/ProductionMarketing/SalesOrder/components/CreateForm';
import UpdateForm from '@/pages/ProductionMarketing/SalesOrder/components/UpdateForm';

const RowOperation = ({ item, operate }) => (
  <Dropdown
    overlay={
      <Menu onClick={async ({ key }) => operate(key, item)}>
        <Menu.Item key="0">详情</Menu.Item>
        {item.status !== 'V' ? <Menu.Item key="e">修改</Menu.Item> : null}
        {item.status !== 'V' ? <Menu.Item key="d">删除</Menu.Item> : null}
        {item.status === 'V' ? <Menu.Item key="r">还原</Menu.Item> : null}
        <Menu.Item key="copy">拷贝</Menu.Item>
      </Menu>
    }
  >
    <a>
      操作 <DownOutlined />
    </a>
  </Dropdown>
);

RowOperation.propTypes = {
  item: PropTypes.object.isRequired,
  operate: PropTypes.func.isRequired,
};

const TableList = (props) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const [currentObject, setCurrentObject] = useState({});
  const actionRef = useRef();

  const { currentUser } = props;

  /**
   * 添加
   * @param fields
   */
  const handleAdd = async (fields) => {
    message.loading('正在添加');
    try {
      const res = await add({
        ...fields,
        creator: currentUser ? currentUser.userid + currentUser.name : '',
      });
      const { code, msg } = res;
      if (code < '300') {
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
  const handleUpdate = async (fields) => {
    message.loading('正在更新');
    try {
      const res = await update({
        ...fields,
        optuser: currentUser ? currentUser.userid + currentUser.name : '',
      });
      const { code, msg } = res;
      if (code < '300') {
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
  const handleRemove = async (id) => {
    if (!id) return true;
    message.loading('正在删除');
    try {
      const res = await remove(id);
      const { code, msg } = res;
      if (code < '300') {
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

  const operate = async (key, item) => {
    const value = { ...item };
    const { formid } = item;

    switch (key) {
      case '0':
        // read
        history.push({
          pathname: '/production-marketing/order-detail',
          query: {
            uid: value.UID,
            formid: value.formid,
          },
        });
        break;
      case 'e':
        // edit
        setUpdateModalVisible(true);
        setModalReadOnly(false);
        setCurrentObject({
          ...item,
          formdate: item.formdate ? utc2Local(item.formdate) : null,
          demandDate: item.demandDate ? utc2Local(item.demandDate) : null,
        });
        break;
      case 'd':
        // delete
        Modal.confirm({
          title: '删除',
          content: `确定删除${formid}吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleRemove(item.id);

            if (success) {
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          },
        });
        break;
      case 'v':
        // verify
        value.status = 'V';

        Modal.confirm({
          title: '确认',
          content: `确定确认${formid}吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleUpdate({ ...value });

            if (success) {
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          },
        });
        break;
      case 'r':
        // revoke
        value.status = 'N';
        value.currentStep = value.currentStep - 1;

        Modal.confirm({
          title: '还原',
          content: `确定还原${formid}吗？`,
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleUpdate({ ...value });

            if (success) {
              setCurrentObject({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          },
        });
        break;
      case 'copy':
        // copy
        value.formid = '';
        value.formdate = null;
        value.status = 'N';
        Modal.confirm({
          title: '拷贝',
          content: `确定拷贝${formid}吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            setCurrentObject({
              ...value,
              formdate: value.formdate ? utc2Local(value.formdate) : null,
              demandDate: value.demandDate ? utc2Local(value.demandDate) : null,
            });
            setCreateModalVisible(true);
          },
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
      title: '公司',
      dataIndex: 'company',
      width: 60,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: '客户简称',
      dataIndex: 'customer',
      width: 120,
      ellipsis: true,
      fixed: 'left',
    },
    {
      title: '产品型号',
      dataIndex: 'itemModel',
      width: 160,
      fixed: 'left',
    },
    {
      title: '数量',
      dataIndex: 'qty',
      width: 80,
      fixed: 'left',
      hideInSearch: true,
    },
    {
      title: '客户交期',
      dataIndex: 'demandDate',
      valueType: 'dateRange',
      width: 120,
      fixed: 'left',
      render: (_, item) =>
        item.demandDate ? (
          <span>{utc2Local(item.demandDate, { localFormat: 'YYYY-MM-DD' })}</span>
        ) : null,
    },
    {
      title: '订单编号',
      dataIndex: 'formid',
      width: 160,
    },
    {
      title: '接单日期',
      dataIndex: 'formdate',
      valueType: 'dateRange',
      width: 120,
      render: (_, item) =>
        item.formdate ? (
          <span>{utc2Local(item.formdate, { localFormat: 'YYYY-MM-DD' })}</span>
        ) : null,
    },
    {
      title: '预计出货',
      dataIndex: 'deliveryDate',
      valueType: 'dateRange',
      width: 120,
      render: (_, item) =>
        item.deliveryDate ? (
          <span>{utc2Local(item.deliveryDate, { localFormat: 'YYYY-MM-DD' })}</span>
        ) : null,
    },
    {
      title: '生管交期',
      dataIndex: 'prepareDate',
      valueType: 'date',
      width: 120,
      hideInSearch: true,
      render: (_, item) =>
        item.prepareDate ? (
          <span>{utc2Local(item.prepareDate, { localFormat: 'YYYY-MM-DD' })}</span>
        ) : null,
    },
    {
      title: '制令日期',
      dataIndex: 'manufactureDate',
      valueType: 'date',
      width: 120,
      hideInSearch: true,
      render: (_, item) =>
        item.manufactureDate ? (
          <span>{utc2Local(item.manufactureDate, { localFormat: 'YYYY-MM-DD' })}</span>
        ) : null,
    },
    {
      title: '订单类别',
      dataIndex: 'formKind',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '客户别名',
      dataIndex: 'customerAlias',
      hideInSearch: true,
    },
    {
      title: '负责业务',
      dataIndex: 'salesman',
      hideInSearch: true,
    },
    {
      title: '业务姓名',
      dataIndex: 'salesmanName',
    },
    {
      title: '品号',
      dataIndex: 'itemno',
      hideInSearch: true,
    },
    {
      title: '品名',
      dataIndex: 'itemDesc',
      hideInSearch: true,
    },
    {
      title: '制令',
      dataIndex: 'manqty',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '备货',
      dataIndex: 'invqty',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '已交',
      dataIndex: 'shipqty',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        all: { text: '全部' },
        N: { text: '未确认', value: 'N' },
        V: { text: '已确认', value: 'V' },
      },
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '进度',
      dataIndex: 'currentStep',
      valueEnum: {
        0: { text: '营业', status: 'Error' },
        1: { text: '技术', status: 'Processing' },
        2: { text: '生管', status: 'Warning' },
        3: { text: '待结案', status: 'Default' },
        4: { text: '已结案', status: 'Success' },
      },
      width: 80,
      fixed: 'right',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_, item) => (
        <>
          <RowOperation item={item} operate={operate} />
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="订单列表"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={(params) => queryList(params)}
        columns={columns}
        pagination={{
          showSizeChanger: true,
        }}
        scroll={{ x: 2800 }}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <p style={{ margin: 0 }}>营业备注：{record.salesRemark}</p>
              <p style={{ margin: 0 }}>生管备注：{record.planRemark}</p>
            </>
          ),
          rowExpandable: (record) => record.salesRemark || record.planRemark,
        }}
      />
      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            setCreateModalVisible(false);
            setCurrentObject({});
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setCreateModalVisible(false);
          setCurrentObject({});
        }}
        modalVisible={createModalVisible}
        initialValues={Object.keys(currentObject).length > 0 ? currentObject : null}
      />
      {currentObject && Object.keys(currentObject).length ? (
        <UpdateForm
          onFinish={async (value) => {
            const success = await handleUpdate({ ...currentObject, ...value });

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

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(TableList);
