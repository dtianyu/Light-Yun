import React, { Fragment, useEffect, useState } from 'react';
import { connect, history } from 'umi';
import {
  Button,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { add, update, remove } from '@/pages/ProductionMarketing/services/BOM';
import Item from '@/pages/components/ERP/Item';

const FormItem = Form.Item;
const { TextArea } = Input;

const BOM = (props) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentPart, setCurrentPart] = useState({});
  const [readOnly, setReadOnly] = useState(false);

  const { currentUser, currentObject, extData, dispatch, loading, submitting } = props;
  const { uid, itemModel } = props.location.query;

  /**
   * 添加
   * @param fields
   */
  const handleAddPart = async (fields) => {
    message.loading('正在添加');
    try {
      const res = await add({
        ...fields,
      });
      const { code, msg } = res;
      if (code < '300') {
        if (dispatch && uid) {
          dispatch({
            type: 'productModel/fetchCurrent',
            payload: {
              uid: uid,
            },
          });
        } else {
          history.push('/404');
        }
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
  const handleUpdatePart = async (fields) => {
    message.loading('正在更新');
    try {
      const res = await update({
        ...fields,
      });
      const { code, msg } = res;
      if (code < '300') {
        if (dispatch && uid) {
          dispatch({
            type: 'productModel/fetchCurrent',
            payload: {
              uid: uid,
            },
          });
        } else {
          history.push('/404');
        }
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
  const handleRemovePart = async (id) => {
    if (!id) return true;
    message.loading('正在删除');
    try {
      const res = await remove(id);
      const { code, msg } = res;
      if (code < '300') {
        if (dispatch && uid) {
          dispatch({
            type: 'productModel/fetchCurrent',
            payload: {
              uid: uid,
            },
          });
        } else {
          history.push('/404');
        }
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

  const columns = [
    {
      title: '序号',
      dataIndex: 'seq',
      key: 'seq',
      width: 90,
      hideInSearch: true,
    },
    {
      title: '品号',
      key: 'itemno',
      dataIndex: 'itemno',
      hideInSearch: true,
    },
    {
      title: '品名',
      key: 'itemDesc',
      dataIndex: 'itemDesc',
      hideInSearch: true,
    },
    {
      title: '简名',
      key: 'itemModel',
      dataIndex: 'itemModel',
      hideInSearch: true,
    },
    {
      title: '数量',
      key: 'qty',
      dataIndex: 'qty',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, item) => {
        return (
          <span>
            <a
              onClick={(e) => {
                if (readOnly) {
                  return;
                }
                setUpdateModalVisible(true);
                setCurrentPart(item);
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => handleRemovePart(item.id)}
              disabled={readOnly}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const product = (
    <Descriptions column={2}>
      <Descriptions.Item label="品号">{currentObject.itemno}</Descriptions.Item>
      <Descriptions.Item label="品名">{currentObject.itemDesc}</Descriptions.Item>
      <Descriptions.Item label="系列">{currentObject.series}</Descriptions.Item>
      <Descriptions.Item label="规格">{currentObject.itemSpec}</Descriptions.Item>
    </Descriptions>
  );

  useEffect(() => {
    // console.log(props.location);
    if (dispatch && uid) {
      dispatch({
        type: 'productModel/fetchCurrent',
        payload: {
          uid: uid,
        },
      });
    } else {
      history.push('/404');
    }
  }, []);

  useEffect(() => {
    if (currentObject && Object.keys(currentObject).length !== 0) {
      if (currentObject.status === 'V') {
        setReadOnly(readOnly || true);
      } else {
        setReadOnly(false);
      }
    }
  }, [currentObject]);

  return (
    <>
      <PageHeaderWrapper
        title={'产品简名' + currentObject.itemModel}
        onBack={() => window.history.back()}
        content={product}
      >
        <ProTable
          headerTitle="产品结构"
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                setCreateModalVisible(true);
              }}
              disabled={readOnly}
            >
              新建
            </Button>,
          ]}
          columns={columns}
          dataSource={currentObject.BOM ? currentObject.BOM : []}
          pagination={false}
          search={false}
          loading={loading}
        />
        <PartCreateForm
          onFinish={async (value) => {
            let seq;
            if (!value.seq || value.seq === 0) {
              seq = currentObject.BOM ? currentObject.BOM.length + 1 : 1;
            } else {
              seq = value.seq;
            }
            let data = {
              ...value,
              pid: currentObject.id,
              seq: seq,
              category: currentObject.category,
              series: currentObject.series,
            };

            const success = await handleAddPart(data);

            if (success) {
              setCreateModalVisible(false);
            }
          }}
          onCancel={() => {
            setCreateModalVisible(false);
            setCurrentPart({});
          }}
          modalVisible={createModalVisible}
        />
        {currentPart && Object.keys(currentPart).length ? (
          <PartUpdateForm
            onFinish={async (value) => {
              const success = await handleUpdatePart({ ...currentPart, ...value });

              if (success) {
                setUpdateModalVisible(false);
                setCurrentPart({});
              }
            }}
            onCancel={() => {
              setUpdateModalVisible(false);
              setCurrentPart({});
            }}
            modalVisible={updateModalVisible}
            values={currentPart}
          />
        ) : null}
      </PageHeaderWrapper>
    </>
  );
};

const PartCreateForm = (props) => {
  const [currentCompany, setCurrentCompany] = useState('C');
  const [itemModalVisible, setItemModalVisible] = useState(false);

  const [form] = Form.useForm();

  const { company, initialValues, modalVisible, modalWidth, onFinish: handleAdd, onCancel } = props;

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
            handleAdd(fieldsValue);
          });
        }}
      >
        <Form
          form={form}
          {...formItemLayout}
          initialValues={initialValues ? initialValues : { seq: 0, qty: 1 }}
        >
          <FormItem label="品号" style={{ marginBottom: 0 }} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="itemno"
                rules={[
                  {
                    required: true,
                    message: '请输入品号',
                  },
                ]}
              >
                <Input />
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={() => setItemModalVisible(true)}>
                  查询
                </Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem
            label="品名"
            name="itemDesc"
            rules={[
              {
                required: true,
                message: '请输入品名',
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem label="规格" name="itemSpec">
            <Input />
          </FormItem>
          <FormItem
            label="简名"
            name="itemModel"
            rules={[
              {
                required: true,
                message: '请输入简名',
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="标准用量"
            name="qty"
            rules={[
              {
                required: true,
                message: '请输入标准用量',
              },
            ]}
          >
            <InputNumber placeholder="数字" />
          </FormItem>
          <FormItem label="备注" name="remark" rules={[]}>
            <TextArea rows={2} />
          </FormItem>
        </Form>
      </Modal>
      <Item
        title="品号查询"
        width={860}
        visible={itemModalVisible}
        selectType="radio"
        company={company ? company : currentCompany}
        onCancel={() => setItemModalVisible(false)}
        onHandle={(data) => {
          if (data.length === 1) {
            form.setFieldsValue({
              itemno: data[0].itnbr,
              itemDesc: data[0].itdsc,
              itemSpec: data[0].spdsc,
            });
          }
          setItemModalVisible(false);
        }}
      />
    </>
  );
};

const PartUpdateForm = (props) => {
  const [currentCompany, setCurrentCompany] = useState('C');
  const [itemModalVisible, setItemModalVisible] = useState(false);

  const [form] = Form.useForm();

  const { company, values, modalVisible, modalWidth, onFinish: handleUpdate, onCancel } = props;

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
        title="Update"
        visible={modalVisible}
        width={modalWidth ? modalWidth : 800}
        onCancel={onCancel}
        onOk={() => {
          form.validateFields().then((fieldsValue) => {
            handleUpdate(fieldsValue);
          });
        }}
      >
        <Form form={form} {...formItemLayout} initialValues={values}>
          <FormItem label="品号" style={{ marginBottom: 0 }} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="itemno"
                rules={[
                  {
                    required: true,
                    message: '请输入品号',
                  },
                ]}
              >
                <Input />
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={() => setItemModalVisible(true)}>
                  查询
                </Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem
            label="品名"
            name="itemDesc"
            rules={[
              {
                required: true,
                message: '请输入品名',
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem label="规格" name="itemSpec">
            <Input />
          </FormItem>
          <FormItem
            label="简名"
            name="itemModel"
            rules={[
              {
                required: true,
                message: '请输入简名',
              },
            ]}
          >
            <Input />
          </FormItem>
          <FormItem
            label="标准用量"
            name="qty"
            rules={[
              {
                required: true,
                message: '请输入标准用量',
              },
            ]}
          >
            <InputNumber placeholder="数字" />
          </FormItem>
          <FormItem label="备注" name="remark" rules={[]}>
            <TextArea rows={2} />
          </FormItem>
        </Form>
      </Modal>
      <Item
        title="品号查询"
        width={860}
        visible={itemModalVisible}
        selectType="radio"
        company={company ? company : currentCompany}
        onCancel={() => setItemModalVisible(false)}
        onHandle={(data) => {
          if (data.length === 1) {
            form.setFieldsValue({
              itemno: data[0].itnbr,
              itemDesc: data[0].itdsc,
              itemSpec: data[0].spdsc,
            });
          }
          setItemModalVisible(false);
        }}
      />
    </>
  );
};

export default connect(({ user, productModel, loading }) => ({
  currentUser: user.currentUser,
  currentObject: productModel.currentObject,
  extData: productModel.extData,
  loading: loading.effects['productModel/fetchCurrent'],
  submitting: loading.effects['productModel/update'],
}))(BOM);
