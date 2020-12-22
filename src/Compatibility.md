# 记录移动端开发踩过的坑
## 1. 安卓端能正确获取响应，IOS中的H5页面发起请求的时候参数体为空，无法正确获取响应？
A: 很有可能是iOS采用了WK webview，与其缓存策略放生了冲突，需要提醒移动端开发同事注意。

## 2. iPhone手机在滑动的时候会发生卡顿？
A： 需要加入以下css代码，-webkit-overflow-scrolling: touch

## 3. 移动端bfc（back forward cache）,往返缓存的原理是把之前访问的页面缓存到浏览器内存里，当用户在进行“后退”和“前进”操作的时候，浏览器会直接从缓存里面把页面展示到前端，而不去刷新页面。这样会导致用户在子页面与上一个页面之前存在管理的时候，返回的是缓存的页面而状态并没有得到更新。
A：需要检测页面是不是从缓存里读取出来的页面，添加一下监听函数：
```javascript
window.addEventListener("pageshow", function(event){
   if (event.persisted) {
   location.reload(true);
 }
});
```

## 4. h5唤起已安装的手机app？
```javascript
schema协议://jumpurl?url=%2Fpublic%2Ffin%2Fonsale%2Findex
```
url后面可以跟app内嵌H5的路由

## 5. iPhone手机在滑动的时候会发生卡顿？
使用表单提交数据时，若需要兼容安卓低版本手机或者微信Android5.0以下系统时，html5新增的属性FormData无法使用，此时可以考虑不使用ajax，而是直接表单提交，使用
iframe来承载，[详细可见](https://juejin.cn/post/6908604005878857741)
