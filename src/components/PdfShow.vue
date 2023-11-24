<template>
  <div>
    <pdf v-for="i in numPages" :key="i" :src="src" :page="i"></pdf>
  </div>
</template>

<script>
import pdf from 'vue-pdf';

// var loadingTask = pdf.createLoadingTask(
//   `${window.location.origin}/static/resume.pdf`,
// );

export default {
  components: {
    pdf,
  },
  data() {
    return {
      src: undefined,
      numPages: undefined,
    };
  },
  mounted() {
    // this.src = pdf.createLoadingTask(
    //   `${window.location.origin}/static/test.pdf`,
    // );
    this.src = pdf.createLoadingTask(
      `${window.location.origin}/${this.$route.query.url}`,
    );

    this.src.promise.then((pdf) => {
      this.numPages = pdf.numPages;
    });
  },
};
</script>
