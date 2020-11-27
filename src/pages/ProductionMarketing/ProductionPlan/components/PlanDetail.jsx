import React, { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Button, Table, message, Dropdown, Menu } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { local2UTC, utc2Local } from '@/pages/comm';
import CreateForm from '@/pages/ProductionMarketing/ProductionPlan/components/CreateForm';
import UpdateForm from '@/pages/ProductionMarketing/ProductionPlan/components/UpdateForm';
import * as PropTypes from 'prop-types';

const RowOperation = ({ item, operate }) => (
  <Dropdown
    overlay={
      <Menu onClick={async ({ key }) => operate(key, item)}>
        <Menu.Item key="0">详情</Menu.Item>
        {item.status === 'N' ? <Menu.Item key="e">修改</Menu.Item> : null}
        {item.status === 'N' ? <Menu.Item key="d">删除</Menu.Item> : null}
        {item.status === 'N' ? <Menu.Item key="v">确认</Menu.Item> : null}
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

const PlanDetail = (props) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [currentObject, setCurrentObject] = useState({});

  const { currentUser, data, extData, total, dispatch, loading } = props;
  const { company, mon, productSeries, itemModel } = props.location.query;

  /**
   * 添加
   * @param fields
   */
  const handleAdd = async (fields) => {
    message.loading('正在添加');
    try {
      await dispatch({
        type: 'productionPlanModel/add',
        payload: {
          data: fields,
        },
      });
      await dispatch({
        type: 'productionPlanModel/fetchList',
        payload: {
          company: company,
          mon: mon,
          productSeries: productSeries,
          itemModel: itemModel,
          current: page,
          pageSize: pageSize,
        },
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
  const handleUpdate = async (fields) => {
    message.loading('正在更新');
    try {
      await dispatch({
        type: 'productionPlanModel/update',
        payload: {
          data: fields,
        },
      });
      await dispatch({
        type: 'productionPlanModel/fetchList',
        payload: {
          company: company,
          mon: mon,
          productSeries: productSeries,
          itemModel: itemModel,
          current: page,
          pageSize: pageSize,
        },
      });
      return true;
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
    if (!id) return false;
    message.loading('正在删除');
    try {
      await dispatch({
        type: 'productionPlanModel/remove',
        payload: {
          id: id,
        },
      });
      await dispatch({
        type: 'productionPlanModel/fetchList',
        payload: {
          company: company,
          mon: mon,
          productSeries: productSeries,
          itemModel: itemModel,
          current: page,
          pageSize: pageSize,
        },
      });
      return true;
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
        break;
      case 'e':
        // edit
        setUpdateModalVisible(true);
        setModalReadOnly(false);
        setCurrentObject({
          ...item,
          formdate: item.formdate ? utc2Local(item.formdate) : null,
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
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleUpdate({ ...value });

            if (success) {
              setCurrentObject({});
            }
          },
        });
        break;
      case 'r':
        // revoke
        value.status = 'N';

        Modal.confirm({
          title: '还原',
          content: `确定还原${formid}吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: async () => {
            const success = await handleUpdate({ ...value });

            if (success) {
              setCurrentObject({});
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
            setCurrentObject(value);
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
      title: '公司',
      key: 'company',
      dataIndex: 'company',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '年月',
      key: 'mon',
      dataIndex: 'mon',
      width: 120,
    },
    {
      title: '产品型号',
      key: 'itemModel',
      dataIndex: 'itemModel',
    },
    {
      title: '品名',
      key: 'itemDesc',
      dataIndex: 'itemDesc',
      hideInSearch: true,
    },
    {
      title: '制令编号',
      key: 'formid',
      dataIndex: 'formid',
      hideInSearch: true,
    },
    {
      title: '制令日期',
      key: 'formdate',
      dataIndex: 'formdate',
      valueType: 'dateRange',
      width: 120,
      render: (_, item) =>
        item.formdate ? (
          <span>{utc2Local(item.formdate, { localFormat: 'YYYY-MM-DD' })}</span>
        ) : null,
    },
    {
      title: '制令数量',
      dataIndex: 'qty',
      key: 'qty',
      align: 'right',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      valueEnum: {
        all: { text: '全部' },
        N: { text: '未确认', value: 'N' },
        V: { text: '已确认', value: 'V' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, item) => (
        <>
          <RowOperation item={item} operate={operate} />
        </>
      ),
    },
  ];

  useEffect(() => {
    // console.log(props.location.query);
    if (dispatch && company && mon && itemModel) {
      dispatch({
        type: 'productionPlanModel/fetchList',
        payload: {
          ...props.location.query,
          current: page,
          pageSize: pageSize,
        },
      });
    } else {
      history.push('/404');
    }
  }, []);

  const handlePaginationChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    if (dispatch && company && mon && itemModel) {
      dispatch({
        type: 'productionPlanModel/fetchList',
        payload: {
          ...props.location.query,
          current: page,
          pageSize: pageSize,
        },
      });
    } else {
      history.push('/404');
    }
  };

  return (
    <PageHeaderWrapper title={'产品型号' + itemModel} onBack={() => window.history.back()}>
      <ProTable
        headerTitle="计划列表"
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setCurrentObject({});
              setCreateModalVisible(true);
            }}
          >
            新建
          </Button>,
        ]}
        columns={columns}
        dataSource={data}
        pagination={{
          showSizeChanger: true,
          total: total,
          onChange: (page, pageSize) => handlePaginationChange(page, pageSize),
          onShowSizeChange: (current, size) => handlePaginationChange(current, size),
        }}
        loading={loading}
        summary={(pageData) => {
          // console.log(pageData);
          let sum = 0;
          pageData.forEach(({ qty }) => {
            sum += qty;
          });

          return (
            <Table.Summary.Row style={{ textAlign: 'right' }}>
              <Table.Summary.Cell>合计</Table.Summary.Cell>
              <Table.Summary.Cell />
              <Table.Summary.Cell />
              <Table.Summary.Cell />
              <Table.Summary.Cell />
              <Table.Summary.Cell>{sum}</Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            setCreateModalVisible(false);
          }
        }}
        onCancel={() => {
          setCreateModalVisible(false);
          setCurrentObject({});
        }}
        modalVisible={createModalVisible}
        initialValues={Object.keys(currentObject).length > 0 ? currentObject : null}
      />
      {Object.keys(currentObject).length > 0 ? (
        <UpdateForm
          onFinish={async (value) => {
            const success = await handleUpdate({ ...currentObject, ...value });

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
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ user, productionPlanModel, loading }) => ({
  currentUser: user.currentUser,
  data: productionPlanModel.data,
  total: productionPlanModel.total,
  extDate: productionPlanModel.extDate,
  loading:
    loading.effects['productionPlanModel/fetchList'] || loading.effects['productionPlanModel/add'],
}))(PlanDetail);
