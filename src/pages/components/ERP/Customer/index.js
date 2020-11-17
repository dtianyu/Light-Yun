import React from 'react';
import { Modal, Button, Input, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { queryList } from '@/pages/components/ERP/Customer/service'

class Customer extends React.Component {

    columns = [
        {
            title: '客户编号',
            dataIndex: 'cusno',
        },
        {
            title: '客户简称',
            dataIndex: 'cusna',
        },
        {
            title: '负责业务',
            dataIndex: ['cdrcusman', 'man'],
            hideInSearch: true,
        },
        {
            title: '业务姓名',
            dataIndex: ['cdrcusman', 'secuser', 'username'],
            hideInSearch: true,
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
        const { title, width, visible, selectType, company, onCancel, onHandle } = this.props;
        return (
            <Modal
                destroyOnClose
                title={title ? title : "客户列表"}
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
                    request={params => queryList({ ...params, facno: company ? company : 'C' })}
                    rowKey="cusno"
                    rowSelection={{
                        type: selectType,
                        onChange: (selectedRowKeys, selectedRows) => {
                            this.setState({ selectedData: selectedRows })
                        },
                    }}
                    size="small"
                />
            </Modal>
        );
    }
}

export default Customer;
