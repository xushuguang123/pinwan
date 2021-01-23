<template>
	<view>
		<view class="label">
			<view class="label-box">
				<view class="label-header">
					<view class="label-title">我的标签</view>
					<view class="label-edit" @click="editLabel">{{is_edit?"完成":"编辑"}}</view>
				</view>
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view v-if="!loading" class="label-content">
					<view class="label-content__item" v-for="(item,index) in labelList" :key="item._id">
						{{item.name}}
						<uni-icons class="icons-close" type="clear" size="18" color="red" v-if="is_edit" @click="del(index)"></uni-icons>
					</view>
					<view v-if="labelList.length===0 && !loading" class="no-data">
						当前没有数据
					</view>
				</view>
			</view>
			
			<view class="label-box">
				<view class="label-header">
					<view class="label-title">标签推荐</view>
				</view>
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view v-if="!loading" class="label-content">
					<view class="label-content__item" v-for="(item,index) in list" :key="item._id" @click="add(index)">
						{{item.name}}
					</view>
					<view v-if="list.length===0 && !loading" class="no-data">
						当前没有数据
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_edit: false,
				labelList: [],
				list: [],
				loading: true
			}
		},
		onLoad() {
			//自定义事件
			//this.$emit 通知父组件 uni.$emit 通知全局
			this.getLabel()
		},
		methods: {
			//添加标签
			add(index) {
				//只有在编辑的状态中才能操作
				if (!this.is_edit) return
				//添加到labelList中
				this.labelList.push(this.list[index])
				this.list.splice(index, 1)
			},
			//删除标签
			del(index) {
				//添加到list中
				this.list.push(this.labelList[index])
				this.labelList.splice(index, 1)
			},
			//编辑与完成的显示
			editLabel() {
				if (this.is_edit) {
					this.is_edit = false
					// console.log(this.labelList)
					this.setUpdateLabel(this.labelList)
				} else {
					this.is_edit = true
				}
			},

			//调用云函数,更改云数据
			setUpdateLabel(label) {
				let newArrIds = []
				//获取每个label._id 
				label.forEach(item => {
					newArrIds.push(item._id)
				})
				uni.showLoading()
				// console.log("更改传入的数据:",newArrIds)
				this.$api.update_label({
					label: newArrIds
				}).then((res) => {
					uni.hideLoading()
					uni.showToast({
						title: '更新成功',
						icon: 'none'
					})
					//更新数据后,发送事件到首页
					uni.$emit('labelChange')
					// console.log(res)
				})
			},

			//调用云函数,获取数据
			getLabel() {
				this.loading = true
				this.$api.get_label({
					type:"all"
				}
				).then((res) => {
					console.log(res)
					const {
						data
					} = res
					//data.filter(item=>item.current) 表示只返回 item.current为true 的所有字段
					this.labelList = data.filter(item => item.current)
					// console.log("current为true:", this.labelList)
					//data.filter(item=>item.current) 表示只返回 item.current为false 的所有字段
					this.list = data.filter(item => !item.current)
					// console.log("current为false:", this.list)
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.label {
		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;

				.label-edit {
					color: #30b33a;
					font-weight: bold;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content__item {
					position: relative;
					padding: 2px 5px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px #666 solid;
					font-size: 14px;
					color: #666;

					.icons-close {
						position: absolute;
						right: -8px;
						top: -8px;
						background-color: #fff;
						border-radius: 50%;
					}
				}
			}
		}
	}

	.no-data {
		width: 100%;
		text-align: center;
		padding: 50px 0;
		color: #999;
		font-size: 14px;
	}
</style>
