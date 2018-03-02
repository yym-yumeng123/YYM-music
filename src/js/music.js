// 自定义事件
var EventCenter = {
  on: function(type, handler){
    $(document).on(type, handler)
  },
  fire: function(type, data){
    $(document).trigger(type, data)
  }
}


var Footer = {
	//初始化页面
	init: function(){
		this.$footer = $('footer')
		this.$ul = this.$footer.find('ul')
		this.$box = this.$footer.find('.box')
	    this.$leftBtn = this.$footer.find('.icon-left')
	    this.$rightBtn = this.$footer.find('.icon-right')
	    this.isToEnd = false   //判断您点击轮播是不是到最后了
	    this.isToStart = true
	    this.isAnimate = false //状态锁

		this.bind()
		this.render()
	},
	// 绑定事件
	bind: function(){
		var _this = this
		$(window).resize(function(){
			_this.setStyle()
		});
		//点击右边的icon 往左移动
		this.$rightBtn.on('click',function(){
			if (_this.isAnimate ) {return}
			var itemWidth = _this.$box.find('li').outerWidth(true)
			var rowCount = Math.floor(_this.$box.width()/itemWidth) 
			//给个判断条件
			if (!_this.isToEnd) {
				//状态锁
				_this.isAnimate = true;
				_this.$ul.animate({
					left: '-=' + rowCount*itemWidth
				},400,function(){
					//状态锁
					_this.isAnimate = false
					_this.isToStart = false
					//如果盒子的宽度+ 往左偏移的宽度  >= ul的宽度
					if(parseFloat(_this.$box.width()) - parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.css('width')) ){
			            _this.isToEnd = true
			        }
			    })
			}
		})
		//点击左边往右移动
		this.$leftBtn.on('click',function(){
			if (_this.isAnimate ) {return}
			var itemWidth = _this.$box.find('li').outerWidth(true)
			var rowCount = Math.floor(_this.$box.width()/itemWidth) 
			if (!_this.isToStart) {
				_this.isAnimate = true
				_this.$ul.animate({
					left: '+=' + rowCount*itemWidth
				},400,function(){
					_this.isAnimate = false
					 _this.isToEnd = false
					//如果盒子的宽度+ 往左偏移的宽度  >= ul的宽度
					if(parseFloat(_this.$ul.css('left')) >= 0){
	            _this.isToStart = true
	          }
				})
			}
		})

		//点击后的状态
		this.$footer.on('click', 'li', function(){
	      $(this).addClass('active').siblings().removeClass('active')
	      //自定义事件 把类别和类名name 放进去
	      EventCenter.fire('select-albumn', {
	        channelId: $(this).attr('data-channel-id'),
	        channelName: $(this).attr('data-channel-name')
	      })
	    })
  

	},
	// 渲染页面
	render: function(){
		var _this = this
		$.getJSON('https://jirenguapi.applinzi.com/fm/getChannels.php')
		 .done(function(ret){
			// 渲染数据
				_this.renderFooter(ret.channels)
			}).fail(function(){
				console.log('error...')
			})
	},
	// 数据放到页面上
	renderFooter: function(channels){
		console.log(channels)
		var html = ''
		channels.forEach(function(channel){
			// 拼接字符串
			html += '<li data-channel-id='+channel.channel_id+' data-channel-name='+channel.name+'>'
						+ 	'<div class="cover" style="background-image:url('+channel.cover_small+')"></div>'
						+ 	'<h3>'+channel.name+'</h3>'
						+ '</li>'
		})
		this.$ul.html(html)
		// 设置样式
		this.setStyle()
	},
	// 设置样式
	setStyle: function(){
		//多少个li
		var count = this.$footer.find('li').length
		//每个li的宽度 包括外边框
		var width = this.$footer.find('li').outerWidth(true)	
		this.$ul.css({
			width: count * width + 'px'
		})
	}
}

