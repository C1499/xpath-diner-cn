var dailyChallengeIndex = levels.length;
var randomChallengeIndex = levels.length + 1;
var challengeDifficulties = ["easy", "medium", "hard"];
var dinerFoodTags = ["apple", "orange", "pickle", "donut", "burger", "sushi", "taco", "cupcake"];
var dinerContainerTags = ["plate", "bento"];
var randomChallengeHistoryKey = "xpathDinerRandomChallengeHistory";
var randomChallengeHistoryLimit = 6;
var randomChallengeCounter = 0;

function initializeChallengeLevels() {
  levels.push(createDailyChallenge());
  levels.push(createRandomChallenge(false));
}

function loadDailyChallenge() {
  levels[dailyChallengeIndex] = createDailyChallenge();
  currentLevel = dailyChallengeIndex;
  finished = false;
  loadLevel();
  closeMenu();
}

function loadRandomChallenge() {
  levels[randomChallengeIndex] = createRandomChallenge();
  currentLevel = randomChallengeIndex;
  finished = false;
  loadLevel();
  closeMenu();
}

function createDailyChallenge() {
  var today = new Date();
  var seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  seed = seed + challengeDifficulties.indexOf(currentDifficulty) * 1000000;
  var level = createGeneratedChallenge(seed, currentDifficulty);
  level.challengeLabel = { "zh-CN": i18n["zh-CN"].dailyChallenge, en: i18n.en.dailyChallenge };
  level.menuLabel = { "zh-CN": i18n["zh-CN"].dailyMenu, en: i18n.en.dailyMenu };
  level.selectorName = withModeName(level.selectorName, { "zh-CN": i18n["zh-CN"].dailyChallenge, en: i18n.en.dailyChallenge });
  level.hideAnswer = true;
  return level;
}

function createRandomChallenge(rememberHistory) {
  var level = createNonRepeatingRandomChallenge(currentDifficulty);
  level.challengeLabel = { "zh-CN": i18n["zh-CN"].randomChallenge, en: i18n.en.randomChallenge };
  level.menuLabel = { "zh-CN": i18n["zh-CN"].randomMenu, en: i18n.en.randomMenu };
  level.selectorName = withModeName(level.selectorName, { "zh-CN": i18n["zh-CN"].randomChallenge, en: i18n.en.randomChallenge });
  level.hideAnswer = true;
  if(rememberHistory !== false) {
    rememberRandomChallenge(level, currentDifficulty);
  }
  return level;
}

function createGeneratedChallenge(seed, difficulty) {
  var random = seededRandom(seed);
  var factoriesByDifficulty = {
    easy: [
      { type: "type", factory: createTypeChallenge },
      { type: "attribute-presence", factory: createAttributePresenceChallenge },
      { type: "class", factory: createClassChallenge }
    ],
    medium: [
      { type: "child", factory: createChildChallenge },
      { type: "attribute-value", factory: createAttributeValueChallenge },
      { type: "union", factory: createUnionChallenge },
      { type: "index", factory: createIndexChallenge },
      { type: "iframe-basic", factory: createBasicFrameChallenge }
    ],
    hard: [
      { type: "data-testid-frame", factory: createCheckoutFrameChallenge },
      { type: "aria-label-frame", factory: createLoginFrameChallenge },
      { type: "scoped-list-frame", factory: createFrameListChallenge },
      { type: "dynamic-class-frame", factory: createDynamicClassFrameChallenge },
      { type: "disambiguation-frame", factory: createDisambiguationFrameChallenge },
      { type: "sibling-axis-frame", factory: createParentScopeFrameChallenge },
      { type: "text-not-frame", factory: createTextButtonFrameChallenge },
      { type: "substring-frame", factory: createSubstringFrameChallenge }
    ]
  };
  var factories = factoriesByDifficulty[difficulty] || factoriesByDifficulty.easy;
  var entry = factories[pickIndex(random, factories.length)];
  var level = entry.factory(random);
  level.generatedSeed = seed;
  level.challengeType = entry.type;
  level.answerSignature = getChallengeAnswerSignature(level);
  level.challengeSignature = getChallengeSignature(level);
  return level;
}

