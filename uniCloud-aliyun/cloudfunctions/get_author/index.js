'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const {
		user_id
	} = event
	let userinfo = await db.collection('user').doc(user_id).get()
	userinfo = userinfo.data[0]

	let lists = await db.collection('user')
		.aggregate()
		.addFields({
			is_likes: $.in(['$id', userinfo.author_likes_ids])
		})
		.match({
			is_likes: true
		})
		.end()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据获取成功',
		data: lists.data
	}
};
