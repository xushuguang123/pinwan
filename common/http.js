import store from '../store/index.js'
	export default function $http(options) {
		const {
			url, //传入的云函数名称
			data //传入的返回的数据
		} = options
		const dataObj = {
			user_id: store.state.userinfo._id,
			...data
		}
		return new Promise((reslove, reject) => {
			uniCloud.callFunction({
				name: url,
				data: dataObj
			}).then((res) => {
				if (res.result.code === 200) {
					// .then
					reslove(res.result)
				} else {
					//.catch
					reject(res.result)
				}
			}).catch((err) => {
				reject(err)
			})
		})
	}
