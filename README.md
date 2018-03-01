# YYM-music

**jquery + ajax + 面向对象实现YYM音乐播放器**

> 自己偶然看电视看到的一个音乐FM播放器,满屏(大屏页面),感兴趣就写了这个项目,可以在不同大屏幕上播放,PC端布局,比例协调

### 问题
- 页面的响应式
- 音乐的播放 暂停 下一曲
- 不同音乐类型数据的获取,数据过多,切换下一页
- 歌词的处理

**问题一: PC页面的响应式**

> 因为要实现不仅宽度上随页面的变化而比例协调,高度充满,也是响应式,所以 px 单位就不太合适了,使用新出的单位 vh 更合适,不仅高度上10vh 随着页面高度变化,而且font-size大小也可以随着屏幕变化而变化,比百分比的效果更好一点,

> 总结上,宽度上加一些响应式, 高度满屏,需要高度上使用vh单位

- 设置 @media 宽度上响应
```
.layout {
  margin: 0 auto;
  width: 600px;
}
@media (min-width: 700px) {
  .layout {
    width: 600px;
  }
}

...

@media (min-width: 1200px) {
  .layout {
    width: 1100px;
  }
}
```
- `<figure>`图片不设置src,为了更好的适配,设置background

**问题二: 音乐的播放 暂停**
- Audio API的使用
```
//创建audio标签
this.audio = new Audio()

autoplay = true  // 自动播放
play()           // 播放事件
pause()          // 暂停事件
currentTime      // 设置或返回音频/视频播放的当前位置
duration         // 获取音乐长度，单位为秒。
onended          // 在视频/音频（audio/video）播放结束时触发。
```

**问题三: 音乐类型过多,左右切换问题**

> 点击左右按钮ul滚动距离和滚的最后不能再滚动了,由于经验不足,逻辑有些地方思考不太清晰,在这里遇到了问题,解决:

```
R.on('click',function(){
  $ul.animate({
    left: '-=' + $box.width() //移动的box宽度,但图片会出现一半一半的情况
    解决1: left: '-=' + rowCount*itemWidth // box里面li的个数 * 每个li的宽度,解决了出现一半一半的问题
  })
})
```
```
问题2:点击到最后一个类型,再次点击没有效果,不知道判断条件
解决: 判断box的宽度 + 滚动距离左边的距离 是否 > ul 的宽度,如果大于,条件不成立

this.isToEnd = false   //判断您点击轮播是不是到最后了
this.isToStart = true

if(!this.isToEnd){
  this.isToStart = false  //设置往右滚动状态为false
  //条件成立,设置状态为true
  if(parseFloat(_this.$box.width()) - parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.css('width')) ){
     _this.isToEnd = true
  }
}

L.on('click',function(){
 if (!_this.isToStart) {  // 当点击右图片向左滚动时, toStart为false
	_this.$ul.animate({
		left: '+=' + rowCount*itemWidth
	},400,function(){
		 _this.isToEnd = false // toEnd为false, 可以点击向右滚动
		//如果盒子的宽度+ 往左偏移的宽度  >= ul的宽度
		if(parseFloat(_this.$ul.css('left')) >= 0){
    _this.isToStart = true  // 设为true,禁止再往右滚动
  }
	})
}
})

问题3: 当点击过快时,会出现动画不连续问题
解决: 加一个状态锁
```
**问题四: 歌词的处理**
- 如何解析歌词与时间对应
```
[00:56.00][02:36.00]我在怀疑该不该躲避 该不该躲这场雨

var arr = lyric.split('\n')                     // 得到一个数组
arr.forEach                                     // 遍历数组
var times = line.match(/\d{2}:\d{2}/g)          // 匹配时间 
var str = line.replace(/\[.+?\]/g, '')          // 匹配歌词
// 判断数组time是否是数组存在
if (Array.isArray(times)) {
	times.forEach(function(time){
		lyricobj[time] = str
	})
}   
```

### jquery插件,弄一个酷炫的歌词
