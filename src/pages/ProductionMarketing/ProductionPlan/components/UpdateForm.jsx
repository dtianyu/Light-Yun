import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Radio, Select, DatePicker, message } from 'antd';
import { formatDateTime, local2UTC } from '@/pages/comm';
import ItemModel from '@/pages/components/ERP/ItemModel';
import ProductSeriesSelect from '@/pages/components/ERP/ProductSeriesSelect';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const UpdateForm = (props) => {
  const [currentCompany, setCurrentCompany] = useState('C');
  const [currentSeries, setCurrentSeries] = useState('');
  const [itemModelModalVisible, setItemModelModalVisible] = useState(false);

  const [form] = Form.useForm();

  const { values, modalVisible, modalWidth, onFinish: handleUpdate, onCancel } = props;

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

  const handleItemModelSelect = () => {
    let company = form.getFieldValue('company');
    let series = form.getFieldValue('productSeries');
    if (company === undefined || company === null || company === '') {
      message.warning('请先选择公司');
      return;
    }
    if (series === undefined || series === null || series === '') {
      message.warning('请先选择产品类别');
      return;
    }
    setCurrentCompany(company);
    setCurrentSeries(series);
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
              formdate: local2UTC(fieldsValue.formdate),
              mon: formatDateTime(local2UTC(fieldsValue.formdate), { format: 'YYYYMM' }),
              status: 'N',
            };
            handleUpdate(values);
          });
        }}
      >
        <Form form={form} {...formItemLayout} initialValues={values}>
          <FormItem
            label="公司"
            name="company"
            rules={[
              {
                required: true,
                message: '请输入公司代号',
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
          <FormItem
            label="产品类别"
            name="productSeries"
            rules={[
              {
                required: true,
                message: '请输入产品类别',
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
              placeholder="产品类别"
            />
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
          <FormItem label="制令编号" name="formid">
            <Input placeholder="可以空白" />
          </FormItem>
          <FormItem
            label="生产日期"
            name="formdate"
            rules={[
              {
                required: true,
                message: '请输入生产日期',
              },
            ]}
          >
            <DatePicker />
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
          <FormItem label="备注" name="remark" rules={[]}>
            <TextArea rows={2} />
          </FormItem>
        </Form>
      </Modal>
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
    </>
  );
};
export default UpdateForm;
