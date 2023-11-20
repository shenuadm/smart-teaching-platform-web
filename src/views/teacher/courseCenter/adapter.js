import defaultData from './data.js';
import { saveCourse } from '@/utils/api.js'
let data = JSON.parse(JSON.stringify(defaultData))

let adapter = {
    data,
    methods: {
        // 保存
        editCourseClick(e) {
            this.dialogVisible = true
            this.editCourse.name = e.name
            // console.log(e);
        },
        //保存保存
        submitForm(formName) {
            let data = this.editCourse
            console.log(data);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    saveCourse(data).then(res => {
                        // console.log(res);
                    })
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