# YYM-music

> 自己偶然看电视看到的一个音乐FM播放器,满屏(大屏页面),感兴趣就写了这个项目,可以在不同大屏幕上播放,PC端布局,比例协调

### 实现效果
- 页面的响应式
- 音乐的播放 暂停 下一曲
- 不同音乐类型数据的获取,数据过多,切换下一页
- 歌词的处理

**PC页面的响应式**

> 因为要实现不仅宽度上随页面的变化而比例协调,高度充满,也是响应式,所以 px 单位就不太合适了,使用新出的单位 vh 更合适,不仅高度上10vh 随着页面高度变化,而且font-size大小也可以随着屏幕变化而变化,比百分比的效果更好一点,

> 总结上,宽度上加一些响应式, 高度满屏,需要高度上使用vh单位

```
# 设置 @media 宽度上响应
.layout {
  margin: 0 auto;
  width: 600px;
}
@media (min-width: 700px) {
  .layout {
    width: 600px;
  }
}
@media (min-width: 900px) {
  .layout {
    width: 800px;
  }
}
@media (min-width: 1000px) {
  .layout {
    width: 900px;
  }
}
@media (min-width: 1200px) {
  .layout {
    width: 1100px;
  }
}
```