function createNonRepeatingRandomChallenge(difficulty) {
  var history = getRandomChallengeHistory(difficulty);
  var bestAny = null;
  var bestWithoutRecentAnswer = null;
  var bestWithoutRecentAnswerAndLatestType = null;
  var bestWithoutRecentAnswerAndRecentType = null;
  var bestWithoutExactRepeat = null;
  var recentTypeHistory = history.slice(0, 3);

  for(var attempt = 0; attempt < 80; attempt++) {
    var level = createGeneratedChallenge(createRandomSeed(attempt), difficulty);
    var signature = getChallengeSignature(level);
    var repeatsLatestType = history.length > 0 && history[0].type === signature.type;
    var repeatsRecentType = recentTypeHistory.some(function(item) {
      return item.type === signature.type;
    });
    var repeatsRecentAnswer = history.some(function(item) {
      return item.answer === signature.answer;
    });
    var repeatsExactChallenge = history.some(function(item) {
      return item.key === signature.key;
    });

    if(!bestAny) {
      bestAny = level;
    }

    if(!repeatsExactChallenge && !bestWithoutExactRepeat) {
      bestWithoutExactRepeat = level;
    }

    if(!repeatsRecentAnswer && !bestWithoutRecentAnswer) {
      bestWithoutRecentAnswer = level;
    }

    if(!repeatsRecentAnswer && !repeatsLatestType && !bestWithoutRecentAnswerAndLatestType) {
      bestWithoutRecentAnswerAndLatestType = level;
    }

    if(!repeatsRecentAnswer && !repeatsRecentType && !bestWithoutRecentAnswerAndRecentType) {
      bestWithoutRecentAnswerAndRecentType = level;
    }

    if(!repeatsRecentType && !repeatsRecentAnswer && !repeatsExactChallenge) {
      return level;
    }
  }

  return bestWithoutRecentAnswerAndRecentType ||
    bestWithoutRecentAnswerAndLatestType ||
    bestWithoutRecentAnswer ||
    bestWithoutExactRepeat ||
    bestAny;
}

function createRandomSeed(attempt) {
  randomChallengeCounter++;
  return Date.now() +
    Math.floor(Math.random() * 1000000) +
    attempt * 1000003 +
    randomChallengeCounter * 9176;
}

function getChallengeAnswerSignature(level) {
  return level.frameSelector || level.selector || level.syntax || "";
}

function getChallengeSignature(level) {
  var answer = getChallengeAnswerSignature(level);
  var type = level.challengeType || "";
  var frame = level.frameName || "";
  return {
    key: [type, answer, frame].join("|"),
    type: type,
    answer: answer,
    frame: frame
  };
}

function getRandomChallengeHistory(difficulty) {
  return readRandomChallengeHistory()[difficulty] || [];
}

function rememberRandomChallenge(level, difficulty) {
  var signature = getChallengeSignature(level);
  var allHistory = readRandomChallengeHistory();
  var history = allHistory[difficulty] || [];
  history = history.filter(function(item) {
    return item.key !== signature.key;
  });
  history.unshift(signature);
  allHistory[difficulty] = history.slice(0, randomChallengeHistoryLimit);
  writeRandomChallengeHistory(allHistory);
}

function readRandomChallengeHistory() {
  try {
    return JSON.parse(localStorage.getItem(randomChallengeHistoryKey)) || {};
  }
  catch(err) {
    return {};
  }
}

function writeRandomChallengeHistory(history) {
  try {
    localStorage.setItem(randomChallengeHistoryKey, JSON.stringify(history));
  }
  catch(err) {}
}

function createTypeChallenge(random) {
  var tag = pick(random, dinerContainerTags.concat(dinerFoodTags));
  return {
    doThis: { "zh-CN": "选中所有 " + tag, en: "Select every " + tag },
    selector: "//" + tag,
    selectorName: generatedName("Type selector"),
    helpTitle: { "zh-CN": "按 tag 类型选择 element", en: "Select elements by tag type" },
    syntax: "//" + tag,
    help: {
      "zh-CN": "这是一道简单练习。观察右侧 HTML，用 XPath selector 找出所有指定 tag。",
      en: "This is an easy practice item. Read the HTML and use an XPath selector to find every matching tag."
    },
    examples: localizedExamples("//" + tag, "选中所有 <tag>" + tag + "</tag> element。", "selects every <tag>" + tag + "</tag> element."),
    boardMarkup: createMixedBoard(random, tag, { minimumTargetCount: 2 })
  };
}

function createClassChallenge(random) {
  var tag = pick(random, dinerFoodTags);
  return {
    doThis: { "zh-CN": "选中所有 small " + tag, en: "Select every small " + tag },
    selector: "//" + tag + "[contains(@class,'small')]",
    selectorName: generatedName("Class selector"),
    helpTitle: { "zh-CN": "组合 tag 和 class attribute", en: "Combine tag and class attribute" },
    syntax: "//" + tag + "[contains(@class,'small')]",
    help: {
      "zh-CN": "先限定 tag，再用 <strong>contains(@class,'small')</strong> 缩小范围。",
      en: "Start with the tag, then narrow it with <strong>contains(@class,'small')</strong>."
    },
    examples: localizedExamples("//" + tag + "[contains(@class,'small')]", "只选 class 包含 small 的 " + tag + "。", "selects only " + tag + " elements whose class contains small."),
    boardMarkup: createMixedBoard(random, tag, { targetClass: "small", minimumTargetCount: 2 })
  };
}

