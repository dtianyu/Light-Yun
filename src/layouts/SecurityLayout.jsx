import React from 'react';
import {PageLoading} from '@ant-design/pro-layout';
import {Redirect, connect} from 'umi';
import {stringify} from 'querystring';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const {dispatch, userId} = this.props;

    if (dispatch && userId) {
      dispatch({
        type: 'user/fetchCurrent',
        payload: {userid: userId},
      });
    }
  }

  render() {
    const {isReady} = this.state;
    const {children, loading, currentUser} = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）

    const isLogin = currentUser && currentUser.userid && this.props.isLogin;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading/>;
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`}/>;
    }

    return children;
  }
}

//login.status === 'ok' || login.status === 'success',

export default connect(({login, user, loading}) => ({
  isLogin: true,
  userId: login.loginId,
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
