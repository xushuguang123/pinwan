'use strict';
//获取数据库的应用
const db = uniCloud.database()
//聚合操作符
const $ = db.command.aggregate
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,
		article_id
	} = event
	//获取用户信息
	let user = await db.collection('user').doc(user_id).get()
	user = user.data[0]
	//
	let list = await db.collection('article')
		.aggregate()
		.addFields({
			//是否关注作者
			//获取$author.id,是否存在于user表中的user.author_likes_ids数组中
			is_author_like: $.in(['$author.id', user.author_likes_ids]),
			//是否收藏文章
			is_like: $.in(['$_id', user.article_likes_ids]),
			//是否点赞
			is_thumbs_up: $.in(['$_id', user.thumbs_up_article_ids])
		})
		//只返回传递进来的article_id的数据
		.match({
			_id: article_id
		})
		//操作哪些数据需要返回,哪些数据不需要返回
		.project({
			coments: 0
		})
		.end()
		
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data[0]
	}
};
