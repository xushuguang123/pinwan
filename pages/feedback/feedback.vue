<template>
	<view>
		<view class="feedback-title">意见反馈:</view>
		<view class="feedback-conten">
			<textarea class="feedback-textarea" v-model="content" placeholder="请输入您要反馈的问题" />
			</view>
		<view class="feedback-title">反馈图片:</view>
		<view class="feedback-image-box">
			<view class="feedback-image-item" v-for="(item,index) in imageList" :key="index">
				<view class="close-icon" @click="delImage(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
			<view v-if="imageList.length<6" class="feedback-image-item" @click="addImage">
				<view class="image-box">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view>
		</view>
		<button type="default" class="feedback-btn" @click="submit" style="background-color: #f07373;">提交反馈</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
				imageList:[]
			}
		},
		methods: {
			delImage(index) {
				this.imageList.splice(index,1)
			},
			//选择,添加图片
			addImage(){
				// let _this=this
				const count=6 - this.imageList.length
				uni.chooseImage({
					// count 最多选择图片数量
					// this的指向问题
					// ① 重新声明this
					// ② 使用箭头函数
					count:count,
					success:(res) =>{
						const temfilepaths=res.tempFilePaths
						temfilepaths.forEach((item,index)=>{
							// 处理 H5 多选的状况
							if(index<count){
								this.imageList.push({
									url:item
								})
							}
						})
						// console.log(res)
					}
				})
			},
			async submit(){
				//因为每次上传图片只能上传一张
				let imagesPath=[]
				if(!this.content){
					uni.showToast({
						title:'请输入反馈内容!',
						icon:'none'
					})
					return
				}
				uni.showLoading()
				for(let i=0; i<this.imageList.length;i++){
					const filePath=this.imageList[i].url
					filePath=await this.uploadFiles(filePath)
					imagesPath.push(filePath)
				}
				console.log(imagesPath)
				this.updateFeedback({
					content:this.content,
					feedbackImages:imagesPath
					})
					
			},
			// 所以只能同步
			async uploadFiles(filePath){
				const result= await uniCloud.uploadFile({
					cloudPath:filePath
				})
				// console.log(result)
				return result.fileID
			},
			updateFeedback({content,feedbackImages}){
				this.$api.update_feedback({
					content,feedbackImages
				}).then(res=>{
					uni.hideLoading()
					uni.showToast({
						title:'反馈提交成功',
						icon:'none'
					})
					setTimeout(()=>{
						uni.switchTab({
							url:'/pages/tabbar/my/my'
						})
					},1000)
				}).catch(()=>{
					uni.hideLoading()
					uni.showToast({
						title:'反馈提交失败',
						icon:'none'
					})
				})
				}
		}
	}
</script>

<style lang="scss">
	.feedback-title{
		margin: 15px;
		font-size: 14px;
		margin-bottom: 0;
		color: #666;
	}
	.feedback-conten{
		margin: 15px;
		padding: 10px;
		box-sizing: border-box;
		border: 1px #eee solid;
		.feedback-textarea{
			font-size: 12px;
			width: 100%;
			height: 100px;
		}
	}
	.close-icon{
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 0;
		top: 0;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background-color: #ff5a5f;
		z-index: 2;
	}
	.feedback-image-box{
		display: flex;
		flex-wrap: wrap;
		padding: 10px;
		.feedback-image-item{
			width: 33.33%;
			position: relative;
			height: 0;
			padding-top: 33.33%;
			box-sizing: border-box;
			.image-box{
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				top: 5px;
				right: 5px;
				bottom: 5px;
				left: 5px;
				border: 1px solid #eee;
				border-radius: 5px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.feedback-btn{
		margin: 0 15px;
		background-color: $mk-base-color;
	}
</style>
