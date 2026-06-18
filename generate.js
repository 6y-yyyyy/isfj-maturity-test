// generate.js — 全 16 型 MBTI 成熟度测试页面生成器
// 用法：node generate.js → 输出 index.html

const fs = require('fs');

// ============================================================
// PART 1: MBTI TYPE METADATA
// ============================================================
const MBTI = [
  // ---- 分析师 NT (紫色系) ----
  {
    id:'INTJ', name:'建筑师', en:'Architect', group:'analyst', color:'#7C3AED', colorLight:'#f5f3ff',
    icon:'psychology', emoji:'🏗️',
    desc:'INTJ 是富有远见的战略家，拥有强大的内倾直觉 (Ni) 和外倾思考 (Te)。你擅长洞察复杂系统的深层规律，制定长远计划并坚定执行。你的成长课题包括：情感连接的建立、对他人感受的敏感度、以及在完美主义与行动力之间找到平衡。',
    functions:'Ni Te Fi Se',
    strengths:'战略思维、独立判断、长远规划、系统构建',
    challenges:'情感盲区、过度独立、完美主义、社交疏离',
  },
  {
    id:'INTP', name:'逻辑学家', en:'Logician', group:'analyst', color:'#7C3AED', colorLight:'#f5f3ff',
    icon:'psychology', emoji:'🔬',
    desc:'INTP 是创新的思想家，以内倾思考 (Ti) 为主导，外倾直觉 (Ne) 为辅助。你沉迷于分析事物的原理，追求逻辑上的优雅和一致性。你的成长课题包括：将想法转化为行动、情感表达的练习、以及在无尽的思考中找到实践的落脚点。',
    functions:'Ti Ne Si Fe',
    strengths:'深度分析、创新思维、智识诚实、灵活适应',
    challenges:'执行困难、情感表达、拖延症、社交疏远',
  },
  {
    id:'ENTJ', name:'指挥官', en:'Commander', group:'analyst', color:'#7C3AED', colorLight:'#f5f3ff',
    icon:'psychology', emoji:'⚔️',
    desc:'ENTJ 是天生的领导者，以外倾思考 (Te) 为主导，内倾直觉 (Ni) 为辅助。你善于组织资源、制定战略、带领团队高效前进。你的成长课题包括：耐心与倾听、对他人情感的敏感度、以及学会在"赢"之外找到意义。',
    functions:'Te Ni Se Fi',
    strengths:'领导力、战略眼光、高效执行、果断决策',
    challenges:'过分强势、缺乏耐心、情感压抑、忽视自我',
  },
  {
    id:'ENTP', name:'辩论家', en:'Debater', group:'analyst', color:'#7C3AED', colorLight:'#f5f3ff',
    icon:'psychology', emoji:'💡',
    desc:'ENTP 是机智的创新者，以外倾直觉 (Ne) 为主导，内倾思考 (Ti) 为辅助。你享受思想的碰撞，善于发现可能性、挑战假设、提出新颖的解决方案。你的成长课题包括：专注力的培养、完成而不是开始、以及情感承诺的建立。',
    functions:'Ne Ti Fe Si',
    strengths:'创造力、辩论能力、适应力、知识广度',
    challenges:'半途而废、争论过度、情感浅层、不够专注',
  },
  // ---- 外交家 NF (绿色系) ----
  {
    id:'INFJ', name:'提倡者', en:'Advocate', group:'diplomat', color:'#059669', colorLight:'#ecfdf5',
    icon:'self_improvement', emoji:'🌊',
    desc:'INFJ 是深邃的理想主义者，以内倾直觉 (Ni) 为主导，外倾情感 (Fe) 为辅助。你能看透事物的本质，深刻地理解他人的内心世界，并渴望让世界变得更好。你的成长课题包括：自我关怀与边界设立、将理想落地为行动、以及学会不被他人的情绪淹没。',
    functions:'Ni Fe Ti Se',
    strengths:'深度洞察、共情力、理想主义、坚定信念',
    challenges:'过度付出、难以被理解、完美主义、决策纠结',
  },
  {
    id:'INFP', name:'调停者', en:'Mediator', group:'diplomat', color:'#059669', colorLight:'#ecfdf5',
    icon:'self_improvement', emoji:'🕊️',
    desc:'INFP 是充满诗意的理想主义者，以内倾情感 (Fi) 为主导，外倾直觉 (Ne) 为辅助。你忠于内心的价值观，追求真实和意义，拥有丰富的情感世界和创造力。你的成长课题包括：将理想转化为现实行动、应对现实中的妥协、以及学会保护自己不受伤害。',
    functions:'Fi Ne Si Te',
    strengths:'价值坚守、创造力、共情深度、真诚待人',
    challenges:'过度理想化、行动力弱、容易受伤、逃避冲突',
  },
  {
    id:'ENFJ', name:'主人公', en:'Protagonist', group:'diplomat', color:'#059669', colorLight:'#ecfdf5',
    icon:'self_improvement', emoji:'🌟',
    desc:'ENFJ 是富有魅力的教育者，以外倾情感 (Fe) 为主导，内倾直觉 (Ni) 为辅助。你天生善于感知他人的需求，激励和引导他人成长，是人群中的凝聚力中心。你的成长课题包括：照顾自己而非只照顾他人、接受自己的不完美、以及学会在没有人需要你的时候找到自我价值。',
    functions:'Fe Ni Se Ti',
    strengths:'领导魅力、共情力、沟通力、激励他人',
    challenges:'过度付出、忽视自我、难以拒绝、理想化他人',
  },
  {
    id:'ENFP', name:'竞选者', en:'Campaigner', group:'diplomat', color:'#059669', colorLight:'#ecfdf5',
    icon:'self_improvement', emoji:'🎉',
    desc:'ENFP 是热情洋溢的探索者，以外倾直觉 (Ne) 为主导，内倾情感 (Fi) 为辅助。你对生活充满热情和好奇，善于发现人与人之间的可能性，用你的创意和能量感染身边的人。你的成长课题包括：专注力的养成、从热情到坚持、以及学会在自由与责任之间找到平衡。',
    functions:'Ne Fi Te Si',
    strengths:'热情感染力、创造力、同理心、灵活适应',
    challenges:'难以专注、情绪波动、执行力弱、逃避束缚',
  },
  // ---- 守护者 SJ (橙色系) ----
  {
    id:'ISTJ', name:'物流师', en:'Logistician', group:'sentinel', color:'#EA580C', colorLight:'#fff7ed',
    icon:'shield', emoji:'📦',
    desc:'ISTJ 是稳重可靠的组织者，以内倾感觉 (Si) 为主导，外倾思考 (Te) 为辅助。你注重事实、秩序和责任，一旦承诺就会坚持到底，是任何团队的中流砥柱。你的成长课题包括：对新事物的开放态度、情感表达的练习、以及学会在规则之外看到可能性。',
    functions:'Si Te Fi Ne',
    strengths:'可靠负责、注重事实、组织力强、坚韧不拔',
    challenges:'抗拒变化、情感内敛、过于严肃、缺乏灵活',
  },
  {
    id:'ISFJ', name:'守护者', en:'Defender', group:'sentinel', color:'#EA580C', colorLight:'#fff7ed',
    icon:'shield', emoji:'🛡️',
    desc:'ISFJ 是温暖可靠的守护者，以内倾感觉 (Si) 为主导，外倾情感 (Fe) 为辅助。你细心体贴、忠诚可靠，用实际的行动默默守护着你在乎的人和事。你的成长课题包括：学会对自己温柔、设立健康的边界、勇敢表达真实的想法、以及拥抱变化带来的成长。',
    functions:'Si Fe Ti Ne',
    strengths:'温暖体贴、细节关注、忠诚可靠、实际贡献',
    challenges:'过度牺牲、回避冲突、边界模糊、自我忽视',
  },
  {
    id:'ESTJ', name:'总经理', en:'Executive', group:'sentinel', color:'#EA580C', colorLight:'#fff7ed',
    icon:'shield', emoji:'📋',
    desc:'ESTJ 是高效务实的管理者，以外倾思考 (Te) 为主导，内倾感觉 (Si) 为辅助。你善于制定流程、管理资源、确保一切按计划执行，是组织和团队的支柱。你的成长课题包括：倾听他人的情感需求、对新观点保持开放、以及学会在效率之外看到人的价值。',
    functions:'Te Si Ne Fi',
    strengths:'高效执行、组织管理、责任心强、务实可靠',
    challenges:'缺乏灵活性、情感忽视、过于强势、忽略新可能',
  },
  {
    id:'ESFJ', name:'执政官', en:'Consul', group:'sentinel', color:'#EA580C', colorLight:'#fff7ed',
    icon:'shield', emoji:'🤝',
    desc:'ESFJ 是热情友善的照顾者，以外倾情感 (Fe) 为主导，内倾感觉 (Si) 为辅助。你擅长维护人际和谐、照顾他人的实际需求、营造温暖有序的社交环境。你的成长课题包括：接受建设性的冲突、关注自己内心真实的声音、以及学会在不被所有人喜欢时仍然保持自信。',
    functions:'Fe Si Ne Ti',
    strengths:'社交能力、关怀他人、组织协调、维护和谐',
    challenges:'过度关心他人评价、回避冲突、缺乏自我、抗拒批评',
  },
  // ---- 探险家 SP (粉色系) ----
  {
    id:'ISTP', name:'鉴赏家', en:'Virtuoso', group:'explorer', color:'#DB2777', colorLight:'#fdf2f8',
    icon:'build', emoji:'🔧',
    desc:'ISTP 是冷静务实的实干家，以内倾思考 (Ti) 为主导，外倾感觉 (Se) 为辅助。你善于分析事物的运作原理，动手能力极强，在危机中保持冷静和灵活。你的成长课题包括：情感表达与深度连接、长期规划的建立、以及学会在"做"之外也能"感受"。',
    functions:'Ti Se Ni Fe',
    strengths:'动手能力、冷静分析、灵活应变、解决问题',
    challenges:'情感表达、长期规划、社交投入、回避亲密',
  },
  {
    id:'ISFP', name:'探险家', en:'Adventurer', group:'explorer', color:'#DB2777', colorLight:'#fdf2f8',
    icon:'palette', emoji:'🎨',
    desc:'ISFP 是细腻敏感的艺术家，以内倾情感 (Fi) 为主导，外倾感觉 (Se) 为辅助。你对美和真实有独特的感知力，用创造力和温柔的方式体验和表达世界。你的成长课题包括：在坚持自我和适应他人之间找到平衡、将内在感受转化为行动、以及学会面对必要的冲突。',
    functions:'Fi Se Ni Te',
    strengths:'审美力、真诚待人、灵活适应、温暖友善',
    challenges:'回避冲突、缺乏规划、难以做决定、易受伤害',
  },
  {
    id:'ESTP', name:'企业家', en:'Entrepreneur', group:'explorer', color:'#DB2777', colorLight:'#fdf2f8',
    icon:'rocket_launch', emoji:'🔥',
    desc:'ESTP 是精力充沛的行动派，以外倾感觉 (Se) 为主导，内倾思考 (Ti) 为辅助。你活在当下、行动迅速、善于抓住机会，是天生的危机处理者和谈判高手。你的成长课题包括：考虑行动的长期后果、发展情感深度、以及学会在速度之外关注质量。',
    functions:'Se Ti Fe Ni',
    strengths:'行动力强、灵活应变、实际解决、社交魅力',
    challenges:'冲动决策、缺乏耐心、忽略后果、情感浅层',
  },
  {
    id:'ESFP', name:'表演者', en:'Entertainer', group:'explorer', color:'#DB2777', colorLight:'#fdf2f8',
    icon:'theater_comedy', emoji:'🎭',
    desc:'ESFP 是天生的表演者和生活享受者，以外倾感觉 (Se) 为主导，内倾情感 (Fi) 为辅助。你热爱生活、善于带动气氛、用你的热情和真诚让身边的人感到快乐。你的成长课题包括：规划未来的能力、在热情之外找到深度、以及学会面对严肃和困难的话题。',
    functions:'Se Fi Te Ni',
    strengths:'热情感染、灵活应变、实际助人、活在当下',
    challenges:'缺乏规划、回避严肃、冲动决策、难以深交',
  },
];

