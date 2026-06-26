import type { Question } from "./types";

// ========== 40 题通用题库（所有行业共用）==========
// 每题 3 选项（0/1/2 分），9 维度齐全
// 行业定制题会替换以下维度：operation_1-8, supply_chain_1-8, digital_1-8, model_7-8, training_6-8, supervision_6-8

export const genericQuestions: Question[] = [
  // ===== 战略（8题）=====
  { id:"strategy_1", dimension:"strategy", dimensionLabel:"战略", text:"你们有明确的 3-5 年战略目标吗？", options:[
    {value:0,label:"没有，走一步看一步"},{value:1,label:"有大致方向，但没形成书面目标"},{value:2,label:"有书面战略目标，定期复盘，全员知晓"}]
  },
  { id:"strategy_2", dimension:"strategy", dimensionLabel:"战略", text:"战略是怎么制定出来的？", options:[
    {value:0,label:"创始人一个人拍板"},{value:1,label:"核心高管参与讨论，但方法论不够系统"},{value:2,label:"系统化战略流程 + 数据驱动决策"}]
  },
  { id:"strategy_3", dimension:"strategy", dimensionLabel:"战略", text:`对于"做什么"和"不做什么"，你们有明确的取舍吗？`, options:[
    {value:0,label:"没有，什么机会都想试试"},{value:1,label:"有大致方向但偶尔会偏离主业"},{value:2,label:"有清晰战略边界和取舍原则，团队能据此做日常决策"}]
  },
  { id:"strategy_4", dimension:"strategy", dimensionLabel:"战略", text:"你们的区域扩张策略有明确逻辑吗？", options:[
    {value:0,label:"哪有加盟商找上门就开哪"},{value:1,label:"大概圈了区域范围，但缺乏量化标准"},{value:2,label:"有量化选址模型 + 按优先级进入 + 数据验证"}]
  },
  { id:"strategy_5", dimension:"strategy", dimensionLabel:"战略", text:"在目标客户心中，你们跟竞品最大的区别是什么？", options:[
    {value:0,label:"不太清楚，感觉都差不多"},{value:1,label:"有定位描述，但消费者感知不强"},{value:2,label:"差异化清晰，消费者和员工都能讲清楚"}]
  },
  { id:"strategy_6", dimension:"strategy", dimensionLabel:"战略", text:"战略目标如何分解到执行层面？", options:[
    {value:0,label:"没有分解，说了就完了"},{value:1,label:"有年度目标但没有部门到人的拆解"},{value:2,label:"目标层层分解到部门和个人，有数据跟踪和复盘机制"}]
  },
  { id:"strategy_7", dimension:"strategy", dimensionLabel:"战略", text:"当行业出现重大变化时，你们如何应对？", options:[
    {value:0,label:"反应慢，被市场推着走"},{value:1,label:"能感知变化但缺少系统应对机制"},{value:2,label:"有竞争情报机制，能快速响应并形成应对方案"}]
  },
  { id:"strategy_8", dimension:"strategy", dimensionLabel:"战略", text:"一线员工理解和执行战略的程度？", options:[
    {value:0,label:"基本不知道公司战略"},{value:1,label:"大概知道方向但讲不清楚"},{value:2,label:"全员能理解战略，并能据此做日常决策"}]
  },

  // ===== 商业模式（6题通用）=====
  { id:"model_1", dimension:"model", dimensionLabel:"商业模式", text:"你们的单店盈利模型是否清晰？", options:[
    {value:0,label:"没有精细化算过，大概感觉赚钱"},{value:1,label:"知道大概毛利率和盈亏平衡点"},{value:2,label:"单店模型标准化，坪效/人效/回本周期KPI清晰，新店可预测"}]
  },
  { id:"model_2", dimension:"model", dimensionLabel:"商业模式", text:"扩张模式是怎么选择的？", options:[
    {value:0,label:"没想清楚，跟着感觉走"},{value:1,label:"大概有方向（直营或加盟）但缺乏依据"},{value:2,label:"有量化的扩张模式分析（直营/加盟/合伙）并按阶段切换"}]
  },
  { id:"model_3", dimension:"model", dimensionLabel:"商业模式", text:"你们的收入结构是怎样的？", options:[
    {value:0,label:"只有门店销售收入"},{value:1,label:"有辅助收入但不稳定"},{value:2,label:"收入结构多元化且比例合理"}]
  },
  { id:"model_4", dimension:"model", dimensionLabel:"商业模式", text:"定价策略是如何制定的？", options:[
    {value:0,label:"跟着竞品走，或凭感觉定"},{value:1,label:"有成本加成定价，但缺乏消费者研究"},{value:2,label:"科学定价（成本+竞争+消费者支付意愿）+ 动态调整"}]
  },
  { id:"model_5", dimension:"model", dimensionLabel:"商业模式", text:"如果竞争对手明天在你隔壁开一家同品类店，你能活下来吗？", options:[
    {value:0,label:"很难，会被分流得很严重"},{value:1,label:"有一定的护城河但没底气"},{value:2,label:"有明确的竞争壁垒（品牌/供应链/会员/成本），有信心不受太大影响"}]
  },
  { id:"model_6", dimension:"model", dimensionLabel:"商业模式", text:"门店投资回报周期多久？", options:[
    {value:0,label:"没算过，或远超预期"},{value:1,label:"在行业常见范围内但不稳定"},{value:2,label:"回本周期稳定且优于行业平均，投资回报可预测"}]
  },

  // ===== 组织人才（8题通用）=====
  { id:"organization_1", dimension:"organization", dimensionLabel:"组织人才", text:"你们的组织架构能支撑下一步扩张吗？", options:[
    {value:0,label:"没想过，当前架构被动形成"},{value:1,label:"有基本架构但部门分工模糊"},{value:2,label:"架构清晰 + 部门权责明确 + 为下一阶段扩张预留弹性"}]
  },
  { id:"organization_2", dimension:"organization", dimensionLabel:"组织人才", text:"核心高管团队稳定吗？能力互补吗？", options:[
    {value:0,label:"创始人挑大梁，高管流动频繁"},{value:1,label:"核心高管相对稳定但能力同质化"},{value:2,label:"团队稳定+能力互补（业务/运营/财务/数字化各有强将）"}]
  },
  { id:"organization_3", dimension:"organization", dimensionLabel:"组织人才", text:"店长是怎么来的？供给充足吗？", options:[
    {value:0,label:"外面招，来了就用，供给紧张"},{value:1,label:"外部招聘为主内部晋升有一些但不够"},{value:2,label:"有店长储备池+系统化培养路径+晋升通道+供给能匹配扩张节奏"}]
  },
  { id:"organization_4", dimension:"organization", dimensionLabel:"组织人才", text:"员工的离职率怎么样？", options:[
    {value:0,label:"没人统计，大概感觉挺高的"},{value:1,label:"有统计，在行业均值上下波动"},{value:2,label:"离职率低于行业均值且关键岗位稳定性好"}]
  },
  { id:"organization_5", dimension:"organization", dimensionLabel:"组织人才", text:"绩效考核体系是怎样的？", options:[
    {value:0,label:"基本没有，凭感觉"},{value:1,label:"有KPI但跟战略脱节"},{value:2,label:"OKR+KPI结合，考核指标与战略一致，定期复盘校准"}]
  },
  { id:"organization_6", dimension:"organization", dimensionLabel:"组织人才", text:"员工觉得在这里有职业发展空间吗？", options:[
    {value:0,label:"没人提过，也没想过"},{value:1,label:"有晋升通道但不够透明"},{value:2,label:"透明的职级体系和晋升机制，员工知道怎么成长"}]
  },
  { id:"organization_7", dimension:"organization", dimensionLabel:"组织人才", text:"如果明天要开 50 家新店，管理人员够用吗？", options:[
    {value:0,label:"完全不够，现有团队已经吃紧"},{value:1,label:"勉强凑得出但质量参差不齐"},{value:2,label:"有成熟的人才培养体系和储备池，供给能匹配扩张需求"}]
  },
  { id:"organization_8", dimension:"organization", dimensionLabel:"组织人才", text:"创始人的精力分配是怎样的？", options:[
    {value:0,label:"到处救火，什么都要管"},{value:1,label:"有分工但关键决策仍依赖创始人"},{value:2,label:"创始人有清晰的精力分配，组织不依赖个人运转"}]
  },

  // ===== 培训体系（5题通用）=====
  { id:"training_1", dimension:"training", dimensionLabel:"培训体系", text:"新员工入职培训是怎样的？", options:[
    {value:0,label:"招来就上岗，全靠老员工带"},{value:1,label:"有入职培训但不系统"},{value:2,label:"标准化培训体系+考核认证上岗+持续追踪"}]
  },
  { id:"training_2", dimension:"training", dimensionLabel:"培训体系", text:"培训内容更新频率？", options:[
    {value:0,label:"基本没更新过"},{value:1,label:"偶尔更新但没有固定机制"},{value:2,label:"有固定更新机制，新流程/新品上线即同步培训内容"}]
  },
  { id:"training_3", dimension:"training", dimensionLabel:"培训体系", text:"培训教材是怎么做的？", options:[
    {value:0,label:"口头传授，没有教材"},{value:1,label:"有纸质手册但更新不及时"},{value:2,label:"全岗位视频SOP库+考核题库+定期更新"}]
  },
  { id:"training_4", dimension:"training", dimensionLabel:"培训体系", text:"培训效果如何检验？", options:[
    {value:0,label:"没法验证，效果全靠感觉"},{value:1,label:"有考试但没有跟业绩挂钩"},{value:2,label:"考核+实操认证+上岗评估+业绩数据追踪"}]
  },
  { id:"training_5", dimension:"training", dimensionLabel:"培训体系", text:"是否有内部讲师/师傅传帮带机制？", options:[
    {value:0,label:"没有正式机制"},{value:1,label:"有师傅带教但不系统"},{value:2,label:"正式带教师傅认证+激励机制+评估体系"}]
  },

  // ===== 督导体系（5题通用）=====
  { id:"supervision_1", dimension:"supervision", dimensionLabel:"督导体系", text:"是否有专职督导团队？", options:[
    {value:0,label:"没有，店长自己管自己"},{value:1,label:"有但覆盖不全或人员不足"},{value:2,label:"有专职督导团队+明确责任区域+定期巡店"}]
  },
  { id:"supervision_2", dimension:"supervision", dimensionLabel:"督导体系", text:"巡店检查有标准吗？", options:[
    {value:0,label:"不定期走马观花"},{value:1,label:"有标准但检查深度不够"},{value:2,label:"有分级检查标准+评分报告+跟踪整改闭环"}]
  },
  { id:"supervision_3", dimension:"supervision", dimensionLabel:"督导体系", text:"督导结果如何落地？", options:[
    {value:0,label:"查了等于白查，没有后续"},{value:1,label:"有整改通知但缺乏跟踪"},{value:2,label:"检查→整改→复查→考核闭环"}]
  },
  { id:"supervision_4", dimension:"supervision", dimensionLabel:"督导体系", text:"门店标准化执行力如何？", options:[
    {value:0,label:"差异化很大，各店各凭本事"},{value:1,label:"大部分门店能做到但水平参差不齐"},{value:2,label:"标准化执行率高，各店表现差距小"}]
  },
  { id:"supervision_5", dimension:"supervision", dimensionLabel:"督导体系", text:"问题反馈和改进机制？", options:[
    {value:0,label:"没有固定机制"},{value:1,label:"有反馈但响应慢"},{value:2,label:"问题→反馈→分析→改进→培训的完整闭环"}]
  },

  // ===== 企业文化（8题通用）=====
  { id:"culture_1", dimension:"culture", dimensionLabel:"企业文化", text:"员工能说出公司的使命/愿景/价值观吗？", options:[
    {value:0,label:"从来没有提过"},{value:1,label:"墙上有，但员工说不出"},{value:2,label:"大部分员工能说出来并认同"}]
  },
  { id:"culture_2", dimension:"culture", dimensionLabel:"企业文化", text:"价值观是否体现在招聘和晋升决策中？", options:[
    {value:0,label:"没有，只看业绩"},{value:1,label:"嘴上但实际操作不明显"},{value:2,label:"明确将价值观纳入招聘评估和晋升标准"}]
  },
  { id:"culture_3", dimension:"culture", dimensionLabel:"企业文化", text:"公司的决策透明度如何？", options:[
    {value:0,label:"完全不透明，老板一人决定"},{value:1,label:"偶尔开会通报但不系统"},{value:2,label:"定期全员沟通+重大决策公示+建立双向对话渠道"}]
  },
  { id:"culture_4", dimension:"culture", dimensionLabel:"企业文化", text:"新员工融入文化的速度？", options:[
    {value:0,label:"适应不了就走了，没有引导"},{value:1,label:"老员工传帮带但不系统"},{value:2,label:"有文化融入计划+老员工帮扶+跟踪评估"}]
  },
  { id:"culture_5", dimension:"culture", dimensionLabel:"企业文化", text:"员工提建议的意愿和渠道？", options:[
    {value:0,label:"没人敢提，或没人想提"},{value:1,label:"有渠道但形同虚设"},{value:2,label:"多种反馈渠道+建议被采纳有奖励+营造安全感"}]
  },
  { id:"culture_6", dimension:"culture", dimensionLabel:"企业文化", text:"跨部门协作顺畅吗？", options:[
    {value:0,label:"部门各自为政，互相甩锅"},{value:1,label:"高层协调才能推动协作"},{value:2,label:"跨部门协作有机制保障，沟通成本低"}]
  },
  { id:"culture_7", dimension:"culture", dimensionLabel:"企业文化", text:"公司推崇什么样的工作氛围？", options:[
    {value:0,label:"高压、无序、怨气重"},{value:1,label:"各门店各自有自己的小氛围"},{value:2,label:"有明确氛围导向+正面案例宣传+员工认同度高"}]
  },
  { id:"culture_8", dimension:"culture", dimensionLabel:"企业文化", text:"企业文化是否有仪式感？", options:[
    {value:0,label:"完全没有"},{value:1,label:"有一些活动但不定期"},{value:2,label:"有固定的文化活动/晨会/表彰/周年庆等仪式，员工参与感强"}]
  },

  // ===== 运营标准化（8题通用版，无行业定制的场景使用）=====
  { id:"operation_1", dimension:"operation", dimensionLabel:"运营标准化", text:"你们有书面的运营标准手册（SOP）吗？", options:[
    {value:0,label:"没有，全靠口头和经验传授"},{value:1,label:"有基础SOP但覆盖不全"},{value:2,label:"全岗位SOP覆盖完整，定期更新迭代"}]
  },
  { id:"operation_2", dimension:"operation", dimensionLabel:"运营标准化", text:"同一项服务/产品在不同门店的体验一致吗？", options:[
    {value:0,label:"差异化很大，各店各凭本事"},{value:1,label:"核心项目能做到大致一致但细节有差距"},{value:2,label:"全门店体验一致，消费者感知不到差异"}]
  },
  { id:"operation_3", dimension:"operation", dimensionLabel:"运营标准化", text:"新开一家店的标准化程度如何？", options:[
    {value:0,label:"每次开新店都不一样，靠运气"},{value:1,label:"有开店checklist但每次都有意外"},{value:2,label:"标准化开店手册，周期固定，新店首月即达标"}]
  },
  { id:"operation_4", dimension:"operation", dimensionLabel:"运营标准化", text:"门店日常管理有标准化流程吗？", options:[
    {value:0,label:"全靠店长自觉"},{value:1,label:"有基本制度但执行差异大"},{value:2,label:"关键流程系统化，店长精力从救火转向经营"}]
  },
  { id:"operation_5", dimension:"operation", dimensionLabel:"运营标准化", text:"产品/服务结构是否稳定？变动有依据吗？", options:[
    {value:0,label:"老板拍脑袋决定"},{value:1,label:"有流程但数据支撑不足"},{value:2,label:"数据结构化驱动产品优化和汰换"}]
  },
  { id:"operation_6", dimension:"operation", dimensionLabel:"运营标准化", text:"门店空间体验是统一的吗？", options:[
    {value:0,label:"每家店不一样"},{value:1,label:"有VI手册但执行差异大"},{value:2,label:"完整SI体系+分级空间标准+模块化复制"}]
  },
  { id:"operation_7", dimension:"operation", dimensionLabel:"运营标准化", text:"核心人员离职后门店能正常运转吗？", options:[
    {value:0,label:"核心人员离职=门店瘫痪"},{value:1,label:"有副手制度但过渡期较长"},{value:2,label:"标准化体系+人才储备池，系统大于个人"}]
  },
  { id:"operation_8", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准如何持续优化？", options:[
    {value:0,label:"标准定了就不改"},{value:1,label:"年度修订但不系统"},{value:2,label:"数据驱动+标杆门店萃取+定期迭代推送到所有门店"}]
  },

  // ===== 供应链（8题通用版）=====
  { id:"supply_chain_1", dimension:"supply_chain", dimensionLabel:"供应链", text:"采购模式是怎样的？", options:[
    {value:0,label:"各店自行采购，供应商五花八门"},{value:1,label:"核心品类集采，边缘品类自采"},{value:2,label:"全品类集采+战略供应商绑定，成本领先"}]
  },
  { id:"supply_chain_2", dimension:"supply_chain", dimensionLabel:"供应链", text:"产品/原料质量如何保证？", options:[
    {value:0,label:"靠供应商自觉"},{value:1,label:"有验收标准但抽检为主"},{value:2,label:"全链路品控+批次可追溯+不合格自动拒收"}]
  },
  { id:"supply_chain_3", dimension:"supply_chain", dimensionLabel:"供应链", text:"仓储和配送体系是怎样的？", options:[
    {value:0,label:"供应商直送，没有统一仓配"},{value:1,label:"有中心仓覆盖核心区域"},{value:2,label:"多级多温仓配体系，覆盖半径200km，配送准时"}]
  },
  { id:"supply_chain_4", dimension:"supply_chain", dimensionLabel:"供应链", text:"缺货/积压情况如何？", options:[
    {value:0,label:"经常缺货也经常积压"},{value:1,label:"有进销存但补货靠经验"},{value:2,label:"AI预测+自动补货，缺货率和积压率都低"}]
  },
  { id:"supply_chain_5", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链成本有优势吗？", options:[
    {value:0,label:"没算过，或明显高于同行"},{value:1,label:"在行业均值范围内"},{value:2,label:"规模集采使成本率低于同行，且差距在拉大"}]
  },
  { id:"supply_chain_6", dimension:"supply_chain", dimensionLabel:"供应链", text:"核心原料/产品有卡脖子风险吗？", options:[
    {value:0,label:"严重依赖单一供应商"},{value:1,label:"多个供应商可切换但稳定性存风险"},{value:2,label:"自有产能/自有品牌+多品牌组合+上游参股保障供应安全"}]
  },
  { id:"supply_chain_7", dimension:"supply_chain", dimensionLabel:"供应链", text:"进入新市场供应链能跟得上吗？", options:[
    {value:0,label:"供应链是扩张最大瓶颈"},{value:1,label:"能覆盖但周期长成本高"},{value:2,label:"仓配网络可快速复制，新市场短期内供应链就位"}]
  },
  { id:"supply_chain_8", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链数字化程度？", options:[
    {value:0,label:"全靠电话/微信/Excel"},{value:1,label:"有基础系统但数据不打通"},{value:2,label:"全链路数字化+库存可视化+AI预测补货"}]
  },

  // ===== 数字化（8题通用版）=====
  { id:"digital_1", dimension:"digital", dimensionLabel:"数字化", text:"系统覆盖情况？", options:[
    {value:0,label:"基本没有数字化"},{value:1,label:"有基础收银+简单会员系统"},{value:2,label:"核心系统覆盖较全"}]
  },
  { id:"digital_2", dimension:"digital", dimensionLabel:"数字化", text:"系统之间数据打通了吗？", options:[
    {value:0,label:"各系统孤岛，数据对不上"},{value:1,label:"部分打通但数据偶尔不一致"},{value:2,label:"核心系统数据互通，总部看板实时汇总"}]
  },
  { id:"digital_3", dimension:"digital", dimensionLabel:"数字化", text:"数据驱动决策的程度？", options:[
    {value:0,label:"纯凭经验"},{value:1,label:"月底看报表，日常靠经验"},{value:2,label:"实时数据看板+异常预警，数据驱动日常决策"}]
  },
  { id:"digital_4", dimension:"digital", dimensionLabel:"数字化", text:"消费者端数字化程度？", options:[
    {value:0,label:"纯线下，没有线上触点"},{value:1,label:"有线上但运营不够"},{value:2,label:"完整会员体系+精准营销+私域运营"}]
  },
  { id:"digital_5", dimension:"digital", dimensionLabel:"数字化", text:"数字化投入力度？", options:[
    {value:0,label:"基本没投入"},{value:1,label:"用了些工具但零散"},{value:2,label:"有数字化预算+专职团队，是战略级投入"}]
  },
  { id:"digital_6", dimension:"digital", dimensionLabel:"数字化", text:"线上业务占比？", options:[
    {value:0,label:"没做线上"},{value:1,label:"有线上但占比低且运营粗放"},{value:2,label:"线上占比高+精细化运营+线上线下打通"}]
  },
  { id:"digital_7", dimension:"digital", dimensionLabel:"数字化", text:"实时数据可见度？", options:[
    {value:0,label:"月底才能看到汇总"},{value:1,label:"次日能看到昨日数据"},{value:2,label:"实时看板+可下钻到单品/门店/时段"}]
  },
  { id:"digital_8", dimension:"digital", dimensionLabel:"数字化", text:"行业数字化水平自评？", options:[
    {value:0,label:"低于行业平均"},{value:1,label:"跟大部分同行差不多"},{value:2,label:"数字化是竞争加分项"}]
  },

  // ===== 商业模式（2题通用补充）=====
  { id:"model_7", dimension:"model", dimensionLabel:"商业模式", text:"收费/定价模式是否清晰？", options:[
    {value:0,label:"没有明确模式，市场决定"},{value:1,label:"有基本定价但缺乏科学依据"},{value:2,label:"科学定价+动态调整+数据反馈"}]
  },
  { id:"model_8", dimension:"model", dimensionLabel:"商业模式", text:"是否有多元收入来源？", options:[
    {value:0,label:"只有单一收入来源"},{value:1,label:"有辅助收入但不稳定"},{value:2,label:"收入结构多元化且比例合理"}]
  },

  // ===== 培训体系（3题通用补充）=====
  { id:"training_6", dimension:"training", dimensionLabel:"培训体系", text:"关键岗位有认证体系吗？", options:[
    {value:0,label:"没有"},{value:1,label:"有简单认证但不系统"},{value:2,label:"完整认证体系+与晋升和薪酬挂钩"}]
  },
  { id:"training_7", dimension:"training", dimensionLabel:"培训体系", text:"培训资源投入？", options:[
    {value:0,label:"几乎没有投入"},{value:1,label:"有基本投入但不够"},{value:2,label:"培训是核心投资，有专职团队和独立预算"}]
  },
  { id:"training_8", dimension:"training", dimensionLabel:"培训体系", text:"远程/线上培训能力？", options:[
    {value:0,label:"没有线上培训"},{value:1,label:"有简单录播课程"},{value:2,label:"系统化线上学习平台+直播培训+学习数据追踪"}]
  },

  // ===== 督导体系（3题通用补充）=====
  { id:"supervision_6", dimension:"supervision", dimensionLabel:"督导体系", text:"督导覆盖频率？", options:[
    {value:0,label:"不定期，看情况"},{value:1,label:"月度为周期"},{value:2,label:"有明确分级频次+重点门店加密"}]
  },
  { id:"supervision_7", dimension:"supervision", dimensionLabel:"督导体系", text:"是否有第三方评估？", options:[
    {value:0,label:"没有"},{value:1,label:"偶尔做但不系统"},{value:2,label:"定期第三方评估+与内部督导互相验证"}]
  },
  { id:"supervision_8", dimension:"supervision", dimensionLabel:"督导体系", text:"督导与培训联动？", options:[
    {value:0,label:"督导和培训完全脱节"},{value:1,label:"有简单联动但不够紧密"},{value:2,label:"督导发现问题→培训针对性改进→复检验证闭环"}]
  },
];

