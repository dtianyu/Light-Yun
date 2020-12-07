import React, { Fragment, useEffect, useState } from 'react';
import { connect, history } from 'umi';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Steps,
  Switch,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { local2UTC, utc2Local } from '@/pages/comm';
import Customer from '@/pages/components/ERP/Customer';
import ItemModel from '@/pages/components/ERP/ItemModel';
import SystemUser from '@/pages/components/EAP/SystemUser';
import ProductSeriesSelect from '@/pages/ProductionMarketing/components/ProductSeriesSelect';
import PlanTable from '@/pages/ProductionMarketing/SalesOrder/components/PlanTable';
import { add, update, remove } from '@/pages/ProductionMarketing/services/SalesOrderSchedule';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const OrderDetail = (props) => {
  const [currentCompany, setCurrentCompany] = useState('C');
  const [currentSeries, setCurrentSeries] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [itemModelModalVisible, setItemModelModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const [form] = Form.useForm();
  const { currentUser, currentObject, extData, dispatch, loading, submitting } = props;
  const { uid, formid } = props.location.query;

  /**
   * 添加
   * @param fields
   */
  const handleAddPlan = async (fields) => {
    message.loading('正在添加');
    try {
      const res = await add({
        ...fields,
      });
      const { code, msg } = res;
      if (code < '300') {
        if (dispatch && uid) {
          dispatch({
            type: 'salesOrderModel/fetchCurrent',
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
  const handleUpdatePlan = async (fields) => {
    message.loading('正在更新');
    try {
      const res = await update({
        ...fields,
      });
      const { code, msg } = res;
      if (code < '300') {
        if (dispatch && uid) {
          dispatch({
            type: 'salesOrderModel/fetchCurrent',
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
  const handleRemovePlan = async (id) => {
    if (!id) return true;
    message.loading('正在删除');
    try {
      const res = await remove(id);
      const { code, msg } = res;
      if (code < '300') {
        if (dispatch && uid) {
          dispatch({
            type: 'salesOrderModel/fetchCurrent',
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

  useEffect(() => {
    // console.log(props.location);
    if (dispatch && uid) {
      dispatch({
        type: 'salesOrderModel/fetchCurrent',
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
      }
      // console.log(currentObject);
      form.setFieldsValue({
        ...currentObject,
        formdate: currentObject.formdate ? utc2Local(currentObject.formdate) : null,
        demandDate: currentObject.demandDate ? utc2Local(currentObject.demandDate) : null,
        manufactureDate: currentObject.manufactureDate
          ? utc2Local(currentObject.manufactureDate)
          : null,
        prepareDate: currentObject.prepareDate ? utc2Local(currentObject.prepareDate) : null,
        deliveryDate: currentObject.deliveryDate ? utc2Local(currentObject.deliveryDate) : null,
      });
      setCurrentStep(currentObject.currentStep);
    }
  }, [currentObject]);

  const handleCustomerSelect = () => {
    let company = form.getFieldValue('company');
    if (company === undefined || company === null || company === '') {
      message.warning('请先选择订单公司');
      return;
    }
    setCurrentCompany(company);
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
      message.warning('请先选择产品类别');
      return;
    }
    setCurrentCompany(company);
    setCurrentSeries(series);
    setItemModelModalVisible(true);
  };

  const handleStepReject = () => {
    setCurrentStep(currentStep - 1);
    form?.submit();
  };

  const handleStepSubmit = () => {
    setCurrentStep(currentStep + 1);
    form?.submit();
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        hideRequiredMark
        onFinish={async (fieldsValue) => {
          const values = {
            ...currentObject,
            ...fieldsValue,
            formdate: fieldsValue.formdate ? local2UTC(fieldsValue.formdate) : null,
            demandDate: fieldsValue.demandDate ? local2UTC(fieldsValue.demandDate) : null,
            manufactureDate: fieldsValue.manufactureDate
              ? local2UTC(fieldsValue.manufactureDate)
              : null,
            prepareDate: fieldsValue.prepareDate ? local2UTC(fieldsValue.prepareDate) : null,
            deliveryDate: fieldsValue.deliveryDate ? local2UTC(fieldsValue.deliveryDate) : null,
            currentStep: currentStep,
            optuser: currentUser ? currentUser.userid + currentUser.name : '',
            status: extData.steps ? (currentStep === extData.steps.length ? 'V' : 'N') : 'N',
          };
          message.loading('正在更新');
          try {
            dispatch({
              type: 'salesOrderModel/update',
              payload: {
                data: values,
              },
            });
          } catch (error) {
            message.error('更新失败,请重试');
          }
        }}
      >
        <PageHeaderWrapper
          title={'订单编号' + formid}
          onBack={() => {
            window.history.back();
          }}
          extra={
            <Fragment>
              <Button
                type="primary"
                onClick={() => form?.submit()}
                loading={submitting}
                disabled={readOnly}
              >
                提交
              </Button>
            </Fragment>
          }
        >
          <Card
            title="流程进度"
            style={{
              marginBottom: 24,
            }}
          >
            {extData.steps && Object.keys(extData.steps).length ? (
              <Steps current={currentStep}>
                {extData.steps.map((step) => {
                  if (currentStep === 0 && currentStep + 1 === step.seq) {
                    return (
                      <Step
                        title={step.name}
                        subTitle={step.cfmuser}
                        description={
                          <>
                            <div>
                              <a onClick={handleStepSubmit}>完成</a>
                            </div>
                          </>
                        }
                      />
                    );
                  } else if (currentStep !== 0 && currentStep + 1 === step.seq) {
                    return (
                      <Step
                        title={step.name}
                        subTitle={step.cfmuser}
                        description={
                          <>
                            <div>
                              <a onClick={handleStepReject}>退回</a>
                            </div>
                            <div>
                              <a onClick={handleStepSubmit}>完成</a>
                            </div>
                          </>
                        }
                      />
                    );
                  } else {
                    return <Step title={step.name} subTitle={step.cfmuser} description={<></>} />;
                  }
                })}
              </Steps>
            ) : null}
          </Card>
          <Card title="订单内容" bordered={false}>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <FormItem
                  label="接单公司"
                  name="company"
                  rules={[
                    {
                      required: true,
                      message: '请输入接单公司代号',
                      max: 2,
                    },
                  ]}
                  initialValue={currentCompany}
                >
                  <Select
                    onChange={(value) => {
                      form.setFieldsValue({
                        company: value,
                      });
                    }}
                  >
                    <Option value="C">上海汉钟</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem
                  label="订单编号"
                  name="formid"
                  rules={[
                    {
                      required: true,
                      message: '请输入订单编号',
                    },
                  ]}
                >
                  <Input placeholder="订单编号" />
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="接单日期" name="formdate">
                  <DatePicker />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
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
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="预计出货" name="deliveryDate">
                  <DatePicker />
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="订单分类" style={{ marginBottom: 0 }} required={true}>
                  <Input.Group compact={true}>
                    <FormItem
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
                        }}
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
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
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
                      <Input placeholder="客户代号" style={{ width: 100 }} />
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
                      <Input placeholder="客户简称" style={{ width: 120 }} />
                    </FormItem>
                    <FormItem>
                      <Button type="primary" onClick={handleCustomerSelect}>
                        查询
                      </Button>
                    </FormItem>
                  </Input.Group>
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
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
                      <Input placeholder="负责业务ID" style={{ width: 100 }} />
                    </FormItem>
                    <FormItem name="salesmanName">
                      <Input placeholder="业务姓名" style={{ width: 120 }} />
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
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="终端客户" name="customerAlias">
                  <Input />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
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
                      required={true}
                    >
                      <Input />
                    </FormItem>
                    <FormItem>
                      <Button type="primary" onClick={handleItemModelSelect}>
                        查询
                      </Button>
                    </FormItem>
                  </Input.Group>
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="产品名称" name="itemDesc">
                  <Input />
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="品号" name="itemno">
                  <Input placeholder="品号" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="订单数量和已出数量" style={{ marginBottom: 0 }} required={true}>
                  <Input.Group compact={true}>
                    <FormItem
                      name="qty"
                      rules={[
                        {
                          required: true,
                          message: '请输入数量',
                        },
                      ]}
                      required={true}
                    >
                      <InputNumber placeholder="数字" />
                    </FormItem>
                    <FormItem
                      name="shipqty"
                      rules={[
                        {
                          required: true,
                          message: '请输入已出数量',
                        },
                      ]}
                      required={true}
                    >
                      <InputNumber placeholder="数字" />
                    </FormItem>
                  </Input.Group>
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="制令日期和制令数量" style={{ marginBottom: 0 }} required={true}>
                  <Input.Group compact={true}>
                    <FormItem name="manufactureDate">
                      <DatePicker />
                    </FormItem>
                    <FormItem
                      name="manqty"
                      rules={[
                        {
                          required: true,
                          message: '请输入制令数量',
                        },
                      ]}
                      required={true}
                    >
                      <InputNumber placeholder="数字" />
                    </FormItem>
                  </Input.Group>
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem label="生管交期和备货数量" style={{ marginBottom: 0 }} required={true}>
                  <Input.Group compact={true}>
                    <FormItem name="prepareDate">
                      <DatePicker />
                    </FormItem>
                    <FormItem
                      name="shipqty"
                      rules={[
                        {
                          required: true,
                          message: '请输入出货数量',
                        },
                      ]}
                      required={true}
                    >
                      <InputNumber placeholder="数字" />
                    </FormItem>
                  </Input.Group>
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="备注管理" bordered={false}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <FormItem label="营业备注" name="salesRemark">
                  <TextArea rows={2} disabled={readOnly} />
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <FormItem label="生管备注" name="planRemark">
                  <TextArea rows={2} disabled={readOnly} />
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card
            title="生产计划"
            bordered={false}
            extra={
              <FormItem name="autoUpdate" valuePropName="checked">
                <Switch checkedChildren="1" unCheckedChildren="0" disabled={readOnly} />
              </FormItem>
            }
          >
            <FormItem name="scheduleList">
              <PlanTable
                onCreate={async (value) => {
                  return await handleAddPlan({ ...value, pid: currentObject.id });
                }}
                onUpdate={async (value) => {
                  return await handleUpdatePlan(value);
                }}
                onRemove={async (id) => {
                  return await handleRemovePlan(id);
                }}
              />
            </FormItem>
          </Card>
        </PageHeaderWrapper>
      </Form>
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

export default connect(({ user, salesOrderModel, loading }) => ({
  currentUser: user.currentUser,
  currentObject: salesOrderModel.currentObject,
  extData: salesOrderModel.extData,
  loading: loading.effects['salesOrderModel/fetchCurrent'],
  submitting: loading.effects['salesOrderModel/update'],
}))(OrderDetail);
