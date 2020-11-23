import React from 'react';
import styles from './index.less';
import { history } from 'umi';
import { Button } from 'antd-mobile';
export default () => {
  const test = () => {
    console.log('hhh');
    history.push('/captcha');
  };
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <Button onClick={test}>test</Button>
    </div>
  );
};