// ========== 行业定制题（每行业 32 题，替换同名 ID 的通用题）==========

// 餐饮
const 餐饮: Question[] = [
  // 运营标准化 8题
  { id:"operation_1", dimension:"operation", dimensionLabel:"运营标准化", text:"SOP 覆盖度如何？", options:[
    {value:0,label:"后厨靠师傅手感，前厅靠店长经验，没有成文标准"},{value:1,label:"招牌菜有配方卡，但非招牌菜和前台服务标准不全"},{value:2,label:"全岗位SOP覆盖（每道菜量化到克/秒/温度，前厅服务七步法），视频化培训素材，季度迭代"}]
  },
  { id:"operation_2", dimension:"operation", dimensionLabel:"运营标准化", text:"出品一致性如何？", options:[
    {value:0,label:"同一品牌不同门店口味差异明显，完全取决于当班师傅"},{value:1,label:"招牌菜基本一致，但非招牌菜和饮品有差异"},{value:2,label:"全品类一致性高，神秘顾客评分偏差<10%，消费者感知在哪吃都一样"}]
  },
  { id:"operation_3", dimension:"operation", dimensionLabel:"运营标准化", text:"新店开业标准化程度？", options:[
    {value:0,label:"每次开新店都是打仗，没有标准流程，工期预算不可控"},{value:1,label:"有开店checklist但厨房间动线每家都要重新磨合"},{value:2,label:"标准化开店手册+模块化厨房设计，开店周期固定在45天以内"}]
  },
  { id:"operation_4", dimension:"operation", dimensionLabel:"运营标准化", text:"日常运营管理水平？", options:[
    {value:0,label:"排班/订货/盘点/卫生全靠店长自觉"},{value:1,label:"有基本制度但翻台率/人效/损耗率差异大"},{value:2,label:"关键流程数字化（智能排班/自动补货/损耗预警），店长从救火转向经营"}]
  },
  { id:"operation_5", dimension:"operation", dimensionLabel:"运营标准化", text:"产品结构管理是否科学？", options:[
    {value:0,label:"老板/总厨拍脑袋更新菜单，没有数据支撑"},{value:1,label:"有新品研发SOP但老品淘汰凭感觉"},{value:2,label:"菜单工程化（引流款/利润款/形象款分层），季度数据复盘ABC分类汰换"}]
  },
  { id:"operation_6", dimension:"operation", dimensionLabel:"运营标准化", text:"门店空间标准化程度？", options:[
    {value:0,label:"每家店装修风格不同，品牌识别度低"},{value:1,label:"有VI手册但灯光/音乐/桌面布局执行差异大"},{value:2,label:"完整SI体系按店型分级（旗舰/标准/外卖/档口），模块化施工"}]
  },
  { id:"operation_7", dimension:"operation", dimensionLabel:"运营标准化", text:"店长/厨师长离职抗风险能力？", options:[
    {value:0,label:"核心人员离职=门店瘫痪，新人至少1-2个月才能接手"},{value:1,label:"有副手制度但关键菜品仍依赖个人"},{value:2,label:"中央厨房+标准化SOP+人才储备池，系统大于个人，换人出品不受影响"}]
  },
  { id:"operation_8", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准如何持续优化？", options:[
    {value:0,label:"标准定了就不改，出了大投诉才被动调整"},{value:1,label:"年度修订一次SOP但不系统"},{value:2,label:"数据驱动+标杆门店经验萃取+季度迭代推送到所有门店"}]
  },
  // 供应链 8题
  { id:"supply_chain_1", dimension:"supply_chain", dimensionLabel:"供应链", text:"采购模式是怎样的？", options:[
    {value:0,label:"各店自采，供应商五花八门，食材品质不稳定"},{value:1,label:"核心食材集采（底料/肉类/油脂），蔬菜调料门店自采"},{value:2,label:"全品类集采+战略供应商绑定+反向定制，集采占比>80%"}]
  },
  { id:"supply_chain_2", dimension:"supply_chain", dimensionLabel:"供应链", text:"食安与质量保障如何？", options:[
    {value:0,label:"靠供应商自觉，来货看一下就入库，索证索票不完整"},{value:1,label:"有验收标准但抽检为主，冷链断链偶发"},{value:2,label:"全链路品控（产地→冷链→中央厨房→门店），批次可追溯，不合格自动拒收"}]
  },
  { id:"supply_chain_3", dimension:"supply_chain", dimensionLabel:"供应链", text:"仓配体系是怎样的？", options:[
    {value:0,label:"没有中央厨房/中心仓，供应商直送各门店"},{value:1,label:"有中央厨房覆盖核心区域但冷链不稳定"},{value:2,label:"多温层中央厨房+区域分仓，覆盖半径200km，日配/隔日配，冷链不断链"}]
  },
  { id:"supply_chain_4", dimension:"supply_chain", dimensionLabel:"供应链", text:"食材损耗与断货情况？", options:[
    {value:0,label:"经常断货（高峰期缺招牌菜），也经常报损"},{value:1,label:"有订货标准但凭经验，食材成本率波动±5%，报损率3-8%"},{value:2,label:"AI销量预测+智能补货，成本率稳定在目标±2%内，报损率<2%"}]
  },
  { id:"supply_chain_5", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链成本有优势吗？", options:[
    {value:0,label:"没算过食材成本率，或明显高于同行"},{value:1,label:"在行业均值范围内"},{value:2,label:"集采规模+中央厨房使成本率低于同行3-5个百分点"}]
  },
  { id:"supply_chain_6", dimension:"supply_chain", dimensionLabel:"供应链", text:"核心原料有卡脖子风险吗？", options:[
    {value:0,label:"核心底料/蘸料/肉类依赖单一供应商"},{value:1,label:"有两家以上供应商可切换但配方稳定性存在风险"},{value:2,label:"核心底料自建工厂生产+战略储备+上游参股，供应安全充分保障"}]
  },
  { id:"supply_chain_7", dimension:"supply_chain", dimensionLabel:"供应链", text:"新城市扩展供应链能力？", options:[
    {value:0,label:"供应链是跨区扩张的最大障碍，不敢出省"},{value:1,label:"能覆盖但要新建仓/找新供应商，周期3-6个月"},{value:2,label:"中央厨房产能前置规划+区域分仓可快速复制，新城市2个月内供应链就位"}]
  },
  { id:"supply_chain_8", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链数字化程度？", options:[
    {value:0,label:"全靠电话/微信/Excel，订货靠手写单"},{value:1,label:"有基础进销存但中央厨房与门店数据不打通"},{value:2,label:"全链路数字化（采购→中央厨房→配送→门店验收），实时库存可视，异常自动预警"}]
  },
  // 数字化 8题
  { id:"digital_1", dimension:"digital", dimensionLabel:"数字化", text:"系统覆盖情况？", options:[
    {value:0,label:"基本没有数字化，全靠手工"},{value:1,label:"有POS收银+基础会员系统"},{value:2,label:"核心系统覆盖（POS+会员CRM+进销存+巡店+外卖平台对接）"}]
  },
  { id:"digital_2", dimension:"digital", dimensionLabel:"数字化", text:"数据打通程度？", options:[
    {value:0,label:"POS/外卖/会员/进销存各是各的，数据对不上"},{value:1,label:"部分系统有对接但数据偶尔不一致"},{value:2,label:"一个ID贯穿所有系统，总部看板实时汇总各店数据"}]
  },
  { id:"digital_3", dimension:"digital", dimensionLabel:"数字化", text:"数据驱动决策的程度？", options:[
    {value:0,label:"纯凭经验决策"},{value:1,label:"月底看报表，日常经营靠经验"},{value:2,label:"实时数据看板+异常自动预警，从一线到高管看数据决策"}]
  },
  { id:"digital_4", dimension:"digital", dimensionLabel:"数字化", text:"消费者端数字化程度？", options:[
    {value:0,label:"纯线下，没有线上触点"},{value:1,label:"有公众号/小程序但没运营"},{value:2,label:"完整私域体系（小程序点单+会员分层+精准营销+社群+评价管理），复购率可追踪"}]
  },
  { id:"digital_5", dimension:"digital", dimensionLabel:"数字化", text:"数字化投入力度？", options:[
    {value:0,label:"基本没投入"},{value:1,label:"用了一些SaaS工具但很零散"},{value:2,label:"有数字化预算+专职团队或稳定外包，数字化是战略级投入"}]
  },
  { id:"digital_6", dimension:"digital", dimensionLabel:"数字化", text:"外卖/线上营收占比？", options:[
    {value:0,label:"没做外卖或开了没人管，评分很低"},{value:1,label:"外卖占比10-25%但运营靠人工"},{value:2,label:"外卖占比25%+，双平台精细化运营+私域外卖，线上线下互相导流"}]
  },
  { id:"digital_7", dimension:"digital", dimensionLabel:"数字化", text:"实时数据可见度？", options:[
    {value:0,label:"月底才能看到汇总报表"},{value:1,label:"第二天能看到昨天数据但看不到实时"},{value:2,label:"实时看板（营业额/翻台率/人效/成本率/差评即时推送），可下钻到单品/时段"}]
  },
  { id:"digital_8", dimension:"digital", dimensionLabel:"数字化", text:"行业数字化水平自评？", options:[
    {value:0,label:"低于行业平均水平"},{value:1,label:"跟大部分同行差不多"},{value:2,label:"数字化是竞争加分项（智能排队/自助点单/厨房KDS/数据中台）"}]
  },
  // 商业模式 2题定制
  { id:"model_7", dimension:"model", dimensionLabel:"商业模式", text:"单店盈利模型够精细吗？", options:[
    {value:0,label:"没有精细化算过，大概感觉赚钱就继续开"},{value:1,label:"知道大概毛利率和回本周期但不同店型差异大"},{value:2,label:"单店模型标准化（坪效/翻台率/人效/食材成本率/回本周期KPI清晰），新店可模拟预测"}]
  },
  { id:"model_8", dimension:"model", dimensionLabel:"商业模式", text:"投资回报周期？", options:[
    {value:0,label:"没算过回本周期或远超预期（>18个月）"},{value:1,label:"回本周期在12-18个月但不稳定"},{value:2,label:"回本周期稳定在8-12个月以内（优于行业平均），投资者排队"}]
  },
  // 培训体系 3题定制
  { id:"training_6", dimension:"training", dimensionLabel:"培训体系", text:"新店员上岗周期？", options:[
    {value:0,label:"3-4周甚至更长，跟着师傅看，没有系统培训"},{value:1,label:"2-3周，有集中培训但实操还是靠师傅带"},{value:2,label:"1-2周，标准化培训（视频SOP+模拟操作+师傅带教+考核认证上岗）"}]
  },
  { id:"training_7", dimension:"training", dimensionLabel:"培训体系", text:"培训教材？", options:[
    {value:0,label:"口头传授，没有书面教材"},{value:1,label:"有纸质SOP手册但没有视频化，新菜品上线培训跟不上"},{value:2,label:"全岗位视频SOP库+考核题库+定期更新，新菜品上线即更新培训内容"}]
  },
  { id:"training_8", dimension:"training", dimensionLabel:"培训体系", text:"加盟商培训？", options:[
    {value:0,label:"收了加盟费就完事，培训走过场"},{value:1,label:"开业前集中培训+开业驻店带教7-15天但没有后续"},{value:2,label:"开业前系统培训+开业后持续赋能（月度复训/新品培训/经营分析），与直营标准一致"}]
  },
  // 督导体系 3题定制
  { id:"supervision_6", dimension:"supervision", dimensionLabel:"督导体系", text:"巡店检查重点？", options:[
    {value:0,label:"不定期走一圈，看心情检查"},{value:1,label:"约一个月一次，主要看卫生和出餐速度"},{value:2,label:"有明确频次+分级检查标准（食品安全40%+出品30%+服务20%+环境10%），每次出评分报告"}]
  },
  { id:"supervision_7", dimension:"supervision", dimensionLabel:"督导体系", text:"神秘顾客制度？", options:[
    {value:0,label:"没有"},{value:1,label:"偶尔做，一年1-2次，结果没有系统利用"},{value:2,label:"季度神秘顾客计划+结果与内部督导互相验证+问题门店专项复检"}]
  },
  { id:"supervision_8", dimension:"supervision", dimensionLabel:"督导体系", text:"品质信心如何？", options:[
    {value:0,label:"完全没信心，不同门店体验天差地别"},{value:1,label:"大部分店还行（70%达标），偏远门店心里没底"},{value:2,label:"有数据支撑的信心——各门店出品评分/客诉率/复购率在可控范围，90%+门店达标"}]
  },
];

