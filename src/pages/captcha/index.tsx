import { useState, useEffect, useRef, memo } from 'react';
import React, { FC } from 'react';
import { connect } from 'dva';
import { mapStateToProps, dispatchToProps } from '@/utils/mapToProps';
import styles from './index.less';

interface IProps {
  ReqAuthCode: any;
}

const Captcha: FC<IProps> = props => {
  const [showValue, setShowValue] = useState([]); // 收集并展示验证码
  const [index, setIndex] = useState(0); // 标记输入到第几个数字了
  const [x, setDx] = useState(0); // x方向偏移量
  const [count, setCount] = useState(-1); // -1标记为初始状态
  const inputEle = useRef(null); // 获取输入框
  const { ReqAuthCode } = props;

  useEffect(() => {
    inputEle && inputEle.current.focus(); // 进入页面就唤起键盘
    ReqAuthCode({}).then((res: any) => {
      setCount(60);
    });
  }, []);

  useEffect(() => {
    if (count === -1) {
      return;
    }
    if (count === 0) {
      setCount(-1);
    } else {
      setTimeout(() => {
        setCount(count - 1);
      }, 1000);
    }
  }, [count]);

  const handleChange = (e: any) => {
    let curr: string[] = e.target.value;
    if (curr.length > 6) {
      curr = curr.slice(0, 6);
    }
    console.log(curr, 'currr');
    if (curr.length === 6) {
      //  支持复制粘贴功能
      setShowValue(curr.split(''));
      inputEle.current.style.visibility = 'hidden';
      return;
    }
    showValue.push(curr); // 收集输入的数字
    setIndex(index + 1);
    setDx(x + 57); // 输入框右移
    if (index === 5) {
      // 隐藏焦点
      inputEle.current.style.visibility = 'hidden';
    }
  };

  // 删除监听
  const handleDelete = (e: any) => {
    const isBackSpaceKey = e.keyCode === 8;
    if (isBackSpaceKey) {
      let currIndex = index - 1;
      if (currIndex < 0) {
        return;
      }
      showValue.pop();
      let params: any = showValue.slice();
      setShowValue(params);
      setIndex(currIndex);
      setDx(x - 57); // 若使用vw或者rem布局需注意换算，精度丢失，删除到第一个不一定是0
    }
  };

  const renderCaptchaItem = () => {
    const list = new Array(6).fill('_');
    return list.map((item: string, index: number) => {
      return (
        <div className={styles.item} key={index}>
          {showValue[index]}
        </div>
      );
    });
  };

  return (
    <>
      <div className={styles.captchaBody}>
        <div className={styles.amount}>¥ 10000</div>
        <div className={styles.phone}>
          <p className={styles.tip}>输入短信验证码</p>
          <p className={styles.send}>
            <span>验证码已发送至</span>
            <span className={styles.number}>137****5064</span>
          </p>
        </div>
        <div className={styles.phoneCode}>{renderCaptchaItem()}</div>
        <input
          value={''}
          ref={inputEle}
          style={{ transform: `translate(${x}px, -32px)` }}
          className={styles.inputItem}
          autoFocus
          onChange={handleChange}
          onKeyDown={handleDelete}
        />
      </div>
      <div className={styles.reGet + ' ' + (count > 0 ? '' : styles.hide)}>
        {count}秒后重新获取
      </div>
    </>
  );
};
export default memo(
  connect(
    mapStateToProps('modeA'),
    dispatchToProps('modeA', ['ReqAuthCode']),
  )(Captcha),
);
