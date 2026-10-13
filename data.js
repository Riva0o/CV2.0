// 公开内容集中在此编辑。unpublished 条目不会渲染。
export const site = {
  name: 'Protoaxis Studio', personalName: '', email: '', socialUrl: '', cvFile: '',
  location: '广东，中国', account: '125297791',
  intro: '我是一名数字设计师，也是 Protoaxis Studio 的创始人。我的实践涵盖三维视觉、空间与装置，以及品牌体验，探索数字形态、材质表达与实体制作之间的联系。',
  hero: { relief: '/media/hero/images/myth-relief-v1.png', image: null, video: null, model: { src: null, poster: null, alt: '', cameraOrbit: '30deg 75deg 105%', fieldOfView: '30deg', autoRotate: false } },
  about: ['我是一名数字设计师，也是 Protoaxis Studio 的创始人，工作与创作主要在广东广州展开。','我的实践从纺织品、时尚陈列与空间设计延伸至三维视觉、装置和数字内容，关注形态、材质与空间体验之间的关系。在 Protoaxis Studio，我开展视觉与体验设计，并结合三维建模和 3D 打印，探索数字创意在实体场景中的呈现。','我也通过 AI 壁纸与图像实验研究新的视觉表达，并在家居品牌的设计与运营实践中，参与视觉系统、数字内容和线上渠道的建设。','目前于香港岭南大学修读艺术、科技与商业硕士，进一步拓展艺术实践、技术应用与商业语境之间的联系。'],
  practices: [
    {date:'2023.07 — 至今', title:'Protoaxis Studio', role:'创始人 / 数字设计师', location:'广州', text:'视觉与体验设计、三维特效与时尚视觉；结合三维建模和 3D 打印，探索数字形态向实体装置及品牌场景的转化。'},
    {date:'2024.07 — 至今', title:'独立数字媒体实践', role:'内容设计 / 账号运营', location:'广州', text:'数字艺术与 AI 内容创作、视觉叙事及发布运营，通过持续的内容迭代研究个人视觉表达。'},
    {date:'2025.06 — 至今', title:'广州屿拓贸易有限公司', role:'运营与设计经理', location:'广州', text:'参与家居生活品牌创立与运营，建立品牌视觉系统，并参与独立官网及 TikTok、eBay、SHEIN 等渠道建设。'}
  ],
  experience: [
    {date:'2021.11 — 2023.07', title:'洋中里商业管理有限公司', role:'品牌空间设计师', location:'福州', text:'参与商业车库与精品民宿空间设计。'},
    {date:'2021.09 — 2021.11', title:'上海翰威品牌管理有限公司', role:'产品设计师', location:'上海', text:'品牌视觉形象升级及短视频宣传内容。'},
    {date:'2021.07 — 2021.09', title:'LOOKNOW', role:'', location:'上海', text:'参与主题橱窗设计，与 Victor Wang 合作推进快闪项目。', internalRole:'橱窗与快闪项目设计；正式岗位未确认'},
    {date:'2019.01 — 2021.07', title:'M Super Avenir', role:'设计师助理', location:'上海', text:'参与快闪活动、装置与宣传物料设计。', internalNote:'任职性质待确认'},
    {date:'2019.06 — 2019.07', title:'TONLION / BEYONG', role:'陈列部设计师（实习）', text:'参与 Desso 视觉识别与创意概念设计。', unpublished:true}
  ],
  education: [{date:'2026.09 — 至今', title:'岭南大学',role:'硕士在读',location:'香港',text:'',internalNote:'艺术、科技与商业硕士正式名称待证书核对'},{date:'2017.09 — 2021.07',title:'中国艺术学院',role:'服装与服饰设计 · 文学士',location:'中国·杭州',text:''}],
  awards: [
    {date:'2026.03',title:'第三届国际文化传承艺术大赛',role:'优秀奖',unpublished:true},
    {date:'2025.11',title:'“东方美学”艺术设计作品征集',role:'二等奖、三等奖',unpublished:true},
    {date:'2025.09',title:'新加坡 SGADC 艺术设计大赛',role:'银奖、铜奖',unpublished:true},
    {date:'2025.08',title:'BICC 英国国际创意大赛',role:'铜奖、荣誉提名奖',unpublished:true},
    {date:'2025.08',title:'国际艺术视觉协会大奖 ·《蜕》',role:'优秀奖',unpublished:true},
    {date:'2025.08',title:'国际建筑艺术协会大奖 ·《漂浮水母》',role:'提名奖',unpublished:true}
  ],
  skills: [['三维与空间','Blender · SketchUp · V-Ray · 3D 打印'],['图像与视觉','Photoshop · Illustrator · Procreate · Sketch'],['交互与创意技术','TouchDesigner · Arduino'],['AI 图像工作流','Midjourney · Krita AI · Recraft · Lovart']],
  unpublished: {languages:'粤语熟练程度待确认', metrics:'数字艺术：1,000+ 粉丝 / 5,000+ 获赞；AI 内容：约 5,000 粉丝 / 15,000 获赞，统计日期未确认',accountOwnership:'小红书账号归属待确认'}
};
const emptyModel = () => ({src:null,poster:null,alt:'',cameraOrbit:'30deg 75deg 105%',fieldOfView:'30deg',autoRotate:false});
export const projects = Array.from({length:4},(_,i)=>({id:`project-0${i+1}`,slug:`project-0${i+1}`,status:'placeholder',title:'项目待补充',year:null,category:[],role:[],summary:'此页为作品详情模板。项目背景、职责、媒介与署名将在真实内容补充后展示。',contribution:[],credits:[],awards:[],cover:null,gallery:[],model:emptyModel()}));
export const experiments = Array.from({length:2},(_,i)=>({id:`series-0${i+1}`,slug:`series-0${i+1}`,status:'placeholder',title:'实验系列待补充',year:null,category:[],role:[],summary:'此页为图像实验系列模板。真实素材补充后，将说明 AI 生成、筛选与后期处理的实际分工。',contribution:[],credits:[],awards:[],cover:null,gallery:[],model:emptyModel()}));
