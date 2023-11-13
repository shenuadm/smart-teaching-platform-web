<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 200px; overflow-y: hidden"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>
<script>
import Vue from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default Vue.extend({
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: {
        placeholder: "请输入内容",
        MENU_CONF: {
          uploadImage: {
            // 后端上传地址，必填
            server: "/dev-api/common/upload",
            timeout: 5 * 1000, // 5s 超时时间
            fieldName: "custom-fileName",
            //选择文件时的类型限制，默认为['image/*'] 如不想限制，则设置为 []
            allowedFileTypes: ["image/*"],
            metaWithUrl: true, // 参数拼接到 url 上
            maxFileSize: 1000 * 1024 * 1024, //1g //设置大点 不然图片过大会报错
            base64LimitSize: 1000000 * 1024, // 1g 以下插入 base64
          },
        },
      },
      mode: "default", // or 'simple'
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    // 获取html内容
    getEditorHtml() {
      let editor = this.editor;
      if (editor != null) {
        return editor.getHtml();
      }
    },
    // 获取编辑器文本内容
    getEditorText() {
      let editor = this.editor;
      if (editor != null) {
        return editor.getText();
      }
    },
    //填充编辑器html内容
    setEditorHtml(html) {
      let editor = this.editor;
      if (editor != null) {
        editor.setHtml(html);
      }
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    setTimeout(() => {
      this.html = "";
    }, 1500);
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
});
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>