import { useState, useEffect, useRef, memo } from 'react';
import React, { FC } from 'react';
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
import styles from './index.less';
import { Button, Icon, List, Radio, Pagination } from 'antd-mobile';

interface IProps {}

const Signature: FC<IProps> = props => {
  const [signedImg, setSignedImg] = useState('');
  const [pageData, setPageData] = useState('');
  const {} = props;
  const pdfDom = useRef(null);

  useEffect(() => {
    let beginX: number, beginY: number;
    const canvas: any = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.addEventListener('touchstart', function(event: any) {
      event.preventDefault(); // 阻止签名的时候页面跟着滚动
      beginX = event.touches[0].clientX - this.offsetLeft; // 此处可介绍下clientX pageX screenY
      beginY = event.touches[0].pageY - this.offsetTop;
    });
    canvas.addEventListener('touchmove', (event: any) => {
      event.preventDefault();
      event = event.touches[0];
      let stopX = event.clientX - canvas.offsetLeft;
      let stopY = event.pageY - canvas.offsetTop;
      writing(beginX, beginY, stopX, stopY, ctx);
      beginX = stopX; // 这一步很关键，需要不断更新起点，否则画出来的是射线簇
      beginY = stopY;
    });
  }, []);

  const writing = (
    beginX: number,
    beginY: number,
    stopX: number,
    stopY: number,
    ctx: any,
  ) => {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'red';
    ctx.moveTo(beginX, beginY);
    ctx.lineTo(stopX, stopY);
    ctx.closePath();
    ctx.stroke();
  };

  const confirm = () => {
    const canvas: any = document.querySelector('canvas');
    setSignedImg(canvas.toDataURL('image/png', 1.0));
  };

  const reset = () => {
    const canvas: any = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let w = canvas.width;
    let h = canvas.height;
    setSignedImg('');
    ctx.clearRect(0, 0, w, h);
  };

  const download = () => {
    let dom: HTMLElement = pdfDom.current;
    html2Canvas(dom, {
      allowTaint: true,
      width: dom.offsetWidth, //设置获取到的canvas宽度
      height: dom.offsetHeight, //设置获取到的canvas高度
      x: 0, //页面在水平方向滚动的距离
      y: 0, //页面在垂直方向滚动的距离
    }).then((canvas: HTMLCanvasElement) => {
      let contentWidth = canvas.width;
      let contentHeight = canvas.height;
      let pageHeight = (contentWidth / 592.28) * 830;
      let leftHeight = contentHeight;
      let position = 0;
      let imgWidth = 595.28;
      let imgHeight = (592.28 / contentWidth) * contentHeight;
      let pageData = canvas.toDataURL('image/jpeg', 1.0);
      // setPageData(pageData);
      let PDF = new JsPDF('p', 'pt', 'a4', true);

      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
          leftHeight -= pageHeight;
          position -= 841.89;
          if (leftHeight > 0) {
            PDF.addPage();
          }
        }
      }
      PDF.save('test.pdf');
    });
  };

  return (
    <div className={styles.singlePage}>
      <div className={styles.pdfArea} ref={pdfDom}>
        <h2>Title</h2>
        <p className={styles.para}>
          这是第一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <p className={styles.para}>
          这是第二段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <p className={styles.para}>
          这是第三段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <p className={styles.para}>
          这是第四段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <p className={styles.para}>
          这是第五段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <p className={styles.para}>
          这是第六段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <p className={styles.para}>
          这是第七段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <p className={styles.para}>
          这是第八段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <p className={styles.para}>
          这是第九段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
        </p>
        <div className={styles.txt}>
          签名：
          {signedImg && (
            <img alt={''} className={styles.signedImg} src={signedImg} />
          )}
        </div>
      </div>
      <canvas className={styles.canvas} width="350" height="150" />
      <img src={pageData} />
      <div className={styles.btnGroup}>
        <Button
          onClick={confirm}
          activeStyle={false}
          type={'primary'}
          className={styles.btn}
        >
          确 定
        </Button>
        <Button
          onClick={reset}
          activeStyle={false}
          type={'primary'}
          className={styles.btn}
        >
          重 置
        </Button>
      </div>
      <Button
        onClick={download}
        activeStyle={false}
        type={'primary'}
        className={styles.downLoad}
      >
        下载
      </Button>
    </div>
  );
};

export default Signature;
