<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.$api.get_user({
				user_id: "5fd4841c7877e5000182a4a2"
			}).then(res => {
				const {
					data
				} = res
				// console.log(data)
				this.$store.dispatch('set_userinfo', data)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import 'components/gaoyia-parse/parse.css';
</style>
