import type { Question } from "./types";

export const questions: Question[] = [
  // ========== 维度一：战略 ==========
  { id: "strategy_1", dimension: "strategy", dimensionLabel: "战略",
    text: "你们有明确的 3-5 年战略目标吗？", options: [
      { value: 0, label: "没有，走一步看一步" },
      { value: 1, label: "有大致方向，但没形成书面目标和定期复盘机制" },
      { value: 2, label: "有书面战略目标，定期复盘，全员知晓并与之对齐" }] },
  { id: "strategy_2", dimension: "strategy", dimensionLabel: "战略",
    text: "战略是怎么制定出来的？", options: [
      { value: 0, label: "创始人一个人拍板，缺乏系统流程" },
      { value: 1, label: "核心高管参与讨论，但方法论不够系统" },
      { value: 2, label: "有系统化战略流程 + 外部视角 + 数据驱动决策" }] },
  { id: "strategy_3", dimension: "strategy", dimensionLabel: "战略",
    text: `对于"做什么"和"不做什么"，你们有明确的取舍吗？`, options: [
      { value: 0, label: "没有，什么机会都想试试，经常跑偏" },
      { value: 1, label: "有大致方向但经不住诱惑，偶尔会偏离主业" },
      { value: 2, label: "有清晰的战略边界和取舍原则，团队能据此做日常决策" }] },
  { id: "strategy_4", dimension: "strategy", dimensionLabel: "战略",
    text: "你们的区域扩张策略有明确逻辑吗？", options: [
      { value: 0, label: "哪有加盟商找上门就开哪，没有规划" },
      { value: 1, label: "大概圈了区域范围，但缺乏量化选址标准" },
      { value: 2, label: "有量化选址模型 + 按优先级进入 + 历史数据验证" }] },
  { id: "strategy_5", dimension: "strategy", dimensionLabel: "战略",
    text: "在目标客户心中，你们跟竞品最大的区别是什么？", options: [
      { value: 0, label: "不太清楚，感觉都差不多" },
      { value: 1, label: "有定位描述，但消费者感知不强" },
      { value: 2, label: "差异化清晰，消费者能感受到，员工能讲清楚" }] },
  { id: "strategy_6", dimension: "strategy", dimensionLabel: "战略",
    text: "战略目标如何分解到执行层面？", options: [
      { value: 0, label: "老板喊个口号，下面自己理解，没有追踪" },
      { value: 1, label: "目标拆到部门/年度，但跟一线关联不紧密" },
      { value: 2, label: "战略→部门→个人层层对齐，有数字看板追踪" }] },
  { id: "strategy_7", dimension: "strategy", dimensionLabel: "战略",
    text: "当行业出现重大变化时，你们如何应对？", options: [
      { value: 0, label: "被动反应，通常落后半年以上" },
      { value: 1, label: "有关注机制，但反应不够快" },
      { value: 2, label: "有情报收集 + 定期复盘 + 能快速调整方向" }] },
  { id: "strategy_8", dimension: "strategy", dimensionLabel: "战略",
    text: "一线员工理解和执行战略的程度？", options: [
      { value: 0, label: `不沟通，员工觉得"战略是老板的事"` },
      { value: 1, label: "年会/大会传达，但员工记不住、跟日常工作无关" },
      { value: 2, label: "战略纳入考核，每个人知道自己的工作跟战略的关联" }] },

  // ========== 维度二：商业模式 ==========
  { id: "model_1", dimension: "model", dimensionLabel: "商业模式",
    text: "你们的单店盈利模型是否清晰？", options: [
      { value: 0, label: "没有精细化算过，大概感觉是赚钱的" },
      { value: 1, label: "知道大概毛利和盈亏平衡点，但模型不够标准化" },
      { value: 2, label: "单店模型标准化（收入/成本/回本周期），新店可预测" }] },
  { id: "model_2", dimension: "model", dimensionLabel: "商业模式",
    text: "如果做加盟，加盟商的盈利情况你清楚吗？", options: [
      { value: 0, label: "不清楚，收了加盟费就完事了" },
      { value: 1, label: "大概知道，但没系统统计和追踪" },
      { value: 2, label: "有加盟商盈利监控，亏损店有帮扶机制" }] },
  { id: "model_3", dimension: "model", dimensionLabel: "商业模式",
    text: "你们当前的收入结构是怎样的？", options: [
      { value: 0, label: "只有门店销售收入，很单一" },
      { value: 1, label: "门店 + 加盟费/管理费，两到三个收入来源" },
      { value: 2, label: "多元化收入（门店+加盟+供应链+品牌授权等），经常性收入有占比" }] },
  { id: "model_4", dimension: "model", dimensionLabel: "商业模式",
    text: "你们的扩张模式是怎么选择的？", options: [
      { value: 0, label: "没想清楚，有人找就放加盟" },
      { value: 1, label: "有直营和加盟的区分，但边界不够清晰" },
      { value: 2, label: "模式矩阵清晰（直营做标杆、加盟做规模），各有运营标准" }] },
  { id: "model_5", dimension: "model", dimensionLabel: "商业模式",
    text: "你们的定价策略是如何制定的？", options: [
      { value: 0, label: "看看同行卖多少钱，大概定一个" },
      { value: 1, label: "成本 + 预期利润，参考竞品" },
      { value: 2, label: "基于价值定价 + 分层定价体系 + 定期调价" }] },
  { id: "model_6", dimension: "model", dimensionLabel: "商业模式",
    text: "门店投资回报周期多久？投资者满意吗？", options: [
      { value: 0, label: "没算过或回本遥遥无期" },
      { value: 1, label: "回本周期尚可但不稳定，投资者基本接受" },
      { value: 2, label: "回本周期稳定且优于行业平均，投资回报可预测" }] },
  { id: "model_7", dimension: "model", dimensionLabel: "商业模式",
    text: "你们有定价权吗？涨价后消费者会走吗？", options: [
      { value: 0, label: "完全不敢涨价，涨价客户就跑了" },
      { value: 1, label: "有节奏微调，消费者基本接受" },
      { value: 2, label: "有品牌溢价能力，价格高于同行但消费者认可" }] },
  { id: "model_8", dimension: "model", dimensionLabel: "商业模式",
    text: "如果竞争对手明天在你隔壁开一家同品类店，你能活下来吗？", options: [
      { value: 0, label: "大概率撑不住，没有什么壁垒" },
      { value: 1, label: "有老客户基础，短期扛得住，长期不好说" },
      { value: 2, label: "我们有独特的供应链/产品/品牌优势，伤不到根基" }] },

  // ========== 维度三：运营标准化 ==========
  { id: "operation_1", dimension: "operation", dimensionLabel: "运营标准化",
    text: "你们有书面的运营标准手册（SOP）吗？", options: [
      { value: 0, label: "没有，全靠师傅带徒弟、店长凭经验" },
      { value: 1, label: "有手册和标准，但不够系统或门店执行不一致" },
      { value: 2, label: "手册完整 + 定期更新 + 督导检查执行 + 关键节点数字化" }] },
  { id: "operation_2", dimension: "operation", dimensionLabel: "运营标准化",
    text: "同一道菜/同一个服务，在不同门店的体验一致吗？", options: [
      { value: 0, label: "全看当班师傅/店员心情，差异很大" },
      { value: 1, label: "核心产品大致一致，但边缘产品和细节差距明显" },
      { value: 2, label: `全品类一致性高，消费者感知"在哪都一样"` }] },
  { id: "operation_3", dimension: "operation", dimensionLabel: "运营标准化",
    text: "新开一家店，从选址到开业，标准化程度如何？", options: [
      { value: 0, label: "每次都是全新的项目，没有复用流程" },
      { value: 1, label: "有大致流程和 checklist，但每店执行有偏差" },
      { value: 2, label: "标准化开店手册 + 模块化 + 固定周期 + 开店成功率高" }] },
  { id: "operation_4", dimension: "operation", dimensionLabel: "运营标准化",
    text: "门店日常管理（排班、盘点、订货、卫生）有标准化流程吗？", options: [
      { value: 0, label: "店长自己想办法，没有统一标准" },
      { value: 1, label: "有基本制度，但执行参差不齐" },
      { value: 2, label: "标准化制度 + 流程数字化 + 异常自动上报" }] },
  { id: "operation_5", dimension: "operation", dimensionLabel: "运营标准化",
    text: "菜品/产品结构是否稳定？变动有依据吗？", options: [
      { value: 0, label: "老板拍脑袋，想换就换" },
      { value: 1, label: "有上新流程，但淘汰缺乏数据标准" },
      { value: 2, label: "有产品生命周期管理，数据驱动定期优化" }] },
  { id: "operation_6", dimension: "operation", dimensionLabel: "运营标准化",
    text: "门店的装修/VI/空间体验是统一的吗？", options: [
      { value: 0, label: "每家店都不一样，没有统一标准" },
      { value: 1, label: "有 VI 手册，但实际落地差距大" },
      { value: 2, label: "完整 SI 体系 + 模块化设计，门店空间可快速复制" }] },
  { id: "operation_7", dimension: "operation", dimensionLabel: "运营标准化",
    text: `你的门店能否在"店长离职"后正常运转？`, options: [
      { value: 0, label: "店长走了就乱，新人至少需要 1-2 个月" },
      { value: 1, label: "会乱一阵，大概 2-3 周能稳住" },
      { value: 2, label: "有标准化 + 副手储备，系统 > 个人，1 周内平稳交接" }] },
  { id: "operation_8", dimension: "operation", dimensionLabel: "运营标准化",
    text: "你们如何持续优化门店运营标准？", options: [
      { value: 0, label: "不优化或出了大问题才改" },
      { value: 1, label: "定期收集反馈，但不系统、迭代慢" },
      { value: 2, label: "数据驱动 + 最佳实践萃取 + 定期迭代推送到所有门店" }] },

  // ========== 维度四：组织人才 ==========
  { id: "organization_1", dimension: "organization", dimensionLabel: "组织人才",
    text: "你们的组织架构能支撑下一步扩张吗？", options: [
      { value: 0, label: "没有清晰架构，人多了就加，常常混乱" },
      { value: 1, label: "有基本架构但清晰度不够，扩张时需要大调整" },
      { value: 2, label: "架构可伸缩，扩张时岗位和权责提前定义好" }] },
  { id: "organization_2", dimension: "organization", dimensionLabel: "组织人才",
    text: "核心高管团队稳定吗？能力互补吗？", options: [
      { value: 0, label: "就老板一个人说了算，或团队流动大" },
      { value: 1, label: "核心 2-3 人稳定，但覆盖不全（缺某些关键职能负责人）" },
      { value: 2, label: "核心团队稳定且能力互补，有接班人计划" }] },
  { id: "organization_3", dimension: "organization", dimensionLabel: "组织人才",
    text: "店长是怎么来的？供给充足吗？", options: [
      { value: 0, label: "缺了就招，找不到就老板自己顶" },
      { value: 1, label: "内部提拔 + 外部招聘混合，但没有系统培养体系" },
      { value: 2, label: "有店长培养体系，开了新店不缺店长" }] },
  { id: "organization_4", dimension: "organization", dimensionLabel: "组织人才",
    text: "员工的离职率怎么样？你清楚吗？", options: [
      { value: 0, label: "不知道具体数据，或明显比同行高" },
      { value: 1, label: "有统计，在行业平均水平上下" },
      { value: 2, label: "离职率低于行业平均，关键岗位流失少" }] },
  { id: "organization_5", dimension: "organization", dimensionLabel: "组织人才",
    text: "绩效考核体系是怎样的？", options: [
      { value: 0, label: "没有考核或全凭老板感觉/印象" },
      { value: 1, label: "有 KPI 体系，但跟战略关联不够" },
      { value: 2, label: "KPI/OKR 与战略对齐，结果与激励挂钩，公平透明" }] },
  { id: "organization_6", dimension: "organization", dimensionLabel: "组织人才",
    text: "员工觉得在这里有职业发展空间吗？", options: [
      { value: 0, label: "几乎没有，干多少年都一样" },
      { value: 1, label: "有晋升通道但不够清晰透明" },
      { value: 2, label: "有清晰职级体系 + 双通道发展 + 内部流动机制" }] },
  { id: "organization_7", dimension: "organization", dimensionLabel: "组织人才",
    text: "如果明天要开 50 家新店，管理人员够用吗？", options: [
      { value: 0, label: "完全不够，现在的人都管不过来" },
      { value: 1, label: "勉强能凑，但质量堪忧" },
      { value: 2, label: "有储备干部池，管理人才供给不拖后腿" }] },
  { id: "organization_8", dimension: "organization", dimensionLabel: "组织人才",
    text: "创始人的精力分配是怎样的？", options: [
      { value: 0, label: "事必躬亲，所有事都要管" },
      { value: 1, label: "日常管理部分授权，但重大决策仍需创始人" },
      { value: 2, label: `创始人聚焦战略和人才，日常经营由团队负责，可"离场"运转` }] },

  // ========== 维度五：供应链 ==========
  { id: "supply_chain_1", dimension: "supply_chain", dimensionLabel: "供应链",
    text: "你们的采购方式是怎样的？", options: [
      { value: 0, label: "各店自己买，没有集中采购" },
      { value: 1, label: "核心原料集中采购，非核心门店自采" },
      { value: 2, label: "全品类集中采购 + 战略供应商体系 + 成本有优势" }] },
  { id: "supply_chain_2", dimension: "supply_chain", dimensionLabel: "供应链",
    text: "食材/货品的质量如何保证？", options: [
      { value: 0, label: "靠供应商自觉，或抽检也不严格" },
      { value: 1, label: "有验收标准和质检流程，但执行不够到位" },
      { value: 2, label: "全链路品控（产地→仓储→配送→门店），可追溯+可追责" }] },
  { id: "supply_chain_3", dimension: "supply_chain", dimensionLabel: "供应链",
    text: "你们的仓储和配送体系是怎样的？", options: [
      { value: 0, label: "没有仓库，供应商直送门店" },
      { value: 1, label: "有中心仓覆盖主要区域，但管理水平一般" },
      { value: 2, label: "多级仓储 + 配送时效和成本可控 + 门店库存联动" }] },
  { id: "supply_chain_4", dimension: "supply_chain", dimensionLabel: "供应链",
    text: "门店断货/积压的情况多吗？", options: [
      { value: 0, label: "经常断货，也经常积压报废" },
      { value: 1, label: "有订货标准，但预测不准，偶尔断货或积压" },
      { value: 2, label: "有补货模型或智能补货，断货率和损耗率低" }] },
  { id: "supply_chain_5", dimension: "supply_chain", dimensionLabel: "供应链",
    text: "供应链成本在总成本中的占比，你有优势吗？", options: [
      { value: 0, label: "不知道，或比同行高" },
      { value: 1, label: "跟同行差不多" },
      { value: 2, label: "有明显的成本优势，且优势在扩大" }] },
  { id: "supply_chain_6", dimension: "supply_chain", dimensionLabel: "供应链",
    text: `核心原料/产品有被供应商"卡脖子"的风险吗？`, options: [
      { value: 0, label: "依赖单一供应商，没有备选" },
      { value: 1, label: "有两家以上供应商可以切换" },
      { value: 2, label: "供应商竞争充分 + 战略储备或后向一体化，供应安全有保障" }] },
  { id: "supply_chain_7", dimension: "supply_chain", dimensionLabel: "供应链",
    text: "进入一个新城市，供应链能跟得上吗？", options: [
      { value: 0, label: "供应链是最大障碍，难以进入新区域" },
      { value: 1, label: "能覆盖，但成本比老区域高、周期长" },
      { value: 2, label: "供应链是扩张的加速器，走到哪跟到哪" }] },
  { id: "supply_chain_8", dimension: "supply_chain", dimensionLabel: "供应链",
    text: "供应链的数字化程度如何？", options: [
      { value: 0, label: "全靠电话、微信、Excel" },
      { value: 1, label: "有基础进销存系统，但数据没打通" },
      { value: 2, label: "供应链全链路数字化，数据实时可视" }] },

  // ========== 维度六：培训体系 ==========
  { id: "training_1", dimension: "training", dimensionLabel: "培训体系",
    text: "新店员从入职到独立上岗，需要多长时间？", options: [
      { value: 0, label: "3-4 周或更长，基本靠师傅带" },
      { value: 1, label: "2-3 周，有一些培训但不系统" },
      { value: 2, label: "1-2 周，有标准化培训体系" }] },
  { id: "training_2", dimension: "training", dimensionLabel: "培训体系",
    text: "你们有专门的培训部门或培训负责人吗？", options: [
      { value: 0, label: "没有，谁有空谁带一下" },
      { value: 1, label: "有兼职或一个专职人员，但覆盖不够" },
      { value: 2, label: "有独立的培训部门或企业培训中心" }] },
  { id: "training_3", dimension: "training", dimensionLabel: "培训体系",
    text: "培训内容有书面教材吗？系统性如何？", options: [
      { value: 0, label: "口头传授，缺乏书面材料" },
      { value: 1, label: "有关键岗位培训材料，但不够系统" },
      { value: 2, label: "全岗位标准化课件 + 考核题库 + 定期更新" }] },
  { id: "training_4", dimension: "training", dimensionLabel: "培训体系",
    text: "怎么确认学员真的学会了？", options: [
      { value: 0, label: "不考核，师傅觉得行就上岗" },
      { value: 1, label: "有理论考试，过了就上岗" },
      { value: 2, label: "理论+实操考核 + 带教期认证上岗 + 回炉培训" }] },
  { id: "training_5", dimension: "training", dimensionLabel: "培训体系",
    text: "店长有没有系统的管理培训？", options: [
      { value: 0, label: "没有，升上去了自己摸索" },
      { value: 1, label: "有培训但不持续，不成体系" },
      { value: 2, label: "有完整的店长培养体系（储备→新任→成熟→资深）" }] },
  { id: "training_6", dimension: "training", dimensionLabel: "培训体系",
    text: "加盟商及其团队怎么培训？", options: [
      { value: 0, label: "收了钱就完事，培训走过场" },
      { value: 1, label: "开业前集中培训 + 开业驻店带教" },
      { value: 2, label: "系统培训 + 持续赋能 + 定期复训，与直营标准一致" }] },
  { id: "training_7", dimension: "training", dimensionLabel: "培训体系",
    text: "培训的效果你能量化吗？", options: [
      { value: 0, label: "从不衡量，培训就是走形式" },
      { value: 1, label: "有满意度调查，但没跟业绩/品质挂钩" },
      { value: 2, label: "培训效果与门店业绩/品质评分关联，ROI 可衡量" }] },
  { id: "training_8", dimension: "training", dimensionLabel: "培训体系",
    text: "如果突然要开 50 家新店，培训体系能支撑吗？", options: [
      { value: 0, label: "完全撑不住，培训是最大瓶颈" },
      { value: 1, label: "勉强能顶，但培训质量会下降" },
      { value: 2, label: "培训产能前置规划，批量培训可支撑扩张" }] },

  // ========== 维度七：督导体系 ==========
  { id: "supervision_1", dimension: "supervision", dimensionLabel: "督导体系",
    text: "你们有专门的督导岗位吗？", options: [
      { value: 0, label: "没有，老板或区域经理偶尔巡店" },
      { value: 1, label: "有督导但人手不够，覆盖不全" },
      { value: 2, label: "有专职督导团队，覆盖所有门店" }] },
  { id: "supervision_2", dimension: "supervision", dimensionLabel: "督导体系",
    text: "督导巡店的频率和深度如何？", options: [
      { value: 0, label: "不定期的走马观花，出了问题才去" },
      { value: 1, label: "约一个月一次，有检查标准但深度一般" },
      { value: 2, label: "有明确频次 + 详细检查标准 + 评分表" }] },
  { id: "supervision_3", dimension: "supervision", dimensionLabel: "督导体系",
    text: "督导发现问题后，怎么闭环？", options: [
      { value: 0, label: "口头说一下，改没改不知道" },
      { value: 1, label: "有整改通知，但追踪不严" },
      { value: 2, label: "问题记录→限期整改→复查确认→闭环归档" }] },
  { id: "supervision_4", dimension: "supervision", dimensionLabel: "督导体系",
    text: `督导是去"找茬"还是"帮门店变好"？`, options: [
      { value: 0, label: "找茬的，门店怕督导来" },
      { value: 1, label: "以检查为主，偶尔给建议" },
      { value: 2, label: `"门店教练"模式，检查 + 辅导 + 标杆推广` }] },
  { id: "supervision_5", dimension: "supervision", dimensionLabel: "督导体系",
    text: "督导的评分标准是否透明、统一？", options: [
      { value: 0, label: "没有统一标准，各督导主观打分" },
      { value: 1, label: "有书面标准，但每个督导理解不太一样" },
      { value: 2, label: "评分细则详细 + 督导校准培训 + 门店预先知道标准" }] },
  { id: "supervision_6", dimension: "supervision", dimensionLabel: "督导体系",
    text: "督导数据除了排名处罚，还用于改善吗？", options: [
      { value: 0, label: "评分就放在那，没人看" },
      { value: 1, label: "用于排名和奖惩，偶尔总结" },
      { value: 2, label: "数据分析→找共性问题→推动制度和培训改善" }] },
  { id: "supervision_7", dimension: "supervision", dimensionLabel: "督导体系",
    text: "有神秘顾客或第三方检查吗？", options: [
      { value: 0, label: "没有" },
      { value: 1, label: "偶尔做，不系统" },
      { value: 2, label: "有系统计划 + 结果与内部督导互相验证" }] },
  { id: "supervision_8", dimension: "supervision", dimensionLabel: "督导体系",
    text: `你有信心说"每家门店的品质都在标准线以上"吗？`, options: [
      { value: 0, label: "完全没信心，心里没底" },
      { value: 1, label: "大部分店还行，小部分看运气" },
      { value: 2, label: "有数据支撑的信心，品质偏差在可控范围内" }] },

  // ========== 维度八：数字化 ==========
  { id: "digital_1", dimension: "digital", dimensionLabel: "数字化",
    text: "你们目前在用哪些数字化系统？", options: [
      { value: 0, label: "基本没有，全靠手工" },
      { value: 1, label: "有 POS + 基础财务或会员系统" },
      { value: 2, label: "核心系统较全（POS + CRM + 进销存 + 巡店 + 数据分析）" }] },
  { id: "digital_2", dimension: "digital", dimensionLabel: "数字化",
    text: "系统之间数据打通了吗？", options: [
      { value: 0, label: "各系统独立，数据是孤岛" },
      { value: 1, label: "部分系统有对接，但数据偶尔不一致" },
      { value: 2, label: "主要系统数据互通，一个 ID 贯穿全链路" }] },
  { id: "digital_3", dimension: "digital", dimensionLabel: "数字化",
    text: "管理团队看数据决策还是凭经验决策？", options: [
      { value: 0, label: "纯凭经验，没数据可看" },
      { value: 1, label: "关键决策有数据参考，日常经营靠经验" },
      { value: 2, label: "数据驱动成为组织习惯，从一线到高管看数据决策" }] },
  { id: "digital_4", dimension: "digital", dimensionLabel: "数字化",
    text: "在会员/消费者端的数字化体验如何？", options: [
      { value: 0, label: "没有线上触点，纯线下" },
      { value: 1, label: "有公众号/小程序，能积分发券" },
      { value: 2, label: "完整会员体系 + 小程序下单 + 私域运营" }] },
  { id: "digital_5", dimension: "digital", dimensionLabel: "数字化",
    text: "在数字化上，你投入了多少？", options: [
      { value: 0, label: "基本没投入" },
      { value: 1, label: "用过一些 SaaS 工具，零散投入" },
      { value: 2, label: "有数字化预算 + 专职团队，数字化是战略重点" }] },
  { id: "digital_6", dimension: "digital", dimensionLabel: "数字化",
    text: "外卖/线上渠道占你们总营收的多少？", options: [
      { value: 0, label: "没做线上或占比极低" },
      { value: 1, label: "占比 5-15%" },
      { value: 2, label: "占比 15%+，线上线下一体化运营" }] },
  { id: "digital_7", dimension: "digital", dimensionLabel: "数字化",
    text: "能实时看到每家门店的经营数据吗？", options: [
      { value: 0, label: "月底才能看到汇总" },
      { value: 1, label: "当天或次日能看到前一天的数据" },
      { value: 2, label: "实时数据看板 + 关键指标随时查看 + 异常预警" }] },
  { id: "digital_8", dimension: "digital", dimensionLabel: "数字化",
    text: "同行数字化是 5 分，你们觉得自己是几分？", options: [
      { value: 0, label: "低于平均水平" },
      { value: 1, label: "平均水平" },
      { value: 2, label: "高于平均水平，数字化是竞争加分项" }] },

  // ========== 维度九：企业文化 ==========
  { id: "culture_1", dimension: "culture", dimensionLabel: "企业文化",
    text: "你们有明确的使命、愿景、价值观吗？", options: [
      { value: 0, label: "没有，从没想过" },
      { value: 1, label: "有，挂在墙上，但大家记不住、说不出来" },
      { value: 2, label: "有，员工能说出来，招聘/考核会考察" }] },
  { id: "culture_2", dimension: "culture", dimensionLabel: "企业文化",
    text: "一线员工知道自己做的事跟公司目标有什么关联吗？", options: [
      { value: 0, label: "完全不知道，就是打工" },
      { value: 1, label: "大概知道公司方向，但觉得跟自己关系不大" },
      { value: 2, label: "清楚自己的岗位如何贡献公司目标，有使命感" }] },
  { id: "culture_3", dimension: "culture", dimensionLabel: "企业文化",
    text: "遇到问题时，大家是主动解决还是等着被安排？", options: [
      { value: 0, label: "等老板说，多一事不如少一事" },
      { value: 1, label: "看情况，偶尔有人主动" },
      { value: 2, label: "主人翁意识强，基层也有决策权" }] },
  { id: "culture_4", dimension: "culture", dimensionLabel: "企业文化",
    text: "跨部门协作顺畅吗？", options: [
      { value: 0, label: "部门墙很厚，互相甩锅" },
      { value: 1, label: "有事才沟通，平时各干各的" },
      { value: 2, label: "协作顺畅，有共同目标和透明的信息流转" }] },
  { id: "culture_5", dimension: "culture", dimensionLabel: "企业文化",
    text: "犯了错以后，公司的反应是什么？", options: [
      { value: 0, label: "追责、罚款，谁犯错谁背锅" },
      { value: 1, label: "大错追究，小错就算了" },
      { value: 2, label: `鼓励复盘，聚焦"怎么避免"，有心理安全感` }] },
  { id: "culture_6", dimension: "culture", dimensionLabel: "企业文化",
    text: "老板/高管跟一线员工的沟通渠道是怎样的？", options: [
      { value: 0, label: "几乎没有，层级森严" },
      { value: 1, label: "偶尔巡店或年会讲一次，有意见渠道但没人用" },
      { value: 2, label: "定期全员沟通 + 扁平文化 + 一线声音能影响决策" }] },
  { id: "culture_7", dimension: "culture", dimensionLabel: "企业文化",
    text: "员工的敬业度和自豪感如何？", options: [
      { value: 0, label: "大多数是混日子，到点就走" },
      { value: 1, label: "老员工还行，整体归属感一般" },
      { value: 2, label: "员工自豪感强，自发传播品牌，推荐朋友来工作" }] },
  { id: "culture_8", dimension: "culture", dimensionLabel: "企业文化",
    text: "如果要员工用一个词形容你们公司，你猜他们会说什么？", options: [
      { value: 0, label: `"压榨""混乱""没前途"` },
      { value: 1, label: `"还行""一般般""挺正规的"` },
      { value: 2, label: `"有成长""氛围好""自豪""想一直待下去"` }] },
];