function createAttributePresenceChallenge(random) {
  var tag = pick(random, dinerContainerTags.concat(dinerFoodTags.slice(0, 5)));
  return {
    doThis: { "zh-CN": "选中带 for attribute 的 " + tag, en: "Select " + tag + " elements with a for attribute" },
    selector: "//" + tag + "[@for]",
    selectorName: generatedName("Attribute presence"),
    helpTitle: { "zh-CN": "检查 attribute 是否存在", en: "Check whether an attribute exists" },
    syntax: "//" + tag + "[@for]",
    help: {
      "zh-CN": "<strong>[@for]</strong> 只要求 for attribute 存在，不要求具体值。",
      en: "<strong>[@for]</strong> only requires the for attribute to exist; it does not check a specific value."
    },
    examples: localizedExamples("//" + tag + "[@for]", "选中带 for attribute 的 <tag>" + tag + "</tag>。", "selects <tag>" + tag + "</tag> elements with a for attribute."),
    boardMarkup: createPeopleBoard(random, tag, false)
  };
}

function createChildChallenge(random) {
  var parent = pick(random, dinerContainerTags);
  var child = pick(random, dinerFoodTags);
  var otherParent = parent === "plate" ? "bento" : "plate";
  return {
    doThis: { "zh-CN": "选中 " + parent + " 里的 " + child, en: "Select " + child + " elements inside " + parent },
    selector: "//" + parent + "/" + child,
    selectorName: generatedName("Child selector"),
    helpTitle: { "zh-CN": "选择直接子 element", en: "Select direct child elements" },
    syntax: "//" + parent + "/" + child,
    help: {
      "zh-CN": "这一题练习层级关系。只选择直接位于 <strong>" + parent + "</strong> 里的 <strong>" + child + "</strong>。",
      en: "This practices hierarchy. Select only <strong>" + child + "</strong> elements directly inside <strong>" + parent + "</strong>."
    },
    examples: localizedExamples("//" + parent + "/" + child, "选中直接位于 <tag>" + parent + "</tag> 里的 <tag>" + child + "</tag>。", "selects <tag>" + child + "</tag> directly inside <tag>" + parent + "</tag>."),
    boardMarkup: `<${parent}><${child}/></${parent}><${child}/><${otherParent}><${child}/></${otherParent}><${parent}><${pickDifferent(random, dinerFoodTags, child)}/></${parent}><${parent}><${child}/></${parent}>`
  };
}

function createAttributeValueChallenge(random) {
  var names = ["Ada", "Lin", "Ming", "Nora", "Kai", "Sara"];
  var targetName = pick(random, names);
  return {
    doThis: { "zh-CN": "选中分配给 " + targetName + " 的餐点", en: "Select the item assigned to " + targetName },
    selector: "//*[@for='" + targetName + "']",
    selectorName: generatedName("Attribute value"),
    helpTitle: { "zh-CN": "匹配完整 attribute value", en: "Match an exact attribute value" },
    syntax: "//*[@for='" + targetName + "']",
    help: {
      "zh-CN": "attribute value 匹配区分大小写，必须和题目中的名字完全一致。",
      en: "Attribute value matching is case-sensitive. It must match the name exactly."
    },
    examples: localizedExamples("//*[@for='" + targetName + "']", "选中 for attribute 等于 " + targetName + " 的 element。", "selects the element whose for attribute equals " + targetName + "."),
    boardMarkup: createPeopleBoard(random, pick(random, dinerContainerTags.concat(dinerFoodTags.slice(0, 5))), true, targetName)
  };
}

function createUnionChallenge(random) {
  var first = pick(random, dinerContainerTags);
  var second = pick(random, dinerFoodTags);
  return {
    doThis: { "zh-CN": "选中所有 " + first + " 和 " + second, en: "Select every " + first + " and " + second },
    selector: "//" + first + "|//" + second,
    selectorName: generatedName("Union selector"),
    helpTitle: { "zh-CN": "用 | 合并两个 selector", en: "Combine two selectors with |" },
    syntax: "//" + first + "|//" + second,
    help: {
      "zh-CN": "<strong>|</strong> 会合并两个 XPath selector 的结果。",
      en: "<strong>|</strong> combines the results of two XPath selectors."
    },
    examples: localizedExamples("//" + first + "|//" + second, "同时选中 <tag>" + first + "</tag> 和 <tag>" + second + "</tag>。", "selects both <tag>" + first + "</tag> and <tag>" + second + "</tag>."),
    boardMarkup: createMixedBoard(random, first, { secondaryTarget: second, minimumTargetCount: 2 })
  };
}