// ============================================================
// PART 2: QUESTION BANK TEMPLATES BY COGNITIVE FUNCTION
// ============================================================

// Each type gets 50 scenario questions. Questions are built from
// function-specific templates adapted to each type's context.

// ---- Scenario Templates ----
// We define scenario "shells" that are adapted per type

function buildQuestions(type) {
  const id = type.id;
  const name = type.name;
  const fn = type.functions.split(' '); // e.g. ['Si','Fe','Ti','Ne']
  const dom = fn[0]; // dominant
  const aux = fn[1]; // auxiliary
  const ter = fn[2]; // tertiary
  const inf = fn[3]; // inferior

  // Helper: generate 6 options with progressive maturity
  const opt = (a,b,c,d,e,f) => [
    {letter:'A',text:a,score:1},
    {letter:'B',text:b,score:2},
    {letter:'C',text:c,score:3},
    {letter:'D',text:d,score:4},
    {letter:'E',text:e,score:5},
    {letter:'F',text:f,score:6},
  ];

  // Common option sets used across multiple questions
  const O = {
    // Avoidance → Balanced confrontation
    conflict: (ctx) => opt(
      `完全回避这个情况——${ctx}，假装什么都没发生。`,
      `内心非常不舒服但表面上勉强应付，用沉默或敷衍来应对。`,
      `委婉地提到一点点自己的感受，但立刻退缩——"算了，没事"。`,
      `在合适的时机用"我感受"的方式表达自己的想法，不指责对方。`,
      `坦诚但温和地沟通——表达自己的立场，同时理解对方的视角，寻求双方都能接受的方案。`,
      `将冲突视为加深理解的机会——不回避、不攻击，在坚守底线和尊重对方之间找到平衡。`
    ),
    // Over-giving → Healthy boundaries
    boundary: (ctx) => opt(
      `立刻答应——${ctx}，即使自己已经非常累了。`,
      `心里不太想答应但还是应了下来，之后感到一阵后悔和疲惫。`,
      `纠结了很久最后答应了，但在过程中明显表现得不太情愿。`,
      `诚实说明自己目前的状态——"我现在能力有限，能做的是……"给出一个有限的承诺并做到。`,
      `评估自己的实际能力和优先级后做出决定——如果答应，是真心愿意；如果拒绝，是温和而坚定的。`,
      `完全接纳"照顾好自己才能持续帮助他人"——你的"不"和你的"好"来自同一个地方：对自己的尊重。`
    ),
    // Rigid → Open to change
    change: (ctx) => opt(
      `内心非常抵触——"${ctx}，我不想改变。"`,
      `表面上接受了但心里一直在怀念旧的方式，一有机会就回到老习惯。`,
      `带着怀疑尝试新方式，但每个不顺手的地方都用来证明"还是旧的好"。`,
      `虽然一开始觉得别扭，但给自己一段时间认真学习新方式，之后再客观比较。`,
      `主动在新旧之间找到结合点——保留旧方式中真正有效的部分，吸收新方式中的改进之处。`,
      `以好奇和开放的心态面对变化——你不把变化看作对自己过去方式的否定，而是一次拓展。`
    ),
    // Self-neglect → Self-care
    selfcare: () => opt(
      `完全忽略自己的需求——"我不重要，先把别人的事做完再说。"`,
      `意识到自己也需要休息，但一想要为自己做什么就有罪恶感。`,
      `偶尔给自己安排一点时间，但期间不断被别人的消息打断，无法真正放松。`,
      `在日程中锁定一段"不可占用"的时间给自己，像对待重要约定一样保护它。`,
      `理解自我关怀不是自私——只有自己状态好了，才能持续为在乎的人提供高质量的支持。`,
      `你的生活建立在"互相滋养"而非"单向消耗"的基础上——你的幸福和别人的幸福同等重要。`
    ),
    // Feedback sensitivity
    feedback: () => opt(
      `完全被负面评价击垮——反复回想那句话，什么其他事情都做不了。`,
      `表面上接受了评价，但内心非常不服，私下跟朋友抱怨。`,
      `感到受伤但努力不去想它——假装不在意，实际上一直压在心底。`,
      `先冷静一段时间，然后客观地复盘——哪些是事实、哪些是对方的情绪、哪些是自己可以改进的。`,
      `主动找对方深入了解反馈的具体情境和期望，将批评转化为具体的改进行动。`,
      `把反馈视为成长的信息源而非对自我价值的审判——从批评中提取营养，不让它定义你。`
    ),
    // Perfectionism → Good enough
    perfect: () => opt(
      `反复修改直到错过截止时间，或者交出一个让自己非常焦虑的版本。`,
      `一直在纠结那两个细节要不要改，浪费了大量时间在犹豫上。`,
      `改了细节但发现了更多问题——陷入无止境的"再改一下就好"循环。`,
      `客观评估细节改动对整体的实际影响——如果只是锦上添花就先提交，关键问题才紧急修改。`,
      `理解"足够好"和"完美"之间的边际成本——在截止时间前交出优秀版本，优化点留到下一版。`,
      `与自己内心的完美主义和解——"我知道你想让我更好，但这次已经够好了。休息一下吧。"`
    ),
  };

  const Q = []; // questions array

  // ====== PART 1: Core Function Traits (12 questions) ======
  // Based on dominant + auxiliary functions

  // Q1: Detail/Observation (Si/Ni/Se/Ne)
  if (dom === 'Si' || aux === 'Si') {
    Q.push({ id:Q.length+1, part:1, scenario:`你负责的工作中有一个需要持续关注的细节环节。最近这个环节出现了一些微小的异常数据。你会怎么做？`,
      options:opt(
        '完全没注意到这些微小变化，直到别人提醒才发现。',
        '看到了但觉得"应该不要紧吧"，继续做其他事，没有深究。',
        '注意到了异常但不确定是不是问题，犹豫了很久要不要报告。',
        '注意到异常后立刻记录下来，观察趋势，在合适的时候向相关人员提出你的发现。',
        '不仅发现了异常，还追溯了可能的原因，带着初步分析去找相关人员讨论，展现了你对细节的敏感度。',
        '你的 Si 细节敏感度成为了团队的"预警系统"——你能在问题还很小的时候就发现并解决它，避免了更大的损失。'
      )});
  } else if (dom === 'Ni' || aux === 'Ni') {
    Q.push({ id:Q.length+1, part:1, scenario:`你在做一个项目时，突然有一种"说不上来但感觉这里有问题"的直觉。目前数据和事实都看起来正常。你会怎么做？`,
      options:opt(
        '忽略这个直觉——"数据和事实都没问题，肯定是我想多了。"',
        '因为直觉感到不安但不知道怎么办，犹豫不决，停滞不前。',
        '跟别人提了一下但说不清楚理由，被质疑后放弃了。',
        '重视这个直觉，花时间深入调研——寻找数据之外的信息，验证你的预感是否有依据。',
        '在直觉和事实之间架起桥梁——用你的 Ni 洞察提出假设，再用实际数据来验证或反驳，形成完整的判断。',
        '你的直觉是经过长期积累形成的"深层模式识别"——你信任它但不过度依赖它，总是用事实来校验，最终做出比纯数据或纯直觉都更准确的判断。'
      )});
  } else if (dom === 'Se' || aux === 'Se') {
    Q.push({ id:Q.length+1, part:1, scenario:`你正在经历一个重要的时刻（可能是会议、活动或社交场合），现场发生了突发状况——有人不小心打翻了饮料。你会怎么做？`,
      options:opt(
        '完全没注意到发生了什么，或者愣住了不知道该做什么。',
        '看到了但觉得"不是我的事"，继续做自己的事情。',
        '想帮忙但犹豫了一下，等反应过来时别人已经处理了。',
        '立刻注意到并迅速反应——帮忙清理、递纸巾、同时用轻松的话缓解尴尬气氛。',
        '在瞬间评估了情况——打翻饮料的人是否需要帮助、会不会影响正在进行的活动、自己能做什么——然后高效地处理了。',
        '你的 Se 让你对当下发生的一切高度敏感——你能快速感知、即时反应、在不破坏氛围的情况下处理好突发状况，让大家甚至觉得"好像什么都没发生"。'
      )});
  } else if (dom === 'Ne' || aux === 'Ne') {
    Q.push({ id:Q.length+1, part:1, scenario:`团队在做一个项目时遇到了瓶颈——现有的方案效果都不理想。有人提议头脑风暴一下。你会怎么做？`,
      options:opt(
        '觉得头脑风暴是浪费时间——"想那么多有什么用，找个已有的方案执行就好了。"',
        '参与了但提不出什么想法，一直在听别人说。',
        '提出了几个想法，但都很接近现有方案的小修小补，没有突破性思考。',
        '抛开思维限制，提出了几个完全不同角度的方案——有些可能不成熟，但确实打开了新的思路。',
        '不仅提出了多样化的可能性，还能将不同人的不同想法串联起来——"A的想法和B的想法结合起来会是什么？"创造出新的组合方案。',
        '你的 Ne 在团队陷入僵局时最有价值——你能看到被大家忽略的可能性，把看似无关的东西联系起来，帮团队找到"第三条路"。'
      )});
  }

  // Q2: People/Emotion awareness (Fe/Fi/Te/Ti)
  if (aux === 'Fe' || dom === 'Fe') {
    Q.push({ id:Q.length+1, part:1, scenario:`你的好朋友最近看起来情绪低落，但每次你问"还好吗"，对方都说"没事"。你会怎么做？`,
      options:opt(
        '既然对方说没事就不再追问了——"他不想说我也没办法。"',
        '反复追问"你真的没事吗"，让对方开始感到有压力。',
        '心里很挂念但不知道该怎么做，一直在旁边默默观察。',
        '不提"你还好吗"，而是创造轻松的相处机会（散步、吃饭），让对方在舒服的氛围中自然打开。',
        '直接而温柔地说："我注意到你最近不太开心，不想说也没关系，我就在这里。需要我的时候随时在。"',
        '根据你对这位朋友的深度了解，选择最合适的陪伴方式——有人需要倾听、有人需要独处、有人需要分散注意力——精准给予对方真正需要的支持。'
      )});
  } else if (aux === 'Fi' || dom === 'Fi') {
    Q.push({ id:Q.length+1, part:1, scenario:`朋友做了一个你觉得不太对的决定，但他看起来很坚定。你知道如果说出真实想法可能会让他不舒服。你会怎么做？`,
      options:opt(
        '直接说出你的真实想法，不管对方的感受——"我就是觉得这样不对。"',
        '完全不说自己的想法，但内心因为"不够诚实"而感到不舒服。',
        '用非常委婉的方式提了一句，但对方没听出来，你就放弃了。',
        '找到一个平衡——先认可对方的自主权，再用"我个人的感受是..."的方式表达你的真实想法，同时强调你支持他的最终决定。',
        '在尊重对方自主权和忠于自己内心之间找到了平衡——你的表达让对方感到被尊重，同时也听到了真实的声音。',
        '你的 Fi 让你对"真实"有很高的标准——但你已经学会了在真实和善意之间找到智慧的表达方式，既不背叛自己也不伤害他人。'
      )});
  } else if (aux === 'Te' || dom === 'Te') {
    Q.push({ id:Q.length+1, part:1, scenario:`团队中大家在讨论一个问题，但讨论了很久都没有形成结论。你是其中资历较深的成员之一。你会？`,
      options:opt(
        '不耐烦地打断——"我们已经讨论太久了，该做决定了，按我说的来吧。"',
        '心里很着急但什么也不说，自己默默开始按自己的想法做。',
        '试图推动但方式比较生硬，让大家感到被催促了，气氛有点尴尬。',
        '在合适的时机总结大家的讨论要点，提出几个可行动的方向，帮助团队从"讨论"转向"决策"。',
        '在推动效率的同时照顾到讨论的价值——"大家的想法都很好，我觉得我们可以先确定A和B两个方向，各试一周再比较。"既推进了行动又尊重了参与。',
        '你的 Te 高效推动力与团队协作完美结合——你知道什么时候需要"做决定"、什么时候需要"再讨论"，让团队既感到被尊重又不会被无休止的讨论消耗。'
      )});
  } else if (aux === 'Ti' || dom === 'Ti') {
    Q.push({ id:Q.length+1, part:1, scenario:`有人提出了一个你直觉上觉得有问题的方案——方案听起来不错，但你隐隐感觉逻辑上有一个漏洞。你会怎么做？`,
      options:opt(
        '直接说"这个方案有问题"，但在追问下无法清晰地解释为什么。',
        '心里觉得有问题但不太确定，就没有提出来——"也许是我搞错了。"',
        '开始分析但陷入了过度的细节推敲中，还没得出结论讨论就结束了。',
        '在你觉得有漏洞的地方提出了一个清晰的问题——"如果X情况发生了，这个方案怎么应对？"让大家看到了之前忽略的盲点。',
        '系统性地分析了方案的逻辑链条，找到了漏洞所在，并用清晰的推理让大家理解问题，同时提出了改进建议。',
        '你的 Ti 逻辑分析力是团队的质量保障——你能在看到"漂亮包装"的时候保持冷静，用清晰的逻辑找出潜在问题，让团队避免"看起来很美好"的陷阱。'
      )});
  }

  // Q3-Q12: More function-specific scenarios
  // For brevity, we generate quality scenarios for each function pair
  // Each type gets a customized set based on dom + aux

  // Generic Q3: Decision making style
  Q.push({ id:Q.length+1, part:1, scenario:`你需要做一个重要决定，这个决定会影响你未来一两年的方向。你已经收集了一些信息，但还有很多不确定因素。你会怎么处理？`,
    options:opt(
      '因为不确定因素太多而感到焦虑，迟迟无法做决定，错过了最佳时机。',
      '冲动地做了一个决定——"走一步看一步吧"——之后发现自己并没有真正想清楚。',
      '列了一个很长的利弊清单但陷入了分析瘫痪——每个选项都有利有弊，越分析越纠结。',
      '收集足够但不过多的信息，在关键因素上做出判断，接受有一定的不确定性，做出一个有根据的选择。',
      '将直觉、理性分析、以及对你来说最重要的价值观结合起来——你做的不是"最优"选择，而是"最对"的选择。',
      '你能在不确定中保持从容——你知道任何重要决定都不可能100%确定的条件下做出。你做了充分准备，然后信任自己的判断。'
    )});

  // Q4: Reliability / Commitment
  if (dom === 'Si' || aux === 'Si' || dom === 'Te' || aux === 'Te') {
    Q.push({ id:Q.length+1, part:1, scenario:`你已经答应了一个朋友帮他处理一件事，但后来出现了一个更有趣的机会。如果选择那个新机会，你会让朋友很为难。你会？`,
      options:opt(
        '直接放弃之前的承诺去追新机会——"他会理解的吧。"',
        '纠结了很久，最后两边都没做好——朋友的事耽误了，新机会也没好好把握。',
        '敷衍地帮朋友完成了最低限度的事，然后去追新机会，但内心一直不安。',
        '信守对朋友的承诺——你答应了就会做到。新机会可以以后再争取，但你的信誉不是。',
        '在守信的前提下寻找灵活方案——跟朋友坦诚沟通，看是否可以调整时间或方式，在尽量不影响对方的情况下追求新机会。',
        '可靠性已成为你的身份标识——你做选择时不需要"挣扎"，因为"守信"已经内化为你的本能。同时你也能在特殊情况下灵活调整，不僵化。'
      )});
  } else {
    Q.push({ id:Q.length+1, part:1, scenario:`有人对你提出了一个有点过分的要求——对方希望你用周末时间免费帮他做一个本该他自己完成的事情。你其实有安排。你会？`,
      options:opt(
        '虽然不情愿但还是答应了——"拒绝别人太难了。"',
        '找了一个借口推脱，但内心因为"撒谎"而不舒服。',
        '非常委婉地暗示自己不太方便，但对方似乎没听懂，最后你还是答应了。',
        '直接但礼貌地拒绝——"这个周末我有安排了，帮不了你。建议你试试找XXX。"没有过度解释也不需要编借口。',
        '你的拒绝坚定而温和，不给对方"再磨一磨就会答应"的错觉。你理解清晰的边界对双方都是好事。',
        '设立边界对你来说已经不再是一件难事——你知道"不"是完整的句子，你的时间和精力是有限的资源，你优先对真正重要的人和事说"好"。'
      )});
  }

  // Generate remaining Part 1 questions (up to 12 total)
  // We need 8 more questions to reach 12 in Part 1
  const part1Scenarios = [
    { s:`你在做一个需要长期投入的个人目标（比如学习一项技能），已经坚持了三个月，但最近两周因为各种原因中断了。你对这件事的感受是？`,
      o:opt(
        '感到非常挫败——"又半途而废了，我果然做不到。"彻底放弃了。',
        '很沮丧但没有采取行动——每次想起这个目标就感到焦虑，但一直没有重新开始。',
        '给自己制定了更严格的计划来"弥补"，但因为太严格坚持不了一周又中断了。',
        '接受中断是正常的——分析为什么中断（时间安排？动力下降？），调整计划让它更可持续，然后重新开始。',
        '理解任何长期目标都会有起伏——你不会因为两周的中断否定三个月的努力。你对自己有耐心，同时也保持前进的方向。',
        '你在自我管理和自我关怀之间找到了平衡——你知道什么时候该push自己、什么时候该给自己空间。你的成长是一个螺旋上升的过程，不是一条直线。'
      )},
    { s:`你在一个小组中，大家正在讨论一个你不太熟悉的领域。有人问你的看法。你会？`,
      o:opt(
        '非常紧张，胡乱说了几句，结果说得不太好，更加尴尬。',
        '直接说"我不知道"然后沉默，之后觉得自己看起来很蠢。',
        '勉强说了几句但明显不自信，声音越来越小。',
        '诚实地说"这个领域我不太熟悉，但从我的角度我看到的是……"把"不了解"从尴尬变成了一种坦诚的表达。',
        '将这个问题转化为学习机会——"我不太确定，但我很好奇你是怎么看的？"用自己的好奇心带动更有价值的对话。',
        '你不再因为"不了解"而感到不安——你知道没有人什么都懂。你的自信来自对自己能力的准确认知，而非"什么都会"。'
      )},
    { s:`你正在专注做一件事（工作/学习），突然收到好几条消息——一个朋友在倾诉、一个同事在问工作问题、一个家人在找你。你会怎么处理？`,
      o:opt(
        '立刻全部回复，自己的事被完全打断，最后什么也没做成。',
        '假装没看到继续做事，但心里一直惦记着，效率很低。',
        '每条都看了一眼但都没认真回，结果每个人都觉得被敷衍了。',
        '快速扫一眼消息判断紧急程度——真正紧急的立即处理，其他的做完手头事再回复。',
        '在日常中建立了清晰的沟通边界——重要的人知道紧急时该怎么联系你，非紧急的事大家习惯了你会稍后回复。你的专注时间得到了保护。',
        '你在"可及"和"专注"之间找到了平衡——你关心的人不会觉得被冷落，你的重要工作也不会被碎片化打断。这是现代生活中极其珍贵的能力。'
      )},
    { s:`你在团队中的角色一直都比较低调，但最近你完成了一个很重要的任务，领导在全员面前表扬了你。你的感受是？`,
      o:opt(
        '感到非常不自在——希望地上有条缝可以钻进去，会后反复想大家会不会觉得我"太出风头"。',
        '表面尴尬地笑了一下，内心很想赶紧结束这个环节。',
        '感到高兴但不敢表现出来——担心如果表现得太高兴，别人会觉得我骄傲。',
        '坦然接受表扬——"谢谢，这个项目确实花了很多心血，能帮到团队我很开心。"简洁得体地回应。',
        '不仅接受表扬，还借此机会感谢了帮助过你的人，把个人荣誉分享给了团队。',
        '你能坦然接受认可——你知道自己的贡献值得被看见，接受表扬不代表骄傲自大。同时你也把荣誉看作激励自己继续做得更好的动力。'
      )},
    { s:`你发现一个朋友对你撒了一个小谎——不是什么大事，但你确定他说的是假话。你会怎么做？`,
      o:opt(
        '直接当面拆穿——"你在撒谎。"让对方非常难堪。',
        '什么都不说但心里对这个人产生了不信任，之后相处时态度微妙的变了。',
        '在心里纠结要不要提——"万一是误会呢？""不提又觉得不舒服。"',
        '选择一个合适的时机私下沟通——"我注意到上次你说X，但我了解到的是Y，是不是有什么我不知道的情况？"给对方解释的空间。',
        '先理解对方可能有撒谎的原因（保护自己、不想让你担心等），然后温和但诚实地表达——你在意的是信任本身，而不是那个具体的谎言。',
        '你在诚实和善意之间找到了平衡——你不会假装没看到谎言，也不会用攻击的方式去揭穿。你的处理方式让对方感到被尊重，也让真相有了一个安全的表达空间。'
      )},
  ];

  // Add remaining Part 1 questions
  while (Q.filter(q=>q.part===1).length < 12) {
    const idx = Q.filter(q=>q.part===1).length - 2; // offset for the first 2 custom Qs
    if (idx >= 0 && idx < part1Scenarios.length) {
      const s = part1Scenarios[idx];
      Q.push({ id:Q.length+1, part:1, scenario:s.s, options:s.o });
    } else {
      // filler
      Q.push({ id:Q.length+1, part:1, scenario:`在日常生活和工作中，你如何处理那些需要你在短时间内做出判断的突发情况？`,
        options:opt(
          '通常会慌乱或僵住，需要别人告诉我该怎么做。',
          '感到压力很大，做的决定往往是"赶紧摆脱这个情况"而非真正解决问题。',
          '可以应对但事后会反复想"我是不是处理得不够好"。',
          '在压力下能保持基本冷静，收集有限但关键的信息后做出一个合理判断。',
          '在突发情况中能快速抓住核心问题，做出有效反应，事后复盘提取经验。',
          '即使在高压突发情况中，你也能发挥自己的认知优势——保持清醒、做出判断、事后学习。这是成熟的标志。'
        )});
    }
  }

  // ====== PART 2: Weakness Recognition (12 questions) ======
  // Based on inferior + tertiary function challenges

  const part2Scenarios = [
    { s:`有人对你的工作方式提出了批评——"你这样做太慢了。"你心里其实知道对方有一部分是对的，但方式让你很不舒服。你的反应是？`, o:O.feedback() },
    { s:`你已经帮了好几个人了，这时候又有一个人来找你帮忙。你已经精疲力尽了。你会？`, o:O.boundary('即使自己已经到极限了') },
    { s:`你花了大量时间准备一件事，在最后时刻发现还有两个细节可以做得更好。截止时间就在一小时后。你会？`, o:O.perfect() },
    { s:`团队在讨论一个方案，你心里有不同意见但大部分人都倾向另一个方向——包括比你资深的同事。你会？`,
      o:opt(
        '完全不说自己的想法——"说了也没用。"之后消极配合。',
        '在心里反复演练想说的话但最终还是没有开口。会后跟一两个信任的同事私下说。',
        '非常委婉地提了一句但被忽略后就立刻退缩了——"果然不该说。"',
        '在会议中找到一个合适的间隙，清晰而条理地表达自己的观点，同时表示尊重团队的最终决定。',
        '在表达不同意见的同时认可对方方案中的优点，提出折中方案——你的表达是建设性的而非对抗的。',
        '敢于在群体中保持独立判断——你的自我价值不取决于"是否被大多数人认同"。即使最终意见未被采纳，你也不会因此自我怀疑或怨恨他人。'
      )},
    { s:`你一直在用某种方式做一件事。最近发现了一种完全不同的新方法，据说效率更高——但你不太确定它是否适合你。你的反应是？`, o:O.change('这个新方法看起来不太靠谱') },
    { s:`过去几个月里，你对一个朋友积累了不少不满（临时取消计划、回应敷衍、答应的事经常忘）。今天他又临时取消了和你的约定。你的情绪快憋不住了。你会？`,
      o:opt(
        '终于爆发了——在电话里把所有积累的不满一股脑倒出来，语气很激动。',
        '取消约好后一个人生闷气，发了一条含沙射影的状态——期待对方自己意识到问题。',
        '决定不再主动联系对方了——"如果他在乎我，他会来找我的。"用冷战代替了表达。',
        '冷静两天后，找一个合适时机和对方进行一次坦诚但不指责的对话——说具体事例而非笼统的"你总是……"。',
        '反思自己为什么没有在第一次就说出不满——以后建立"及时表达"的习惯，不让情绪积累到爆发。',
        '建立了健康的情绪表达习惯——觉察、及时沟通、不就事论人。你能在问题初现时就用温和的方式表达，不再有"积累-爆发"的循环。'
      )},
    { s:`你最近发现自己在某些情况下会不自觉地做一些你知道不太好的事（比如拖延、情绪化消费、回避重要对话）。你意识到这是你的"盲点模式"。你会？`,
      o:opt(
        '继续惯性地做这些事——"我知道不好但我控制不了。"',
        '每次做了之后都陷入后悔但下次还是重复，觉得自己很失败。',
        '注意到这个模式但不确定怎么改变，一直在"想"的阶段。',
        '识别出触发这个模式的典型情境，在这些情境出现时提前给自己"预警"，有意识地选择不同的回应方式。',
        '不仅改变了行为，还理解了行为背后的深层原因——你不再只是"控制症状"，而是在治愈根源。',
        '你对自己有深刻的了解和接纳——你知道人的成长包括认识到自己的盲点并与之共处、对话、慢慢改变。你不再因为"有盲点"而羞耻。'
      )},
    { s:`你参加一个社交活动，发现大部分人在聊的话题你完全不熟悉。有人注意到你一直没怎么说话。你会？`,
      o:opt(
        '尴尬地笑了笑说"我在听你们说"然后继续神游。',
        '强迫自己加入话题，假装了解那些内容，结果说错了被纠正更加尴尬。',
        '觉得是自己的问题——"为什么别人能聊的我都不会。"产生了自我怀疑。',
        '自然地承认——"这个领域我真不太了解，你们聊得挺有意思的，我正好学学。"把"不了解"变成轻松参与的方式。',
        '不强行融入也不孤立自己——你在不熟悉的场合也能自在做自己。你知道"不擅长闲聊"不代表你有问题。',
        '你不再因为"和群体不同"而自我怀疑——你喜欢什么、了解什么、擅长什么，构成了独特的你。那些真正欣赏你的人，会因为你真实的特质而被吸引。'
      )},
    { s:`有一个不太熟的人经常找你帮忙，但只在需要你的时候才出现。这次他又来了。你会？`, o:O.boundary('虽然不想帮但还是答应了') },
    { s:`你遇到了一个棘手的问题，用自己习惯的方法试了几次都没解决。你的应对方式是？`,
      o:opt(
        '反复用同样的方法尝试，越来越沮丧——"这个方法以前都行的，为什么这次不行？"',
        '把问题搁置了——"最近太忙了，以后再处理吧。"实际上是在回避。',
        '一个人死磕了很久，到最后问题恶化了才找人帮忙——但已经错过了最佳解决时机。',
        '尝试两三种方法后如果不行，主动向有经验的人请教或查资料寻找新思路。',
        '认识到自己的惯用方法不适用于所有情况——主动拓展"工具箱"，学习不同的解决策略。',
        '面对困难时展现出成熟的应对——接受暂时挫折、多角度审视、灵活调用资源、保持耐心。你不再把"需要帮助"看作自己的失败。'
      )},
    { s:`周末在家休息，但手机不断收到和工作相关的消息。虽然没有人点名找你，但你知道有些事你处理起来比别人快。你会？`,
      o:opt(
        '忍不住回复每一条，最终等于在家加了一天班——休息等于没休。',
        '不回复但一直看手机，脑子停不下来——"身体在家，精神在上班。"',
        '关掉了通知但没和任何人说——周一发现大家以为你在线所以给你安排了紧急任务。',
        '在周末前明确通知团队自己休息，设置自动回复，紧急事务交接给值班同事，手机静音安心休息。',
        '理解"负责任"和"过度负责"的区别——对工作负责，也对自己的身心健康负责。一个健康的人比一个累垮的英雄更有价值。',
        '你放下了"没有我事情就会出问题"的执念——团队在你不在的时候也能运转。你在休息时真正休息，这让你在工作时更有能量。'
      )},
    { s:`你对自己的一个性格特点长期感到困扰（可能是不够自信、太容易焦虑、或者太在意别人的看法）。最近你读了一些关于这方面的内容，开始有了新的认识。你会怎么做？`,
      o:opt(
        '读完就忘了——"有道理，但我改不了。"',
        '觉得很有启发但没有任何实际行动——"总有一天我会开始改变的。"',
        '尝试改变了一两周但遇到阻力就放弃了——"果然太难了，还是算了。"',
        '制定了具体的小目标（不是"完全改变"而是"每天进步一点点"），并开始持续练习。',
        '不仅自己在改变，还找了朋友或伙伴一起——有人陪伴的成长比独自摸索要有效得多。',
        '成长对你来说不是一时的冲动而是一种持续的生活方式——你不害怕面对自己的"不够好"，因为每个"不够好"都是成长的入口。'
      )},
  ];

  part2Scenarios.forEach((s,i) => {
    if (Q.filter(q=>q.part===2).length < 12) {
      Q.push({ id:Q.length+1, part:2, scenario:s.s, options:s.o });
    }
  });

  // ====== PART 3: Strength Application (12 questions) ======
  const part3Scenarios = [
    { s:`你被分配主导一个需要统筹协调的任务。这是你第一次承担这个角色。你做的第一件事是？`,
      o:opt(
        '立刻开始埋头做自己最熟悉的部分，先做了再说，其他的边走边看。',
        '花大量时间做了一个极其详细的计划，但迟迟没有开始执行——因为"计划还不够完美"。',
        '召集大家开了个会但没有明确议程，讨论了很多但没有产出可执行的下一步。',
        '先把任务分解为几个阶段和关键节点，明确每个人的职责和时间线，召开简短启动会确保所有人对齐。',
        '制定计划时考虑到每个人的特点和优势，安排最合适的工作。预留缓冲时间应对意外。计划既清晰又灵活。',
        '你的安排同时兼顾了"事"和"人"——任务被清晰分解和执行，每个人的状态也被关注。大家完成时不仅交付了成果，还觉得这是一次高效的协作。'
      )},
    { s:`你的团队中有一个反复出现的问题——客户满意度一直在下降。大家提出了各种猜测但都没有系统的分析。你怎么看待这个问题？`,
      o:opt(
        '觉得这个问题太复杂，不是自己能解决的，保持沉默。',
        '想到什么说什么但没有系统分析——"可能是A的原因吧，也可能是B。"',
        '提出了几个观察但无法把它们串联成一个完整的分析。',
        '系统地回顾了过去一段时间的客户反馈、服务流程和人员变化，从大量细节中找出了共性规律。',
        '不仅从历史数据中发现了规律，还主动和一线同事深入交流了解"数据之外的故事"，提出立体的诊断和可行的改进方案。',
        '你的分析能力让人看到别人看不到的深层规律——你把散落的信息点连成了一条清晰的线，不仅发现问题还能设计出完整的解决方案。'
      )},
    { s:`朋友经历了一个重大挫折非常低落。你想真正帮到他，而不是只说"加油"。你会怎么做？`,
      o:opt(
        '发了一句"有需要随时找我"然后被动等待——不知道还能做什么。',
        '每隔几天问"你好点了吗"，让对方觉得被催促着"快点好起来"。',
        '做了很多关心的计划但大部分因为"怕做得不合适"而没实施。',
        '用具体行动陪伴——不只是说"需要找我"，而是隔几天送一次饭、散步、帮忙处理杂事。你的关心是可感可知的。',
        '根据你对这位朋友的深度了解提供"量身定制"的陪伴——有人需要倾诉、有人需要独处。你不期待对方立刻好起来。',
        '你用自己的方式建立了情感的桥梁——对方在你这里感受到的不只是"有人帮我"，而是"有人真正理解我"。这是你最珍贵的礼物。'
      )},
  ];

  // Add more Part 3 scenarios
  [
    `你被要求在团队或公开场合分享你的经验和知识。你对这个领域很熟悉但不太习惯公开表达。你怎么准备？`,
    `你和一个合作者建立了很好的工作关系。你听到有人在背后议论这个人。你会怎么做？`,
    `一个比你年轻的人向你请教人生/职业建议。他面临的选择也是你曾经纠结过的。你会怎么回应？`,
    `你正在组织一个重要的活动或聚会。你需要统筹各方面的事情。你怎么确保一切顺利？`,
    `你在团队中虽然不是领导，但大家遇到困难时经常来找你商量。你怎么看待自己的这个角色？`,
    `经过一段时间的努力，你发现自己在某个一直困扰你的问题上有了明显的进步。你会怎么对待这个进步？`,
    `你在一个需要创意和灵感的任务中遇到了瓶颈。常规的方法都不太管用。你会怎么办？`,
    `有一个你一直想做但总因为各种原因推迟的事情——可能是学一个新技能、开启一个项目、或者改变一个习惯。你如何让它从"想"变成"做"？`,
    `你需要在两个都不错的选项中做一个选择，两个各有利弊，没有明显的好坏之分。你如何做决定？`,
  ].forEach(s => {
    if (Q.filter(q=>q.part===3).length < 12) {
      Q.push({ id:Q.length+1, part:3, scenario:s, options:opt(
        '感到无从下手，拖延着不做决定/不行动，希望问题自己消失。',
        '随便选了一个/草率行动，过程中不断怀疑自己的选择。',
        '收集了大量信息但陷入分析瘫痪——每个选项都有利弊，越分析越纠结。',
        '明确自己最看重的核心标准，以此为基准做判断。接受"不完美"的选项，做出理性的取舍。',
        '将理性分析和感性直觉结合起来——选择不仅"合理"，而且让你内心感到"对"。然后全心投入不再纠结。',
        '你在实践中学会了做选择的智慧——不是每个选择都有完美的答案，重要的是选择后用行动让它变成"对的选择"。'
      )});
    }
  });

  // ====== PART 4: Self-Awareness & Growth (8 questions) ======
  const part4Scenarios = [
    `有人问你："你觉得自己最大的性格弱点是什么？"你能多快、多清晰地回答？`,
    `你发现自己有一个很难改变的习惯。努力了一段时间进展很慢。你内心的对话是什么？`,
    `你了解到自己某些行为模式可能有问题——比如总是回避某个话题、或总是对某种人过度迁就。接下来你会？`,
    `你一直用某种方式处理某件事。现在出现了一种新方式，学习曲线陡峭而且和你的习惯很不一样。你的心态是？`,
    `你一个人安静地待着，没有手机、没有打扰。你会感到什么？`,
    `你在一个重要的价值观上遇到了现实的两难——坚持这个价值观可能会伤害一段重要关系。你怎么处理？`,
    `你给自己设定了一个成长目标，已经努力了一段时间但进展很慢。你对自己说什么？`,
    `有人给了你一个关于你性格的反馈——"我觉得你有时候……"。这个反馈让你有点意外。你怎么回应？`,
  ];

  part4Scenarios.forEach(s => {
    if (Q.filter(q=>q.part===4).length < 8) {
      Q.push({ id:Q.length+1, part:4, scenario:s, options:opt(
        '几乎无法清晰地回答——"我好像没什么特别的弱点"或者想到的都是非常表面的东西。',
        '能说出一两个但非常笼统（"可能太敏感了吧"），无法给出具体例子。',
        '能说出三四个弱点但更像别人给你的"标签"，缺乏深入的自我观察和反思。',
        '能清晰说出核心弱点和它们出现的典型情境，并有具体例子支撑。对自己的认知是具体的而非模糊的。',
        '不仅清楚自己的弱点还理解它们的"来源"——哪些是天生的性格倾向、哪些是后天形成的模式。能区分"特质"和"盲点"。',
        '你对自己的了解是立体的、动态的——你知道不同情境下自己的反应模式、哪些健康哪些不健康。你持续更新对自己的认知，不给自己贴永久标签。'
      )});
    }
  });

  // ====== PART 5: Stress & Integration (6 questions) ======
  const part5Scenarios = [
    `你正在经历一段高压时期——多个方面的压力同时出现。你发现自己在压力下变得和平时不太一样。你是怎么应对的？`,
    `你一直习惯的方式是"先想清楚再行动"。但生活中有一些领域可能需要你"先试试看，在行动中学习"。你会？`,
    `你内心有一些比较深的感受和想法，一直没有跟任何人说过。这些想法在脑海转了很久了。你会怎么做？`,
    `有一个机会让你在完全不熟悉的领域做一件事——你对这个领域有兴趣但还不擅长。你会接受吗？`,
    `你需要做一个决策——理性分析指向一个方向，你的直觉和感受指向另一个方向。你会怎么处理？`,
    `深夜独自一人时，你问自己："我想成为什么样的人？我这一生到底想要什么？"你能多清晰地回答？`,
  ];

  part5Scenarios.forEach(s => {
    if (Q.filter(q=>q.part===5).length < 6) {
      Q.push({ id:Q.length+1, part:5, scenario:s, options:opt(
        '完全被压力/困惑吞没——无法思考、无法行动、陷入焦虑循环。',
        '情绪化地做出了反应——说的话或做的事后悔了，但不是因为想清楚了。',
        '一个人硬扛——拒绝向任何人求助，在崩溃边缘但仍然撑着。',
        '首先承认自己的状态——"我现在不太好，这是正常的。"然后采取一些即时调整措施并寻求适当支持。',
        '能识别自己在压力/困惑下的"典型模式"并主动干预——"这不是真实的危机，这只是我的压力在说话。"',
        '即使在风暴中，你也能保持一个"内心观察者"的视角——不被完全淹没，也不强行控制。你像对待一个受伤的朋友一样对待自己。'
      )});
    }
  });

  // Ensure exactly 50 questions: 12+12+12+8+6 = 50
  // Trim or fill each part
  ['part1','part2','part3','part4','part5'].forEach((p,i) => {
    const target = [12,12,12,8,6][i];
    const pNum = i+1;
    let current = Q.filter(q=>q.part===pNum);
    while (current.length > target) {
      const last = Q.findLastIndex(q=>q.part===pNum);
      if (last >= 0) Q.splice(last, 1);
      current = Q.filter(q=>q.part===pNum);
    }
    while (current.length < target) {
      Q.push({ id:Q.length+1, part:pNum,
        scenario:`[${type.id}] 在日常生活和人际互动中，你如何评价自己在"自我认知与实际行动之间的差距"方面的表现？`,
        options:opt(
          '我几乎意识不到这个差距的存在——凭直觉和习惯生活。',
          '偶尔能感觉到差距但不知道如何缩小它，感到有些无力。',
          '知道差距在哪里但改变的动力不够强，经常重新回到老习惯。',
          '能看到差距并在关键时候有意识地做出不同的选择，虽然还不完美。',
          '已经很善于在觉察到差距时及时调整，新习惯正在慢慢代替旧模式。',
          '自我认知和实际行动已经高度一致——你能做到你所知道的，也能持续反思和调整。'
        )});
      current = Q.filter(q=>q.part===pNum);
    }
  });

  // Re-index question IDs
  Q.forEach((q,i) => { q.id = i+1; });

  return Q;
}

