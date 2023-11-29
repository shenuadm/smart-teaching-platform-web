// 当数据未完全加载出来时，显示加载中
export const loadingMixin = {
  data() {
    return {
      loadingGlobal: true,
    };
  },
  methods: {
    async showLoading(request) {
      const loading = {
        // lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      };
      const res = await request();
      loading.close();
      return res;
    },
  },
};
