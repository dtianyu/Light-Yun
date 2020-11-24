import React from 'react';
import { Modal, Button, Input, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { queryList } from '@/pages/components/ERP/Item/service';

class Item extends React.Component {
  columns = [
    {
      title: '品号大类',
      dataIndex: 'itcls',
    },
    {
      title: '大类名称',
      dataIndex: ['invcls', 'clsdsc'],
      hideInSearch: true,
    },
    {
      title: '品号',
      dataIndex: 'itnbr',
    },
    {
      title: '品名',
      dataIndex: 'itdsc',
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedData: [],
    };
  }

  render() {
    const { company, filter, title, width, visible, selectType, onCancel, onHandle } = this.props;

    return (
      <Modal
        destroyOnClose
        title={title ? title : '品号列表'}
        width={width ? width : 860}
        visible={visible}
        onCancel={onCancel}
        onOk={() => {
          if (this.state.selectedData && this.state.selectedData.length > 0) {
            onHandle(this.state.selectedData);
          } else {
            message.warning('请先选择');
          }
        }}
      >
        <ProTable
          columns={this.columns}
          onRow={(record) => {
            return {
              onDoubleClick: (event) => {
                if (record) {
                  let arr = [];
                  arr.push(record);
                  onHandle(arr);
                } else {
                  message.warning('请先选择');
                }
              },
            };
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          request={(params) =>
            queryList({
              facno: company ? company : 'C',
              ...params,
            })
          }
          rowKey="itnbr"
          rowSelection={{
            type: selectType,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({ selectedData: selectedRows });
            },
          }}
          size="small"
        />
      </Modal>
    );
  }
}

export default Item;
