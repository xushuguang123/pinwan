'use strict';
const db=uniCloud.database()
const dbCmd=db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const{
		user_id,
		article_id
	}=event
	// console.log('event : ', event)
	//返回数据给客户端
	
	const userinfo=await db.collection('user').doc(user_id).get()
	const article_likes_ids=userinfo.data[0].article_likes_ids
	let daCmdFuns=null
	if(article_likes_ids.includes(article_id)){
		daCmdFuns=dbCmd.pull(article_id)
	}else{
		daCmdFuns=dbCmd.addToSet(article_id)
	}
	await db.collection('user').doc(user_id).update({
		article_likes_ids:daCmdFuns
	})
	return {
		code: 200,
		msg: '数据返回成功',
		data: userinfo.data[0]
	}
};