'use strict';
//获取数据库的引用
const db = uniCloud.database()
//获取聚合的操作符
const $ = db.command.aggregate

exports.main = async (event, context) => {
	//event为客户端上传的参数
	//获取label表的数据
	const {
		user_id,
		type
	} = event
	let matchObj = {}
	//type 的默认值是 all
	if (type !== "all") {
		matchObj = {
			current: true
		}
	}

	//获取用户表的数据
	let userinfo = await db.collection('user').doc(user_id).get()
	//获取用户表的对象
	userinfo = userinfo.data[0]

	let label = await db.collection('label')
		.aggregate()
		.addFields({
			//表示当前记录是否存在用户表
			//$.ifNull([userinfo.label_ids, []]) 如果当userinfo.label_ids 不存在时 返回一个数组
			current: $.in(['$_id', $.ifNull([userinfo.label_ids, []])])
		})
		//返回为 current:true  的数组
		.match(matchObj)
		.end()

	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: label.data
	}
};
