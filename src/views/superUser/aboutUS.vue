<template>
  <div>
    <h1>成都易腾创想智能科技有限公司</h1>
    <div>
      <ul>
        <li ><h2>公司介绍</h2></li>
        <li class="text"><span>成都易腾创想智能科技有限公司（简称：易腾创想）成立于2017年，是一家致力于智能软硬件系统设计、研发、集成交付服务和产教融合解决方案提供的科技公司。</span></li>
        <li class="text"><span>公司一直秉承健康、信任、专业、创新的经营理念，坚持以“产教融合协同育人”为导向，自研了面向教育行业的智能化教学管理系统、在线学习平台、物联网实验平台、
          网络安全实践平台；自研了面向招聘行业的智能招聘系统，自成立以来已经获得30余项软件著作权，2项专利技术，2020年获评为“高新技术企业”。</span></li>
        <li class="text"><span>依托公司产业背景与项目成果，公司与全国40余所高校建立了“产教融合协同育人”校企合作关系，根据产教融合的精神和要求为高校提供产教融合解决方案，
          为高校提供了包括学科建设、课程开发、实践教学、就业服务等多方面的支持，并与高校共同完成30多个教育部协同育人项目，5个省级教改项目。</span></li>
        <li class="text"><span>公司根据工程教育专业认证标准，构建了以“课程案例化、过程数据化、结果个性化”为核心要素的教育服务体系，旨在为高校提供人才培养与学
          科建设服务、为学员提供个性化学习服务、为企业提供精准招聘服务。</span></li>
      </ul>
      <div class="image">
        <img src="@/assets/img1.png" alt="" />
        <img src="@/assets/img2.png" alt="" />
        <img src="@/assets/img3.png" alt="" />
        <img src="@/assets/img4.png" alt="" />
      </div>
      <ul class="bottom">
        <li>
          <h4>公司联系方式</h4>
          <span>028-62539515</span>
        </li>
        <li>
          <h4>系统版本信息</h4>
          <span>v1.0</span>
        </li>
        <li>
          <h4>用户使用手册</h4>
          <a href="#">点击这里访问用户使用手册</a>
        </li>
      </ul>
      <ul>
        <li><h4>公众号二维码</h4></li>
        <li><img src="@/assets/qrcode.png" alt="" class="qrcode" /></li>
      </ul>    
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
h1 {
  font-size: 30px;
}
h2 {
  text-align: left;
}
.text{
  padding-top: 10px;
  font-size: 17px;
  color: #393939b5;
}
.text>span{
  text-indent: 2em;
}
.image {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 790px;
  left: 50%;
  transform: translateX(-50%);
}
.image > img {
  display: block;
  width: 350px;
  height: 233px;
  padding: 15px;
}
span {
  display: block;
  text-align: left !important;
}
.bottom {
  float: left;
  text-align: left;
}
.qrcode {
  width: 240px;
  height: 240px;
}
</style>