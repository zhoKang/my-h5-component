import { useState, useEffect, useRef, memo } from 'react';
import React, { FC } from 'react';
import html2Canvas from 'html2canvas';
import JsPDF from 'jspdf';
import styles from './index.less';
import { Button, Icon, List } from 'antd-mobile';

interface IProps {}

const Signature: FC<IProps> = props => {
  const [signedImg, setSignedImg] = useState('');
  const {} = props;
  const pdfDom = useRef(null);
  const canvasDom = useRef(null);

  useEffect(() => {
    let beginX: number, beginY: number;
    const canvas: HTMLCanvasElement = canvasDom.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas.addEventListener('touchstart', function(event: any) {
      event.preventDefault(); // 阻止签名的时候页面跟着滚动
      beginX = event.touches[0].clientX - this.offsetLeft;
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

  const print = () => {
    let dom: HTMLElement = pdfDom.current;
    // let len = dom.childElementCount, i = 0, tempHeight = 0, nodes = dom.children, hasChanged = [];
    // while (i < len) {
    //   tempHeight += nodes[i].clientHeight;
    //   if (tempHeight < 550 && nodes[i + 1] && tempHeight + nodes[i + 1].clientHeight > 550) {
    //     hasChanged.push(i);
    //     nodes[i].style.paddingBottom = -tempHeight + 550 + 'px';
    //     tempHeight = 0;
    //   }
    //   i++;
    // }
    html2Canvas(dom, {
      allowTaint: true,
      width: dom.scrollWidth, //设置获取到的canvas宽度，若有横向滚动条，则可以使内容全部展示
      height: dom.scrollHeight, //设置获取到的canvas高度
      x: 0, //页面在水平方向滚动的距离
      y: 0, //页面在垂直方向滚动的距离
    }).then((canvas: HTMLCanvasElement) => {
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;
      let pageHeight = (canvasWidth / 592.28) * 841.89; // 一页A4 pdf能显示的canvas高度
      let imgWidth = 595.28; // 设置图片宽度和A4纸宽度相等
      let imgHeight = (592.28 / canvasWidth) * canvasHeight; //等比例换算成A4纸的高度
      let totalHeight = imgHeight; // 需要打印的图片总高度，初始状态和图片高度相等
      let pageData = canvas.toDataURL('image/png', 1.0);
      let PDF = new JsPDF('p', 'pt', 'a4', true);
      if (totalHeight < pageHeight) {
        // 只有一页的情况
        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight); // 从顶部开始打印
      } else {
        let top = 0; // 打印初始区域
        while (totalHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 0, top, imgWidth, imgHeight); // 从图片顶部往下top位置开始打印
          totalHeight -= pageHeight;
          top -= 841.89;
          if (totalHeight > 0) {
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
          这是第一段测试文字这是一段测试文字这是一1111文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字这是一段测试文字
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
      <canvas
        className={styles.canvas}
        ref={canvasDom}
        width="350"
        height="150"
      />
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
        onClick={print}
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