// ============================================================
// PART 3: ANALYSIS TEXT GENERATION
// ============================================================

function buildAnalysis(type, level) { // level: 'primary','intermediate','advanced'
  const fn = type.functions.split(' ');
  const dom = fn[0], aux = fn[1], ter = fn[2], inf = fn[3];

  const fnNames = {
    Si:'内倾感觉', Se:'外倾感觉', Ni:'内倾直觉', Ne:'外倾直觉',
    Ti:'内倾思考', Te:'外倾思考', Fi:'内倾情感', Fe:'外倾情感',
  };

  if (level === 'primary') {
    return `
      <h3>🔍 画像：萌芽期的 ${type.name} (${type.id})</h3>
      <p>你正处在 ${type.id} 人格发展的<strong>初级阶段</strong>。你的主导功能 ${fnNames[dom]}（${dom}）和辅助功能 ${fnNames[aux]}（${aux}）已经以本能的方式在发挥作用——你可能已经能感受到自己的一些天赋特质，比如${type.strengths.split('、').slice(0,3).join('、')}。但在这个阶段，这些特质更多是出于本能的驱动，而非有意识的选择。</p>
      <p>你可能时常发现自己陷入一些重复的模式——${type.challenges.split('、').slice(0,3).join('、')}——却不清楚为什么会这样，也不知道如何改变。你的第四功能 ${fnNames[inf]}（${inf}）是你最大的盲点和成长区，在压力下你可能会表现出一些让自己事后感到意外的行为。</p>
      <div class="analysis-highlight strength"><p><strong>💚 你的天赋萌芽：</strong>你能在自己擅长的领域展现出自然的优势——当你在舒适区做自己擅长的事时，你的表现可能远超同龄人。这些都是你未来成长的重要基础。</p></div>
      <div class="analysis-highlight weakness"><p><strong>⚠️ 当前主要挑战：</strong>${type.challenges}——这些问题大多源于你还没有学会有意识地管理自己的认知功能。好消息是，这些问题都是可以改善的。</p></div>
      <p><strong>🎯 核心成长方向：</strong>从"无意识驱动"进入"有意识觉察"——开始注意自己的行为模式、情绪触发点和认知盲点，为后续的有意识成长打下基础。</p>
    `;
  } else if (level === 'intermediate') {
    return `
      <h3>🔍 画像：成长中的 ${type.name} (${type.id})</h3>
      <p>你正处在 ${type.id} 人格发展的<strong>中级阶段</strong>。你已经对自己的认知模式有了一定的了解，开始有意识地运用你的主导功能 ${fnNames[dom]}（${dom}）和辅助功能 ${fnNames[aux]}（${aux}），同时也在学习管理和弥补你的盲点。</p>
      <p>在这个阶段，你可能已经取得了一些切实的进步——比如更善于在${type.strengths.split('、')[0]}和${type.challenges.split('、')[0]}之间找到平衡。但同时你也可能感受到"知易行难"的拉扯——知道应该怎么做，但实际做的时候旧模式仍然会出现。</p>
      <div class="analysis-highlight strength"><p><strong>💚 已经取得的进步：</strong>你开始具备"元认知"能力——能在行为当下或之后识别出自己的模式。这是成长中最关键的突破，说明你已经从"自动驾驶"进入了"有意识驾驶"。</p></div>
      <div class="analysis-highlight weakness"><p><strong>⚠️ 仍在面对的挑战：</strong>第三功能 ${fnNames[ter]}（${ter}）和第四功能 ${fnNames[inf]}（${inf}）的整合仍在进行中。在压力或特定情境下，旧模式仍然可能反弹。这是正常的"螺旋上升"过程。</p></div>
      <p><strong>🎯 核心成长方向：</strong>将"有意识的觉察"转化为"自动化的习惯"——让新的、更健康的模式成为你的默认设置，而不再是需要刻意努力的事。</p>
    `;
  } else {
    return `
      <h3>🔍 画像：整合期的 ${type.name} (${type.id})</h3>
      <p>你正处在 ${type.id} 人格发展的<strong>高阶阶段</strong>。你已经完成了认知功能整合中最艰难的工作——你不再被自己的模式控制，而是成为了模式的驾驭者。你的主导功能 ${fnNames[dom]}（${dom}）和辅助功能 ${fnNames[aux]}（${aux}）发挥得游刃有余，第三功能 ${fnNames[ter]}（${ter}）和第四功能 ${fnNames[inf]}（${inf}）也得到了有意识的发展和整合。</p>
      <p>在这个阶段，你的${type.strengths.split('、').slice(0,3).join('、')}等优势已经不再是偶尔闪现的天赋，而是稳定、可靠的核心能力。同时，曾经的盲点——${type.challenges.split('、').slice(0,2).join('、')}——虽然可能仍然存在，但你已经有了管理它们的能力和智慧。</p>
      <div class="analysis-highlight strength"><p><strong>🌟 成熟的表现：</strong>你在自己的核心领域展现出真正的mastery——不仅是技能上的熟练，更是对自我和他人深刻的理解。你的存在本身就能给周围的人带来稳定感、洞察力或激励。</p></div>
      <div class="analysis-highlight"><p><strong>🚀 持续成长：</strong>达到高阶不意味着"完成"。新的成长课题会不断浮现——可能是帮助他人成长、在更大范围内发挥影响、或是探索自我实现的新维度。保持初学者心态，你最好的作品可能还没到来。</p></div>
      <p><strong>🎯 核心方向：</strong>从"个人成长"迈向"社会贡献"——用你成熟的 ${type.name} 力量去影响和赋能更多的人，成为他人的榜样和推动力。</p>
    `;
  }
}