function createIndexChallenge(random) {
  var tag = pick(random, dinerFoodTags);
  var index = 2 + pickIndex(random, 3);
  return {
    doThis: { "zh-CN": "选中第 " + index + " 个 " + tag, en: "Select the " + ordinal(index) + " " + tag },
    selector: "(//" + tag + ")[" + index + "]",
    selectorName: generatedName("Index selector"),
    helpTitle: { "zh-CN": "从结果里取指定位置", en: "Pick a specific position from the result set" },
    syntax: "(//" + tag + ")[" + index + "]",
    help: {
      "zh-CN": "XPath 的位置索引从 1 开始。用括号包住 selector，再取第几个。",
      en: "XPath positions start at 1. Wrap the selector, then pick the target position."
    },
    examples: localizedExamples("(//" + tag + ")[" + index + "]", "选中第 " + index + " 个 <tag>" + tag + "</tag>。", "selects the " + ordinal(index) + " <tag>" + tag + "</tag>."),
    boardMarkup: createRepeatedTagBoard(tag, index + 2)
  };
}

function createBasicFrameChallenge(random) {
  var frameName = pick(random, ["tiny-table", "dessert-window", "side-board"]);
  var target = pick(random, ["today-special", "chef-pick", "table-seven"]);
  var selector = "//plate[@data-testid='" + target + "']";

  return createFrameChallenge({
    frameName: frameName,
    selectorName: "iframe basics",
    selector: selector,
    doThis: {
      "zh-CN": "切到 `" + frameName + "` 小餐桌 iframe 后，定位 data-testid 为 `" + target + "` 的 plate。",
      en: "Inside the `" + frameName + "` mini-table iframe, locate the plate whose data-testid is `" + target + "`."
    },
    helpTitle: {
      "zh-CN": "中等练习：小餐桌 iframe",
      en: "Medium practice: mini-table iframe"
    },
    help: frameHelp(
      "这是一张嵌在页面里的小餐桌。真实自动化里要先切到 <strong>" + frameName + "</strong> frame，然后在 frame 内定位餐点。",
      "This is a tiny table embedded in the page. In real automation, switch to the <strong>" + frameName + "</strong> frame first, then locate the food inside the frame."
    ),
    examples: localizedExamples(selector, "切入 frame 后，定位 data-testid 为 " + target + " 的 plate。", "after switching into the frame, locates the plate whose data-testid is " + target + "."),
    frameMarkup: [
      '<main class="mini-app"><h2>Mini table</h2><div class="mini-table">',
      '<plate data-testid="starter"><apple/></plate>',
      '<plate data-testid="' + target + '"><orange/></plate>',
      '<bento data-testid="side-box"><pickle/></bento>',
      '<plate data-testid="dessert"><apple class="small"/></plate>',
      '</div>',
      '</main>'
    ].join("")
  });
}

function createCheckoutFrameChallenge(random) {
  var selector = "//*[@data-testid='diner-special']";
  return createFrameChallenge({
    frameName: "specials-window",
    selectorName: "data-testid food selector",
    selector: selector,
    doThis: {
      "zh-CN": "切到 `specials-window` iframe 后，定位 data-testid 为 diner-special 的餐点。",
      en: "Inside the `specials-window` iframe, locate the food item whose data-testid is diner-special."
    },
    helpTitle: {
      "zh-CN": "用稳定的 data-testid 定位餐点",
      en: "Locate food with a stable data-testid"
    },
    help: frameHelp(
      "现代 UI 测试里，稳定的 <strong>data-testid</strong> 往往比动态 class 更适合作为定位依据。这里仍然是在小餐桌里找餐点。",
      "In modern UI tests, a stable <strong>data-testid</strong> is often a better locator target than a dynamic class. This still keeps the task inside the mini diner table."
    ),
    examples: localizedExamples(selector, "在 frame 内定位 data-testid 为 diner-special 的 element。", "locates the element whose data-testid is diner-special inside the frame."),
    frameMarkup: [
      '<main class="mini-app"><h2>Chef specials</h2><div class="mini-table">',
      '<plate data-testid="seasonal-plate"><apple/></plate>',
      '<bento data-testid="diner-special"><orange/><pickle/></bento>',
      '<plate data-testid="diner-special-preview"><orange class="small"/></plate>',
      '<apple data-testid="loose-apple"/>',
      '<pickle data-testid="side-pickle"/>',
      '</div>',
      '</main>'
    ].join("")
  });
}

