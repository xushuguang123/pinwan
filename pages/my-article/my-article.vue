<template>
	<view>
		<uni-load-more v-if="articleList.length===0 && loading" iconType="snow" status="loading"></uni-load-more>
		<list-card v-for="item in articleList" :key="item.id" :item="item"></list-card>
		<view v-if="articleList.length<=0 && !loading" class="no-data">没有数据</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleList:[],
				loading:true
			}
		},
		onLoad() {
			this.getMyarticle()
		},
		methods: {
			getMyarticle(){
				this.$api.get_my_article().then(res=>{
					const {data}=res
					this.articleList=data;
					this.loading=false
				})
			}
		}
	}
</script>

<style lang="scss">
		.no-data {
			padding: 50px;
			font-size: 14px;
			color: #999;
			text-align: center;
		}
</style>
