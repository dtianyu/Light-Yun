import React from 'react';
import {Modal, Button, Input, message} from 'antd';
import ProTable from '@ant-design/pro-table';
import {queryList} from '@/pages/components/EAP/SystemUser/service'

class SystemUser extends React.Component {

  columns = [
    {
      title: '工号',
      dataIndex: 'userid',
    },
    {
      title: '姓名',
      dataIndex: 'username',
    },
    {
      title: '部门ID',
      dataIndex: 'deptno',
    },
    {
      title: '部门',
      dataIndex: ['dept', 'dept'],
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
    const {title, width, visible, selectType, onCancel, onHandle} = this.props;
    return (
      <Modal
        title={title ? title : "用户列表"}
        width={width ? width : 680}
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
          onRow={record => {
            return {
              onDoubleClick: event => {
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
          request={params => queryList(params)}
          rowKey="id"
          rowSelection={{
            type: selectType,
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selectedData: selectedRows})
            },
          }}
          size="small"
        />
      </Modal>
    );
  }
}

export default SystemUser;