function createLoginFrameChallenge(random) {
  var selector = "//bento[@aria-label='Chef special']//pickle";
  return createFrameChallenge({
    frameName: "chef-window",
    selectorName: "aria-label scoped food",
    selector: selector,
    doThis: {
      "zh-CN": "在 `chef-window` iframe 里，只选 Chef special bento 里的 pickle。",
      en: "Inside the `chef-window` iframe, select only the pickle inside the Chef special bento."
    },
    helpTitle: {
      "zh-CN": "先用 aria-label 限定餐盒",
      en: "Scope the bento with aria-label"
    },
    help: frameHelp(
      "<strong>aria-label</strong> 是现代页面里常见的稳定语义信息。先限定 Chef special 这个 bento，再找里面的 pickle，避免选到别的 pickle。",
      "<strong>aria-label</strong> is common stable semantic information in modern pages. Scope to the Chef special bento first, then find its pickle."
    ),
    examples: localizedExamples(selector, "只在 aria-label 为 Chef special 的 bento 内选 pickle。", "selects pickle only inside the bento whose aria-label is Chef special."),
    frameMarkup: [
      '<main class="mini-app"><h2>Chef picks</h2><div class="mini-table">',
      '<bento aria-label="Lunch combo"><pickle/></bento>',
      '<bento aria-label="Chef special"><orange/><pickle/></bento>',
      '<plate aria-label="Chef special preview"><pickle class="small"/></plate>',
      '<pickle/>',
      '</div></main>'
    ].join("")
  });
}

function createFrameListChallenge(random) {
  var itemIndex = 3 + pickIndex(random, 2);
  var selector = "//section[@data-testid='dessert-tray']//plate[" + itemIndex + "]/*[1]";
  return createFrameChallenge({
    frameName: "dessert-tray",
    selectorName: "scoped dessert list",
    selector: selector,
    doThis: {
      "zh-CN": "在 `dessert-tray` iframe 里，选中甜点托盘第 " + itemIndex + " 个 plate 里的餐点。",
      en: "Inside the `dessert-tray` iframe, select the food inside plate " + itemIndex + " of the dessert tray."
    },
    helpTitle: {
      "zh-CN": "局部托盘里的第 N 个餐点",
      en: "The Nth food item in a scoped tray"
    },
    help: frameHelp(
      "不要直接取整个 frame 的第 N 个餐点。先限定 <strong>data-testid='dessert-tray'</strong> 这块小餐桌，再进入目标 plate。",
      "Avoid selecting the Nth food item in the whole frame. Scope to <strong>data-testid='dessert-tray'</strong>, then move into the target plate."
    ),
    examples: localizedExamples(selector, "先限定 dessert-tray，再进入第 " + itemIndex + " 个 plate，选中它里面代码顺序排第一的餐点。", "scopes to dessert-tray, then picks the first food item in plate " + itemIndex + " by HTML order."),
    frameMarkup: [
      '<section data-testid="counter-tray" class="mini-app tray-section tray-section-small"><h2>Side tray</h2><div class="mini-table"><plate><apple/></plate><plate><donut/></plate></div></section>',
      '<section data-testid="dessert-tray" class="mini-app tray-section"><h2>Dessert tray</h2><div class="mini-table">',
      '<plate data-slot="1"><cupcake/></plate>',
      '<plate data-slot="2"><donut/></plate>',
      '<plate data-slot="3"><sushi/></plate>',
      '<plate data-slot="4"><taco/></plate>',
      '<plate data-slot="5"><burger/></plate>',
      '</div></section>',
      '<aside><plate><pickle/></plate><plate><orange/></plate></aside>'
    ].join("")
  });
}

function createDynamicClassFrameChallenge(random) {
  var selector = "//donut[contains(@class,'glazed') and not(contains(@class,'sold-out')) and starts-with(@data-state,'fresh')]";
  return createFrameChallenge({
    frameName: "fresh-case",
    selectorName: "dynamic food class",
    selector: selector,
    doThis: {
      "zh-CN": "在 `fresh-case` iframe 里，选中还没售罄、状态以 fresh 开头的 glazed donut。",
      en: "Inside the `fresh-case` iframe, select the glazed donut that is not sold out and whose state starts with fresh."
    },
    helpTitle: {
      "zh-CN": "动态 class 不要整段硬匹配",
      en: "Do not hard-code the full dynamic class"
    },
    help: frameHelp(
      "真实页面里的 class 常常带 hash 或状态词。这里用 <strong>contains(@class,'glazed')</strong> 找稳定片段，再用 <strong>not()</strong> 排除 sold-out。",
      "Real pages often add hashes or state words to class names. Match the stable <strong>glazed</strong> piece, then exclude sold-out with <strong>not()</strong>."
    ),
    examples: localizedExamples(selector, "匹配 glazed class，排除 sold-out，并要求 data-state 以 fresh 开头。", "matches the glazed class, excludes sold-out, and requires data-state to start with fresh."),
    frameMarkup: [
      '<section class="mini-app">',
      '<h2>Donut tray</h2><div class="mini-table">',
      '<donut class="glazed css-9a7x sold-out" data-state="fresh-gone"/>',
      '<donut class="glazed css-4f2k active" data-state="fresh-today"/>',
      '<donut class="glaze-copy css-4f2k active" data-state="fresh-copy"/>',
      '<cupcake class="glazed css-4f2k active" data-state="fresh-today"/>',
      '<donut class="glazed css-8m3q active" data-state="warming"/>',
      '<plate><donut class="glazed css-9a7x sold-out" data-state="fresh-gone"/></plate>',
      '</div>',
      '</section>'
    ].join("")
  });
}

