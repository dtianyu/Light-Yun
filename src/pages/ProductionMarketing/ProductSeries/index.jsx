import React, { useState, useRef } from 'react';
import { Button, Form, Input, message, Modal, Select, Switch } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { RowOperation } from '@/components/RowOperation';
import { add, update, remove, queryList } from '@/pages/ProductionMarketing/services/ProductSeries';
import ProductCategorySelect from '@/pages/ProductionMarketing/components/ProductCategorySelect';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const ProductSeries = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const [currentObject, setCurrentObject] = useState({});
  const actionRef = useRef();

  /**
   * 添加
   * @param fields
   */
  const handleAdd = async (fields) => {
    message.loading('正在添加');
    try {
      const res = await add(fields);
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
    const { series } = item;

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
          content: `确定删除${series}吗？`,
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
          },
        });
        break;
      case 'v':
        // verify
        value.status = 'V';

        Modal.confirm({
          title: '确认',
          content: `确定确认${series}吗？`,
          okText: '确认',
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

        Modal.confirm({
          title: '还原',
          content: `确定还原${series}吗？`,
          okText: '确认',
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
      title: '产品分类',
      dataIndex: 'category',
    },
    {
      title: '产品系列',
      dataIndex: 'series',
    },
    {
      title: '系列名称',
      dataIndex: 'description',
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

  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="产品系列"
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
      />
      <CreateForm
        onFinish={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            setCreateModalVisible(false);
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

const CreateForm = (props) => {
  const [form] = Form.useForm();

  const { modalVisible, modalWidth, onFinish: handleAdd, onCancel } = props;

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 16,
      },
    },
  };

  return (
    <>
      <Modal
        destroyOnClose
        title="Create"
        visible={modalVisible}
        width={modalWidth ? modalWidth : 800}
        onCancel={onCancel}
        onOk={() => {
          form.validateFields().then((fieldsValue) => {
            form.resetFields();
            const values = {
              ...fieldsValue,
              status: 'N',
            };
            handleAdd(values);
          });
        }}
      >
        <Form form={form} {...formItemLayout}>
          <FormItem
            label="产品分类"
            name="category"
            rules={[
              {
                required: true,
                message: '请输入产品分类',
              },
            ]}
          >
            <ProductCategorySelect
              onChange={(value) => {
                form.setFieldsValue({
                  category: value,
                });
              }}
              placeholder="产品分类"
            />
          </FormItem>
          <FormItem
            label="产品系列"
            name="series"
            rules={[
              {
                required: true,
                message: '请输入产品系列',
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="系列名称"
            name="description"
            rules={[
              {
                required: true,
                message: '请输入系列名称',
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem label="备注" name="remark" rules={[]}>
            <TextArea rows={2} />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

const UpdateForm = (props) => {
  const [form] = Form.useForm();

  const { values, readOnly, modalVisible, onFinish: handleUpdate, onCancel } = props;

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 16,
      },
    },
  };

  return (
    <Modal
      destroyOnClose
      title={readOnly === true ? 'View' : 'Modify'}
      visible={modalVisible}
      onOk={() => {
        form.validateFields().then((fieldsValue) => {
          handleUpdate(fieldsValue);
        });
      }}
      onCancel={() => onCancel()}
      okButtonProps={readOnly === true ? { disabled: true } : {}}
    >
      <Form form={form} {...formItemLayout} initialValues={values}>
        <FormItem
          label="产品分类"
          name="category"
          rules={[
            {
              required: true,
              message: '请输入产品分类',
            },
          ]}
        >
          <ProductCategorySelect
            onChange={(value) => {
              form.setFieldsValue({
                category: value,
              });
            }}
            placeholder="产品分类"
          />
        </FormItem>
        <FormItem
          label="产品系列"
          name="series"
          rules={[
            {
              required: true,
              message: '请输入产品系列',
            },
          ]}
        >
          <Input disabled={readOnly} />
        </FormItem>
        <FormItem
          label="系列名称"
          name="description"
          rules={[
            {
              required: true,
              message: '请输入系列名称',
            },
          ]}
        >
          <Input disabled={readOnly} />
        </FormItem>
        <FormItem label="备注" name="remark" rules={[]}>
          <TextArea rows={2} disabled={readOnly} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default ProductSeries;
