(function(win) {
	win.install = {}
	var data = {};
	install.init = function() {
		$('#test').click(function(){
//			if($('#host').val() && $('#port').val() && $('#user').val() && $('#db').val() && $('#pass').val()) {
				$.ajax({
					type:"put",
					url:"/api/install/test-database",
					async:true,
					data: {db: $('#db').val(), host: $('#host').val(), pass: $('#pass').val(), user: $('#user').val(), port: $('#port').val()}
				}).then(function(r){
					console.log(r)
				}, function(e) {
					console.log(e)
				})
//			} else {
//				alert('请完善相关参数的设置再进行数据库连接测试')
//			}
		})
	}
})(this)

$(function(){
	install.init();
})


