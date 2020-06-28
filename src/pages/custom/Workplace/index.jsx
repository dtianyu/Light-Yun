import {Avatar, Card, Col, List, Skeleton, Row, Statistic} from 'antd';
import React, {Component} from 'react';
import {Link, connect} from 'umi';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import moment from 'moment';
import Radar from './components/Radar';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';

const links = [
  {
    title: 'OA',
    href: 'oa.hanbell.com.cn:8086/NaNaWeb',
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

  renderActivities = item => {
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          title={
            <span>
              <a className={styles.username}>{item.name}</a>
              &nbsp;
              <span className={styles.datetime}>期限{moment(item.plannedFinishDate).format("YYYY-MM-DD")}</span>
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
      activities,
      projectNotice,
      projectLoading,
      activitiesLoading,
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
              loading={activitiesLoading}
              extra={<Link to="/custom/tasks">任务清单</Link>}
            >
              <List
                loading={activitiesLoading}
                renderItem={item => this.renderActivities(item)}
                dataSource={activities}
                className={styles.activitiesList}
                pagination={true}
                size="large"
              />
            </Card>
            <Card
              className={styles.projectList}
              style={{
                marginBottom: 24,
              }}
              title="进行中的项目"
              bordered={false}
              extra={<Link to="/">全部项目</Link>}
              loading={projectLoading}
              bodyStyle={{
                padding: 0,
              }}
            >
              {projectNotice.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card
                    bodyStyle={{
                      padding: 0,
                    }}
                    bordered={false}
                  >
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={item.logo}/>
                          <Link to={item.href}>{item.title}</Link>
                        </div>
                      }
                      description={item.description}
                    />
                    <div className={styles.projectItemContent}>
                      <Link to={item.memberLink}>{item.member || ''}</Link>
                      {item.updatedAt && (
                        <span className={styles.datetime} title={item.updatedAt}>
                          {moment(item.updatedAt).fromNow()}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
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
              title="XX 指数"
              loading={radarData.length === 0}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={radarData}/>
              </div>
            </Card>
            <Card
              bodyStyle={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
              bordered={false}
              title="团队"
              loading={projectLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {projectNotice.map(item => (
                    <Col span={12} key={`members-item-${item.id}`}>
                      <Link to={item.href}>
                        <Avatar src={item.logo} size="small"/>
                        <span className={styles.member}>{item.member}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({user, workplaceModel: {projectNotice, activities, radarData}, loading}) => ({
    currentUser: user.currentUser,
    projectNotice,
    activities,
    radarData,
    currentUserLoading: loading.effects['user/fetchCurrent'],
    projectLoading: loading.effects['workplaceModel/fetchProjectNotice'],
    activitiesLoading: loading.effects['workplaceModel/fetchActivitiesList'],
  }),
)(Workplace);
