import defaultData from './data.js';
import { saveCourse } from '@/utils/api.js'
let data = JSON.parse(JSON.stringify(defaultData))

let adapter = {
    data,
    methods: {
        // 保存
        editCourseClick(e) {
            this.dialogVisible = true
            this.editCourse.title = e.name
            this.courseId = e.id
        },
        //保存保存
        submitForm(formName) {
            let data = {
                courseId: this.courseId,
                title: this.editCourse.title,
                selectStartDate: this.editCourse.selectStartDate,
                selectEndDate: this.editCourse.selectEndDate,
                maxTaker: this.editCourse.maxTaker,
                address: this.editCourse.address,
                startDate: this.editCourse.startDate,
                endDate: this.editCourse.endDate,
                status: this.editCourse.status
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    saveCourse(data).then(res => {
                        console.log(res);
                        this.dialogVisible = false
                        this.$message({
                            message: '授课成功',
                            type: 'success'
                        })
                    })
                } else {
                    this.$message({
                        message: '授课失败',
                        type: 'error'
                    })
                    return false;
                }
            });
        },
        // 跳转到章节详情页面
        toChapterDetails(e) {
            console.log(e);
            this.$router.push({
                path: '/courseDetails',
                name: 'courseDetails',
                query: {
                    courseId: e.id
                }
            })
        }
    },
}

export default adapter