function createDisambiguationFrameChallenge(random) {
  var selector = "//bento[@aria-label='Dessert tray']//orange[@data-pick='target']";
  return createFrameChallenge({
    frameName: "dessert-window",
    selectorName: "same food disambiguation",
    selector: selector,
    doThis: {
      "zh-CN": "在 `dessert-window` iframe 里，只选 Dessert tray bento 中标记为 target 的 orange。",
      en: "Inside the `dessert-window` iframe, select only the target orange inside the Dessert tray bento."
    },
    helpTitle: {
      "zh-CN": "同名餐点需要上下文",
      en: "Same-name food needs context"
    },
    help: frameHelp(
      "同一个 iframe 里有很多 orange。先用 <strong>aria-label</strong> 锁定 Dessert tray 这个 bento，再匹配目标 attribute。",
      "The iframe contains several oranges. Scope to the Dessert tray bento with <strong>aria-label</strong>, then match the target attribute."
    ),
    examples: localizedExamples(selector, "只在 aria-label 为 Dessert tray 的 bento 内找 data-pick 为 target 的 orange。", "finds the orange whose data-pick is target only inside the Dessert tray bento."),
    frameMarkup: [
      '<section class="mini-app"><h2>Dessert tray</h2><div class="mini-table">',
      '<bento aria-label="Breakfast tray"><orange data-pick="target"/><pickle/></bento>',
      '<bento aria-label="Dessert tray"><orange/><orange data-pick="target"/><cupcake/></bento>',
      '<plate aria-label="Dessert tray preview"><orange data-pick="target"/></plate>',
      '<orange data-pick="target"/>',
      '</div></section>'
    ].join("")
  });
}

function createParentScopeFrameChallenge(random) {
  var selector = "//label-chip[normalize-space()='Table 7' and not(ancestor::aside)]/following-sibling::plate[1]/*[last()]";
  return createFrameChallenge({
    frameName: "table-seven",
    selectorName: "label sibling plate",
    selector: selector,
    doThis: {
      "zh-CN": "在 `table-seven` iframe 里，从 Table 7 标签走到后面第一个 plate，再选中这个 plate 里代码顺序排最后的餐点。",
      en: "Inside the `table-seven` iframe, move from the Table 7 label to the next plate, then select that plate's last food item."
    },
    helpTitle: {
      "zh-CN": "用 sibling axis 连接标签和餐盘",
      en: "Use the sibling axis to connect a label and plate"
    },
    help: frameHelp(
      "有时目标 element 没有稳定 attribute，但旁边有可读标签。先定位 <strong>Table 7</strong>，再用 <strong>following-sibling::plate[1]</strong> 找到对应餐盘。",
      "Sometimes the target element has no stable attribute, but a nearby label does. Find <strong>Table 7</strong>, then use <strong>following-sibling::plate[1]</strong> to reach the matching plate."
    ),
    examples: localizedExamples(selector, "从主餐桌的 Table 7 label 走到后面的第一个 plate，再按 HTML 顺序取这只 plate 里的最后一个餐点。", "moves from the main Table 7 label to the first following plate, then picks its last food item in HTML order."),
    frameMarkup: [
      '<section class="mini-app"><h2>Table tags</h2><div class="mini-table">',
      '<div class="place"><label-chip>Table 5</label-chip><plate><apple/><pickle/></plate></div>',
      '<div class="place"><label-chip>Table 7</label-chip><plate><donut/><cupcake/><sushi/></plate></div>',
      '<div class="place"><label-chip>Table 9</label-chip><plate><sushi/><taco/></plate></div>',
      '</div></section>',
      '<aside><h3>Side display</h3><div class="place"><label-chip>Table 7</label-chip><plate><orange/></plate></div></aside>'
    ].join("")
  });
}

