import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { NavBar, Icon } from 'antd-mobile';
let currHref = '';

export interface IBasicLayout {
  loading: any;
  [key: string]: any;
}

const BasicLayout: React.FC<IBasicLayout> = props => {
  const { children } = props;

  return <>{children}</>;
};

export default connect(({ loading }: ConnectState) => ({
  loading,
}))(BasicLayout);
