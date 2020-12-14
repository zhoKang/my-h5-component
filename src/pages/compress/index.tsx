import React from 'react';
import { useState, useEffect, useCallback, memo } from 'react';
import styles from './index.less';
import { Button, Icon, Toast } from 'antd-mobile';
import { mapStateToProps, dispatchToProps } from '@/utils/mapToProps';
import compress from '@/utils/compress';
import camera from '@/assets/camera.png';

const CompressPage = () => {
  const [cardFront, setCardFront] = useState('');
  const frontRef = React.createRef();

  const getObjectUrl = (file: any) => {
    let url = null;
    if (window.createObjectURL !== undefined) {
      // basic
      url = window.createObjectURL(file);
    } else if (window.URL !== undefined) {
      // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL !== undefined) {
      // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  };

  const uploadFile = (files: any) => {
    const file = frontRef.current.files[0];
    let src = getObjectUrl(file);
    setCardFront(src);
    const fileType = file.type.split('/')[1];
    if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
      Toast.info('请上传png,jpg,jpeg格式的图片!');
      return;
    }
    file.compressing = true;
    Toast.loading('', 0);
    compress(file, 300).then(
      (res: any) => {
        Toast.success(res.msg);
        console.log(res);
      },
      (err: any) => {
        Toast.fail(err.msg);
      },
    );
  };

  return (
    <div className={'page-wrapper'}>
      <div className={styles.noticeBar}>
        <Icon
          className={styles.noticeIcon}
          type={'voice'}
          size={'xxs'}
          color={'red'}
        />
        <div className={styles.noticeTxt}>
          {' '}
          为保障账户安全请上传本人身份证照片完善信息{' '}
        </div>
      </div>
      <div className={styles.uploadTitle}>
        <h4>欢迎开立电子账户</h4>
      </div>
      <div className={styles.uploadBody}>
        <p className={styles.tip}>请保持身份证完整清晰</p>
        <div className={styles.uploadImg + ' ' + styles.front}>
          <input
            type={'file'}
            ref={frontRef}
            accept={'image/*'}
            onChange={uploadFile}
            multiple={true}
          />
          <div className={styles.circle}>
            <img src={camera} alt={''} />
          </div>
          <p className={styles.uploadTip}>上传身份证头像面</p>
          {cardFront && (
            <img src={cardFront} alt={''} className={styles.previewImg} />
          )}
        </div>
      </div>
      <div>
        <p className={styles.tip2}>
          上传证件只用于开设电子卡，您的信息将严格保密
        </p>
        <Button size={'large'} type={'primary'} className={styles.confirmBtn}>
          确认上传
        </Button>
      </div>
    </div>
  );
};
export default CompressPage;
