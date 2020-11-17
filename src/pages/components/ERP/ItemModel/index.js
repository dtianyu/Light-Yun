import React from 'react';
import { Modal, Button, Input, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { queryList } from '@/pages/components/ERP/ItemModel/service';

class ItemModel extends React.Component {
  columns = [
    {
      title: '机型',
      dataIndex: 'cmcmodel',
    },
    {
      title: '名称',
      dataIndex: 'cmcitdsc',
      hideInSearch: true,
    },
    {
      title: '品号',
      dataIndex: ['cdrdmmodelPK', 'itnbr'],
      hideInSearch: true,
    },
    {
      title: '分类',
      dataIndex: 'kind',
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
    const { title, width, visible, selectType, company, filter, onCancel, onHandle } = this.props;

    return (
      <Modal
        destroyOnClose
        title={title ? title : '产品列表'}
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
              kind: filter.kind ? filter.kind : '',
              ...params,
            })
          }
          rowKey="cmcmodel"
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

export default ItemModel;