// 零售
const 零售: Question[] = [
  { id:"operation_1", dimension:"operation", dimensionLabel:"运营标准化", text:"商品与运营标准覆盖度？", options:[
    {value:0,label:"没有统一的商品结构和运营标准，各店差异大"},{value:1,label:"有标准但门店执行差异大，鲜食品质不稳定"},{value:2,label:"商品标准化（核心品项铺货率>90%）+运营流程标准化（开业/收货/陈列/报损/交接班全有SOP）"}]
  },
  { id:"operation_2", dimension:"operation", dimensionLabel:"运营标准化", text:"门店体验一致性？", options:[
    {value:0,label:"不同门店商品数量/陈列/鲜食品质天差地别"},{value:1,label:"标品铺货基本一致但鲜食/服务/促销执行各店差异明显"},{value:2,label:"核心品项铺货率>95%+鲜食品质稳定+服务话术标准化+促销执行一致"}]
  },
  { id:"operation_3", dimension:"operation", dimensionLabel:"运营标准化", text:"新店开业标准化？", options:[
    {value:0,label:"开新店只看选址+装修，货品配置和品类模型不清晰"},{value:1,label:"有开店流程但品类模型不够精细"},{value:2,label:"标准化开店手册+4-6套品类模型（写字楼/社区/商圈/校园不同配置）+固定开店周期"}]
  },
  { id:"operation_4", dimension:"operation", dimensionLabel:"运营标准化", text:"日常运营管理？", options:[
    {value:0,label:"收货/上架/盘点/报损/排班全靠店长经验"},{value:1,label:"有基本制度但补货靠经验，促销执行看店长"},{value:2,label:"关键流程数字化（自动补货/电子价签/智能盘点）+督导检查执行闭环"}]
  },
  { id:"operation_5", dimension:"operation", dimensionLabel:"运营标准化", text:"商品结构管理？", options:[
    {value:0,label:"商品全靠采购/店长经验决定"},{value:1,label:"有新商品引进流程但老品淘汰靠人工判断，滞销品占比>15%"},{value:2,label:"商品生命周期管理（新品试销→数据评估→爆款放大→滞销淘汰），季度复盘优化"}]
  },
  { id:"operation_6", dimension:"operation", dimensionLabel:"运营标准化", text:"门店空间标准化？", options:[
    {value:0,label:"没有统一的店铺设计和空间标准"},{value:1,label:"有VI/基本空间规范但不同门店商品陈列动线差异大"},{value:2,label:"完整SI体系+棚割图管理（商品陈列位/面位数/促销位标准化），按商圈类型分级配置"}]
  },
  { id:"operation_7", dimension:"operation", dimensionLabel:"运营标准化", text:"店长离职抗风险？", options:[
    {value:0,label:"店长一走门店运营就出问题"},{value:1,label:"有副手/区域经理补位但过渡期运营质量下降"},{value:2,label:"标准化运营体系+店长储备池+系统支撑，1周内平稳交接"}]
  },
  { id:"operation_8", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准持续优化？", options:[
    {value:0,label:"标准定了就不动，出了严重客诉才调整"},{value:1,label:"年度修订但不系统"},{value:2,label:"数据驱动（热销/滞销/报损/客诉）+最佳门店经验萃取+季度迭代推送到所有门店"}]
  },
  { id:"supply_chain_1", dimension:"supply_chain", dimensionLabel:"供应链", text:"采购与商品开发？", options:[
    {value:0,label:"各店自行采购或从批发市场进货"},{value:1,label:"标品集中采购，鲜食/短保品本地采购，自有品牌占比<10%"},{value:2,label:"全品类集采+自有品牌占比>20%（鲜食自有品牌毛利35-50%），战略供应商深度绑定"}]
  },
  { id:"supply_chain_2", dimension:"supply_chain", dimensionLabel:"供应链", text:"商品质量保障？", options:[
    {value:0,label:"靠供应商自觉，来货验收不严格"},{value:1,label:"有验收标准和质检流程但鲜食/短保品温控偶有失控"},{value:2,label:"全链路品控（产地→多温仓→配送→门店）+效期预警+质检不合格自动拒收"}]
  },
  { id:"supply_chain_3", dimension:"supply_chain", dimensionLabel:"供应链", text:"仓配体系？", options:[
    {value:0,label:"供应商直送各门店，没有统一仓配"},{value:1,label:"有中心仓覆盖核心区域但多温层管理不完善"},{value:2,label:"多级多温仓配体系（常温/冷藏/冷冻），日配/隔日配覆盖，配送准点率>95%"}]
  },
  { id:"supply_chain_4", dimension:"supply_chain", dimensionLabel:"供应链", text:"库存管理水平？", options:[
    {value:0,label:"经常缺货（畅销品断货率高）也经常积压"},{value:1,label:"有进销存但补货靠经验，鲜食报损率5-12%"},{value:2,label:"AI销量预测+自动补货，缺货率<3%，鲜食报损率<4%，滞销品自动预警调拨"}]
  },
  { id:"supply_chain_5", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链成本优势？", options:[
    {value:0,label:"不知道毛利率水平或比同行明显偏高"},{value:1,label:"毛利率在行业均值范围内"},{value:2,label:"自有品牌占比提升拉动整体毛利，鲜食供应链让综合毛利高于同行3-5个百分点"}]
  },
  { id:"supply_chain_6", dimension:"supply_chain", dimensionLabel:"供应链", text:"核心商品卡脖子风险？", options:[
    {value:0,label:"核心品牌/品类依赖单一供应商或渠道"},{value:1,label:"多个供应商可切换但上游品牌方话语权强"},{value:2,label:"自有品牌对冲+鲜食自建供应链+标品多品牌组合，不依赖任何单一供应商"}]
  },
  { id:"supply_chain_7", dimension:"supply_chain", dimensionLabel:"供应链", text:"新城市供应链能力？", options:[
    {value:0,label:"供应链是扩张最大瓶颈"},{value:1,label:"能覆盖但要新建仓/找本地供应商"},{value:2,label:"仓配网络可快速扩展复制，新城市2-3个月内供应链就位"}]
  },
  { id:"supply_chain_8", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链数字化？", options:[
    {value:0,label:"全靠电话/微信/Excel"},{value:1,label:"有基础ERP但和供应商/门店数据没完全打通"},{value:2,label:"全链路数字化（供应商→多温仓→配送→门店）+AI预测补货+库存可视化"}]
  },
  { id:"digital_1", dimension:"digital", dimensionLabel:"数字化", text:"系统覆盖？", options:[
    {value:0,label:"基本没有，全靠手工"},{value:1,label:"有POS收银+基础进销存+基础会员系统"},{value:2,label:"系统覆盖较全（POS+自动补货+智能分货+选址引擎+会员CRM+加盟商监控）"}]
  },
  { id:"digital_2", dimension:"digital", dimensionLabel:"数字化", text:"数据打通程度？", options:[
    {value:0,label:"各系统孤岛，数据对不上"},{value:1,label:"部分系统有对接但加盟商数据回传不完整"},{value:2,label:"核心系统数据互通（POS+进销存+会员+供应商），总部一处看全局"}]
  },
  { id:"digital_3", dimension:"digital", dimensionLabel:"数字化", text:"数据驱动决策程度？", options:[
    {value:0,label:"纯凭经验，商品引进/淘汰/促销全看感觉"},{value:1,label:"月底看报表（销售额/毛利/库存）但日常运营决策仍靠经验"},{value:2,label:"实时数据看板+智能指南（选品建议/促销效果分析/门店健康度评分），数据驱动运营"}]
  },
  { id:"digital_4", dimension:"digital", dimensionLabel:"数字化", text:"消费者端数字化？", options:[
    {value:0,label:"纯线下，没有线上触点和会员系统"},{value:1,label:"有公众号/会员积分/优惠券但运营不够"},{value:2,label:"完整会员体系（分层+标签+精准营销）+私域运营（社群/直播/小程序）+全渠道打通"}]
  },
  { id:"digital_5", dimension:"digital", dimensionLabel:"数字化", text:"数字化投入？", options:[
    {value:0,label:"基本没投入"},{value:1,label:"用了一些SaaS工具但零散"},{value:2,label:"有数字化预算+专职团队或稳定外包，数字化是战略级投入"}]
  },
  { id:"digital_6", dimension:"digital", dimensionLabel:"数字化", text:"线上/到家业务占比？", options:[
    {value:0,label:"没做线上/到家"},{value:1,label:"接入京东到家/美团/饿了么等平台但运营粗放，占比<10%"},{value:2,label:"线上到家+自营小程序占比15%+，线上线下库存打通，一体化运营"}]
  },
  { id:"digital_7", dimension:"digital", dimensionLabel:"数字化", text:"实时数据可见度？", options:[
    {value:0,label:"月底才能看到汇总"},{value:1,label:"次日能看到昨日数据但看不到实时"},{value:2,label:"实时看板（各店销售/客流/库存/异常预警），可下钻到单品/时段/门店"}]
  },
  { id:"digital_8", dimension:"digital", dimensionLabel:"数字化", text:"行业数字化自评？", options:[
    {value:0,label:"低于行业平均"},{value:1,label:"跟大部分同行差不多"},{value:2,label:"数字化是竞争加分项（智能选址/自动补货/全渠道）"}]
  },
  { id:"model_7", dimension:"model", dimensionLabel:"商业模式", text:"单店盈利模型够精细吗？", options:[
    {value:0,label:"没有精细化算过"},{value:1,label:"知道大概毛利和回本周期但没细分到坪效/人效/品类贡献"},{value:2,label:"单店模型标准化（坪效/人效/品类毛利贡献/日均客流需求/盈亏平衡线清晰），新店可预测"}]
  },
  { id:"model_8", dimension:"model", dimensionLabel:"商业模式", text:"投资回报周期？", options:[
    {value:0,label:"没算过或远超预期（>24个月）"},{value:1,label:"回本周期18-24个月（行业均值）但不稳定"},{value:2,label:"回本周期稳定在12-18个月（优于行业平均），投资回报可预测"}]
  },
  { id:"training_6", dimension:"training", dimensionLabel:"培训体系", text:"新店员上岗？", options:[
    {value:0,label:"招来就上岗全靠老员工带"},{value:1,label:"有入职培训但实操培训靠店内师傅"},{value:2,label:"标准化培训体系（入职集训+岗位视频SOP+师傅带教+考核认证上岗），1-2周独立上岗"}]
  },
  { id:"training_7", dimension:"training", dimensionLabel:"培训体系", text:"培训教材？", options:[
    {value:0,label:"没有教材全靠口头传授"},{value:1,label:"有纸质SOP手册但临时工/兼职培训缺失"},{value:2,label:"全岗位视频化培训素材+考核题库+新商品上线即更新培训内容"}]
  },
  { id:"training_8", dimension:"training", dimensionLabel:"培训体系", text:"加盟商培训？", options:[
    {value:0,label:"收了加盟费就完事"},{value:1,label:"开业前培训+开业驻店带教但没有持续赋能"},{value:2,label:"系统培训（开业前+开业后持续赋能+月度经营分析辅导），加盟标准与直营一致"}]
  },
  { id:"supervision_6", dimension:"supervision", dimensionLabel:"督导体系", text:"巡店检查重点？", options:[
    {value:0,label:"不定期走马观花"},{value:1,label:"约一个月一次，主要看卫生和陈列"},{value:2,label:"明确频次+分级检查标准（商品结构30%+鲜食品质25%+陈列标准25%+服务体验20%）"}]
  },
  { id:"supervision_7", dimension:"supervision", dimensionLabel:"督导体系", text:"神秘顾客/顾客体验监测？", options:[
    {value:0,label:"没有"},{value:1,label:"偶尔做不系统"},{value:2,label:"季度神秘顾客+顾客满意度调查+线上评价监测，结果与内部督导互相验证"}]
  },
  { id:"supervision_8", dimension:"supervision", dimensionLabel:"督导体系", text:"品质信心？", options:[
    {value:0,label:"完全没信心，不同门店体验天差地别"},{value:1,label:"大部分店还行但鲜食/服务一致性心里没底"},{value:2,label:"有数据支撑（铺货率/鲜食品质/客诉率在可控范围），90%+门店达标"}]
  },
];