function buildAdvice(type, level) {
  if (level === 'primary') return {
    title:'成长行动计划',
    items:[
      `每天花5分钟记录一个行为观察——"今天我注意到了自己……"`,
      `找一个你信任且更了解自己的朋友或导师，请他们帮你发现盲点`,
      `每周为自己安排至少一件"纯为自己"的事——且不因此感到愧疚`,
      `阅读关于认知功能和人格成长的书籍，建立自我认知的基本框架`,
      `从最小、最安全的情境开始练习改变——比如对不喜欢的食物说"不"`,
    ],
    goal:'从"无意识"进入"有意识"——觉察是成长的第一步。',
  };
  else if (level === 'intermediate') return {
    title:'成长行动计划',
    items:[
      `选择1个核心改进点（如"及时表达不同意见"），制定3个月的刻意练习计划`,
      `找一个"成长伙伴"互相观察和反馈——有人陪伴的成长更快`,
      `练习"暂停3秒"——在旧模式即将触发时，暂停3秒问自己"我真正想要的是什么？"`,
      `定期回顾——列出"我三个月前做不到但现在能做到的事"，给自己正向反馈`,
      `开始以某种形式（日记、分享、指导）输出你的成长经验——教是最好的学`,
    ],
    goal:'将"有意识的觉察"转化为"自动化的新习惯"。',
  };
  else return {
    title:'持续成长计划',
    items:[
      `开始指导或帮助正在成长的同龄人——成为你曾经需要的那个人`,
      `系统化整理你的成长经验——写文章、做分享、或建立成长社群`,
      `探索一个超出你舒适区但让你兴奋的新领域——保持成长的动力`,
      `定期做"自我审计"——邀请信任的人帮你做盲点检查，高阶不代表没有盲点`,
      `思考更大的命题：你希望在这个世界上留下什么？将个人成长转化为社会价值`,
    ],
    goal:'从"个人成长"迈向"社会贡献"——让更多人因你而变得更好。',
  };
}

