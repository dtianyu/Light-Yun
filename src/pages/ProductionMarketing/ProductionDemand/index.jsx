import React, { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import { Button, Input, Table, message, Divider, Popconfirm } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import ExportJsonExcel from 'js-export-excel';
import CreateForm from '@/pages/ProductionMarketing/ProductionPlan/components/CreateForm';

const ProductionPlan = (props) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [sheetData, setSheetData] = useState([]);

  const [queryMonth, setQueryMonth] = useState(moment().format('YYYYMM'));
  const actionRef = useRef(undefined);

  const { currentUser, data, extData, dispatch, loading } = props;

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
        type: 'productionPlanModel/fetchDemand',
        payload: {
          mon: queryMonth,
          current: 1,
          pageSize: 2000,
        },
      });
      return true;
    } catch (error) {
      message.error('添加失败请重试！');
      return false;
    }
  };

  let columns = [];
  let summaryData = [];

  const setColumn = () => {
    columns = [];
    summaryData = [];
    columns.push({
      title: '年月',
      dataIndex: 'mon',
      hideInTable: true,
    });
    columns.push({
      title: '产品分类',
      dataIndex: 'productSeries',
      hideInTable: true,
    });
    columns.push({
      title: '产品型号',
      dataIndex: 'itemModel',
      width: 160,
      fixed: 'left',
    });
    columns.push({
      title: '类别',
      dataIndex: 'kind',
      width: 100,
      fixed: 'left',
      valueEnum: {
        10: { text: '订单', status: 'Warning' },
        20: { text: '库存', status: 'Success' },
        30: { text: '在制', status: 'Processing' },
        40: { text: '外采', status: 'Processing' },
        50: { text: '制令', status: 'Default' },
      },
      hideInSearch: true,
    });
    // console.log(moment(queryMonth));
    let days = moment(queryMonth).endOf('month').date();
    for (let i = 1; i <= days; i++) {
      let d = moment(queryMonth).set('date', i);
      let col = 'd' + moment(d).format('YYYYMMDD');
      columns.push({
        title: moment(d).format('MM/DD'),
        dataIndex: col,
        hideInSearch: true,
        align: 'right',
      });
      summaryData.push([col, 0]);
    }
    columns.push({
      title: '合计',
      dataIndex: 'total',
      width: 80,
      fixed: 'right',
      align: 'right',
      hideInSearch: true,
    });
    columns.push({
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, item) => {
        return (
          <>
            <a
              onClick={(e) => {
                history.push({
                  pathname: '/production-marketing/plan-detail',
                  query: {
                    company: item.company ? item.company : 'C',
                    mon: item.mon,
                    productSeries: item.productSeries,
                    itemModel: item.itemModel,
                  },
                });
              }}
            >
              详情
            </a>
          </>
        );
      },
      width: 100,
      fixed: 'right',
    });
    // console.log(columns);
  };

  setColumn(); // 初始化栏位

  let option = {};

  option.fileName = 'excel';

  option.datas = [
    {
      sheetData: sheetData,
      sheetName: 'sheet',
    },
  ];

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'productionPlanModel/fetchDemand',
        payload: {
          mon: queryMonth,
          current: 1,
          pageSize: 2000,
        },
      });
    }
  }, []);

  const handleFormSearch = (params) => {
    // console.log(params);
    if (params.mon) {
      setQueryMonth(params.mon);
      if (dispatch) {
        dispatch({
          type: 'productionPlanModel/fetchDemand',
          payload: {
            ...params,
            current: 1,
            pageSize: 2000,
          },
        });
      }
    }
  };

  const handleTableExport = () => {
    const toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  };

  const TableSummaryCell = (index, value) => {
    return <Table.Summary.Cell index={index}>{value}</Table.Summary.Cell>;
  };

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="需求分析"
        rowKey="index"
        toolBarRender={(action, { selectedRows }) => [
          <Button
            icon={<PlusOutlined />}
            type="primary"
            key="create"
            onClick={() => setCreateModalVisible(true)}
          >
            新建
          </Button>,
          <Button icon={<ExportOutlined />} type="default" key="export" onClick={handleTableExport}>
            导出
          </Button>,
        ]}
        actionRef={actionRef}
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        scroll={{ x: 2500 }}
        onSubmit={handleFormSearch}
      />
      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            setCreateModalVisible(false);
          }
        }}
        onCancel={() => setCreateModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ user, productionPlanModel, loading }) => ({
  currentUser: user.currentUser,
  data: productionPlanModel.demandData,
  extDate: productionPlanModel.extDate,
  loading:
    loading.effects['productionPlanModel/fetchDemand'] ||
    loading.effects['productionPlanModel/add'],
}))(ProductionPlan);