function createTextButtonFrameChallenge(random) {
  var selector = "//label-chip[normalize-space()='Chef Pick' and not(ancestor::aside)]";
  return createFrameChallenge({
    frameName: "chef-picks",
    selectorName: "label text with not()",
    selector: selector,
    doThis: {
      "zh-CN": "在 `chef-picks` iframe 里，选中主餐桌上的 Chef Pick 标签，排除 aside 里的同名标签。",
      en: "Inside the `chef-picks` iframe, select the Chef Pick label on the main table and exclude the matching label inside aside."
    },
    helpTitle: {
      "zh-CN": "用 not() 排除干扰区域",
      en: "Exclude a distracting region with not()"
    },
    help: frameHelp(
      "可读文本也可能重复。这里用 <strong>normalize-space()</strong> 匹配 Chef Pick，再用 <strong>not(ancestor::aside)</strong> 排除旁边展示区。",
      "Readable text can repeat too. Match Chef Pick with <strong>normalize-space()</strong>, then exclude the side display with <strong>not(ancestor::aside)</strong>."
    ),
    examples: localizedExamples(selector, "匹配文本 Chef Pick，并排除 ancestor 是 aside 的 label-chip。", "matches Chef Pick while excluding label-chip elements with an aside ancestor."),
    frameMarkup: [
      '<main class="mini-app"><h2>Chef picks</h2><div class="mini-table">',
      '<div class="place"><label-chip>Starter</label-chip><plate><apple/></plate></div>',
      '<div class="place"><label-chip> Chef Pick </label-chip><plate><donut/></plate></div>',
      '<div class="place"><label-chip>Chef Pick Later</label-chip><plate><cupcake/></plate></div>',
      '</div></main>',
      '<aside><h3>Side display</h3><div class="place"><label-chip>Chef Pick</label-chip><plate><sushi/></plate></div></aside>'
    ].join("")
  });
}

function createSubstringFrameChallenge(random) {
  var suffix = pick(random, ["-special", "-today"]);
  var selector = "//cupcake[starts-with(@data-testid,'dessert') and substring(@data-testid, string-length(@data-testid) - string-length('" + suffix + "') + 1) = '" + suffix + "']";
  return createFrameChallenge({
    frameName: "dessert-codes",
    selectorName: "starts-with + substring",
    selector: selector,
    doThis: {
      "zh-CN": "在 `dessert-codes` iframe 里，用 data-testid 的开头和结尾定位目标 cupcake。",
      en: "Inside the `dessert-codes` iframe, locate the target cupcake by matching the start and end of data-testid."
    },
    helpTitle: {
      "zh-CN": "用开头和结尾锁定餐点",
      en: "Match food by start and ending"
    },
    help: frameHelp(
      "这一题要看 data-testid 的结尾。浏览器原生 XPath 通常是 XPath 1.0，没有 <strong>ends-with()</strong>，所以用 <strong>string-length()</strong> 算出结尾从哪里开始，再用 <strong>substring()</strong> 取最后一段来比较。",
      "This looks for a cupcake whose data-testid ends with the target text. Browser XPath cannot use <strong>ends-with()</strong> directly, so <strong>string-length()</strong> finds where the ending starts and <strong>substring()</strong> compares that final part."
    ),
    examples: localizedExamples(selector, "匹配 data-testid 以 dessert 开头、以 " + suffix + " 结尾的 cupcake。", "matches a cupcake whose data-testid starts with dessert and ends with " + suffix + "."),
    frameMarkup: [
      '<section class="mini-app">',
      '<h2>Dessert codes</h2><div class="mini-table">',
      '<cupcake data-testid="dessert-vanilla' + suffix + '"/>',
      '<cupcake data-testid="dessert-berry-secondary"/>',
      '<donut data-testid="dessert-donut' + suffix + '"/>',
      '<cupcake data-testid="preview-cupcake' + suffix + '"/>',
      '<cupcake data-testid="dessert-choco-backup"/>',
      '<plate><cupcake data-testid="dessert-mini-backup"/></plate>',
      '</div>',
      '</section>'
    ].join("")
  });
}

function createFrameChallenge(options) {
  return {
    requiresFrame: true,
    frameName: options.frameName,
    frameMarkup: options.frameMarkup,
    frameSelector: options.selector,
    selector: options.selector,
    selectorName: generatedName(options.selectorName),
    helpTitle: options.helpTitle,
    syntax: options.selector,
    doThis: options.doThis,
    help: options.help,
    examples: options.examples
  };
}

function frameHelp(zh, en) {
  return {
    "zh-CN": zh + " 先切到 frame，再在餐布里的餐点上运行 XPath；不要用主 document 里的 <strong>//iframe</strong> 当答案。",
    en: en + " Switch into the frame first, then run the XPath on the food on the cloth. Do not answer with <strong>//iframe</strong> from the main document."
  };
}

function generatedName(name) {
  return {
    "zh-CN": generatedTopicName(name, "zh-CN"),
    en: generatedTopicName(name, "en")
  };
}

function localizedExamples(selector, zh, en) {
  return {
    "zh-CN": [codeExample(selector, zh)],
    en: [codeExample(selector, en)]
  };
}

function withModeName(selectorName, modeName) {
  return {
    "zh-CN": modeName["zh-CN"] + " · " + localizeForLanguage(selectorName, "zh-CN"),
    en: modeName.en + " · " + localizeForLanguage(selectorName, "en")
  };
}

function localizeForLanguage(value, language) {
  if(value && typeof value === "object" && !Array.isArray(value)) {
    return value[language] || value["zh-CN"] || value.en || "";
  }
  return value || "";
}

