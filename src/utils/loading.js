// 当数据未完全加载出来时，显示加载中
export const loading = {
  data() {
    return {
    };
  },
  methods: {
    showLoading() {
      this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
  },
}