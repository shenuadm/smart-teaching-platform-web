import defaultData from './data.js';
let data = JSON.parse(JSON.stringify(defaultData))

let adapter = {
    data,
    methods: {
        // 保存
        editCourseClick() {
            this.dialogVisible = true
        },
        //保存保存
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 跳转到章节详情页面
        toChapterDetails() {
            console.log(1);
            this.$router.push('/chapterDetails');
        }
    },
}

export default adapter