function generatedTopicName(name, language) {
  var names = {
    "Type selector": { "zh-CN": "tag 类型", en: "Tag type" },
    "Class selector": { "zh-CN": "class 条件", en: "Class filter" },
    "Attribute presence": { "zh-CN": "attribute 存在", en: "Attribute presence" },
    "Child selector": { "zh-CN": "直接子 element", en: "Direct children" },
    "Attribute value": { "zh-CN": "attribute value", en: "Attribute value" },
    "Union selector": { "zh-CN": "合并 selector", en: "Union selector" },
    "Index selector": { "zh-CN": "位置索引", en: "Position index" },
    "iframe basics": { "zh-CN": "iframe scope", en: "iframe scope" },
    "data-testid food selector": { "zh-CN": "data-testid", en: "data-testid" },
    "aria-label scoped food": { "zh-CN": "aria-label scope", en: "aria-label scope" },
    "scoped dessert list": { "zh-CN": "局部列表", en: "Scoped list" },
    "dynamic food class": { "zh-CN": "动态 class", en: "Dynamic class" },
    "same food disambiguation": { "zh-CN": "同名餐点", en: "Same-name food" },
    "label sibling plate": { "zh-CN": "sibling axis", en: "Sibling axis" },
    "label text with not()": { "zh-CN": "文本 + not()", en: "Text + not()" },
    "starts-with + substring": { "zh-CN": "开头和结尾", en: "Starts and endings" }
  };
  return (names[name] && names[name][language]) || name;
}

function codeExample(selector, text) {
  return '<code class="example-code">' + escapeCode(selector) + '</code>' + text;
}

function escapeCode(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createMixedBoard(random, targetTag, options) {
  var tags = dinerContainerTags.concat(dinerFoodTags);
  var parts = [];
  var targetCount = options.minimumTargetCount || 1;

  for(var i = 0; i < targetCount; i++) {
    parts.push(createElementMarkup(targetTag, options.targetClass));
  }

  if(options.secondaryTarget) {
    parts.push(createElementMarkup(options.secondaryTarget));
    parts.push(createElementMarkup(options.secondaryTarget));
  }

  while(parts.length < 7) {
    var tag = pick(random, tags);
    var className = random() > .65 && dinerFoodTags.indexOf(tag) > -1 ? "small" : "";
    parts.push(createElementMarkup(tag, className));
  }

  return shuffle(random, parts).join("\n");
}

function createPeopleBoard(random, preferredTag, includeExactTarget, targetName) {
  var names = shuffle(random, ["Ada", "Lin", "Ming", "Nora", "Kai", "Sara"]).filter(function(name) {
    return name !== targetName;
  });
  var tags = dinerContainerTags.concat(dinerFoodTags.slice(0, 6));
  var parts = [
    createElementMarkup(preferredTag, "", includeExactTarget ? targetName : names[0]),
    createElementMarkup(preferredTag, "", names[1]),
    createElementMarkup(pickDifferent(random, tags, preferredTag), "", names[2]),
    createElementMarkup(pick(random, tags)),
    createElementMarkup(pick(random, tags), "", names[3])
  ];
  return shuffle(random, parts).join("\n");
}

function createRepeatedTagBoard(tag, count) {
  var parts = [];
  for(var i = 0; i < count; i++) {
    parts.push(createElementMarkup(tag, i % 2 === 0 ? "" : "small"));
    if(i % 3 === 1) {
      parts.push("<plate><" + pickDifferent(seededRandom(i + count), dinerFoodTags, tag) + "/></plate>");
    }
  }
  return parts.join("\n");
}

function createElementMarkup(tag, className, forName) {
  var attrs = "";
  if(className) {
    attrs += ' class="' + className + '"';
  }
  if(forName) {
    attrs += ' for="' + forName + '"';
  }
  if(tag === "plate" || tag === "bento") {
    return "<" + tag + attrs + "><" + (tag === "plate" ? "apple" : "orange") + "/></" + tag + ">";
  }
  return "<" + tag + attrs + "/>";
}

function seededRandom(seed) {
  var value = seed % 2147483647;
  if(value <= 0) {
    value += 2147483646;
  }
  return function() {
    value = value * 16807 % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function pick(random, items) {
  return items[pickIndex(random, items.length)];
}

function pickDifferent(random, items, avoid) {
  var available = items.filter(function(item) {
    return item !== avoid;
  });
  return pick(random, available);
}

function pickIndex(random, length) {
  return Math.floor(random() * length);
}

function shuffle(random, items) {
  var copy = items.slice();
  for(var i = copy.length - 1; i > 0; i--) {
    var j = pickIndex(random, i + 1);
    var tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function ordinal(number) {
  if(number === 2) {
    return "second";
  }
  if(number === 3) {
    return "third";
  }
  return number + "th";
}
