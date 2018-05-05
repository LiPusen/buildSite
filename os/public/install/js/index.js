(function(win) {
	win.install = {}
	var data = {};
	install.init = function() {
		// 初始化站点主题数据
		$.ajax({
			type:"post",
			url: conf.api + "/api/install/themes",
			async: true,
			data: data
		}).then(function(res){
			if(res.code == 200) {
				var str = '';
				for(var i = 0; i < res.body.length; i++){
					str += '<option value="'+ res.body[i].directory +'">'+ res.body[i].name +'</option>'
				}
				$('#theme').html(str);
			} else {
				console.log(res.msg)
			}
		}, function(e) {
			console.log(e)
		})
		// 安装数据库
		$('#installDb').click(function() {
			$('#er1').html('');
			if(!$.trim($('#host').val())) {
				return $('#er1').text('数据库地址不能为空！')
			} else if(!$.trim($('#port').val())) {
				return $('#er1').text('数据库端口号不能为空！')
			} else if(!/^[0-9]+$/.test($.trim($('#port').val()))) {
				return $('#er1').text('数据库端口号只能为数字！')
			} else if(!$.trim($('#db').val())) {
				return $('#er1').text('数据库名不能为空！')
			} else if(!$.trim($('#user').val())) {
				return $('#er1').text('数据库用户名不能为空！')
			} else if(!$.trim($('#pass').val())) {
				return $('#er1').text('数据库连接密码不能为空！')
			} else {
				data = {
					host: $.trim($('#host').val()),
					port: $.trim($('#port').val()),
					db: $.trim($('#db').val()),
					user: $.trim($('#user').val()),
					pass: $.trim($('#pass').val())
				}
				$.ajax({
					type:"post",
					url: conf.api + "/api/install/db",
					async: true,
					data: data
				}).then(function(res){
					if(res.code == 200) {
						$('#one').fadeOut(0);
						$('#two').fadeIn(300);
					} else {
						$('#er1').text(res.msg);
					}
				}, function(e) {
					$('#er1').text('本安装程序已损坏，请下载正版最新的包进行安装！')
					console.log(e)
				})
			}
		})
		// 系统安装
		$('#installSys').on('click', function(){
			$('#er2').html('');
			if(!$.trim($('#title').val())) {
				return $('#er2').text('请输入站点标题！')
			} else if(!$.trim($('#theme').val())) {
				return $('#er2').text('请选择网站主题！')
			} else if(!$.trim($('#email').val())) {
				return $('#er2').text('请输入管理员Email！')
			} else if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($.trim($('#email').val()))){
				return $('#er2').text('管理员Email格式不正确！')
			} else if(!$.trim($('#nickname').val())) {
				return $('#er2').text('请输入管理员昵称！')
			} else if(!$.trim($('#paw').val())) {
				return $('#er2').text('请输入管理员密码！')
			} else if($.trim($('#paw').val()).length < 6) {
				return $('#er2').text('管理员密码必须大于六位！')
			} else if($.trim($('#paw').val()) != $.trim($('#pw').val())) {
				$('#paw').val('');
				$('#pw').val('');
				return $('#er2').text('两次密码不一致！请重新输入！')
			} else {
				data = {
					title: $.trim($('#title').val()),
					theme: $.trim($('#theme').val()),
					email: $.trim($('#email').val()),
					nickname: $.trim($('#nickname').val()),
					password: $.trim($('#paw').val())
				}
				$.ajax({
					type:"post",
					url: conf.api + "/api/install",
					async: true,
					data: data
				}).then(function(res){
					if(res.code == 200) {
						$('#two').fadeOut(0);
						$('#three').fadeIn(300)
					} else {
						$('#er2').text(res.msg);
					}
				}, function(e) {
					$('#er2').text('本安装程序已损坏，请下载正版最新的包进行安装！')
					console.log(e)
				})
			}
		})
	}
})(this)

$(function(){
	install.init();
})


