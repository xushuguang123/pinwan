<template>
	<view>
		<view class="comments-content" v-for="item in commentsList" :key="item.comment_id">
			<comments-box :comments="item" @reply="reply"></comments-box>
		</view>
		<uni-load-more v-if="commentsList.length===0 || commentsList.length>5" iconType="snow" :status="loading"></uni-load-more>
		<popup ref="popup" @submit="submit"></popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentsList: [],
				article_id: '',
				page: 1,
				pageSize: 5,
				loading: 'loading'
			}
		},
		onLoad(query) {
			// console.log(query)
			this.article_id = query.id
			this.getComments()
		},
		onReachBottom() {
			if (this.loading === 'noMore') return
			this.page++
			// console.log(this.page)
			this.getComments()
		},
		methods: {
			reply(e) {
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if (e.comments.reply_id) {
					this.replyFormData.reply_id = e.comments.reply_id
				}
				// console.log(this.replyFormData);
				this.openComment()
			},
			// 发布评论
			submit(content){
				// console.log(content)
				this.setUpdateComment({content,...this.replyFormData})
			},
			// 关闭弹窗
			close(){
				this.$refs.popup.close()
			},
			// 打开评论发布窗口
			openComment(){
				this.$refs.popup.open()
			},
			//更新评论
			setUpdateComment(content){
				const formdata ={
					article_id:this.article_id,
					...content
				}
				// 数据重置，避免key重复，添加重复数据
				this.commentsList =  []
				this.page = 1 
				this.loading = 'loading'
				// console.log(formdata);
				uni.showLoading()
				this.$api.update_comment(formdata).then((res)=>{
					// console.log(res);
					uni.hideLoading()
					uni.showToast({
						title:'评论发布成功',
						icon:'none'
					})
					this.getComments()
					this.close()
					this.replyFormData = {}
					// 关闭窗口清空内容
					this.commentsValue = ''
				})
			},
			//获取评论内容
			getComments() {
				this.$api.get_comments({
					article_id: this.article_id,
					page: this.page,
					pageSize: this.pageSize
				}).then(res => {
					const {
						data
					} = res
					if (data.length === 0) {
						this.loading = 'noMore'
						return
					}
					//对象复制
					let oldFromData = JSON.parse(JSON.stringify(this.commentsList))
					oldFromData.push(...data)
					this.commentsList = oldFromData
					// console.log(this.commentsList)
				})
			}
		}
	}
</script>

<style lang="scss">
	.comments-content {
		padding: 0 15px;
	}
</style>
