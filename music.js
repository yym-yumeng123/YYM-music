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
		this.bind()
		this.render()
	},
	// 绑定事件
	bind: function(){
		var _this = this
		$(window).resize(function(){
			_this.setStyle()
		})
		//点击右边的icon 往左移动
		this.$rightBtn.on('click',function(){

			var itemWidth = _this.$box.find('li').outerWidth(true)
			var rowCount = Math.floor(_this.$box.width()/itemWidth) 
			//给个判断条件
			if (!_this.isToEnd) {
				_this.$ul.animate({
					left: '-=' + rowCount*itemWidth
				},400,function(){
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
			var itemWidth = _this.$box.find('li').outerWidth(true)
			var rowCount = Math.floor(_this.$box.width()/itemWidth) 
			if (!_this.isToStart) {
				_this.$ul.animate({
					left: '+=' + rowCount*itemWidth
				},400,function(){
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
      $(this).addClass('active')
        .siblings().removeClass('active')

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

Footer.init()