// 医药
const 医药: Question[] = [
  { id:"operation_1", dimension:"operation", dimensionLabel:"运营标准化", text:"GSP合规覆盖度？", options:[
    {value:0,label:"GSP合规意识薄弱，靠经验管理"},{value:1,label:"有GSP制度但执行有漏洞，飞检压力大"},{value:2,label:"GSP合规逐条映射到门店操作（温湿度/处方审核/药师在岗/药品分类），每次飞检都经得住查"}]
  },
  { id:"operation_2", dimension:"operation", dimensionLabel:"运营标准化", text:"合规一致性？", options:[
    {value:0,label:"不同门店合规水平差异大"},{value:1,label:"核心门店合规但加盟店/新店有风险"},{value:2,label:"全门店合规一致性高，飞检通过率>95%，无严重缺陷项"}]
  },
  { id:"operation_3", dimension:"operation", dimensionLabel:"运营标准化", text:"新店开业标准化？", options:[
    {value:0,label:"新店开业流程混乱，许可证办理周期不可控"},{value:1,label:"有开店流程但GSP认证/医保定点每家都要重新跑"},{value:2,label:"标准化开店手册（许可证+GSP认证+医保定点+品类模型），开店周期可控"}]
  },
  { id:"operation_4", dimension:"operation", dimensionLabel:"运营标准化", text:"日常运营管理？", options:[
    {value:0,label:"效期管理/温湿度/处方留存全靠店长自觉"},{value:1,label:"有基本制度但药师排班/处方审核执行差异大"},{value:2,label:"关键流程数字化（效期预警/温湿度自动监控/处方审核记录/药师排班），GSP合规自动巡检"}]
  },
  { id:"operation_5", dimension:"operation", dimensionLabel:"运营标准化", text:"药品分类与结构管理？", options:[
    {value:0,label:"药品分类混乱，随意上架"},{value:1,label:"有基本分类但不科学"},{value:2,label:"科学分类（处方药/OTC/中药饮片/医疗器械/保健品）+品类模型+数据驱动汰换"}]
  },
  { id:"operation_6", dimension:"operation", dimensionLabel:"运营标准化", text:"门店空间标准化？", options:[
    {value:0,label:"每家店装修布局不同"},{value:1,label:"有VI手册但功能分区执行差异大"},{value:2,label:"完整SI体系（按店型分级：超级药店/标准店/社区店/DTP药房），功能分区标准化（阴凉区/冷藏区/处方区）"}]
  },
  { id:"operation_7", dimension:"operation", dimensionLabel:"运营标准化", text:"执业药师离职抗风险？", options:[
    {value:0,label:"药师离职=门店无法营业"},{value:1,label:"有药师储备但过渡期长"},{value:2,label:"药师储备池+远程审方系统+区域药师共享机制，药师离职不影响合规运营"}]
  },
  { id:"operation_8", dimension:"operation", dimensionLabel:"运营标准化", text:"合规运营持续优化？", options:[
    {value:0,label:"政策变了才被动调整"},{value:1,label:"年度自查但不系统"},{value:2,label:"法规政策跟踪+定期GSP自查+飞检数据复盘+季度迭代合规SOP"}]
  },
  { id:"supply_chain_1", dimension:"supply_chain", dimensionLabel:"供应链", text:"采购模式？", options:[
    {value:0,label:"从批发商分散采购，没有统一管理"},{value:1,label:"部分品种集采，知名品种从批发商采购"},{value:2,label:"批零一体+集采+自有品牌/贴牌品种开发，品种供应稳定"}]
  },
  { id:"supply_chain_2", dimension:"supply_chain", dimensionLabel:"供应链", text:"药品质量追溯？", options:[
    {value:0,label:"来货验收记录不全，追溯困难"},{value:1,label:"有首营企业和首营品种审核但记录有缺失"},{value:2,label:"GSP全程追溯（从工业→批发→门店→消费者），批次可追溯，效期预警自动触发"}]
  },
  { id:"supply_chain_3", dimension:"supply_chain", dimensionLabel:"供应链", text:"仓配体系？", options:[
    {value:0,label:"没有统一仓库，供应商分散配送"},{value:1,label:"有区域仓库但冷链/特殊储存不完善"},{value:2,label:"批零一体仓储+多温层（常温/阴凉/冷藏/冷冻）+冷链药品专用配送，覆盖半径200km"}]
  },
  { id:"supply_chain_4", dimension:"supply_chain", dimensionLabel:"供应链", text:"库存/缺货管理？", options:[
    {value:0,label:"畅销药经常断货，近效期药品报损率高"},{value:1,label:"有进销存但补货靠经验，效期管理靠人工"},{value:2,label:"AI销量预测+自动补货+效期优先级出库，缺货率<3%，近效期报损率<2%"}]
  },
  { id:"supply_chain_5", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链成本优势？", options:[
    {value:0,label:"毛利率低于行业平均或不清楚"},{value:1,label:"毛利率在行业均值范围内"},{value:2,label:"集采+批零一体+自有品牌使综合毛利高于同行3-5个百分点"}]
  },
  { id:"supply_chain_6", dimension:"supply_chain", dimensionLabel:"供应链", text:"核心品种供货风险？", options:[
    {value:0,label:"核心品种依赖单一供货渠道"},{value:1,label:"多供应商可切换但价格波动大"},{value:2,label:"批零一体+多品牌组合+自有品牌对冲+工业端参股，供应安全有保障"}]
  },
  { id:"supply_chain_7", dimension:"supply_chain", dimensionLabel:"供应链", text:"新城市扩展能力？", options:[
    {value:0,label:"供应链是扩张瓶颈，出不了现有区域"},{value:1,label:"能覆盖但要新建仓/找本地批发商"},{value:2,label:"批零一体网络可快速复制，新城市2-3个月内供应链就位"}]
  },
  { id:"supply_chain_8", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链数字化？", options:[
    {value:0,label:"全靠电话/微信/Excel"},{value:1,label:"有基础ERP但供应商/门店数据没打通"},{value:2,label:"全链路数字化（工业→批发→配送→门店）+GSP追溯+效期预警+智能补货"}]
  },
  { id:"digital_1", dimension:"digital", dimensionLabel:"数字化", text:"系统覆盖？", options:[
    {value:0,label:"基本没有数字化"},{value:1,label:"有基础收银+进销存"},{value:2,label:"GSP合规系统+处方流转+医保对接+慢病CRM+远程审方系统"}]
  },
  { id:"digital_2", dimension:"digital", dimensionLabel:"数字化", text:"数据打通？", options:[
    {value:0,label:"各系统独立，数据不互通"},{value:1,label:"部分对接但医保/处方/进销存数据不统一"},{value:2,label:"核心系统打通（GSP+进销存+处方+医保+会员），总部一处看全局"}]
  },
  { id:"digital_3", dimension:"digital", dimensionLabel:"数字化", text:"数据驱动决策？", options:[
    {value:0,label:"纯凭经验"},{value:1,label:"月底看报表但日常经营靠经验"},{value:2,label:"实时品种分析+GSP合规看板+慢病会员数据驱动品类和营销决策"}]
  },
  { id:"digital_4", dimension:"digital", dimensionLabel:"数字化", text:"消费者端数字化？", options:[
    {value:0,label:"纯线下，没有会员系统"},{value:1,label:"有基础会员卡但运营不够"},{value:2,label:"慢病会员管理+用药提醒+健康档案+在线问诊+O2O送药"}]
  },
  { id:"digital_5", dimension:"digital", dimensionLabel:"数字化", text:"数字化投入？", options:[
    {value:0,label:"基本没投入"},{value:1,label:"用了些工具但零散"},{value:2,label:"有数字化预算+IT团队或稳定外包，GSP合规数字化是底线投入"}]
  },
  { id:"digital_6", dimension:"digital", dimensionLabel:"数字化", text:"线上/O2O占比？", options:[
    {value:0,label:"没做线上"},{value:1,label:"接入美团/饿了么等O2O平台但运营粗放"},{value:2,label:"O2O药品配送占比20%+，处方外流承接+自营小程序+慢病续方"}]
  },
  { id:"digital_7", dimension:"digital", dimensionLabel:"数字化", text:"实时数据可见度？", options:[
    {value:0,label:"月底才能看到汇总"},{value:1,label:"次日能看到昨日数据"},{value:2,label:"实时看板（各店销售/处方量/慢病会员/效期预警/GSP合规状态），异常即时告警"}]
  },
  { id:"digital_8", dimension:"digital", dimensionLabel:"数字化", text:"行业数字化自评？", options:[
    {value:0,label:"低于行业平均"},{value:1,label:"跟大部分同行差不多"},{value:2,label:"数字化是竞争加分项（O2O处方承接/慢病管理/智能审方）"}]
  },
  { id:"model_7", dimension:"model", dimensionLabel:"商业模式", text:"单店盈利模型？", options:[
    {value:0,label:"没有精细化算过"},{value:1,label:"知道大概毛利和回本周期但没细分到品类/医保/非药"},{value:2,label:"单店模型标准化（处方药/OTC/非药/医保统筹毛利分层+坪效+人效），新店可预测"}]
  },
  { id:"model_8", dimension:"model", dimensionLabel:"商业模式", text:"投资回报周期？", options:[
    {value:0,label:"没算过或远超预期"},{value:1,label:"回本周期在行业常见范围但不稳定"},{value:2,label:"回本周期稳定且优于行业平均，医保统筹店有政策红利"}]
  },
  { id:"training_6", dimension:"training", dimensionLabel:"培训体系", text:"药师/店员培训？", options:[
    {value:0,label:"招来就上岗，无系统培训"},{value:1,label:"有入职培训但药学专业知识培训不足"},{value:2,label:"药学到GSP合规到慢病服务全岗位标准化培训+药师继续教育+考核认证"}]
  },
  { id:"training_7", dimension:"training", dimensionLabel:"培训体系", text:"培训教材？", options:[
    {value:0,label:"口头传授无教材"},{value:1,label:"有纸质GSP手册但更新不及时"},{value:2,label:"全岗位培训素材（药品知识/GSP法规/慢病服务）+定期更新+考核题库"}]
  },
  { id:"training_8", dimension:"training", dimensionLabel:"培训体系", text:"加盟店培训？", options:[
    {value:0,label:"收了加盟费就不管了"},{value:1,label:"开业前培训+开业带教但没有持续"},{value:2,label:"开业前系统培训（GSP+药学+运营）+开业后持续赋能，加盟培训标准与直营一致"}]
  },
  { id:"supervision_6", dimension:"supervision", dimensionLabel:"督导体系", text:"GSP合规检查？", options:[
    {value:0,label:"不定期走马观花"},{value:1,label:"定期检查但深度不够"},{value:2,label:"GSP专项巡店（温湿度/处方/效期/药师在岗四大模块）+评分报告+整改闭环"}]
  },
  { id:"supervision_7", dimension:"supervision", dimensionLabel:"督导体系", text:"神秘顾客/顾客体验？", options:[
    {value:0,label:"没有"},{value:1,label:"偶尔做不系统"},{value:2,label:"季度神秘顾客+药学服务满意度调查+线上评价监测+与GSP督导互相验证"}]
  },
  { id:"supervision_8", dimension:"supervision", dimensionLabel:"督导体系", text:"GSP合规信心？", options:[
    {value:0,label:"完全没信心，每次飞检都紧张"},{value:1,label:"大部分门店还行但总担心出问题"},{value:2,label:"有数据支撑+系统化GSP管理，飞检通过率>95%"}]
  },
];

