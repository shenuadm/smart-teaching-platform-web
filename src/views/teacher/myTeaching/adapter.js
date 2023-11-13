import defaultData from './data.js';
let data = JSON.parse(JSON.stringify(defaultData))

let adapter = {
    data,
    methods: {
        // 修改
        editCourseClick() {
            this.dialogVisible = true
        },
        //保存修改
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
        // 重置表单
        resetFrom() {
            
        }
    },
}

export default adapter