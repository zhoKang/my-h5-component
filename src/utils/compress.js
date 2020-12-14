const fileToImage = blob =>
  new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = getObjectUrl(blob);
  });

const getObjectUrl = file => {
  let url = null;
  if (window.createObjectURL != undefined) {
    // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
};

const imgToCanvas = img =>
  new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const imgWidth = img.width;
    const imgHeight = img.height;
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    // 尺寸与原图保持一致
    context.clearRect(0, 0, imgWidth, imgHeight);
    context.drawImage(img, 0, 0, imgWidth, imgHeight);
    resolve(canvas);
  });

// 将一个canvas对象转变为一个File（Blob）对象
const canvastoFile = (canvas, type, encoderOptions) =>
  new Promise(resolve =>
    canvas.toBlob(blob => resolve(blob), type, encoderOptions),
  );

const downLoadImg = blob => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'fileName'; // 文件命名
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

const compress = (originfile, limitedSize) =>
  new Promise(async (resolve, reject) => {
    const originSize = originfile.size / 1024; // 计算文件大小 单位为kb
    // 若小于limitedSize，则不需要压缩，直接返回
    if (originSize < limitedSize) {
      resolve({ file: originfile, msg: '体积小于期望值，无需压缩！' });
      return;
    }
    // 将获取到的blob文件恢复成图片

    const img = await fileToImage(originfile);
    // 使用此图片生成需要的canvas
    const canvas = await imgToCanvas(img);
    // 为规避js精度问题，将encoderOptions乘100为整数，初始最大size为MAX_SAFE_INTEGER
    const maxQualitySize = {
      encoderOptions: 100,
      size: Number.MAX_SAFE_INTEGER,
    };
    // 初始最小size为0
    const minQualitySize = { encoderOptions: 0, size: 0 };
    let encoderOptions = 100; // 初始质量参数
    let count = 0; // 压缩次数
    let errorMsg = ''; // 出错信息
    let compressBlob = null; // 压缩后的文件Blob
    //  压缩思路，用二分法找最佳的压缩点 最多尝试8次即可覆盖全部可能
    while (count < 8) {
      compressBlob = await canvastoFile(
        canvas,
        'image/jpeg',
        encoderOptions / 100,
      );
      const compressSize = compressBlob.size / 1024;
      count++;
      if (compressSize === limitedSize) {
        // 压缩后的体积与期望值相等  压缩完成，总共压缩了count次
        break;
      } else if (compressSize > limitedSize) {
        // 压缩后的体积比期望值大
        maxQualitySize.encoderOptions = encoderOptions;
        maxQualitySize.size = compressSize;
      } else {
        // 压缩后的体积比期望值小
        minQualitySize.encoderOptions = encoderOptions;
        minQualitySize.size = compressSize;
      }
      encoderOptions =
        (maxQualitySize.encoderOptions + minQualitySize.encoderOptions) >> 1;
      if (maxQualitySize.encoderOptions - minQualitySize.encoderOptions < 2) {
        if (!minQualitySize.size && encoderOptions) {
          encoderOptions = minQualitySize.encoderOptions;
        } else if (!minQualitySize.size && !encoderOptions) {
          errorMsg = '压缩失败，无法压缩到指定大小';
          break;
        } else if (minQualitySize.size > limitedSize) {
          errorMsg = '压缩失败，无法压缩到指定大小';
          break;
        } else {
          //  压缩完成
          encoderOptions = minQualitySize.encoderOptions;
          compressBlob = await canvastoFile(
            canvas,
            'image/jpeg',
            encoderOptions / 100,
          );
          break;
        }
      }
    }
    // 压缩失败，则返回原始图片的信息
    if (errorMsg) {
      reject({
        msg: errorMsg,
        file: originfile,
      });
      return;
    }
    const compressSize = compressBlob.size / 1024;
    console.log(
      `最后一次压缩后，encoderOptions为:${encoderOptions}，大小：${compressSize}`,
    );
    // 生成文件
    const compressedFile = new File([compressBlob], originfile.name, {
      type: 'image/jpeg',
    });
    resolve({ file: compressedFile, compressBlob, msg: '压缩成功！' });
  });

export default compress;