// 教育
const 教育: Question[] = [
  { id:"operation_1", dimension:"operation", dimensionLabel:"运营标准化", text:"课程标准化？", options:[
    {value:0,label:"每个老师自己定内容，没有统一标准"},{value:1,label:"有大纲但教学内容和节奏差异化大"},{value:2,label:"课程全流程标准化（引入-讲授-练习-总结时间结构固定）+测评标准化"}]
  },
  { id:"operation_2", dimension:"operation", dimensionLabel:"运营标准化", text:"教学交付一致性？", options:[
    {value:0,label:"同一门课不同老师完全看个人能力"},{value:1,label:"核心课程基本一致但拓展内容差异明显"},{value:2,label:"同课不同师交付体验一致+阶段测评结果偏差<15%+家长满意度稳定"}]
  },
  { id:"operation_3", dimension:"operation", dimensionLabel:"运营标准化", text:"新校区开业标准化？", options:[
    {value:0,label:"每次开新校区都不一样"},{value:1,label:"有开店流程但师资储备跟不上"},{value:2,label:"标准化选址+教室配置+师资前置储备，新校区首月即标准运营"}]
  },
  { id:"operation_4", dimension:"operation", dimensionLabel:"运营标准化", text:"日常运营管理？", options:[
    {value:0,label:"排课/点名/考勤全靠人工"},{value:1,label:"有基本流程但课后反馈/续费跟进靠顾问"},{value:2,label:"系统化管理（排课系统+学员全生命周期+家校互通），运营效率可量化"}]
  },
  { id:"operation_5", dimension:"operation", dimensionLabel:"运营标准化", text:"课程产品结构？", options:[
    {value:0,label:"有什么老师开什么课"},{value:1,label:"有核心课程但新课程开发慢"},{value:2,label:"课程产品矩阵清晰（引流课→正价课→续费课→高端课），数据驱动课程迭代"}]
  },
  { id:"operation_6", dimension:"operation", dimensionLabel:"运营标准化", text:"校区空间标准化？", options:[
    {value:0,label:"每个校区装修不同"},{value:1,label:"有VI手册但教室配置差异大"},{value:2,label:"完整SI体系（按校区类型分级：旗舰/标准/社区），教室功能分区+安全标准统一"}]
  },
  { id:"operation_7", dimension:"operation", dimensionLabel:"运营标准化", text:"名师离职抗风险？", options:[
    {value:0,label:"名师离职带走40-60%生源"},{value:1,label:"有教师储备但过渡期较久"},{value:2,label:"课程标准化+教师培训体系+品牌吸引力，换老师续费率波动<10%"}]
  },
  { id:"operation_8", dimension:"operation", dimensionLabel:"运营标准化", text:"教学标准持续优化？", options:[
    {value:0,label:"标准定下来就不动"},{value:1,label:"年度修订但不系统"},{value:2,label:"数据驱动（测评结果/续费率/家长反馈）+优秀教师经验萃取+季度迭代"}]
  },
  { id:"supply_chain_1", dimension:"supply_chain", dimensionLabel:"供应链", text:"师资供给管理？", options:[
    {value:0,label:"临时招聘，找老师靠运气"},{value:1,label:"有固定招聘渠道但储备不足"},{value:2,label:"多渠道师资供给+储备池+兼职教师管理系统+供给能匹配扩张节奏"}]
  },
  { id:"supply_chain_2", dimension:"supply_chain", dimensionLabel:"供应链", text:"教学质量管控？", options:[
    {value:0,label:"没法管控，全靠老师个人"},{value:1,label:"有听课制度但不系统"},{value:2,label:"标准化师训体系+教学评估+阶段测评反馈+教师能力画像，质量可追踪"}]
  },
  { id:"supply_chain_3", dimension:"supply_chain", dimensionLabel:"供应链", text:"课程内容开发？", options:[
    {value:0,label:"老师自己找教材凑合"},{value:1,label:"有课程研发但不系统"},{value:2,label:"教研中台统一课程开发+标准化课件+定期更新+AI辅助备课"}]
  },
  { id:"supply_chain_4", dimension:"supply_chain", dimensionLabel:"供应链", text:"名师依赖度？", options:[
    {value:0,label:"核心名师集中度过高，50%以上营收靠少数人"},{value:1,label:"名师集中度30-50%有去名师化动作但效果有限"},{value:2,label:"名师集中度<20%，课程标准化+品牌IP去名师化，系统大于个人"}]
  },
  { id:"supply_chain_5", dimension:"supply_chain", dimensionLabel:"供应链", text:"场地利用效率？", options:[
    {value:0,label:"场地闲置率高，教室利用率低"},{value:1,label:"有基本排课但高峰期/低谷期利用不均"},{value:2,label:"教室利用率>70%，坪效在行业中上水平，多时段复用"}]
  },
  { id:"supply_chain_6", dimension:"supply_chain", dimensionLabel:"供应链", text:"知识产权保护？", options:[
    {value:0,label:"没有保护意识"},{value:1,label:"有意识但缺乏措施"},{value:2,label:"课程知识产权保护+竞业协议+知识资产数字化固化"}]
  },
  { id:"supply_chain_7", dimension:"supply_chain", dimensionLabel:"供应链", text:"新城市师资储备？", options:[
    {value:0,label:"师资是扩张瓶颈"},{value:1,label:"能解决但师资质量参差不齐"},{value:2,label:"师训中心培养+异地储备池+远程双师等模式，新城市开业即配齐师资"}]
  },
  { id:"supply_chain_8", dimension:"supply_chain", dimensionLabel:"供应链", text:"数字化教研？", options:[
    {value:0,label:"全靠人工"},{value:1,label:"有基础内容管理系统"},{value:2,label:"教研中台+AI辅助备课+教师能力画像+标准化课件一键分发"}]
  },
  { id:"digital_1", dimension:"digital", dimensionLabel:"数字化", text:"系统覆盖？", options:[
    {value:0,label:"基本没有数字化"},{value:1,label:"有排课+点名基础系统"},{value:2,label:"核心系统覆盖（排课+教师画像+学员LTV管理+家校平台+营销获客）"}]
  },
  { id:"digital_2", dimension:"digital", dimensionLabel:"数字化", text:"数据打通？", options:[
    {value:0,label:"各环节数据散落"},{value:1,label:"部分打通但不完整"},{value:2,label:"学员全生命周期打通（试听→报名→出勤→测评→续费→转介绍→流失回流），数据画像完整"}]
  },
  { id:"digital_3", dimension:"digital", dimensionLabel:"数字化", text:"数据驱动决策？", options:[
    {value:0,label:"纯凭经验"},{value:1,label:"月底看人数和收入"},{value:2,label:"实时看板+数据驱动（满班率/续费率/CAC/LTV）+预警（续费到期/出勤下滑）"}]
  },
  { id:"digital_4", dimension:"digital", dimensionLabel:"数字化", text:"学员/家长端数字化？", options:[
    {value:0,label:"纯线下无线上"},{value:1,label:"有公众号但功能单一"},{value:2,label:"学员端（在线作业/阶段测评/学习报告）+家长端（成长档案/家校沟通/缴费续费），体验完整体"}]
  },
  { id:"digital_5", dimension:"digital", dimensionLabel:"数字化", text:"数字化投入？", options:[
    {value:0,label:"基本没投入"},{value:1,label:"用了些工具但零散"},{value:2,label:"有数字化预算+团队或稳定外包，数字化是核心竞争力"}]
  },
  { id:"digital_6", dimension:"digital", dimensionLabel:"数字化", text:"线上课程占比？", options:[
    {value:0,label:"没有线上课"},{value:1,label:"有录播课但销量低，线上线下割裂"},{value:2,label:"线上课程占比20%+或混合模式成熟，线上线下互相导流"}]
  },
  { id:"digital_7", dimension:"digital", dimensionLabel:"数字化", text:"实时数据可见度？", options:[
    {value:0,label:"月底看汇总"},{value:1,label:"次日看昨日数据"},{value:2,label:"实时看板（各校区出勤/续费/课消/测评/获客成本），异常即时预警"}]
  },
  { id:"digital_8", dimension:"digital", dimensionLabel:"数字化", text:"行业数字化自评？", options:[
    {value:0,label:"低于行业平均"},{value:1,label:"跟大部分同行差不多"},{value:2,label:"数字化是竞争加分项（AI个性化/家校平台/OMO）"}]
  },
  { id:"model_7", dimension:"model", dimensionLabel:"商业模式", text:"单店盈利模型？", options:[
    {value:0,label:"没有精细化算过"},{value:1,label:"知道大概营收和利润但没有细分到班型/客单价"},{value:2,label:"单校区模型标准化（满班率/续费率/客单价/坪效/人效），新校区可预测"}]
  },
  { id:"model_8", dimension:"model", dimensionLabel:"商业模式", text:"投资回报周期？", options:[
    {value:0,label:"没算过或远超预期"},{value:1,label:"回本周期在行业常见范围但受资金监管影响"},{value:2,label:"回本周期稳定（12-18个月以内），投资回报可预测"}]
  },
  { id:"training_6", dimension:"training", dimensionLabel:"培训体系", text:"新教师上岗？", options:[
    {value:0,label:"招来就上课，没有系统培训"},{value:1,label:"有入职培训但实操靠师傅带"},{value:2,label:"标准化师训体系（课程教学SOP+试讲评估+师傅带教+考核认证上岗）"}]
  },
  { id:"training_7", dimension:"training", dimensionLabel:"培训体系", text:"师训教材？", options:[
    {value:0,label:"口头传授无教材"},{value:1,label:"有纸质教案但更新不及时"},{value:2,label:"全课程标准化师训教材+视频示范课+教学能力评估题库+定期更新"}]
  },
  { id:"training_8", dimension:"training", dimensionLabel:"培训体系", text:"教师成长体系？", options:[
    {value:0,label:"没有明确成长路径"},{value:1,label:"有初级→中级→高级的分级但不系统"},{value:2,label:"教师能力画像+分级成长路径+持续师训赋能+晋升机制透明"}]
  },
  { id:"supervision_6", dimension:"supervision", dimensionLabel:"督导体系", text:"教学督导重点？", options:[
    {value:0,label:"不定期听课走马观花"},{value:1,label:"定期听课但反馈深度不够"},{value:2,label:"教学督导标准明确（课堂互动30%+教学目标达成30%+学生参与25%+课堂管理15%）+评分报告"}]
  },
  { id:"supervision_7", dimension:"supervision", dimensionLabel:"督导体系", text:"家长满意度监测？", options:[
    {value:0,label:"没有"},{value:1,label:"偶尔做调查但不系统"},{value:2,label:"季度家长满意度调查+退费分析+线上口碑监测+结果与教师绩效挂钩"}]
  },
  { id:"supervision_8", dimension:"supervision", dimensionLabel:"督导体系", text:"教学质量信心？", options:[
    {value:0,label:"完全没信心"},{value:1,label:"大部分还行但心里没底"},{value:2,label:"有续费率/测评数据/满意度数据支撑，教学质量可量化且90%+达标"}]
  },
];

