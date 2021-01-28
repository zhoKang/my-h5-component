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

## 5. 最原始兼容最多的表单提交方式？
使用表单提交数据时，若需要兼容安卓低版本手机或者微信Android5.0以下系统时，html5新增的属性FormData无法使用，此时可以考虑不使用ajax，而是直接表单提交，使用
iframe来承载，[参考](https://juejin.cn/post/6908604005878857741)

## 6. focus方法有时候无效？
在iOS Safari浏览器下有时候就会出现 input.focus() 无效的情况，并不是代码行不通，而是生效需要一个前提，就是在点击事件中，而且是要在点击事件这个线程中。
注意，并不是说input.focus()语句写在click事件中就是有效的。
例如在Vue等框架中，DOM的渲染是数据驱动的，因此，往往会在click事件中进行数据变化，而此时的DOM渲染实在click事件之后执行的，因此，开发者自然而然会想到使用定时器进行处理。
此时focus行为就不会触发是无效的，因为加了定时器，focus行为已经不和click在一个执行线程中，出于安全和体验的考虑，iOS系统就没有让输入框focus聚焦。
[解决方案](https://www.zhangxinxu.com/wordpress/2020/10/ios-safari-input-button-focus/)

## 7. 点击移动端浏览器的前进按钮或后退按钮，有时不会自动执行旧页面的JS代码？
这与往返缓存有关，这种情况在Safari上特别明显，简单概括就是往返页面无法刷新。往返缓存指浏览器为了在页面间执行前进后退操作时能拥有更流畅体验的一种策略，以下简称BFCache。该策略具体表现为：当用户前往新页面前将旧页面的DOM状态保存在BFCache里，当用户返回旧页面前将旧页面的DOM状态从BFCache里取出并加载。大部分移动端浏览器都会部署BFCache，可大大节省接口请求的时间和带宽。
[解决方案](https://juejin.cn/post/6921886428158754829#heading-36)                            
                                    
