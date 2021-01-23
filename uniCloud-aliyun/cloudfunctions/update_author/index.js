'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,
		author_id
	} = event
	const user = await db.collection('user').doc(user_id).get()
	const author_likes_ids = user.data[0].author_likes_ids
	let author_ids
	//includes表示数组中是否包含
	if (author_likes_ids.includes(author_id)) {
		author_ids = dbCmd.pull(author_id)
	} else {
		author_ids = dbCmd.addToSet(author_id)
	}
	await db.collection('user').doc(user_id).update({
		author_likes_ids: author_ids
	})
	//返回数据给客户端
	return {
		code: 200,
		msg: '更新成功'
	}
};