// 服饰
const 服饰: Question[] = [
  { id:"operation_1", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准覆盖？", options:[
    {value:0,label:"没有统一标准，各店各凭本事"},{value:1,label:"有基本制度但陈列/服务/促销执行差异大"},{value:2,label:"全流程标准化（服务七步法+陈列棚割图+开业/收货/盘点SOP），督导检查执行"}]
  },
  { id:"operation_2", dimension:"operation", dimensionLabel:"运营标准化", text:"服务一致性？", options:[
    {value:0,label:"不同门店服务体验天差地别"},{value:1,label:"核心门店服务好但一般门店差距大"},{value:2,label:"服务七步法标准化执行（迎宾-探需-搭配-试穿-成交-附加-加微信），神秘顾客检查一致"}]
  },
  { id:"operation_3", dimension:"operation", dimensionLabel:"运营标准化", text:"新店开业标准化？", options:[
    {value:0,label:"开新店靠运气"},{value:1,label:"有开店流程但品类模型不够精细"},{value:2,label:"标准化开店手册+按店型分级货品（商场店/街铺/奥莱不同配置）+固定开店周期"}]
  },
  { id:"operation_4", dimension:"operation", dimensionLabel:"运营标准化", text:"店铺日常运营？", options:[
    {value:0,label:"收货/上架/陈列/盘点全靠店长"},{value:1,label:"有基本流程但补货/调拨/促销靠经验"},{value:2,label:"核心流程标准化（陈列棚割图+智能补货+调拨）+督导检查执行闭环"}]
  },
  { id:"operation_5", dimension:"operation", dimensionLabel:"运营标准化", text:"商品结构管理？", options:[
    {value:0,label:"全靠买手/店长经验"},{value:1,label:"有基本商品分类但滞销处理不及时"},{value:2,label:"商品生命周期管理（新品试销→数据评估→爆款放大→季末消化），季末售罄率>75%"}]
  },
  { id:"operation_6", dimension:"operation", dimensionLabel:"运营标准化", text:"门店空间标准化？", options:[
    {value:0,label:"每家店装修风格不一"},{value:1,label:"有VI但不同店差异大"},{value:2,label:"完整SI体系+棚割图管理+VM陈列指引，按店型分级配置"}]
  },
  { id:"operation_7", dimension:"operation", dimensionLabel:"运营标准化", text:"店长离职抗风险？", options:[
    {value:0,label:"店长离职销售直接下滑"},{value:1,label:"有区域经理补位但过渡期销售受影响"},{value:2,label:"标准化运营+系统支撑+店长储备池，换人业绩波动<10%"}]
  },
  { id:"operation_8", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准优化？", options:[
    {value:0,label:"标准不动"},{value:1,label:"年度修订但不系统"},{value:2,label:"数据驱动+标杆门店萃取+季度迭代到所有门店"}]
  },
  { id:"supply_chain_1", dimension:"supply_chain", dimensionLabel:"供应链", text:"采购模式？", options:[
    {value:0,label:"批发市场拿货为主"},{value:1,label:"部分品牌代理+部分自采"},{value:2,label:"期货订货+柔供快反占比>30%+自有品牌开发，供应链灵活可控"}]
  },
  { id:"supply_chain_2", dimension:"supply_chain", dimensionLabel:"供应链", text:"库存周转健康度？", options:[
    {value:0,label:"没算过周转率"},{value:1,label:"知道大概但控不住"},{value:2,label:"库存周转率在行业中上水平+季末售罄率>75%+库龄结构健康"}]
  },
  { id:"supply_chain_3", dimension:"supply_chain", dimensionLabel:"供应链", text:"配补调能力？", options:[
    {value:0,label:"补货靠人工电话/微信"},{value:1,label:"有基础调拨但响应慢"},{value:2,label:"智能配补调系统（畅销款自动补货+滞销款自动调拨+区域库存优化），补货周期<3天"}]
  },
  { id:"supply_chain_4", dimension:"supply_chain", dimensionLabel:"供应链", text:"库存风险？", options:[
    {value:0,label:"畅销款缺货率高+滞销款积压严重"},{value:1,label:"有一定管理但缺货/积压并存"},{value:2,label:"畅销款缺货率<5%+滞销款占比<15%+季末售罄率>75%"}]
  },
  { id:"supply_chain_5", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链成本优势？", options:[
    {value:0,label:"不知道或成本高于同行"},{value:1,label:"在行业均值范围内"},{value:2,label:"自有品牌+柔供快反+规模集采使综合毛利高于同行3-5个百分点"}]
  },
  { id:"supply_chain_6", dimension:"supply_chain", dimensionLabel:"供应链", text:"品牌代理依赖度？", options:[
    {value:0,label:"严重依赖少数品牌代理"},{value:1,label:"多品牌代理但品牌方话语权强"},{value:2,label:"自有品牌对冲+多品牌组合+买手多元化，不依赖单一品牌"}]
  },
  { id:"supply_chain_7", dimension:"supply_chain", dimensionLabel:"供应链", text:"新城市仓配能力？", options:[
    {value:0,label:"扩张瓶颈"},{value:1,label:"能覆盖但要新建仓"},{value:2,label:"仓配网络可快速扩展，新城市1-2个月就位"}]
  },
  { id:"supply_chain_8", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链数字化？", options:[
    {value:0,label:"全靠电话/微信/Excel"},{value:1,label:"有基础进销存"},{value:2,label:"全链路数字化（订货→配货→调拨→门店）+智能补货+单店商品画像"}]
  },
  { id:"digital_1", dimension:"digital", dimensionLabel:"数字化", text:"系统覆盖？", options:[
    {value:0,label:"基本没有"},{value:1,label:"有POS+会员基础系统"},{value:2,label:"核心系统覆盖（POS+智能配补调+单店商品画像+会员CRM+导购助手）"}]
  },
  { id:"digital_2", dimension:"digital", dimensionLabel:"数字化", text:"全渠道库存通？", options:[
    {value:0,label:"线上线下库存不互通"},{value:1,label:"部分打通但库存不准"},{value:2,label:"全渠道库存实时同步，门店可发线上订单，线上可查门店库存"}]
  },
  { id:"digital_3", dimension:"digital", dimensionLabel:"数字化", text:"数据驱动决策？", options:[
    {value:0,label:"纯凭经验"},{value:1,label:"月底看销售报表"},{value:2,label:"实时看板+智能建议（选品/配货/调拨/促销效果分析），数据驱动日常运营"}]
  },
  { id:"digital_4", dimension:"digital", dimensionLabel:"数字化", text:"导购赋能？", options:[
    {value:0,label:"导购没有任何数字化工具"},{value:1,label:"有基础会员查询功能"},{value:2,label:"导购助手（会员画像+搭配推荐+库存查询+线上成交闭环），赋能导购提升连带率和客单价"}]
  },
  { id:"digital_5", dimension:"digital", dimensionLabel:"数字化", text:"数字化投入？", options:[
    {value:0,label:"基本没投入"},{value:1,label:"用了些工具但零散"},{value:2,label:"有数字化预算+专职团队或稳定外包，数字化是战略级投入"}]
  },
  { id:"digital_6", dimension:"digital", dimensionLabel:"数字化", text:"全渠道占比？", options:[
    {value:0,label:"纯线下"},{value:1,label:"做了电商/小程序但线上线下割裂"},{value:2,label:"全渠道占比20%+（门店+小程序+电商+直播），线上线下库存通+会员通"}]
  },
  { id:"digital_7", dimension:"digital", dimensionLabel:"数字化", text:"实时数据可见度？", options:[
    {value:0,label:"月底看汇总"},{value:1,label:"次日看昨日数据"},{value:2,label:"实时看板（各店销售/客流/售罄率/库销比/坪效），可下钻到单品/导购"}]
  },
  { id:"digital_8", dimension:"digital", dimensionLabel:"数字化", text:"行业数字化自评？", options:[
    {value:0,label:"低于行业平均"},{value:1,label:"跟大部分同行差不多"},{value:2,label:"数字化是竞争加分项（智能配补调/全渠道/导购赋能）"}]
  },
  { id:"model_7", dimension:"model", dimensionLabel:"商业模式", text:"单店模型？", options:[
    {value:0,label:"没有精细化算过"},{value:1,label:"知道大概毛利和回本周期"},{value:2,label:"单店模型标准化（坪效/人效/售罄率/库销比/回本周期），按店型分级管理"}]
  },
  { id:"model_8", dimension:"model", dimensionLabel:"商业模式", text:"投资回报周期？", options:[
    {value:0,label:"没算过或远超预期"},{value:1,label:"回本周期在行业常见范围内但不稳定"},{value:2,label:"回本周期稳定（12-18个月以内），投资回报可预测"}]
  },
  { id:"training_6", dimension:"training", dimensionLabel:"培训体系", text:"导购上岗？", options:[
    {value:0,label:"招来就上岗全靠老员工带"},{value:1,label:"有入职培训但不系统"},{value:2,label:"标准化培训（商品知识+服务七步法+搭配技巧+系统操作+考核认证上岗）"}]
  },
  { id:"training_7", dimension:"training", dimensionLabel:"培训体系", text:"培训教材？", options:[
    {value:0,label:"口头传授无教材"},{value:1,label:"有纸质手册但更新不及时"},{value:2,label:"全岗位视频化培训素材+商品知识库+新季度/新系列上线即更新培训内容"}]
  },
  { id:"training_8", dimension:"training", dimensionLabel:"培训体系", text:"加盟商培训？", options:[
    {value:0,label:"收了加盟费就不管了"},{value:1,label:"开业前培训+开业带教但没有持续"},{value:2,label:"系统培训（开业前+新季新货培训+月度销售分析辅导），加盟标准与直营一致"}]
  },
  { id:"supervision_6", dimension:"supervision", dimensionLabel:"督导体系", text:"巡店重点？", options:[
    {value:0,label:"不定期走马观花"},{value:1,label:"约一个月一次主要看卫生"},{value:2,label:"明确频次+分级标准（陈列棚割图执行30%+服务七步法30%+商品结构25%+环境15%）"}]
  },
  { id:"supervision_7", dimension:"supervision", dimensionLabel:"督导体系", text:"神秘顾客？", options:[
    {value:0,label:"没有"},{value:1,label:"偶尔做不系统"},{value:2,label:"季度神秘顾客+顾客满意度调查+线上评价监测+与督导结果互相验证"}]
  },
  { id:"supervision_8", dimension:"supervision", dimensionLabel:"督导体系", text:"品质信心？", options:[
    {value:0,label:"完全没信心"},{value:1,label:"大部分还行但心里没底"},{value:2,label:"有数据支撑（陈列执行率/服务检查分/客诉率在可控范围），90%+门店达标"}]
  },
];

