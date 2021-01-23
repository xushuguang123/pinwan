'use strict';
const db=uniCloud.database()
//操作符
const $=db.command.aggregate
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		user_id
	}=event
	let userinfo=await db.collection('user').doc(user_id).get()
	userinfo=userinfo.data[0]
	const lists=await db.collection('article')
	.aggregate()
	//调加字段
	.addFields({
		is_like:$.in(['$_id',userinfo.article_likes_ids])
	})
	.project({
		content:0
	})
	.match({
		is_like:true
	})
	.end()
	//返回数据给客户端
	return {
		code:200,
		msg:'更新成功',
		data:lists.data
	}
};
