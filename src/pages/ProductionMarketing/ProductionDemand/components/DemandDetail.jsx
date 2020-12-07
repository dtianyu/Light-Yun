import React, { useEffect, useRef, useState } from 'react';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';

const DemandDetail = (props) => {
  const [currentObject, setCurrentObject] = useState({});

  const { currentUser, data, extData, total, dispatch, loading } = props;
  const { company, mon, productSeries, itemModel, queryDay } = props.location.query;

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
      width: 180,
      fixed: 'left',
    });
    columns.push({
      title: '类别',
      dataIndex: 'kind',
      width: 100,
      fixed: 'left',
      valueEnum: {
        10: { text: '订单', status: 'Error' },
        20: { text: '库存', status: 'Success' },
        30: { text: '在制', status: 'Processing' },
        40: { text: '外采', status: 'Warning' },
        50: { text: '制令', status: 'Default' },
      },
      hideInSearch: true,
    });
    let days = moment(mon).endOf('month').date();
    for (let i = 1; i <= days; i++) {
      let d = moment(mon).set('date', i);
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
  };

  setColumn(); // 初始化栏位

  useEffect(() => {
    // console.log(props.location.query);
    if (dispatch && company && itemModel && mon && queryDay) {
      dispatch({
        type: 'productionDemandModel/fetchList',
        payload: {
          ...props.location.query,
        },
      });
    } else {
      history.push('/404');
    }
  }, []);

  return (
    <PageHeaderWrapper title={'产品需求' + itemModel} onBack={() => window.history.back()}>
      <ProTable
        headerTitle="需求详情"
        rowKey="index"
        toolBarRender={(action, { selectedRows }) => []}
        columns={columns}
        dataSource={data}
        pagination={false}
        search={false}
        bordered
        scroll={{ x: 2500 }}
        style={{ maxHeight: 420 }}
        loading={loading}
      />
      <ProTable
        headerTitle="物料状态"
        rowKey="index"
        columns={columns}
        dataSource={extData.children}
        pagination={false}
        search={false}
        bordered
        scroll={{ x: 2500 }}
        style={{ marginTop: 16 }}
        loading={loading}
      />
    </PageHeaderWrapper>
  );
};

export default connect(({ user, productionDemandModel, loading }) => ({
  currentUser: user.currentUser,
  data: productionDemandModel.data,
  total: productionDemandModel.total,
  extData: productionDemandModel.extData,
  loading: loading.effects['productionDemandModel/fetchList'],
}))(DemandDetail);