var Fm = {
	init: function(){
		//选择区块,有命名空间
		this.$container = $('#page-music')
		this.$bar = $('.bar')
		//创建audio标签
		this.audio = new Audio()
		
		//自动播放
		this.audio.autoplay = true

		this.bind()
		this.loadMusic(function(){
	      	this.setMusic()
	    })
	},
	bind: function(){
		var _this = this

	    EventCenter.on('select-albumn', function(e, channelObj){
	      _this.channelId = channelObj.channelId
	      _this.channelName = channelObj.channelName
	      _this.loadMusic()
	    })
	    //暂停 播放
	    this.$container.find('.btn-play').on('click', function(){
	      var $btn = $(this)
	      if($btn.hasClass('icon-play')){
	        $btn.removeClass('icon-play').addClass('icon-pause')
	        _this.audio.play();
	      }else{
	        $btn.removeClass('icon-pause').addClass('icon-play')
	        _this.audio.pause()
	      }
	    })
	    //下一曲
	    this.$container.find('.btn-next').on('click', function(){
	      _this.loadMusic(function(){
	      	_this.setMusic()
	      })
	    })
	    //播放时进度条变化
	    this.audio.addEventListener('play', function(){
	      clearInterval(_this.statusClock)
	      _this.statusClock = setInterval(function(){
	        _this.updateStatus()
	      }, 1000)
	    })
	    //点击进度条快进
	    this.$container.find('.area-bar .bar').on('click',function(e){
			console.log(e)
			var percent = e.offsetX / parseInt(getComputedStyle(this).width)
			_this.audio.currentTime = _this.audio.duration * percent

		})
		//时间完了以后自动下一曲
		this.audio.onended = function(){
			_this.loadMusic(function(){
	      	_this.setMusic()
	      })
		}
	    
		
	    //暂停时清除定时器
	    this.audio.addEventListener('pause', function(){
	      clearInterval(_this.statusClock)
	    })
	},
	//load music
	loadMusic(callback){
		var _this = this
		$.getJSON('//jirenguapi.applinzi.com/fm/getSong.php?',{channel: this.channelId}).done(function(ret){
				 _this.song = ret['song'][0]
				 _this.setMusic()
				 _this.loadLyric()
			})
	},
	//歌词
	loadLyric(){
		var _this = this
	    $.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php',{sid: this.song.sid}).done(function(ret){
	    	//获取歌词数据
	    	var lyric = ret.lyric
	    	var lyricobj = {}
	    	//分割歌词
	    	lyric.split('\n').forEach(function(line){
	    		var times = line.match(/\d{2}:\d{2}/g)  //时间
	    		var str = line.replace(/\[.+?\]/g, '')   //歌词
	    		if (Array.isArray(times)) {
	    			times.forEach(function(time){
		    			lyricobj[time] = str
		    		})
	    		}   		
	    	})
	    	_this.lyricobj = lyricobj
	    })
	},
	// 设置音乐,把内容放进去
	setMusic(){
		console.log(this.song)
		this.audio.src = this.song.url
		$('.bg').css('background-image', 'url('+this.song.picture+')')
	    this.$container.find('.aside figure').css('background-image', 'url('+this.song.picture+')')
	    this.$container.find('.detail h1').text(this.song.title)
	    this.$container.find('.detail .author').text(this.song.artist)
	    this.$container.find('.tag').text(this.channelName)
	    //播放按钮重置
	    this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-pause')
	},
	//进度条
	updateStatus(){
		//设置分秒
	    var min = Math.floor(this.audio.currentTime/60)
	    var second = Math.floor(Fm.audio.currentTime%60)+''
	    second = second.length ===2?second:'0'+second
	    this.$container.find('.current-time').text(min+':'+second)
	    // 设置进度条
	    this.$container.find('.bar-progress').css('width', this.audio.currentTime/this.audio.duration*100+'%')
	    //放置歌词
	    var line = this.lyricobj['0' +min+ ':' +second]
	    if(line){
	      this.$container.find('.lyric p').text(line).boomText()
	    }
	}
}


//jquery插件的使用
/*
$.fn.name = function(){
	
}

$("element").name()
 */

$.fn.boomText = function(type){
  type = type || 'rollIn'     //
  console.log(type)
  this.html(function(){
    var arr = $(this).text()
    .split('').map(function(word){
        return '<span class="boomText">'+ word + '</span>'
    })
    return arr.join('')
  })
  
  var index = 0
  var $boomTexts = $(this).find('span')
  var clock = setInterval(function(){
    $boomTexts.eq(index).addClass('animated ' + type)
    index++
    if(index >= $boomTexts.length){
      clearInterval(clock)
    }
  }, 300)
}





Footer.init()
Fm.init()