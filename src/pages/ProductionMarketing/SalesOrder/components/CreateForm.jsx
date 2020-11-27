import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Radio, Select, DatePicker, message } from 'antd';
import SystemUser from '@/pages/components/EAP/SystemUser';
import Customer from '@/pages/components/ERP/Customer';
import * as moment from 'moment';
import { formatDateTime, local2UTC } from '@/pages/comm';
import ItemModel from '@/pages/components/ERP/ItemModel';
import ProductSeriesSelect from '@/pages/ProductionMarketing/components/ProductSeriesSelect';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const CreateForm = (props) => {
  const [currentCompany, setCurrentCompany] = useState('C');
  const [currentCategory, setCurrentCategory] = useState('P');
  const [currentSeries, setCurrentSeries] = useState('');
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [itemModelModalVisible, setItemModelModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const [form] = Form.useForm();

  const { initialValues, modalVisible, modalWidth, onFinish: handleAdd, onCancel } = props;

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

  useEffect(() => {}, []);

  const handleCustomerSelect = () => {
    let company = form.getFieldValue('company');
    if (company === undefined || company === null || company === '') {
      message.warning('请先选择订单公司');
      return;
    }
    setCustomerModalVisible(true);
  };

  const handleItemModelSelect = () => {
    let company = form.getFieldValue('company');
    let series = form.getFieldValue('productSeries');
    if (company === undefined || company === null || company === '') {
      message.warning('请先选择订单公司');
      return;
    }
    if (series === undefined || series === null || series === '') {
      message.warning('请先选择产品系列');
      return;
    }
    setItemModelModalVisible(true);
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
              formid: '',
              formdate: fieldsValue.formdate ? local2UTC(fieldsValue.formdate) : null,
              formType: currentCategory,
              demandDate: fieldsValue.demandDate ? local2UTC(fieldsValue.demandDate) : null,
              mon: formatDateTime(local2UTC(fieldsValue.demandDate), { format: 'YYYYMM' }),
              deliveryDate: fieldsValue.deliveryDate ? local2UTC(fieldsValue.deliveryDate) : null,
              invqty: 0,
              manqty: 0,
              wipqty: 0,
              shipqty: 0,
              status: 'N',
            };
            handleAdd(values);
          });
        }}
      >
        <Form
          form={form}
          {...formItemLayout}
          initialValues={initialValues ? initialValues : { company: 'C' }}
        >
          <FormItem
            label="接单公司"
            name="company"
            rules={[
              {
                required: true,
                message: '请输入订单公司代号',
                max: 2,
              },
            ]}
          >
            <Select
              onChange={(value) => {
                if (form) {
                  form.setFieldsValue({ company: value });
                }
                setCurrentCompany(value);
              }}
            >
              <Option value="C">上海汉钟</Option>
            </Select>
          </FormItem>
          <FormItem label="产品系列" style={{ marginBottom: 0 }} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="productSeries"
                rules={[
                  {
                    required: true,
                    message: '请输入产品系列',
                  },
                ]}
              >
                <ProductSeriesSelect
                  onChange={(value) => {
                    form.setFieldsValue({
                      productSeries: value,
                    });
                    setCurrentSeries(value);
                  }}
                  placeholder="产品系列"
                />
              </FormItem>
              <FormItem
                name="formKind"
                rules={[
                  {
                    required: true,
                    message: '请输入订单分类',
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    form.setFieldsValue({
                      formKind: value,
                    });
                  }}
                  placeholder="订单分类"
                >
                  <Option value="G">一般订单</Option>
                  <Option value="P">备机订单</Option>
                  <Option value="S">服务订单</Option>
                </Select>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="客户代号" style={{ marginBottom: 0 }} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="customerno"
                rules={[
                  {
                    required: true,
                    message: '请输入客户代号',
                  },
                ]}
              >
                <Input placeholder="客户代号" />
              </FormItem>
              <FormItem
                name="customer"
                rules={[
                  {
                    required: true,
                    message: '请输入客户简称',
                  },
                ]}
              >
                <Input placeholder="客户简称" />
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={handleCustomerSelect}>
                  查询
                </Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="终端客户" name="customerAlias">
            <Input />
          </FormItem>
          <FormItem label="负责业务" style={{ marginBottom: 0 }} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="salesman"
                rules={[
                  {
                    required: true,
                    message: '请输入负责业务',
                  },
                ]}
              >
                <Input placeholder="负责业务ID" />
              </FormItem>
              <FormItem name="salesmanName">
                <Input placeholder="业务姓名" />
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  onClick={() => {
                    setUserModalVisible(true);
                  }}
                >
                  查询
                </Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="产品型号" style={{ marginBottom: 0 }} required={true}>
            <Input.Group compact={true}>
              <FormItem
                name="itemModel"
                rules={[
                  {
                    required: true,
                    message: '请输入产品型号',
                  },
                ]}
              >
                <Input />
              </FormItem>
              <FormItem name="itemDesc">
                <Input />
              </FormItem>
              <FormItem>
                <Button type="primary" onClick={handleItemModelSelect}>
                  查询
                </Button>
              </FormItem>
            </Input.Group>
          </FormItem>
          <FormItem label="品号" name="itemno">
            <Input />
          </FormItem>
          <FormItem
            label="数量"
            name="qty"
            rules={[
              {
                required: true,
                message: '请输入数量',
              },
            ]}
          >
            <InputNumber placeholder="数字" />
          </FormItem>
          <FormItem
            label="客户交期"
            name="demandDate"
            rules={[
              {
                required: true,
                message: '请输入客户交期',
              },
            ]}
          >
            <DatePicker />
          </FormItem>
          <FormItem label="营业备注" name="salesRemark" rules={[]}>
            <TextArea rows={2} />
          </FormItem>
        </Form>
      </Modal>
      <Customer
        title="客户查询"
        width={860}
        visible={customerModalVisible}
        selectType="radio"
        company={currentCompany}
        onCancel={() => setCustomerModalVisible(false)}
        onHandle={(data) => {
          if (data.length === 1) {
            form.setFieldsValue({
              customerno: data[0].cusno,
              customer: data[0].cusna,
            });
            if (data[0].cdrcusman) {
              form.setFieldsValue({
                salesman: data[0].cdrcusman.man,
                salesmanName: data[0].cdrcusman.secuser.username,
              });
            }
          }
          setCustomerModalVisible(false);
        }}
      />
      <ItemModel
        title="产品查询"
        width={860}
        visible={itemModelModalVisible}
        selectType="radio"
        company={currentCompany}
        filter={{ kind: currentSeries }}
        onCancel={() => setItemModelModalVisible(false)}
        onHandle={(data) => {
          if (data.length === 1) {
            form.setFieldsValue({
              itemModel: data[0].cmcmodel,
              itemDesc: data[0].cmcitdsc,
            });
            if (data[0].cdrdmmodelPK) {
              form.setFieldsValue({
                itemno: data[0].cdrdmmodelPK.itnbr,
              });
            }
          }
          setItemModelModalVisible(false);
        }}
      />
      <SystemUser
        title="员工查询"
        width={860}
        visible={userModalVisible}
        selectType="radio"
        onCancel={() => setUserModalVisible(false)}
        onHandle={async (data) => {
          if (data.length === 1) {
            form.setFieldsValue({
              salesman: data[0].userid,
              salesmanName: data[0].username,
            });
          }
          setUserModalVisible(false);
        }}
      />
    </>
  );
};

export default CreateForm;
