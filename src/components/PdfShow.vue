<template>
  <div>
    <pdf @progress="loadedRatio" v-for="i in numPages" :key="i" :src="src" :page="i" class="pdf"></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf';

export default {
  components: {
    pdf,
  },
  data() {
    return {
      src: undefined,
      numPages: undefined,
      loadedRatio: 0, // 加载进度
    };
  },
  methods: {
    // 禁用鼠标右击、F12 来禁止打印和打开调试工具
    prohibit() {
      document.oncontextmenu = function () {
        return false;
      };
      document.onkeydown = function (e) {
        if (
          e.ctrlKey &&
          (e.keyCode === 65 ||
            e.keyCode === 67 ||
            e.keyCode === 73 ||
            e.keyCode === 74 ||
            e.keyCode === 80 ||
            e.keyCode === 83 ||
            e.keyCode === 85 ||
            e.keyCode === 86 ||
            e.keyCode === 117)
        ) {
          return false;
        }
        if (e.keyCode === 18 || e.keyCode === 123) {
          return false;
        }
      };
    },
  },
  async mounted() {
    // this.src = pdf.createLoadingTask(
    //   `${window.location.origin}/static/test.pdf`,
    // );
    this.prohibit();
    this.src = pdf.createLoadingTask(`${window.location.origin}/${this.$route.query.url}`);
    // console.log(this.src, 'src');

    this.src.promise.then((pdf) => {
      this.numPages = pdf.numPages;
      console.log(this.numPages, '1');
    });
    console.log(this.numPages, '2');
  },
};
</script>
<style >
.pdf{
  width: 52%;
  left: 50%;
  box-shadow: 0px 5px 20px #999999;
  transform: translateX(-50%);
}

</style>