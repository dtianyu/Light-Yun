import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, message, Modal} from 'antd';
import React, {useState, useRef} from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import {queryList, update, add, remove} from './service';
import {RowOperation} from "@/components/RowOperation";
import CreateForm from './components/CreateForm';
import UpdateForm from "./components/UpdateForm";

/**
 * 添加
 * @param fields
 */
const handleAdd = async fields => {
  message.loading('正在添加');
  try {
    const res = await add({
      company: fields.company,
      name: fields.name,
      fullname: fields.fullname,
      status: 'N',
      hasEAP: false,
      hasEAM: false,
      hasKPI: false,
      hasBSC: false,
    });
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


const TableList = () => {

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const [currentObject, setCurrentObject] = useState({});
  const actionRef = useRef();

  const operate = async (key, item) => {
    const value = {...item};
    const {name} = item;

    switch (key) {
      case '0':
        // read
        setUpdateModalVisible(true);
        setModalReadOnly(true);
        setCurrentObject(item);
        break;
      case 'e':
        // edit
        setUpdateModalVisible(true);
        setModalReadOnly(false);
        setCurrentObject(item);
        break;
      case 'd':
        // delete
        Modal.confirm({
          title: '删除',
          content: `确定删除${name}吗？`,
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
      case 'v':
        // verify
        value.status = 'V';

        Modal.confirm({
          title: '确认',
          content: `确定确认${name}吗？`,
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
        value.status = 'N';

        Modal.confirm({
          title: '还原',
          content: `确定还原${name}吗？`,
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
      title: '公司代号',
      dataIndex: 'company',
    },
    {
      title: '公司简称',
      dataIndex: 'name',
    },
    {
      title: '公司全称',
      dataIndex: 'fullname',
      hideInSearch: true,
    },
    {
      title: '联系地址',
      dataIndex: 'address',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '电话',
      dataIndex: 'tel',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '传真',
      dataIndex: 'fax',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'hasEAP',
      dataIndex: 'hasEAP',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'hasEAM',
      dataIndex: 'hasEAM',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'hasKPI',
      dataIndex: 'hasKPI',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'hasBSC',
      dataIndex: 'hasBSC',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        all: {text: '全部',},
        N: {text: '未确认', value: 'N',},
        V: {text: '已确认', value: 'V',},
        X: {text: '已注销', value: 'X',},
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
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
      />
      <CreateForm
        onSubmit={async value => {
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
          onSubmit={async value => {
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

export default TableList;