// ========== 行业专属预热题 ==========
// 不参与计分，仅作为 AI 分析的上下文参考
export const industryWarmup: Record<string, { text: string; options: { value: number; label: string }[] }[]> = {
  "餐饮": [
    { text: "你们的翻台率（日均翻台次数）大概是多少？", options: [{ value: 0, label: "不到 2 次" }, { value: 1, label: "2-4 次" }, { value: 2, label: "5 次以上" }] },
    { text: "外卖占总营收的比例？", options: [{ value: 0, label: "不到 10%" }, { value: 1, label: "10%-30%" }, { value: 2, label: "30% 以上" }] },
    { text: "核心菜品有多少道 SKU？", options: [{ value: 0, label: "50 道以上" }, { value: 1, label: "20-50 道" }, { value: 2, label: "20 道以内（聚焦爆品）" }] },
  ],
  "零售": [
    { text: "线上线下销售占比？", options: [{ value: 0, label: "纯线下" }, { value: 1, label: "线下为主，线上为辅" }, { value: 2, label: "线上线下各一半以上" }] },
    { text: "店里 SKU 数量？", options: [{ value: 0, label: "1000 个以上" }, { value: 1, label: "500-1000 个" }, { value: 2, label: "500 个以内精选" }] },
    { text: "有没有做私域（微信群/企业微信）？", options: [{ value: 0, label: "没做" }, { value: 1, label: "做了，效果一般" }, { value: 2, label: "做了，转化不错" }] },
  ],
  "酒店民宿": [
    { text: "入住率大概多少？", options: [{ value: 0, label: "不到 50%" }, { value: 1, label: "50%-70%" }, { value: 2, label: "70% 以上" }] },
    { text: "主要获客渠道？", options: [{ value: 0, label: "全靠 OTA（携程/美团）" }, { value: 1, label: "OTA + 自有渠道" }, { value: 2, label: "自有渠道为主" }] },
  ],
  "教育培训": [
    { text: "续费率多少？", options: [{ value: 0, label: "不到 30%" }, { value: 1, label: "30%-60%" }, { value: 2, label: "60% 以上" }] },
    { text: "老师是专职还是兼职？", options: [{ value: 0, label: "全是兼职" }, { value: 1, label: "核心专职 + 部分兼职" }, { value: 2, label: "全部专职" }] },
  ],
  "美容美发": [
    { text: "会员储值占比？", options: [{ value: 0, label: "不到 10%" }, { value: 1, label: "10%-30%" }, { value: 2, label: "30% 以上" }] },
    { text: "技师流动率？", options: [{ value: 0, label: "很高，经常走" }, { value: 1, label: "一般" }, { value: 2, label: "较低，核心稳定" }] },
  ],
  "健身运动": [
    { text: "会员月活率？", options: [{ value: 0, label: "不到 20%" }, { value: 1, label: "20%-40%" }, { value: 2, label: "40% 以上" }] },
    { text: "私教课占比？", options: [{ value: 0, label: "不到 10%" }, { value: 1, label: "10%-30%" }, { value: 2, label: "30% 以上" }] },
  ],
  "汽车服务": [
    { text: "客户年回厂率？", options: [{ value: 0, label: "不到 50%" }, { value: 1, label: "50%-70%" }, { value: 2, label: "70% 以上" }] },
    { text: "技师认证率？", options: [{ value: 0, label: "没认证" }, { value: 1, label: "部分认证" }, { value: 2, label: "全部持证上岗" }] },
  ],
  "医疗健康": [
    { text: "患者复诊率？", options: [{ value: 0, label: "不到 20%" }, { value: 1, label: "20%-40%" }, { value: 2, label: "40% 以上" }] },
    { text: "有没有数字化病历系统？", options: [{ value: 0, label: "完全纸质" }, { value: 1, label: "部分数字化" }, { value: 2, label: "全流程数字化" }] },
  ],
  "宠物服务": [
    { text: "会员复购率？", options: [{ value: 0, label: "不到 20%" }, { value: 1, label: "20%-40%" }, { value: 2, label: "40% 以上" }] },
    { text: "有没有自己的供应链（宠物食品/用品）？", options: [{ value: 0, label: "全靠外部进货" }, { value: 1, label: "有部分自有产品" }, { value: 2, label: "自有品牌为主" }] },
  ],
  "便利店": [
    { text: "日均客流量？", options: [{ value: 0, label: "不到 200 人" }, { value: 1, label: "200-500 人" }, { value: 2, label: "500 人以上" }] },
    { text: "自有品牌商品占比？", options: [{ value: 0, label: "没有" }, { value: 1, label: "不到 10%" }, { value: 2, label: "10% 以上" }] },
  ],
  "服装": [
    { text: "库存周转天数？", options: [{ value: 0, label: "90 天以上" }, { value: 1, label: "45-90 天" }, { value: 2, label: "45 天以内" }] },
    { text: "有没有做直播带货？", options: [{ value: 0, label: "没做" }, { value: 1, label: "偶尔做" }, { value: 2, label: "常态化运营" }] },
  ],
  "其他连锁": [
    { text: "你们的核心竞争力是什么？", options: [{ value: 0, label: "价格低" }, { value: 1, label: "位置好" }, { value: 2, label: "产品/服务独特" }] },
    { text: "最近一年营收趋势？", options: [{ value: 0, label: "下滑" }, { value: 1, label: "持平" }, { value: 2, label: "增长" }] },
  ],
};