// ============================================================
// PART 4: HTML GENERATION
// ============================================================

function generateHTML() {
  const typeSelectorHTML = MBTI.map(t => {
    const gNames = { analyst:'分析师', diplomat:'外交家', sentinel:'守护者', explorer:'探险家' };
    const gIcons = { analyst:'🧠', diplomat:'💚', sentinel:'🛡️', explorer:'🔥' };
    return `<div class="type-card ${t.group}" onclick="selectType('${t.id}')" style="--card-color:${t.color};--card-bg:${t.colorLight}">
      <div class="type-card-icon">${t.emoji}</div>
      <div class="type-card-name">${t.id}</div>
      <div class="type-card-title">${t.name}</div>
      <div class="type-card-desc">${t.desc.substring(0,40)}...</div>
      <div class="type-card-group">${gIcons[t.group]} ${gNames[t.group]}</div>
    </div>`;
  }).join('');

  // Generate JS data for all types
  const allTypeData = MBTI.map(t => {
    const questions = buildQuestions(t);
    const analysis = {
      primary: buildAnalysis(t, 'primary'),
      intermediate: buildAnalysis(t, 'intermediate'),
      advanced: buildAnalysis(t, 'advanced'),
    };
    const advice = {
      primary: buildAdvice(t, 'primary'),
      intermediate: buildAdvice(t, 'intermediate'),
      advanced: buildAdvice(t, 'advanced'),
    };
    return { type:t, questions, analysis, advice };
  });

  // Serialize all data as JSON for embedding
  const dataJSON = JSON.stringify(allTypeData.map(d => ({
    id: d.type.id,
    questions: d.questions,
    analysis: d.analysis,
    advice: d.advice,
  })));

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MBTI 人格成熟度测试</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
<style>
*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
:root {
  --gray-50:#f9fafb; --gray-100:#f3f4f6; --gray-200:#e5e7eb; --gray-300:#d1d5db;
  --gray-400:#9ca3af; --gray-500:#6b7280; --gray-600:#4b5563; --gray-700:#374151; --gray-800:#1f2937; --gray-900:#111827;
  --teal-50:#f0fdfa; --teal-100:#ccfbf1; --teal-500:#14b8a6; --teal-600:#0d9488; --teal-700:#0f766e;
  --orange:#FFA500; --green:#4CAF50; --blue:#2196F3;
  --shadow-sm:0 1px 2px rgba(0,0,0,.05); --shadow:0 1px 3px rgba(0,0,0,.1),0 1px 2px rgba(0,0,0,.06);
  --shadow-md:0 4px 6px rgba(0,0,0,.07),0 2px 4px rgba(0,0,0,.06);
  --shadow-lg:0 10px 15px rgba(0,0,0,.1),0 4px 6px rgba(0,0,0,.05);
  --radius:12px; --radius-sm:8px;
}
body {
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
  background:linear-gradient(135deg,#f0fdfa 0%,#e0f2fe 30%,#faf5ff 60%,#f0fdfa 100%);
  min-height:100vh; color:var(--gray-800); line-height:1.6;
  display:flex; justify-content:center; align-items:flex-start; padding:20px;
}
.app-container { width:100%; max-width:800px; margin:0 auto; }
.page { display:none; animation:fadeIn .4s ease; }
.page.active { display:block; }
@keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
.card { background:#fff; border-radius:var(--radius); padding:32px; box-shadow:var(--shadow-lg); }
@media(max-width:640px){ .card{padding:20px 16px;border-radius:var(--radius-sm)} }

/* Type Selector */
.type-selector-title { text-align:center; margin-bottom:8px; }
.type-selector-title h1 { font-size:24px; font-weight:800; color:var(--gray-800); }
.type-selector-title p { font-size:14px; color:var(--gray-500); margin-top:4px; }
.type-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin:24px 0; }
@media(max-width:768px){ .type-grid{grid-template-columns:repeat(2,1fr)} }
@media(max-width:400px){ .type-grid{grid-template-columns:1fr} }
.type-card {
  background:#fff; border-radius:var(--radius-sm); padding:16px 12px; text-align:center;
  cursor:pointer; transition:all .2s; border:2px solid var(--gray-200);
  box-shadow:var(--shadow-sm);
}
.type-card:hover { transform:translateY(-4px); box-shadow:var(--shadow-lg); border-color:var(--card-color); }
.type-card-icon { font-size:32px; margin-bottom:4px; }
.type-card-name { font-size:18px; font-weight:800; color:var(--gray-800); }
.type-card-title { font-size:12px; color:var(--gray-500); margin-bottom:4px; }
.type-card-desc { font-size:11px; color:var(--gray-400); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.type-card-group { font-size:10px; color:var(--card-color); margin-top:6px; font-weight:600; }

/* Type Home */
.type-home-header { text-align:center; margin-bottom:20px; }
.type-home-icon { font-size:64px; }
.type-home-type { font-size:14px; font-weight:700; color:var(--gray-500); }
.type-home-name { font-size:28px; font-weight:800; color:var(--gray-800); margin:4px 0; }
.type-home-fn { display:inline-block; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:600; background:var(--teal-50); color:var(--teal-700); margin-bottom:12px; }
.type-home-desc { color:var(--gray-600); line-height:1.8; font-size:14px; margin:12px 0; }
.type-home-info { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:16px 0; }
@media(max-width:480px){ .type-home-info{grid-template-columns:1fr} }
.type-home-info-item { padding:12px 14px; border-radius:var(--radius-sm); font-size:13px; }
.type-home-info-item.strengths { background:#f0fdf4; border:1px solid #bbf7d0; }
.type-home-info-item.challenges { background:#fff7ed; border:1px solid #fed7aa; }
.type-home-info-item h4 { font-size:12px; font-weight:700; margin-bottom:4px; }
.type-home-info-item p { color:var(--gray-600); line-height:1.5; }
.btn-start {
  display:block; width:100%; max-width:300px; margin:24px auto 0; padding:14px 32px;
  font-size:18px; font-weight:700; color:#fff; background:linear-gradient(135deg,var(--teal-500),var(--teal-600));
  border:none; border-radius:50px; cursor:pointer;
  box-shadow:0 4px 14px rgba(13,148,136,.35); transition:all .2s;
}
.btn-start:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(13,148,136,.45); }

/* Quiz (same as original) */
.quiz-top { margin-bottom:20px; }
.progress-bar-outer { width:100%; height:8px; background:var(--gray-200); border-radius:4px; overflow:hidden; }
.progress-bar-inner { height:100%; background:linear-gradient(90deg,var(--teal-500),var(--teal-600)); border-radius:4px; transition:width .3s ease; }
.progress-info { display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:13px; color:var(--gray-500); }
.progress-text { font-weight:600; color:var(--teal-600); }
.part-badge { display:inline-block; padding:4px 12px; border-radius:99px; font-size:12px; font-weight:600; background:var(--teal-50); color:var(--teal-700); }
.question-number { font-size:14px; font-weight:700; color:var(--gray-500); margin-bottom:4px; }
.scenario-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--teal-600); margin-bottom:6px; }
.question-scenario { font-size:17px; font-weight:600; color:var(--gray-800); margin-bottom:20px; line-height:1.7; padding:14px 16px; background:var(--teal-50); border-radius:var(--radius-sm); border-left:4px solid var(--teal-500); }
.options-list { display:flex; flex-direction:column; gap:8px; }
.option-item { position:relative; }
.option-item input { position:absolute; opacity:0; width:0; height:0; }
.option-item label { display:flex; align-items:flex-start; gap:10px; padding:12px 14px; border:2px solid var(--gray-200); border-radius:var(--radius-sm); cursor:pointer; transition:all .2s; font-size:14px; color:var(--gray-700); background:#fff; line-height:1.5; }
.option-item label:hover { border-color:var(--teal-200); background:var(--teal-50); }
.option-item input:checked+label { border-color:var(--teal-500); background:var(--teal-50); box-shadow:0 0 0 3px rgba(13,148,136,.1); }
.option-letter { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:var(--gray-100); font-weight:700; font-size:13px; color:var(--gray-600); flex-shrink:0; transition:all .2s; margin-top:1px; }
.option-item input:checked+label .option-letter { background:var(--teal-500); color:#fff; }
.quiz-nav { display:flex; justify-content:space-between; align-items:center; margin-top:24px; gap:12px; }
.btn-nav { padding:10px 24px; font-size:15px; font-weight:600; border-radius:50px; border:2px solid var(--gray-300); background:#fff; color:var(--gray-700); cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:6px; white-space:nowrap; }
.btn-nav:hover:not(:disabled) { border-color:var(--teal-500); color:var(--teal-600); }
.btn-nav:disabled { opacity:.35; cursor:not-allowed; }
.btn-next { background:var(--teal-600); color:#fff; border-color:var(--teal-600); }
.btn-next:hover:not(:disabled) { background:var(--teal-700); }
.btn-submit { background:linear-gradient(135deg,var(--teal-500),var(--teal-600)); color:#fff; border-color:transparent; }
.question-dots { display:flex; flex-wrap:wrap; gap:4px; margin-top:20px; justify-content:center; }
.question-dot { width:24px; height:24px; border-radius:50%; font-size:10px; display:flex; align-items:center; justify-content:center; background:var(--gray-100); color:var(--gray-400); cursor:pointer; border:1px solid var(--gray-200); transition:all .15s; font-weight:600; }
.question-dot:hover { border-color:var(--teal-400); color:var(--teal-600); }
.question-dot.active { background:var(--teal-600); color:#fff; border-color:var(--teal-600); }
.question-dot.answered { background:var(--teal-50); border-color:var(--teal-300); color:var(--teal-600); }
.question-dot.answered.active { background:var(--teal-600); color:#fff; }

/* Modal */
.modal-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:100; align-items:center; justify-content:center; }
.modal-overlay.show { display:flex; }
.modal-box { background:#fff; border-radius:var(--radius); padding:28px 24px; max-width:420px; width:90%; text-align:center; box-shadow:var(--shadow-lg); }
.modal-box h3 { margin-bottom:12px; color:var(--gray-800); }
.modal-box p { color:var(--gray-500); font-size:14px; margin-bottom:20px; }
.modal-buttons { display:flex; gap:10px; justify-content:center; }
.btn-cancel { padding:10px 24px; font-size:14px; font-weight:600; border-radius:50px; border:2px solid var(--gray-300); background:#fff; color:var(--gray-600); cursor:pointer; }
.btn-confirm { padding:10px 24px; font-size:14px; font-weight:600; border-radius:50px; border:none; background:var(--teal-600); color:#fff; cursor:pointer; }

/* Results */
.result-header { text-align:center; margin-bottom:20px; }
.result-icon { font-size:64px; }
.result-level { display:inline-block; padding:6px 20px; border-radius:99px; font-size:16px; font-weight:700; color:#fff; margin:8px 0; }
.result-level.primary { background:var(--orange); }
.result-level.intermediate { background:var(--green); }
.result-level.advanced { background:var(--blue); }
.result-total { font-size:64px; font-weight:900; line-height:1; background:linear-gradient(135deg,var(--teal-600),var(--teal-500)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.result-total-label { font-size:14px; color:var(--gray-400); margin-top:4px; }
.analysis-report { margin:20px 0; }
.analysis-section { margin-bottom:20px; }
.analysis-section h3 { font-size:15px; font-weight:700; color:var(--gray-800); margin-bottom:8px; }
.analysis-section p { font-size:14px; color:var(--gray-600); line-height:1.85; margin-bottom:6px; }
.analysis-highlight { background:var(--teal-50); border-radius:var(--radius-sm); padding:16px 18px; border:1px solid var(--teal-100); margin:14px 0; }
.analysis-highlight.weakness { background:#fff7ed; border-color:#fed7aa; }
.analysis-highlight.strength { background:#f0fdf4; border-color:#bbf7d0; }
.analysis-highlight p { margin-bottom:4px; }
.breakdown-title { font-size:16px; font-weight:700; color:var(--gray-800); margin:24px 0 12px; }
.breakdown-table { width:100%; border-collapse:collapse; font-size:14px; }
.breakdown-table th,.breakdown-table td { padding:10px 14px; text-align:left; border-bottom:1px solid var(--gray-100); }
.breakdown-table th { background:var(--gray-50); font-weight:600; color:var(--gray-600); font-size:12px; text-transform:uppercase; letter-spacing:.5px; }
.breakdown-table .bar-cell { width:40%; }
.breakdown-bar-outer { height:8px; background:var(--gray-200); border-radius:4px; overflow:hidden; }
.breakdown-bar-inner { height:100%; border-radius:4px; transition:width .6s ease; }
.breakdown-bar-inner.p1{background:var(--teal-500)} .breakdown-bar-inner.p2{background:#f59e0b}
.breakdown-bar-inner.p3{background:var(--green)} .breakdown-bar-inner.p4{background:#8b5cf6}
.breakdown-bar-inner.p5{background:var(--blue)}
.breakdown-table .score-cell { font-weight:700; text-align:center; white-space:nowrap; }
.breakdown-table .max-cell { color:var(--gray-400); font-size:12px; text-align:center; }
.advice-section { margin-top:24px; }
.advice-title { font-size:16px; font-weight:700; color:var(--gray-800); margin-bottom:12px; }
.advice-card { background:linear-gradient(135deg,var(--teal-50),#f0fdfa); border-radius:var(--radius-sm); padding:18px 20px; border:1px solid var(--teal-100); }
.advice-card h4 { font-size:14px; color:var(--teal-700); margin-bottom:6px; }
.advice-card ul { margin:8px 0 0 18px; font-size:14px; color:var(--gray-600); }
.advice-card li { margin-bottom:4px; line-height:1.6; }
.btn-restart { display:block; width:100%; max-width:260px; margin:28px auto 0; padding:12px 28px; font-size:16px; font-weight:700; color:var(--teal-600); background:#fff; border:2px solid var(--teal-300); border-radius:50px; cursor:pointer; transition:all .2s; }
.btn-restart:hover { background:var(--teal-50); border-color:var(--teal-500); }
.toast { position:fixed; top:20px; left:50%; transform:translateX(-50%); background:var(--gray-800); color:#fff; padding:10px 24px; border-radius:50px; font-size:14px; z-index:200; opacity:0; pointer-events:none; transition:opacity .3s; box-shadow:var(--shadow-md); }
.toast.show { opacity:1; }
.app-footer { text-align:center; margin-top:24px; font-size:12px; color:var(--gray-400); }
.btn-back-type { display:block; width:100%; max-width:260px; margin:28px auto 0; padding:10px 24px; font-size:14px; font-weight:600; color:var(--gray-500); background:#fff; border:2px solid var(--gray-200); border-radius:50px; cursor:pointer; transition:all .2s; }
.btn-back-type:hover { border-color:var(--gray-400); color:var(--gray-700); }
.material-symbols-outlined.icon-inline { font-size:1.15em; vertical-align:middle; font-variation-settings:'FILL'0,'wght'400,'GRAD'0,'opsz'24; }
.material-symbols-outlined.icon-result { font-size:64px; font-variation-settings:'FILL'1,'wght'300,'GRAD'0,'opsz'48; }
@media(max-width:640px){ body{padding:12px} .type-selector-title h1{font-size:20px} .result-total{font-size:48px} .quiz-nav{flex-wrap:wrap} .btn-nav{flex:1;justify-content:center;min-width:70px;font-size:14px;padding:10px 16px} .question-scenario{font-size:15px} }
@media print { body{background:#fff} .card{box-shadow:none;border:1px solid #ddd} .btn-nav,.btn-start,.btn-restart,.question-dots{display:none!important} }
</style>
</head>
<body>
<div class="app-container">

  <!-- PAGE 0: MBTI TYPE SELECTOR -->
  <section class="page active" id="page-select">
    <div class="card">
      <div class="type-selector-title">
        <h1>🧠 选择你的 MBTI 类型</h1>
        <p>不确定你的类型？可以先去 16personalities.com 做个测试再回来</p>
      </div>
      <div class="type-grid">${typeSelectorHTML}</div>
    </div>
    <p class="app-footer">全 16 型 MBTI 成熟度测试 · 基于荣格认知功能理论</p>
  </section>

  <!-- PAGE 1: TYPE HOME -->
  <section class="page" id="page-home"><div class="card" id="home-content"></div></section>

  <!-- PAGE 2: QUIZ -->
  <section class="page" id="page-quiz">
    <div class="card">
      <div class="quiz-top">
        <div class="progress-bar-outer"><div class="progress-bar-inner" id="progress-bar" style="width:0%"></div></div>
        <div class="progress-info"><span class="progress-text" id="progress-text">0/50</span><span class="part-badge" id="part-badge"></span></div>
      </div>
      <div><p class="question-number" id="question-number"></p><p class="scenario-label">🎬 场景</p><p class="question-scenario" id="question-scenario"></p><div class="options-list" id="options-list"></div></div>
      <div class="quiz-nav">
        <button class="btn-nav" id="btn-prev" onclick="prevQuestion()">← 上一题</button>
        <span style="font-size:13px;color:var(--gray-400)" id="nav-hint"></span>
        <button class="btn-nav btn-next" id="btn-next" onclick="nextQuestion()">下一题 →</button>
      </div>
      <div class="question-dots" id="question-dots"></div>
    </div>
  </section>

  <!-- PAGE 3: RESULTS -->
  <section class="page" id="page-result">
    <div class="card">
      <div class="result-header">
        <div class="result-icon" id="result-icon"></div>
        <div class="result-level" id="result-level-badge"></div>
        <div class="result-total" id="result-total"></div>
        <div class="result-total-label">总分（范围 50–300）</div>
      </div>
      <div class="analysis-report" id="analysis-report"></div>
      <h3 class="breakdown-title">📊 各维度得分明细</h3>
      <table class="breakdown-table"><thead><tr><th>维度</th><th>进度</th><th>得分</th><th>满分</th></tr></thead><tbody id="breakdown-tbody"></tbody></table>
      <div class="advice-section" id="advice-section"></div>
      <button class="btn-restart" onclick="resetTest()">🔄 重新测试</button>
      <button class="btn-restart" style="margin-top:8px" onclick="backToQuiz()">📝 返回修改答案</button>
      <button class="btn-back-type" onclick="backToTypes()">← 选择其他 MBTI 类型</button>
    </div>
    <p class="app-footer">全 16 型 MBTI 成熟度测试 · 基于荣格认知功能理论</p>
  </section>
</div>

<div class="modal-overlay" id="modal-confirm">
  <div class="modal-box">
    <h3>📋 确认提交</h3>
    <p>提交后将生成你的成熟度分析报告。<br>提交后仍可返回修改答案。</p>
    <div class="modal-buttons"><button class="btn-cancel" onclick="closeModal()">继续检查</button><button class="btn-confirm" onclick="confirmSubmit()">确认提交</button></div>
  </div>
</div>
<div class="toast" id="toast"></div>

<script>
// ===== ALL MBTI DATA =====
const ALL_DATA = ${dataJSON};

const MBTI_META = ${JSON.stringify(MBTI.map(t=>({id:t.id,name:t.name,en:t.en,group:t.group,color:t.color,colorLight:t.colorLight,icon:t.icon,emoji:t.emoji,desc:t.desc,functions:t.functions,strengths:t.strengths,challenges:t.challenges})))};

const PART_NAMES = {1:'核心功能特质',2:'缺点认知与克服',3:'优点运用与发挥',4:'自我认知与成长',5:'压力应对与功能整合'};
const PART_MAX = {1:72,2:72,3:72,4:48,5:36};

let currentType = null;
let questions = [];
let currentIndex = 0;
let answers = {};
let quizSubmitted = false;

// ===== TYPE SELECTION =====
function selectType(typeId) {
  currentType = MBTI_META.find(t=>t.id===typeId);
  if (!currentType) return;
  const data = ALL_DATA.find(d=>d.id===typeId);
  if (!data) return;
  questions = data.questions;
  answers = {};
  quizSubmitted = false;
  currentIndex = 0;
  const storageKey = 'mbti_answers_' + typeId;
  try { const s=localStorage.getItem(storageKey); if(s) answers=JSON.parse(s); } catch(e){}
  const savedIdx = sessionStorage.getItem('mbti_idx_'+typeId);
  if (savedIdx) currentIndex = parseInt(savedIdx)||0;
  showTypeHome();
}

function showTypeHome() {
  if (!currentType) return;
  const h = document.getElementById('home-content');
  h.innerHTML = '<div class="type-home-header">'+
    '<div class="type-home-icon">'+currentType.emoji+'</div>'+
    '<div class="type-home-type">'+currentType.id+' · '+currentType.name+'</div>'+
    '<div class="type-home-name">'+currentType.name+' 成熟度测试</div>'+
    '<div class="type-home-fn">认知功能：'+currentType.functions+'</div>'+
    '<p class="type-home-desc">'+currentType.desc+'</p>'+
    '<div class="type-home-info">'+
      '<div class="type-home-info-item strengths"><h4>💚 核心优势</h4><p>'+currentType.strengths+'</p></div>'+
      '<div class="type-home-info-item challenges"><h4>⚠️ 成长课题</h4><p>'+currentType.challenges+'</p></div>'+
    '</div>'+
    '<p style="font-size:13px;color:var(--gray-400);text-align:center;margin-top:12px">⚡ 50道场景题 · 答案自动保存 · 可返回修改</p>'+
    '<button class="btn-start" onclick="startQuiz()">开始测试</button>'+
    '<button class="btn-back-type" onclick="backToTypes()">← 选择其他类型</button>';
  showPage('page-home');
}

function backToTypes() {
  currentType = null; questions = []; answers = {}; quizSubmitted = false; currentIndex = 0;
  showPage('page-select');
}

// ===== PAGE NAV =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
}

// ===== QUIZ =====
function startQuiz() {
  quizSubmitted = false;
  if (Object.keys(answers).length>0) {
    currentIndex = 0;
    for (let i=0;i<questions.length;i++) { if(!(questions[i].id in answers)){currentIndex=i;break;} }
  }
  showPage('page-quiz');
  renderQuiz();
}

function backToQuiz() { quizSubmitted=false; currentIndex=questions.length-1; showPage('page-quiz'); renderQuiz(); }

function renderQuiz() {
  const q = questions[currentIndex];
  const ac = Object.keys(answers).length;
  document.getElementById('progress-bar').style.width = Math.round(ac/questions.length*100)+'%';
  document.getElementById('progress-text').textContent = ac+'/'+questions.length;
  document.getElementById('part-badge').textContent = '第'+q.part+'部分 · '+PART_NAMES[q.part];
  document.getElementById('question-number').textContent = '第'+(currentIndex+1)+'题 / 共'+questions.length+'题';
  document.getElementById('question-scenario').textContent = q.scenario;
  const ol = document.getElementById('options-list');
  const ca = answers[q.id];
  ol.innerHTML = q.options.map(o=>{
    const c = ca===o.score?' checked':'';
    return '<div class="option-item"><input type="radio" name="opt" id="opt-'+o.letter+'" value="'+o.score+'"'+c+' onchange="selectOption('+q.id+','+o.score+')"><label for="opt-'+o.letter+'"><span class="option-letter">'+o.letter+'</span><span>'+o.text+'</span></label></div>';
  }).join('');
  const bp = document.getElementById('btn-prev');
  const bn = document.getElementById('btn-next');
  bp.style.visibility = currentIndex===0?'hidden':'visible';
  if (currentIndex===questions.length-1) {
    bn.innerHTML = '<span class="material-symbols-outlined icon-inline">assignment</span> 提交';
    bn.className = 'btn-nav btn-submit';
    bn.disabled = ac<questions.length;
    bn.onclick = ()=>{ if(ac>=questions.length) showSubmitModal(); };
  } else {
    bn.innerHTML = '下一题 →';
    bn.className = 'btn-nav btn-next';
    bn.disabled = !(q.id in answers);
    bn.onclick = nextQuestion;
  }
  document.getElementById('nav-hint').innerHTML = (q.id in answers)
    ? '<span class="material-symbols-outlined icon-inline">check_circle</span> 已作答'
    : '<span class="material-symbols-outlined icon-inline">warning</span> 请选择最接近你实际行为的选项';
  renderDots();
}

function selectOption(qid,score) { answers[qid]=score; saveStorage(); renderQuiz(); }
function nextQuestion() {
  if (!(questions[currentIndex].id in answers)) { showToast('<span class="material-symbols-outlined icon-inline">warning</span> 请先选择一个选项'); return; }
  if (currentIndex<questions.length-1) { currentIndex++; renderQuiz(); window.scrollTo({top:0,behavior:'smooth'}); }
}
function prevQuestion() { if(currentIndex>0){currentIndex--;renderQuiz();window.scrollTo({top:0,behavior:'smooth'});} }
function renderDots() {
  document.getElementById('question-dots').innerHTML = questions.map((q,i)=>{
    let c=''; if(i===currentIndex)c='active'; if(q.id in answers)c+=' answered';
    return '<div class="question-dot '+c.trim()+'" onclick="jumpTo('+i+')" title="第'+(i+1)+'题">'+(i+1)+'</div>';
  }).join('');
}
function jumpTo(i) { currentIndex=i; renderQuiz(); window.scrollTo({top:0,behavior:'smooth'}); }

// ===== STORAGE =====
function getStorageKey() { return currentType?'mbti_answers_'+currentType.id:'mbti_answers'; }
function saveStorage() { try{localStorage.setItem(getStorageKey(),JSON.stringify(answers))}catch(e){} }
function saveSession() { if(currentType){sessionStorage.setItem('mbti_idx_'+currentType.id,currentIndex);sessionStorage.setItem('mbti_submitted_'+currentType.id,quizSubmitted?'1':'');} }

// ===== SUBMIT =====
function showSubmitModal() {
  const ua = questions.filter(q=>!(q.id in answers));
  if (ua.length>0) { showToast('<span class="material-symbols-outlined icon-inline">warning</span> 还有'+ua.length+'题未作答'); return; }
  document.getElementById('modal-confirm').classList.add('show');
}
function closeModal(){document.getElementById('modal-confirm').classList.remove('show');}
function confirmSubmit(){document.getElementById('modal-confirm').classList.remove('show');quizSubmitted=true;saveSession();showResults();}

// ===== RESULTS =====
function showResults() {
  const r = calcResults(); showPage('page-result'); renderResults(r);
}
function calcResults() {
  const ps={1:0,2:0,3:0,4:0,5:0}; let t=0;
  questions.forEach(q=>{const s=answers[q.id]||0; ps[q.part]+=s; t+=s;});
  return {total:t,partScores:ps};
}
function getLevel(total) {
  if(total<=90)return{name:'初级 '+currentType.id,cssClass:'primary',icon:currentType.emoji,color:'#FFA500'};
  if(total<=180)return{name:'中级 '+currentType.id,cssClass:'intermediate',icon:currentType.emoji,color:'#4CAF50'};
  return{name:'高阶 '+currentType.id,cssClass:'advanced',icon:currentType.emoji,color:'#2196F3'};
}
function renderResults(r) {
  const lv = getLevel(r.total);
  document.getElementById('result-icon').textContent = lv.icon;
  const b = document.getElementById('result-level-badge');
  b.textContent = lv.name; b.className = 'result-level '+lv.cssClass;
  document.getElementById('result-total').textContent = r.total;
  const data = ALL_DATA.find(d=>d.id===currentType.id);
  const analysisKey = lv.cssClass==='primary'?'primary':lv.cssClass==='intermediate'?'intermediate':'advanced';
  document.getElementById('analysis-report').innerHTML = data?data.analysis[analysisKey]:'';
  const tbody = document.getElementById('breakdown-tbody');
  tbody.innerHTML = [1,2,3,4,5].map(p=>{
    const s=r.partScores[p], mx=PART_MAX[p], pct=Math.round(s/mx*100);
    return '<tr><td>Part '+p+'<br><small style="color:var(--gray-400)">'+PART_NAMES[p]+'</small></td><td class="bar-cell"><div class="breakdown-bar-outer"><div class="breakdown-bar-inner p'+p+'" style="width:'+pct+'%"></div></div></td><td class="score-cell">'+s+'</td><td class="max-cell">/ '+mx+'</td></tr>';
  }).join('');
  const adv = data?data.advice[analysisKey]:null;
  if (adv) {
    document.getElementById('advice-section').innerHTML = '<h3 class="advice-title">💡 '+adv.title+'</h3><div class="advice-card"><ul>'+adv.items.map(i=>'<li>'+i+'</li>').join('')+'</ul><p style="margin-top:12px"><strong>🎯 成长目标：</strong>'+adv.goal+'</p></div>';
  }
}

function resetTest() {
  if(confirm('确定清除所有答案并重新测试吗？')){answers={};quizSubmitted=false;currentIndex=0;localStorage.removeItem(getStorageKey());startQuiz();showToast('🔄 已重置');}
}

// ===== TOAST =====
let tt; function showToast(m){const t=document.getElementById('toast');t.innerHTML=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2500);}

// ===== INIT =====
document.addEventListener('DOMContentLoaded',()=>{
  // check if returning to a type
  const lastType = sessionStorage.getItem('mbti_last_type');
  if (lastType) {
    const meta = MBTI_META.find(t=>t.id===lastType);
    if (meta) {
      selectType(lastType);
      const sub = sessionStorage.getItem('mbti_submitted_'+lastType);
      if (sub==='1') { quizSubmitted=true; showResults(); }
      return;
    }
  }
});

window.addEventListener('beforeunload',()=>{ saveStorage(); saveSession(); if(currentType) sessionStorage.setItem('mbti_last_type',currentType.id); });
</script>
</body>
</html>`;

  return html;
}

// ============================================================
// BUILD & OUTPUT
// ============================================================
console.log('Generating full 16-type MBTI test...');
const output = generateHTML();
const outPath = __dirname + '/index.html';
fs.writeFileSync(outPath, output, 'utf-8');
const sizeKB = Math.round(Buffer.byteLength(output, 'utf-8') / 1024);
console.log('✅ Done! Written to index.html (' + sizeKB + ' KB)');
console.log('   Contains all 16 MBTI types with 50 scenario questions each.');
