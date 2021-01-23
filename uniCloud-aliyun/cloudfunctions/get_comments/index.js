'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,
		article_id,
		pageSize=10,
		page=1
	}=event
	
	const list=await db.collection('article')
	.aggregate()
	.match({
		_id:article_id
	})
	//拆分指定的数组
	.unwind('$comments')
	.project({
		_id:false,
		comments:true
	})
	//重新定义根节点
	.replaceRoot({
		newRoot:'$comments'
	})
	.skip(pageSize*(page-1))
	.limit(pageSize)
	.end()
	//返回数据给客户端
		return {
			code: 200,
			msg: '数据请求成功',
			data: list.data,
		}
};