// 酒类
const 酒类: Question[] = [
  { id:"operation_1", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准覆盖？", options:[
    {value:0,label:"没有统一标准，各店各管各"},{value:1,label:"有基本制度但门店执行差异大"},{value:2,label:"全流程标准化（品控验收+陈列标准+大客户拜访SOP+品鉴会流程），督导检查执行"}]
  },
  { id:"operation_2", dimension:"operation", dimensionLabel:"运营标准化", text:"正品保障？", options:[
    {value:0,label:"没有品控机制，假货风险存在"},{value:1,label:"有入库检查但不系统"},{value:2,label:"一物一码溯源+入库防调包+正品保真体系+消费者可验真"}]
  },
  { id:"operation_3", dimension:"operation", dimensionLabel:"运营标准化", text:"新店开业标准化？", options:[
    {value:0,label:"开新店靠运气"},{value:1,label:"有开店流程但烟草证办理周期不可控"},{value:2,label:"标准化开店（选址+烟草证+品类配置+陈列标准），开店周期可控"}]
  },
  { id:"operation_4", dimension:"operation", dimensionLabel:"运营标准化", text:"日常运营管理？", options:[
    {value:0,label:"名酒配额分配/资金占用管理全靠经验"},{value:1,label:"有基本制度但配额利用率/资金周转看店长"},{value:2,label:"系统化管理（名酒配额智能分配+库存周转监控+资金占用预警），运营效率量化"}]
  },
  { id:"operation_5", dimension:"operation", dimensionLabel:"运营标准化", text:"产品结构管理？", options:[
    {value:0,label:"有什么酒卖什么酒无规划"},{value:1,label:"有基本结构但数据驱动不足"},{value:2,label:"品类分级（名酒引流+品类酒利润+自有品牌高毛利），数据驱动结构优化"}]
  },
  { id:"operation_6", dimension:"operation", dimensionLabel:"运营标准化", text:"门店空间标准化？", options:[
    {value:0,label:"每家店布局不同"},{value:1,label:"有VI但执行差异大"},{value:2,label:"完整SI体系+按品牌/价位/场景分区陈列+品鉴体验区标准化"}]
  },
  { id:"operation_7", dimension:"operation", dimensionLabel:"运营标准化", text:"店长离职抗风险？", options:[
    {value:0,label:"店长离职=团购客户流失"},{value:1,label:"有客户交接但团购关系重建难"},{value:2,label:"团购CRM+客户资产公司化+标准化服务，个人离职客户不流失"}]
  },
  { id:"operation_8", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准优化？", options:[
    {value:0,label:"标准不动"},{value:1,label:"年度修订但不系统"},{value:2,label:"数据驱动+标杆门店萃取+季度迭代"}]
  },
  { id:"supply_chain_1", dimension:"supply_chain", dimensionLabel:"供应链", text:"名酒配额获取？", options:[
    {value:0,label:"茅台/五粮液拿不到货，依赖二批"},{value:1,label:"有部分直供配额但不够分"},{value:2,label:"名酒配额稳定获取+品牌方直供+渠道关系深耕"}]
  },
  { id:"supply_chain_2", dimension:"supply_chain", dimensionLabel:"供应链", text:"防伪溯源？", options:[
    {value:0,label:"没有品控机制"},{value:1,label:"有人工抽检但不系统"},{value:2,label:"一物一码全链路溯源+入库防调包+消费者扫码验真"}]
  },
  { id:"supply_chain_3", dimension:"supply_chain", dimensionLabel:"供应链", text:"仓配体系？", options:[
    {value:0,label:"供应商分散配送"},{value:1,label:"有仓库但温控/防破损不完善"},{value:2,label:"专业酒类仓配（温控+防震+防盗），配送覆盖核心区域，破损率<0.1%"}]
  },
  { id:"supply_chain_4", dimension:"supply_chain", dimensionLabel:"供应链", text:"库存周转？", options:[
    {value:0,label:"周转率极低（<1.5次/年），资金占用大"},{value:1,label:"周转率1.5-3次/年"},{value:2,label:"库存周转率>3次/年+资金占用优化+滞销品及时消化"}]
  },
  { id:"supply_chain_5", dimension:"supply_chain", dimensionLabel:"供应链", text:"自有品牌/定制酒？", options:[
    {value:0,label:"没有"},{value:1,label:"有但占比<5%"},{value:2,label:"自有品牌/定制酒占比>15%，毛利贡献显著高于名酒"}]
  },
  { id:"supply_chain_6", dimension:"supply_chain", dimensionLabel:"供应链", text:"名酒配额风险？", options:[
    {value:0,label:"严重依赖少数配额"},{value:1,label:"多品牌分散但名酒仍占大头"},{value:2,label:"名酒+品类酒+自有品牌组合，不依赖单一品牌配额"}]
  },
  { id:"supply_chain_7", dimension:"supply_chain", dimensionLabel:"供应链", text:"新城市烟草证/配额？", options:[
    {value:0,label:"烟草证是最大障碍"},{value:1,label:"能办理但周期长（3-6个月）"},{value:2,label:"标准化办证流程+提前储备+合规运营，新城市2-3个月就位"}]
  },
  { id:"supply_chain_8", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链数字化？", options:[
    {value:0,label:"全靠电话/微信"},{value:1,label:"有基础进销存"},{value:2,label:"一物一码+防窜货系统+库存可视化+配额智能管理"}]
  },
  { id:"digital_1", dimension:"digital", dimensionLabel:"数字化", text:"系统覆盖？", options:[
    {value:0,label:"基本没有"},{value:1,label:"有POS+基础进销存"},{value:2,label:"一物一码溯源+防窜货+团购CRM+私域运营系统"}]
  },
  { id:"digital_2", dimension:"digital", dimensionLabel:"数字化", text:"数据打通？", options:[
    {value:0,label:"各系统不互通"},{value:1,label:"部分打通但数据不准"},{value:2,label:"核心系统打通（溯源+进销存+CRM+财务），总部看全局"}]
  },
  { id:"digital_3", dimension:"digital", dimensionLabel:"数字化", text:"数据驱动决策？", options:[
    {value:0,label:"纯凭经验"},{value:1,label:"月底看报表"},{value:2,label:"实时看板（各店销售/配额利用率/库存/窜货预警），数据驱动运营"}]
  },
  { id:"digital_4", dimension:"digital", dimensionLabel:"数字化", text:"消费者端/团购CRM？", options:[
    {value:0,label:"没有团购系统"},{value:1,label:"有Excel记录团购客户"},{value:2,label:"团购CRM+私域社群+品鉴活动管理+复购分析，大客户精细化运营"}]
  },
  { id:"digital_5", dimension:"digital", dimensionLabel:"数字化", text:"数字化投入？", options:[
    {value:0,label:"基本没投入"},{value:1,label:"用了些工具但零散"},{value:2,label:"有数字化预算+团队或稳定外包，数字化是竞争利器"}]
  },
  { id:"digital_6", dimension:"digital", dimensionLabel:"数字化", text:"线上/私域占比？", options:[
    {value:0,label:"没有线上"},{value:1,label:"有微信但运营粗放"},{value:2,label:"私域复购率可追踪+线上订单占比提升+社群直播等新渠道"}]
  },
  { id:"digital_7", dimension:"digital", dimensionLabel:"数字化", text:"实时数据可见度？", options:[
    {value:0,label:"月底看汇总"},{value:1,label:"次日看昨日数据"},{value:2,label:"实时看板（各店销售/名酒配额/库存/窜货预警/团购跟进），异常即时告警"}]
  },
  { id:"digital_8", dimension:"digital", dimensionLabel:"数字化", text:"行业数字化自评？", options:[
    {value:0,label:"低于行业平均"},{value:1,label:"跟大部分同行差不多"},{value:2,label:"数字化是竞争加分项（防窜货/团购CRM/私域运营）"}]
  },
  { id:"model_7", dimension:"model", dimensionLabel:"商业模式", text:"单店模型？", options:[
    {value:0,label:"没有精细化算过"},{value:1,label:"知道大概毛利和回本周期"},{value:2,label:"单店模型标准化（名酒配额缺口+品类酒毛利+团购占比+资金周转），新店可预测"}]
  },
  { id:"model_8", dimension:"model", dimensionLabel:"商业模式", text:"投资回报周期？", options:[
    {value:0,label:"没算过或远超预期"},{value:1,label:"回本周期在行业常见范围但不稳定"},{value:2,label:"回本周期稳定+优于行业平均，投资回报可预测"}]
  },
  { id:"training_6", dimension:"training", dimensionLabel:"培训体系", text:"店员上岗？", options:[
    {value:0,label:"招来就上岗全靠老员工带"},{value:1,label:"有入职培训但不系统"},{value:2,label:"标准化培训（产品知识+防伪鉴别+团购话术+品鉴流程+系统操作+考核认证上岗）"}]
  },
  { id:"training_7", dimension:"training", dimensionLabel:"培训体系", text:"培训教材？", options:[
    {value:0,label:"口头传授无教材"},{value:1,label:"有基础手册但更新不及时"},{value:2,label:"全岗位视频化培训素材+产品知识库+新品上线即更新+品鉴技能培训"}]
  },
  { id:"training_8", dimension:"training", dimensionLabel:"培训体系", text:"加盟商培训？", options:[
    {value:0,label:"收了加盟费就不管了"},{value:1,label:"开业前培训+开业带教但没有持续"},{value:2,label:"系统培训（开业前+防伪溯源+名酒配额管理+月度经营分析辅导），加盟标准与直营一致"}]
  },
  { id:"supervision_6", dimension:"supervision", dimensionLabel:"督导体系", text:"巡店检查重点？", options:[
    {value:0,label:"不定期走马观花"},{value:1,label:"定期检查但深度不够"},{value:2,label:"专项检查（防伪溯源20%+陈列标准20%+名酒配额管理20%+团购回访20%+合规20%），每次出评分报告"}]
  },
  { id:"supervision_7", dimension:"supervision", dimensionLabel:"督导体系", text:"神秘顾客/顾客体验？", options:[
    {value:0,label:"没有"},{value:1,label:"偶尔做不系统"},{value:2,label:"季度神秘顾客+团购客户回访+防伪溯源抽查+与内部督导互相验证"}]
  },
  { id:"supervision_8", dimension:"supervision", dimensionLabel:"督导体系", text:"品质信心？", options:[
    {value:0,label:"完全没信心，窜货和假货防不住"},{value:1,label:"大部分店还行但偏远门店心里没底"},{value:2,label:"有数据支撑（溯源覆盖率/窜货率/客户满意度在可控范围），90%+门店达标"}]
  },
];

// 家电
const 家电: Question[] = [
  { id:"operation_1", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准覆盖？", options:[
    {value:0,label:"没有统一标准，各店各管各"},{value:1,label:"有基本制度但安装/售后执行差异大"},{value:2,label:"全流程标准化（上门安装七步法+售后响应SLA+客服话术库+场景化体验区陈列），督导检查执行"}]
  },
  { id:"operation_2", dimension:"operation", dimensionLabel:"运营标准化", text:"安装服务质量？", options:[
    {value:0,label:"一次差评安装拉低NPS15-25点"},{value:1,label:"有标准流程但外包管控不足"},{value:2,label:"安装满意度>95%+售后一次解决率>85%+客诉SLA达标率>90%"}]
  },
  { id:"operation_3", dimension:"operation", dimensionLabel:"运营标准化", text:"新店开业标准化？", options:[
    {value:0,label:"开新店靠运气"},{value:1,label:"有开店流程但品类配置不够精细"},{value:2,label:"标准化开店手册+按店型分级品类（旗舰/标准/社区），新店首月即标准化运营"}]
  },
  { id:"operation_4", dimension:"operation", dimensionLabel:"运营标准化", text:"日常运营管理？", options:[
    {value:0,label:"安装/售后/库存全凭经验"},{value:1,label:"有基本制度但执行差异大"},{value:2,label:"系统化管理（安装派单+售后工单+库存管理+导购绩效），运营效率可量化"}]
  },
  { id:"operation_5", dimension:"operation", dimensionLabel:"运营标准化", text:"产品结构管理？", options:[
    {value:0,label:"有什么品牌卖什么，无规划"},{value:1,label:"有基本分类但新品类拓展不足"},{value:2,label:"品类结构优化（传统大家电+智能家居/清洁电器/个护小电组合），新品类占比提升"}]
  },
  { id:"operation_6", dimension:"operation", dimensionLabel:"运营标准化", text:"门店体验标准化？", options:[
    {value:0,label:"传统陈列方式无体验感"},{value:1,label:"有体验区但执行差异大"},{value:2,label:"完整场景化体验体系（智能家居/厨房/清洁场景）+标准化体验动线+数据追踪"}]
  },
  { id:"operation_7", dimension:"operation", dimensionLabel:"运营标准化", text:"店长离职抗风险？", options:[
    {value:0,label:"店长离职业绩大幅下滑"},{value:1,label:"有补位但过渡期销售受影响"},{value:2,label:"标准化运营+导购系统+客户CRM，业绩波动<10%"}]
  },
  { id:"operation_8", dimension:"operation", dimensionLabel:"运营标准化", text:"运营标准优化？", options:[
    {value:0,label:"标准不动"},{value:1,label:"年度修订但不系统"},{value:2,label:"数据驱动+标杆门店萃取+季度迭代"}]
  },
  { id:"supply_chain_1", dimension:"supply_chain", dimensionLabel:"供应链", text:"品牌采购模式？", options:[
    {value:0,label:"完全依赖厂家区域代理，几无定价权和选品权"},{value:1,label:"多品牌多品类代理，有一定议价能力"},{value:2,label:"多品牌组合+厂家直供占比高+选品能力独立"}]
  },
  { id:"supply_chain_2", dimension:"supply_chain", dimensionLabel:"供应链", text:"售后配件管理？", options:[
    {value:0,label:"配件管理混乱，经常缺件导致延期"},{value:1,label:"有配件库存但预测不准"},{value:2,label:"配件库存预测+区域仓调配+供应商协同，维修配件满足率>95%"}]
  },
  { id:"supply_chain_3", dimension:"supply_chain", dimensionLabel:"供应链", text:"仓配体系？", options:[
    {value:0,label:"供应商直送，物流成本高"},{value:1,label:"有仓库但大家电物流成本占比高（售价5-10%）"},{value:2,label:"仓配一体化+大家电专用物流+最后一公里配送安装一站式，物流成本持续优化"}]
  },
  { id:"supply_chain_4", dimension:"supply_chain", dimensionLabel:"供应链", text:"库存周转？", options:[
    {value:0,label:"周转率极低（<1.5次/年），单店库存500万+"},{value:1,label:"周转率1.5-2.5次/年"},{value:2,label:"库存周转率>2.5次/年+过气机型及时处理+新品类高周转"}]
  },
  { id:"supply_chain_5", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链成本优势？", options:[
    {value:0,label:"不知道或成本高于同行"},{value:1,label:"在行业均值范围内"},{value:2,label:"规模采购+仓配优化+售后服务降本使综合成本低于同行"}]
  },
  { id:"supply_chain_6", dimension:"supply_chain", dimensionLabel:"供应链", text:"品牌方依赖度？", options:[
    {value:0,label:"严重依赖少数品牌"},{value:1,label:"多品牌但品牌方话语权强"},{value:2,label:"品类多元+品牌组合+新品类自主选品，不依赖单一品牌"}]
  },
  { id:"supply_chain_7", dimension:"supply_chain", dimensionLabel:"供应链", text:"新城市扩展能力？", options:[
    {value:0,label:"扩张瓶颈"},{value:1,label:"能覆盖但仓配成本高"},{value:2,label:"仓配网络可复制，新城市2-3个月就位，成本可控"}]
  },
  { id:"supply_chain_8", dimension:"supply_chain", dimensionLabel:"供应链", text:"供应链数字化？", options:[
    {value:0,label:"全靠电话/微信"},{value:1,label:"有基础ERP"},{value:2,label:"进销存+配件管理+安装派单+售后工单全链路数字化+库存可视化"}]
  },
  { id:"digital_1", dimension:"digital", dimensionLabel:"数字化", text:"系统覆盖？", options:[
    {value:0,label:"基本没有"},{value:1,label:"有POS+ERP基础"},{value:2,label:"全渠道价格智能匹配+售后服务全链路+导购智能助手+场景化体验系统"}]
  },
  { id:"digital_2", dimension:"digital", dimensionLabel:"数字化", text:"全渠道价格管理？", options:[
    {value:0,label:"线上线下价格混乱"},{value:1,label:"有调价但跟不上变化"},{value:2,label:"全渠道价格智能匹配+竞品价格监控+动态调价，消费者体验一致"}]
  },
  { id:"digital_3", dimension:"digital", dimensionLabel:"数字化", text:"数据驱动决策？", options:[
    {value:0,label:"纯凭经验"},{value:1,label:"月底看报表"},{value:2,label:"实时看板+智能指南（品类坪效/安装满意度/竞品价格/库存预警），数据驱动运营"}]
  },
  { id:"digital_4", dimension:"digital", dimensionLabel:"数字化", text:"消费者端数字化？", options:[
    {value:0,label:"纯线下无线上"},{value:1,label:"有基础线上展示"},{value:2,label:"全渠道体验（门店场景化+小程序查询+安装进度推送+售后评价+复购推荐），线上线下无缝"}]
  },
  { id:"digital_5", dimension:"digital", dimensionLabel:"数字化", text:"数字化投入？", options:[
    {value:0,label:"基本没投入"},{value:1,label:"用了些工具但零散"},{value:2,label:"有数字化预算+专职团队或稳定外包，数字化是战略级投入"}]
  },
  { id:"digital_6", dimension:"digital", dimensionLabel:"数字化", text:"新品类占比？", options:[
    {value:0,label:"完全依赖传统大家电"},{value:1,label:"有尝试新品类但占比<10%"},{value:2,label:"智能家居/清洁电器/个护小电等新品类占比>25%，且持续增长"}]
  },
  { id:"digital_7", dimension:"digital", dimensionLabel:"数字化", text:"实时数据可见度？", options:[
    {value:0,label:"月底看汇总"},{value:1,label:"次日看昨日数据"},{value:2,label:"实时看板（各店销售/品类坪效/安装满意度/库存/竞品价格），可下钻到品类/导购"}]
  },
  { id:"digital_8", dimension:"digital", dimensionLabel:"数字化", text:"行业数字化自评？", options:[
    {value:0,label:"低于行业平均"},{value:1,label:"跟大部分同行差不多"},{value:2,label:"数字化是竞争加分项（全渠道价格匹配/售后服务/场景化体验）"}]
  },
  { id:"model_7", dimension:"model", dimensionLabel:"商业模式", text:"单店模型？", options:[
    {value:0,label:"没有精细化算过"},{value:1,label:"知道大概毛利和回本周期"},{value:2,label:"单店模型标准化（坪效/品类贡献/安装售后成本/库存周转），按店型分级管理"}]
  },
  { id:"model_8", dimension:"model", dimensionLabel:"商业模式", text:"投资回报周期？", options:[
    {value:0,label:"没算过或远超预期"},{value:1,label:"回本周期在行业常见范围但不稳定"},{value:2,label:"回本周期稳定+优于行业平均，投资回报可预测"}]
  },
  { id:"training_6", dimension:"training", dimensionLabel:"培训体系", text:"导购/安装人员上岗？", options:[
    {value:0,label:"招来就上岗全靠老员工带"},{value:1,label:"有入职培训但不系统"},{value:2,label:"标准化培训（产品知识+安装流程+场景化销售+售后话术+系统操作+考核认证上岗）"}]
  },
  { id:"training_7", dimension:"training", dimensionLabel:"培训体系", text:"培训教材？", options:[
    {value:0,label:"口头传授无教材"},{value:1,label:"有基础手册但更新不及时"},{value:2,label:"全岗位视频化培训素材+新产品上线即更新+安装/售后场景化培训"}]
  },
  { id:"training_8", dimension:"training", dimensionLabel:"培训体系", text:"加盟商培训？", options:[
    {value:0,label:"收了加盟费就不管了"},{value:1,label:"开业前培训+开业带教但没有持续"},{value:2,label:"系统培训（开业前+新产品培训+安装售后标准+月度经营分析辅导），加盟标准与直营一致"}]
  },
  { id:"supervision_6", dimension:"supervision", dimensionLabel:"督导体系", text:"巡店检查重点？", options:[
    {value:0,label:"不定期走马观花"},{value:1,label:"定期检查但深度不够"},{value:2,label:"专项检查（场景化体验25%+安装售后质量25%+价格合规25%+客户回访25%），每次出评分报告"}]
  },
  { id:"supervision_7", dimension:"supervision", dimensionLabel:"督导体系", text:"顾客体验监测？", options:[
    {value:0,label:"没有"},{value:1,label:"偶尔调查不系统"},{value:2,label:"安装满意度回访+季度顾客调查+线上评价监测+结果与督导互相验证"}]
  },
  { id:"supervision_8", dimension:"supervision", dimensionLabel:"督导体系", text:"服务品质信心？", options:[
    {value:0,label:"完全没信心"},{value:1,label:"大部分还行但偏远区域心里没底"},{value:2,label:"有数据支撑（安装好评率/售后一次解决率/客诉SLA达标率在可控范围），90%+门店达标"}]
  },
];

