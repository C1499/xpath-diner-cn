var supportedLanguages = ["zh-CN", "en"];
var defaultDifficulty = "easy";

var i18n = {
  "zh-CN": {
    pageTitle: "XPath Diner - 用小游戏练 XPath selector",
    appTitle: "XPath Diner",
    share: "分享",
    noteTitle: "从第一关开始，用餐桌小游戏练 XPath selector。",
    noteIntro: "XPath selector 可以从 HTML 或 XML 中定位目标 element。这里的 tag、attribute、class、id 会保留英文，方便和真实代码对应。",
    noteExampleTitle: "示例 1 - 一个 XPath selector",
    noteExampleExplain: "这里的 <strong>//</strong> 和 <strong>div</strong> 表示查找所有 div element；<strong>[@class='header']</strong> 表示这个 div 必须带有 class attribute，且值为 header。",
    noteHowTo: "玩法很简单：在下方编辑器输入 XPath，选中餐桌上的目标 element。主线关卡答对后会自动进入下一关。",
    noteHover: "把鼠标移到餐桌物品或右侧 HTML 上，可以查看对应的 tag 结构。",
    noteHelp: "右侧会显示当前关卡的语法提示和示例。",
    noteOk: "明白了",
    noteToggle: "查看帮助",
    editorTitle: "XPath 编辑器",
    htmlTitle: "HTML 结构",
    inputPlaceholder: "输入 XPath selector",
    run: "运行",
    skipHelp: "输入数字可跳转关卡。<br/>例如：输入 \"5\" 跳到第 5 关。<br/>*/",
    footerMade: "原项目由 <a href=\"http://www.topswagcode.com\">TopSwagCode</a> 制作，本地版本已做中文化和部署优化。",
    footerRepo: "反馈或问题可以在 <a href=\"https://github.com/TopSwagCode/xpath-diner\">GitHub 仓库</a> 查看项目来源。",
    examples: "示例",
    chooseLevel: "选择关卡",
    resetProgress: "重置进度",
    dailyChallenge: "每日一题",
    randomChallenge: "随机练习",
    challengeNote: "当前难度：{difficulty}。每日一题同一天同难度固定，明天自动更换；随机练习每次点击都会生成新题。",
    languageZh: "中文",
    languageEn: "EN",
    difficultyEasy: "简单",
    difficultyMedium: "中等",
    difficultyHard: "困难",
    quickGuideTitle: "写 XPath 的 4 步",
    quickGuideIntro: "看到普通网页结构时，不要从完整 DOM 路径开始。先找稳定线索，再一点点缩小范围。",
    quickGuideStepTag: "先判断目标大概是什么 tag",
    quickGuideStepAttribute: "优先找稳定 attribute，例如 id、name、aria-label、data-testid",
    quickGuideStepScope: "如果页面里有很多同类 element，先用父级 scope 圈住区域",
    quickGuideStepFallback: "没有稳定 attribute 时，再用可见文本、sibling 或位置关系",
    quickPatternTag: "按 tag 找",
    quickPatternAttribute: "按 attribute 精确匹配",
    quickPatternDescendant: "在 A 里面找任意深度的 B",
    quickPatternIndex: "从一组结果里取第 3 个",
    quickPatternClass: "匹配 class 中的某个词",
    quickPatternFrame: "先切到 frame，再写 frame 内 XPath",
    correctFeedback: "正确，正在进入下一题。",
    dailyCorrectFeedback: "正确，今天这题完成了。",
    randomCorrectFeedback: "正确，这道随机题完成了。",
    incorrectFeedback: "还没选对，再试一次。",
    syntaxErrorFeedback: "这个 XPath 语法没有通过。检查括号、引号、函数名或 axis 写法。",
    noMatchFeedback: "这个 XPath 没有匹配到任何 element。",
    selectedTooFewFeedback: function(expected, actual) { return "你选中了 " + actual + " 个 element，但目标有 " + expected + " 个。"; },
    selectedTooManyFeedback: function(expected, actual) { return "你选中了 " + actual + " 个 element，但目标只有 " + expected + " 个。"; },
    wrongSelectionFeedback: function(actual) { return "数量接近了，但选中的 " + actual + " 个 element 不是目标。"; },
    generatedHelpIntro: "先观察餐桌和 HTML 结构。标准 XPath 先藏起来，答错几次后可以选择展开。",
    firstMissHint: "先找最稳定的线索：tag、attribute、文字、位置，或者是否需要先切到 frame。",
    answerHiddenMessage: function(remaining) { return "标准答案先隐藏。再答错 " + remaining + " 次后，可以选择查看答案。"; },
    answerRevealReady: "需要标准答案吗？你可以继续尝试，或者展开答案。",
    showAnswer: "查看答案",
    answerRevealed: "已显示标准答案。",
    randomAgain: "再来一题",
    startRandomPractice: "随机练习",
    backToMain: "回主线",
    randomCompleteLabel: "随机练习完成",
    dailyCompleteLabel: "今日完成",
    levelCount: function(current, total) { return "第 " + current + " 关 / 共 " + total + " 关"; },
    winner: '<span class="winner"><strong>全部通关！</strong><br>你已经掌握了这些 XPath selector。</span>',
    dailyMenu: "每日",
    randomMenu: "随机",
    shareEmailSubject: "XPath Diner",
    shareEmailBody: "这是一个用小游戏学习和练习 XPath selector 的项目。"
  },
  en: {
    pageTitle: "XPath Diner - Practice XPath selectors through play",
    appTitle: "XPath Diner",
    share: "Share",
    noteTitle: "Start with level one and practice XPath selectors at the table.",
    noteIntro: "XPath selectors locate target elements in HTML or XML. Terms like tag, attribute, class, and id are kept in English because they map directly to real code.",
    noteExampleTitle: "Exhibit 1 - An XPath selector",
    noteExampleExplain: "Here, <strong>//</strong> and <strong>div</strong> find every div element; <strong>[@class='header']</strong> means that div must have a class attribute with the value header.",
    noteHowTo: "Type an XPath selector in the editor below to select the target elements on the table. Main levels move forward after a correct answer.",
    noteHover: "Hover over table items or the HTML viewer to inspect the matching tag structure.",
    noteHelp: "The right panel shows syntax hints and examples for the current level.",
    noteOk: "Got it",
    noteToggle: "Show help",
    editorTitle: "XPath Editor",
    htmlTitle: "HTML Viewer",
    inputPlaceholder: "Type an XPath selector",
    run: "Run",
    skipHelp: "Type a number to skip to a level.<br/>Example: \"5\" for level 5.<br/>*/",
    footerMade: "Original project by <a href=\"http://www.topswagcode.com\">TopSwagCode</a>. This fork adds localization, local deployment fixes, and practice modes.",
    footerRepo: "Feedback or questions can refer to the <a href=\"https://github.com/TopSwagCode/xpath-diner\">GitHub repository</a>.",
    examples: "Examples",
    chooseLevel: "Choose a level",
    resetProgress: "Reset Progress",
    dailyChallenge: "Daily Challenge",
    randomChallenge: "Random Practice",
    challengeNote: "Current difficulty: {difficulty}. The daily challenge stays fixed for the same day and difficulty, then changes tomorrow; random practice creates a new item every click.",
    languageZh: "中文",
    languageEn: "EN",
    difficultyEasy: "Easy",
    difficultyMedium: "Medium",
    difficultyHard: "Hard",
    quickGuideTitle: "A 4-step XPath recipe",
    quickGuideIntro: "When you read a normal page, do not start with the full DOM path. Find a stable clue first, then narrow the scope.",
    quickGuideStepTag: "Start with the target tag",
    quickGuideStepAttribute: "Prefer stable attributes such as id, name, aria-label, or data-testid",
    quickGuideStepScope: "If the page has many similar elements, scope to a parent region first",
    quickGuideStepFallback: "When attributes are weak, use visible text, sibling relationships, or position",
    quickPatternTag: "find by tag",
    quickPatternAttribute: "match an exact attribute value",
    quickPatternDescendant: "find B anywhere inside A",
    quickPatternIndex: "pick the third result",
    quickPatternClass: "match one class word",
    quickPatternFrame: "switch into the frame, then write XPath inside it",
    correctFeedback: "Correct. Moving to the next level.",
    dailyCorrectFeedback: "Correct. Today's challenge is done.",
    randomCorrectFeedback: "Correct. This random challenge is done.",
    incorrectFeedback: "Not quite. Try again.",
    syntaxErrorFeedback: "That XPath did not parse. Check parentheses, quotes, function names, or axis syntax.",
    noMatchFeedback: "That XPath did not match any elements.",
    selectedTooFewFeedback: function(expected, actual) { return "You selected " + actual + " element" + (actual === 1 ? "" : "s") + ", but the target has " + expected + "."; },
    selectedTooManyFeedback: function(expected, actual) { return "You selected " + actual + " elements, but the target has " + expected + "."; },
    wrongSelectionFeedback: function(actual) { return "The count is close, but those " + actual + " element" + (actual === 1 ? "" : "s") + " are not the target."; },
    generatedHelpIntro: "Start by reading the table and HTML. The full XPath stays hidden until you miss a few times.",
    firstMissHint: "Look for the most stable clue first: tag, attribute, text, position, or whether this needs frame scope.",
    answerHiddenMessage: function(remaining) { return "The full answer is hidden. Miss " + remaining + " more time" + (remaining === 1 ? "" : "s") + " to unlock it."; },
    answerRevealReady: "Need the full answer? You can keep trying or reveal it.",
    showAnswer: "Show answer",
    answerRevealed: "Answer shown.",
    randomAgain: "Try another",
    startRandomPractice: "Random practice",
    backToMain: "Back to main",
    randomCompleteLabel: "Random practice complete",
    dailyCompleteLabel: "Done for today",
    levelCount: function(current, total) { return "Level " + current + " of " + total; },
    winner: '<span class="winner"><strong>You did it!</strong><br>You have practiced these XPath selectors.</span>',
    dailyMenu: "Daily",
    randomMenu: "Random",
    shareEmailSubject: "XPath Diner",
    shareEmailBody: "A small game for learning and practicing XPath selectors."
  }
};

function detectLanguage() {
  var stored = localStorage.getItem("language");
  if(supportedLanguages.indexOf(stored) > -1) {
    return stored;
  }

  var browserLanguage = navigator.language || navigator.userLanguage || "";
  if(browserLanguage.toLowerCase().indexOf("zh") === 0) {
    return "zh-CN";
  }
  return "en";
}

function getText(key) {
  var value = i18n[currentLanguage][key] || i18n["zh-CN"][key] || "";
  if(typeof value === "function") {
    return value;
  }
  return value;
}

function localize(value) {
  if(value && typeof value === "object" && !Array.isArray(value)) {
    return value[currentLanguage] || value["zh-CN"] || value.en || "";
  }
  return value || "";
}
