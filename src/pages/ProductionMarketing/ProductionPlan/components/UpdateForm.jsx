import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Radio, Select, DatePicker, message } from 'antd';
import { formatDateTime, local2UTC } from '@/pages/comm';
import ItemModel from '@/pages/components/ERP/ItemModel';
import ProductSeriesSelect from '@/pages/ProductionMarketing/components/ProductSeriesSelect';
import ProductCategorySelect from '@/pages/ProductionMarketing/components/ProductCategorySelect';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const UpdateForm = (props) => {
  const [currentCompany, setCurrentCompany] = useState('C');
  const [currentCategory, setCurrentCategory] = useState('');
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
      message.warning('请先选择产品系列');
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
        title="Modify"
        visible={modalVisible}
        width={modalWidth ? modalWidth : 800}
        onCancel={onCancel}
        onOk={() => {
          form.validateFields().then((fieldsValue) => {
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
            label="产品分类"
            name="formType"
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
                  formType: value,
                });
                setCurrentCategory(value);
              }}
              placeholder="产品分类"
            />
          </FormItem>
          <FormItem
            label="产品系列"
            name="productSeries"
            rules={[
              {
                required: true,
                message: '请输入产品系列',
              },
            ]}
          >
            <ProductSeriesSelect
              category={currentCategory}
              onChange={(value) => {
                form.setFieldsValue({
                  productSeries: value,
                });
                setCurrentSeries(value);
              }}
              placeholder="产品系列"
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