// ========== 行业题库汇总 ==========
export const industryQuestions: Record<string, Question[]> = {
  "餐饮": 餐饮,
  "零售": 零售,
  "医药": 医药,
  "教育": 教育,
  "服饰": 服饰,
  "服装": 服饰,  // alias
  "酒类": 酒类,
  "家电": 家电,
};

// ========== 50 题精简版过滤集 ==========
// 从72题裁到50题：通用30题 + 行业20题
// 裁题原则：保留诊断价值最高的题（让报告仍能详细诊断），砍掉重叠/非关键题
// 如需恢复到72题：删除这两个过滤集，恢复 getQuestionsForIndustry 旧逻辑即可

const KEEP_GENERIC_IDS = new Set([
  // strategy 8→5：裁边界取舍、差异化感知、市场变化响应（太抽象/与战略制定重叠）
  "strategy_1","strategy_2","strategy_4","strategy_6","strategy_8",
  // model 6→4：裁扩张模式选择、定价策略（战略题已覆盖/行业题更具体）
  "model_1","model_3","model_5","model_6",
  // organization 8→6：裁离职率、职业发展（店长供给+考核+扩张储备更关键）
  "organization_1","organization_2","organization_3","organization_5","organization_7","organization_8",
  // training 5→4：裁更新频率（教材+效果检验+传帮带已覆盖）
  "training_1","training_3","training_4","training_5",
  // supervision 5→4：裁结果落地（检查标准+执行力+反馈机制已覆盖）
  "supervision_1","supervision_2","supervision_4","supervision_5",
  // culture 8→7：裁工作氛围（价值观+融入+建议渠道+仪式感已覆盖）
  "culture_1","culture_2","culture_3","culture_4","culture_5","culture_6","culture_8",
  // 以下为无行业选择时的默认行业题（与 KEEP_INDUSTRY_IDS 一致）
  "operation_1","operation_2","operation_3","operation_4","operation_7",
  "supply_chain_1","supply_chain_2","supply_chain_3","supply_chain_4","supply_chain_6",
  "digital_1","digital_2","digital_3","digital_4","digital_7",
  "model_7","model_8",
  "training_6","training_8",
  "supervision_6",
]);

const KEEP_INDUSTRY_IDS = new Set([
  // operation 8→5：裁产品结构管理、空间标准化、持续优化
  "operation_1","operation_2","operation_3","operation_4","operation_7",
  // supply_chain 8→5：裁成本优势、新城市扩展、数字化
  "supply_chain_1","supply_chain_2","supply_chain_3","supply_chain_4","supply_chain_6",
  // digital 8→5：裁投入力度、线上占比、行业自评
  "digital_1","digital_2","digital_3","digital_4","digital_7",
  // model 2→2：保留（单店模型+回本周期行业版最关键）
  "model_7","model_8",
  // training 3→2：裁教材形式（上岗+认证更关键）
  "training_6","training_8",
  // supervision 3→1：裁神秘顾客、品质信心（巡店重点最核心）
  "supervision_6",
]);

// ========== 获取某行业的完整题库 ==========
export function getQuestionsForIndustry(industry?: string): Question[] {
  const overrides = industry ? industryQuestions[industry] : [];
  if (overrides.length === 0) {
    return genericQuestions.filter(q => KEEP_GENERIC_IDS.has(q.id));
  }
  const overrideIds = new Set(overrides.map(q => q.id));
  return [
    ...genericQuestions.filter(q => !overrideIds.has(q.id) && KEEP_GENERIC_IDS.has(q.id)),
    ...overrides.filter(q => KEEP_INDUSTRY_IDS.has(q.id)),
  ];
}

// 默认导出通用题库（兼容旧代码）
export const questions = genericQuestions;

// 行业预热题保持不变
export const industryWarmup: Record<string, { text: string; options: { value: number; label: string }[] }[]> = {
  "餐饮": [
    { text: "你们的翻台率（日均翻台次数）大概是多少？", options: [{ value: 0, label: "不到 2 次" }, { value: 1, label: "2-3 次" }, { value: 2, label: "超过 3 次" }] },
    { text: "后厨标准化程度如何？", options: [{ value: 0, label: "几乎没有标准，全靠师傅" }, { value: 1, label: "招牌菜有配方卡，但未全面覆盖" }, { value: 2, label: "全面量化标准化，新人也能稳定出品" }] },
  ],
  "零售": [
    { text: "你们的 SKU 数量大概是多少？", options: [{ value: 0, label: "不到 500 个" }, { value: 1, label: "500-2000 个" }, { value: 2, label: "超过 2000 个" }] },
    { text: "鲜食/自有品牌占比？", options: [{ value: 0, label: "几乎没有" }, { value: 1, label: "10-20%" }, { value: 2, label: "超过 20%" }] },
  ],
  "医药": [
    { text: "你们有几家医保统筹定点门店？", options: [{ value: 0, label: "暂时没有" }, { value: 1, label: "少量门店已接入" }, { value: 2, label: "大部分门店已接入" }] },
    { text: "执业药师配置情况？", options: [{ value: 0, label: "药师不足，存在挂靠风险" }, { value: 1, label: "基本满足，但储备不够" }, { value: 2, label: "充足配置+区域共享+远程审方" }] },
  ],
  "教育": [
    { text: "你们的主要获客渠道是？", options: [{ value: 0, label: "纯线下地推/发传单" }, { value: 1, label: "线上+线下都有但不够系统" }, { value: 2, label: "多渠道体系化获客（转介绍+线上+异业合作）" }] },
    { text: "名师集中度如何？", options: [{ value: 0, label: "超过 50% 营收靠少数名师" }, { value: 1, label: "30-50% 依赖名师" }, { value: 2, label: "低于 20%，课程标准化程度高" }] },
  ],
  "服饰": [
    { text: "你们的季末售罄率大概多少？", options: [{ value: 0, label: "低于 55%" }, { value: 1, label: "55-70%" }, { value: 2, label: "超过 70%" }] },
    { text: "快反/柔供占比？", options: [{ value: 0, label: "几乎没有，全期货模式" }, { value: 1, label: "10-20%" }, { value: 2, label: "超过 20%，供应链灵活" }] },
  ],
  "酒类": [
    { text: "名酒配额能满足需求吗？", options: [{ value: 0, label: "严重不足，经常断供" }, { value: 1, label: "基本满足但不够稳定" }, { value: 2, label: "稳定供应，渠道关系扎实" }] },
    { text: "团购/对公业务占比？", options: [{ value: 0, label: "低于 20%，以散客为主" }, { value: 1, label: "20-50%" }, { value: 2, label: "超过 50%，团购体系成熟" }] },
  ],
  "家电": [
    { text: "你们的安装/售后服务模式？", options: [{ value: 0, label: "完全外包" }, { value: 1, label: "部分自营+部分外包" }, { value: 2, label: "自有安装售后团队为主" }] },
    { text: "新品类（智能家居/清洁电器等）占比？", options: [{ value: 0, label: "几乎没有" }, { value: 1, label: "10-25%" }, { value: 2, label: "超过 25% 且增长中" }] },
  ],
  "酒店民宿": [
    { text: "你们的入住率大概多少？", options: [{ value: 0, label: "低于 50%" }, { value: 1, label: "50-70%" }, { value: 2, label: "超过 70%" }] },
    { text: "OTA 平台依赖度？", options: [{ value: 0, label: "几乎全靠 OTA" }, { value: 1, label: "OTA 占比 50-70%" }, { value: 2, label: "OTA 占比低于 50%，有私域和协议客户" }] },
  ],
  "美容美发": [
    { text: "会员储值占比？", options: [{ value: 0, label: "低于 20%" }, { value: 1, label: "20-40%" }, { value: 2, label: "超过 40%" }] },
    { text: "核心技师流失率？", options: [{ value: 0, label: "超过 30%，流失严重" }, { value: 1, label: "15-30%" }, { value: 2, label: "低于 15%，团队稳定" }] },
  ],
  "健身运动": [
    { text: "会员月活跃率大概多少？", options: [{ value: 0, label: "低于 30%" }, { value: 1, label: "30-50%" }, { value: 2, label: "超过 50%" }] },
    { text: "私教课消率？", options: [{ value: 0, label: "低于 60%" }, { value: 1, label: "60-80%" }, { value: 2, label: "超过 80%" }] },
  ],
  "汽车服务": [
    { text: "客户复购率如何？", options: [{ value: 0, label: "低于 30%，一锤子买卖" }, { value: 1, label: "30-50%" }, { value: 2, label: "超过 50%，客户粘性高" }] },
    { text: "配件供应及时率？", options: [{ value: 0, label: "经常缺件，客户等很久" }, { value: 1, label: "大部分及时，偶尔缺件" }, { value: 2, label: "供应链完善，配件及时率超过 95%" }] },
  ],
  "宠物服务": [
    { text: "你们的客单价大概多少？", options: [{ value: 0, label: "低于 100 元" }, { value: 1, label: "100-300 元" }, { value: 2, label: "超过 300 元" }] },
    { text: "会员复购率？", options: [{ value: 0, label: "低于 40%" }, { value: 1, label: "40-60%" }, { value: 2, label: "超过 60%" }] },
  ],
  "便利店": [
    { text: "你们的日均营业额大概多少？", options: [{ value: 0, label: "低于 3000 元" }, { value: 1, label: "3000-6000 元" }, { value: 2, label: "超过 6000 元" }] },
    { text: "鲜食占比？", options: [{ value: 0, label: "低于 20%" }, { value: 1, label: "20-35%" }, { value: 2, label: "超过 35%" }] },
  ],
  "服装": [
    { text: "你们的季末售罄率大概多少？", options: [{ value: 0, label: "低于 55%" }, { value: 1, label: "55-70%" }, { value: 2, label: "超过 70%" }] },
    { text: "快反/柔供占比？", options: [{ value: 0, label: "几乎没有，全期货模式" }, { value: 1, label: "10-20%" }, { value: 2, label: "超过 20%，供应链灵活" }] },
  ],
  "其他连锁": [
    { text: "你们的连锁模式主要是？", options: [{ value: 0, label: "直营为主" }, { value: 1, label: "加盟为主" }, { value: 2, label: "直营+加盟混合" }] },
    { text: "门店数量大概多少？", options: [{ value: 0, label: "1-5 家" }, { value: 1, label: "6-50 家" }, { value: 2, label: "超过 50 家" }] },
  ],
};