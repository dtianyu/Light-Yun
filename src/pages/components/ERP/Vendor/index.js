import React from 'react';
import { Modal, Button, Input, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { queryList } from '@/pages/components/ERP/Vendor/service'

class Vendor extends React.Component {

    columns = [
        {
            title: '厂商编号',
            dataIndex: 'vdrno',
        },
        {
            title: '厂商简称',
            dataIndex: 'vdrna',
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
                title={title ? title : "厂商列表"}
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
                    request={params => queryList({ ...params, facno: company ? company : 'C' })}
                    rowKey="vdrno"
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

export default Vendor;
