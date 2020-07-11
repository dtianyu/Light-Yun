import {Avatar, Card, Col, List, Skeleton, Row, Statistic} from 'antd';
import React, {Component} from 'react';
import {Link, connect} from 'umi';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import moment from 'moment';
import Radar from './components/Radar';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';
import {utc2Local} from "@/pages/comm";

const links = [
  {
    title: 'OA',
    href: 'http://oa.hanbell.com.cn:8086/NaNaWeb',
  },
  {
    title: 'EAM',
    href: 'eam.hanbell.com.cn:8480/Hanbell-EAM',
  },
  {
    title: '操作三',
    href: '',
  },
  {
    title: '操作四',
    href: '',
  },
  {
    title: '操作五',
    href: '',
  },
  {
    title: '操作六',
    href: '',
  },
];

const PageHeaderContent = ({currentUser}) => {
  const loading = currentUser && Object.keys(currentUser).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser.avatar}/>
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          你好，
          {currentUser.name}
          ，祝你开心每一天！
        </div>
        <div>
          {currentUser.title} |{currentUser.group}
        </div>
      </div>
    </div>
  );
};

const ExtraContent = () => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="项目数" value={56}/>
    </div>
    <div className={styles.statItem}>
      <Statistic title="团队内排名" value={8} suffix="/ 24"/>
    </div>
    <div className={styles.statItem}>
      <Statistic title="项目访问" value={2223}/>
    </div>
  </div>
);

class Workplace extends Component {

  componentDidMount() {
    const {dispatch, currentUser} = this.props;
    if (dispatch && currentUser) {
      dispatch({
        type: 'workplaceModel/init', payload: {userid: currentUser.userid}
      });
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'workplaceModel/clear',
    });
  }

  renderTasks = item => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          title={
            <span>
              <a className={styles.username}>{item.name}</a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span className={styles.datetime}>{utc2Local(item.plannedStartDate, {localFormat: "YYYY-MM-DD"})}</span>
              -
              <span className={styles.datetime}>{utc2Local(item.plannedFinishDate, {localFormat: "YYYY-MM-DD"})}</span>
            </span>
          }
          description={
            <span title={item.name}>
              {item.description}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    const {
      currentUser,
      tasks,
      projectNotice,
      projectLoading,
      taskLoading,
      radarData,
    } = this.props;

    if (!currentUser || !currentUser.userid) {
      return null;
    }

    return (
      <PageHeaderWrapper
        content={<PageHeaderContent currentUser={currentUser}/>}
        extraContent={<ExtraContent/>}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{
                padding: 0,
              }}
              bordered={false}
              className={styles.activeCard}
              title="我的任务"
              loading={taskLoading}
              extra={<Link to="/custom/tasks">任务清单</Link>}
            >
              <List
                loading={taskLoading}
                renderItem={item => this.renderTasks(item)}
                dataSource={tasks}
                className={styles.activitiesList}
                size="large"
              />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{
                marginBottom: 24,
              }}
              title="快速开始 / 便捷导航"
              bordered={false}
              bodyStyle={{
                padding: 0,
              }}
            >
              <EditableLinkGroup onAdd={() => {
              }} links={links} linkElement={Link}/>
            </Card>
            <Card
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              title="员工魅力指数"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={radarData}/>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({user, workplaceModel: {projectNotice, tasks, radarData}, loading}) => ({
    currentUser: user.currentUser,
    projectNotice,
    tasks,
    radarData,
    currentUserLoading: loading.effects['user/fetchCurrent'],
    projectLoading: loading.effects['workplaceModel/fetchProjectNotice'],
    taskLoading: loading.effects['workplaceModel/fetchTask'],
  }),
)(Workplace);
