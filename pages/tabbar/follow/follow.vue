<template>
	<view class="follow">
		<!-- 导航切换 -->
		<view class="follow-tab">
			<view class="follow-tab__box">
				<view class="follow-tab__item" :class="{active:activeIndex===0}" @click="tab(0)">文章</view>
				<view class="follow-tab__item" :class="{active:activeIndex===1}" @click="tab(1)">作者</view>
			</view>
		</view>
		<view class="follow-list">
			<swiper class="follow-list__swiper" :current="activeIndex" @change="change">
				<swiper-item>
					<list-scroll>
						<uni-load-more v-if="list.length===0 && !articleShow " status="loading" iconType="snow"></uni-load-more>
						<!-- 
						定义属性types="follow"  判断uni.$emit监听的页面
						-->
						<list-card types="follow" v-for="item in list" :key="item._id" :item="item"></list-card>
						<view v-if="articleShow" class="no-data">没有数据</view>
					</list-scroll>
				</swiper-item>
				<swiper-item>
					<list-scroll>
						<list-author v-for="item in authorList" :key="item.id" :item="item"></list-author>
					</list-scroll>
				</swiper-item>
			</swiper>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				list: [],
				authorList:[],
				articleShow: false
			}
		},
		onLoad() {
			//自定义事件,$on只能在打开的页面触发
			uni.$on('update_article',(e)=>{
				this.getFollow()
			})
			uni.$on('update_author',()=>{
				this.getAuthor()
			})
			this.getFollow()
			this.getAuthor()
		},
		methods: {
			change(e){
				this.activeIndex=e.detail.current
			},
			tab(index) {
				// console.log(index)
				this.activeIndex = index
			},
			// 获取关注页面  文章收藏
			getFollow() {
				this.$api.get_follow().then(res => {
					// console.log(res)
					const {
						data
					} = res
					this.list = data
					this.articleShow = this.list.length === 0 ? true : false
				})
			},
			// 获取关注页面  作者
			getAuthor(){
				this.$api.get_author().then(res=>{
					const {data}=res
					this.authorList=data
					// console.log(data)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.follow {
		display: flex;
		height: 100%;
		flex-direction: column;
		flex: 1;
		// border: 1px solid #007AFF;
		box-sizing: border-box;

		.follow-tab {
			height: 30px;
			padding: 10px 20px;
			border-bottom: 1px solid #F5F5F5;

			.follow-tab__box {
				display: flex;
				width: 100%;
				height: 100%;
				border-radius: 5px;
				border: 1px solid $mk-base-color;

				.follow-tab__item {
					display: flex;
					justify-content: center;
					align-items: center;
					color: #666;
					font-size: 14px;
					width: 100%;

					&:first-child {
						border-right: 1px solid $mk-base-color;
					}

					&.active {
						color: $mk-base-color;
					}
				}
			}
		}

		.follow-list {
			flex: 1;
			// border: 1px solid red;

			.follow-list__swiper {
				height: 100%;

				.swiper-item {
					height: 100%;
				}
			}
		}

		.no-data {
			padding: 50px;
			font-size: 14px;
			color: #999;
			text-align: center;
		}
	}
</style>
