<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<view :style="{height: statusBarHeight+'px'}"></view>
			<!-- 导航栏内容 -->
			<view class="navbar-content" :class="{search:isSearch}" :style="{height:navBarHeight+'px',width:windowWidth+'px'}"
			 @click.stop="open">
				<view v-if="isSearch" class="navbar-content__search-icons" @click="back">
					<uni-icons type="back" size="22" color="#fff"></uni-icons>
				</view>

				<view v-if="!isSearch" class="navbar-serach">
					<!-- 非搜索页显示 -->
					<view class="navbar-serach_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-serach_text">uni-app、vue</view>
				</view>
				<view v-else class="navbar-serach">
					<!-- 搜索页显示 -->
					<input class="navbar-search_text" type="text" placeholder="请输入您要搜索的内容" v-model="val" @input="inputChange" />
				</view>
			</view>
		</view>
		<view :style="{height: statusBarHeight+navBarHeight+'px'}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: [String, Number],
				default: ''
			},
			isSearch: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				statusBarHeight: 20,
				navBarHeight: 40,
				windowWidth: 375,
				val: ''
			}
		},
		watch: {
			//监听点击事件openHistroy value值的变化
			value(newVal) {
				this.val = newVal
				console.log("zai", this.val)
			}

		},
		methods: {
			//点击返回首页
			back(){
				uni.switchTab({
					url:'/pages/tabbar/index/index'
				})
			},
			open() {
				if (this.isSearch) return
				uni.navigateTo({
					url: '/pages/home-search/home-search'
				})
			},
			inputChange(e) {
				console.log(e.detail)
				const {
					value
				} = e.detail
				this.$emit('input', value)
			}
		},
		created() {
			//获取手机系统信息
			const info = uni.getSystemInfoSync()
			// 获取手机系统的状态栏高且设置状态栏高度 
			this.statusBarHeight = info.statusBarHeight
			// console.log(info);  
			//h5 app mp-Alipay  
			//#ifndef H5 || APP-PLUS || MP-ALIPAY
			//获取胶囊的位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			// console.log(menuButtonInfo);
			//(胶囊底部高度-状态栏的高度)+(胶囊顶部高度-状态栏内高度)=导航栏的高度
			this.navBarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight)
			this.windowWidth = menuButtonInfo.left
			//#endif
			// console.log(navBarHeight)
		}
	}
</script>

<style lang="scss">
	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: $mk-base-color;

			.navbar-content {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 15px;
				box-sizing: border-box;

				.navbar-serach {
					display: flex;
					align-items: center;
					width: 100%;
					height: 30px;
					border-radius: 30px;
					padding: 0 10px;
					background-color: #fff;

					.navbar-serach_icon {
						margin-right: 10px;
					}

					.navbar-serach_text {
						width: 100%;
						font-size: 14px;
						color: #999;
					}
				}

				&.search {
					padding-left: 0;

					.navbar-content__search-icons {
						margin-left: 10px;
						margin-right: 10px;
					}

					.navbar-serach {
						border-radius: 5px;
					}
				}
			}

		}
	}
</style>
