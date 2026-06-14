var levels = [
  {
    helpTitle: { "zh-CN": "按 tag 类型选择 element", en: "Select elements by tag type" },
    selectorName: { "zh-CN": "tag 类型", en: "Type selector" },
    doThis: { "zh-CN": "选中所有 plate", en: "Select the plates" },
    selector: "//plate",
    syntax: "//A",
    help: {
      "zh-CN": "选择所有 tag 名为 <strong>A</strong> 的 element。tag 是 HTML/XML 里的元素类型，例如 <tag>div</tag>、<tag>p</tag>、<tag>ul</tag>。",
      en: "Selects all elements with tag name <strong>A</strong>. A tag is an HTML/XML element type, such as <tag>div</tag>, <tag>p</tag>, or <tag>ul</tag>."
    },
    examples: {
      "zh-CN": ["<strong>//div</strong> 会选中所有 <tag>div</tag> element。", "<strong>//p</strong> 会选中所有 <tag>p</tag> element。"],
      en: ["<strong>//div</strong> selects all <tag>div</tag> elements.", "<strong>//p</strong> selects all <tag>p</tag> elements."]
    },
    boardMarkup: `<plate/><plate/>`
  },
  {
    helpTitle: { "zh-CN": "按 tag 类型选择 element", en: "Select elements by tag type" },
    selectorName: { "zh-CN": "tag 类型", en: "Type selector" },
    doThis: { "zh-CN": "选中所有 bento", en: "Select the bento boxes" },
    selector: "//bento",
    syntax: "//A",
    help: {
      "zh-CN": "选择所有 tag 名为 <strong>A</strong> 的 element。练习时先看右侧 HTML，再写出对应 XPath selector。",
      en: "Selects all elements with tag name <strong>A</strong>. Read the HTML on the right, then write the matching XPath selector."
    },
    examples: {
      "zh-CN": ["<strong>//div</strong> 会选中所有 <tag>div</tag> element。", "<strong>//p</strong> 会选中所有 <tag>p</tag> element。"],
      en: ["<strong>//div</strong> selects all <tag>div</tag> elements.", "<strong>//p</strong> selects all <tag>p</tag> elements."]
    },
    boardMarkup: `<bento/><plate/><bento/>`
  },
  {
    helpTitle: { "zh-CN": "按 attribute 选择 element", en: "Select elements by attribute" },
    selectorName: { "zh-CN": "attribute 条件", en: "Attribute selector" },
    doThis: { "zh-CN": "选中带 fancy id 的 plate", en: "Select the fancy plate" },
    selector: "//*[@id='fancy']",
    syntax: "//*[@id='fancy']",
    help: {
      "zh-CN": "用 <strong>[@id='fancy']</strong> 锁定 id attribute 为 fancy 的 element。attribute selector 也可以用于 class、name、placeholder 等 attribute。",
      en: "Use <strong>[@id='fancy']</strong> to target the element whose id attribute is fancy. Attribute selectors also work with class, name, placeholder, and other attributes."
    },
    examples: {
      "zh-CN": ["<strong>//*[@id=\"cool\"]</strong> 会选中任意 id 为 cool 的 element。", "<strong>//ul[@id=\"long\"]</strong> 会选中 <strong>&lt;ul id=\"long\"&gt;</strong>。"],
      en: ["<strong>//*[@id=\"cool\"]</strong> selects any element with id=\"cool\".", "<strong>//ul[@id=\"long\"]</strong> selects <strong>&lt;ul id=\"long\"&gt;</strong>."]
    },
    boardMarkup: `<plate id="fancy"/><plate/><bento/>`
  },
  {
    helpTitle: { "zh-CN": "选择某个父 element 里的子 element", en: "Select an element inside another element" },
    selectorName: { "zh-CN": "子 element", en: "Child selector" },
    doThis: { "zh-CN": "选中 plate 里的 apple", en: "Select the apple on the plate" },
    selector: "//plate/apple",
    syntax: "//A/B",
    help: {
      "zh-CN": "<strong>//A/B</strong> 会选中直接位于 <strong>A</strong> 内部的 <strong>B</strong>。这一关只要找 plate 下面的 apple。",
      en: "<strong>//A/B</strong> selects <strong>B</strong> elements directly inside <strong>A</strong>. In this level, find the apple under plate."
    },
    examples: {
      "zh-CN": ["<strong>//p/strong</strong> 会选中直接位于 <tag>p</tag> 里的 <tag>strong</tag>。", "<strong>//*[@id=\"fancy\"]/span</strong> 会选中 id 为 fancy 的 element 里的 <tag>span</tag>。"],
      en: ["<strong>//p/strong</strong> selects <tag>strong</tag> directly inside <tag>p</tag>.", "<strong>//*[@id=\"fancy\"]/span</strong> selects <tag>span</tag> inside the element with id=\"fancy\"."]
    },
    boardMarkup: `<bento/><plate><apple/></plate><apple/>`
  },
  {
    helpTitle: { "zh-CN": "组合 attribute selector 和层级", en: "Combine attribute and child selectors" },
    selectorName: { "zh-CN": "组合 selector", en: "Combined selector" },
    doThis: { "zh-CN": "选中 fancy plate 里的 pickle", en: "Select the pickle on the fancy plate" },
    selector: "//*[@id='fancy']/pickle",
    syntax: "//*[@id='id']/A",
    help: {
      "zh-CN": "先用 id attribute 找到父 element，再选择它内部的目标 tag。",
      en: "First locate the parent element by id attribute, then select the target tag inside it."
    },
    examples: {
      "zh-CN": ["<strong>//*[@id=\"cool\"]/span</strong> 会选中 id 为 cool 的 element 里的 <tag>span</tag>。"],
      en: ["<strong>//*[@id=\"cool\"]/span</strong> selects <tag>span</tag> inside the element with id=\"cool\"."]
    },
    boardMarkup: `<bento><orange/></bento><plate id="fancy"><pickle/></plate><plate><pickle/></plate>`
  },
  {
    helpTitle: { "zh-CN": "用 class attribute 缩小范围", en: "Filter by class attribute" },
    selectorName: { "zh-CN": "class 条件", en: "Class selector" },
    doThis: { "zh-CN": "选中 small apple", en: "Select the small apples" },
    selector: "//*[contains(@class,'small')]",
    syntax: "//*[contains(@class,'small')]",
    help: {
      "zh-CN": "XPath 1.0 常用 <strong>contains()</strong> 判断 class attribute 是否包含某个词。这里先练习只按 class 找 element。",
      en: "XPath 1.0 commonly uses <strong>contains()</strong> to test whether a class attribute contains a word. This level starts with class-only matching."
    },
    examples: {
      "zh-CN": ["<strong>//*[contains(@class,\"neato\")]</strong> 会选中 class 中包含 neato 的 element。"],
      en: ["<strong>//*[contains(@class,\"neato\")]</strong> selects elements whose class contains neato."]
    },
    boardMarkup: `<apple/><apple class="small"/><plate><apple class="small"/></plate><plate/>`
  },
  {
    helpTitle: { "zh-CN": "组合 tag 和 class 条件", en: "Combine tag and class conditions" },
    selectorName: { "zh-CN": "tag + class", en: "Specific class selector" },
    doThis: { "zh-CN": "选中 small orange", en: "Select the small oranges" },
    selector: "//orange[contains(@class,'small')]",
    syntax: "//A[contains(@class,'value')]",
    help: {
      "zh-CN": "先限定 tag，再用 attribute 条件缩小范围。这样不会误选其他 small element。",
      en: "Start with the tag, then narrow it with an attribute condition. This avoids selecting other small elements."
    },
    examples: {
      "zh-CN": ["<strong>//ul[contains(@class,\"important\")]</strong> 会选中 class 包含 important 的 <tag>ul</tag>。", "<strong>//input[@placeholder=\"Name\"]</strong> 会选中 placeholder 为 Name 的 <tag>input</tag>。"],
      en: ["<strong>//ul[contains(@class,\"important\")]</strong> selects <tag>ul</tag> elements whose class contains important.", "<strong>//input[@placeholder=\"Name\"]</strong> selects <tag>input</tag> elements with placeholder=\"Name\"."]
    },
    boardMarkup: `<apple/><apple class="small"/><orange class="small"/><orange/><orange class="small"/>`
  },
  {
    helpTitle: { "zh-CN": "把 tag、层级和 class 串起来", en: "Combine tag, hierarchy, and class" },
    selectorName: { "zh-CN": "组合练习", en: "Combined practice" },
    doThis: { "zh-CN": "选中 bento 里的 small orange", en: "Select the small oranges in the bentos" },
    selector: "//bento/orange[contains(@class,'small')]",
    syntax: "//A/B[contains(@class,'value')]",
    help: {
      "zh-CN": "这一关需要同时使用父子层级和 class attribute。先找 bento 里的 orange，再筛选 small。",
      en: "This level combines parent-child hierarchy and class attribute matching. Find orange inside bento, then filter for small."
    },
    examples: { "zh-CN": [], en: [] },
    boardMarkup: `<bento><orange/></bento><orange class="small"/><bento><orange class="small"/></bento><bento><apple class="small"/></bento><bento><orange class="small"/></bento>`
  },
  {
    helpTitle: { "zh-CN": "用 | 合并多个 XPath 结果", en: "Combine XPath results with |" },
    selectorName: { "zh-CN": "合并 selector", en: "Union selector" },
    doThis: { "zh-CN": "选中所有 plate 和 bento", en: "Select all the plates and bentos" },
    selector: "//plate|//bento",
    syntax: "//A|//B",
    help: {
      "zh-CN": "<strong>|</strong> 会合并多个 XPath selector 的结果，可以把不同 tag 一起选中。",
      en: "<strong>|</strong> combines the results of multiple XPath selectors, so you can select different tags together."
    },
    examples: {
      "zh-CN": ["<strong>//p|//*[@id=\"fun\"]</strong> 会选中所有 <tag>p</tag> 和 id 为 fun 的 element。", "<strong>//a|//p|//div</strong> 会选中 <tag>a</tag>、<tag>p</tag> 和 <tag>div</tag>。"],
      en: ["<strong>//p|//*[@id=\"fun\"]</strong> selects all <tag>p</tag> elements and the element with id=\"fun\".", "<strong>//a|//p|//div</strong> selects <tag>a</tag>, <tag>p</tag>, and <tag>div</tag> elements."]
    },
    boardMarkup: `<pickle class="small"/><pickle/><plate><pickle/></plate><bento><pickle/></bento><plate><pickle/></plate><pickle/><pickle class="small"/>`
  },
  {
    helpTitle: { "zh-CN": "用 * 选择任意子 element", en: "Select any child element with *" },
    selectorName: { "zh-CN": "通配符", en: "Wildcard selector" },
    doThis: { "zh-CN": "选中 plate 里的所有东西", en: "Select everything on a plate" },
    selector: "//plate/*",
    syntax: "//A/*",
    help: {
      "zh-CN": "<strong>*</strong> 表示任意 tag。<strong>//plate/*</strong> 会选中每个 plate 的直接子 element。",
      en: "<strong>*</strong> means any tag. <strong>//plate/*</strong> selects every direct child element of each plate."
    },
    examples: {
      "zh-CN": ["<strong>//p/*</strong> 会选中所有 <tag>p</tag> 里的直接子 element。", "<strong>//ul[@id=\"fancy\"]/*</strong> 会选中 id 为 fancy 的 <tag>ul</tag> 里的直接子 element。"],
      en: ["<strong>//p/*</strong> selects every direct child inside <tag>p</tag> elements.", "<strong>//ul[@id=\"fancy\"]/*</strong> selects every direct child inside <tag>ul id=\"fancy\"</tag>."]
    },
    boardMarkup: `<apple/><plate><orange class="small" /></plate><bento/><bento><orange/></bento><plate id="fancy"/>`
  },
  {
    helpTitle: { "zh-CN": "练习 sibling axis", en: "Practice the sibling axis" },
    selectorName: { "zh-CN": "sibling axis", en: "Following sibling selector" },
    doThis: { "zh-CN": "选中跟在 plate 后面的 apple", en: "Select every apple that follows a plate" },
    selector: "//plate/following-sibling::apple",
    syntax: "//A/following-sibling::B",
    help: {
      "zh-CN": "这一关练习 sibling axis，也就是同级 element 之间的位置关系。<strong>following-sibling::B</strong> 会找同一层级中排在后面的 B。",
      en: "This level practices the sibling axis: position relationships between elements at the same depth. <strong>following-sibling::B</strong> finds B elements after the current element."
    },
    examples: {
      "zh-CN": ["<strong>//p/following-sibling::div</strong> 会选中跟在 <tag>p</tag> 后面的 <tag>div</tag>。", "<strong>//div/following-sibling::a</strong> 会选中跟在 <tag>div</tag> 后面的 <tag>a</tag>。"],
      en: ["<strong>//p/following-sibling::div</strong> selects <tag>div</tag> elements after a <tag>p</tag> sibling.", "<strong>//div/following-sibling::a</strong> selects <tag>a</tag> elements after a <tag>div</tag> sibling."]
    },
    boardMarkup: `<plate id="fancy"><orange class="small"/></plate><plate><pickle/></plate><apple class="small"/><plate><apple/></plate>`
  },
  {
    helpTitle: { "zh-CN": "从 XPath 结果中取指定位置", en: "Select an item by index" },
    selectorName: { "zh-CN": "位置索引", en: "Index selector" },
    doThis: { "zh-CN": "选中第 3 个 pickle", en: "Select the third pickle" },
    selector: "(//pickle)[3]",
    syntax: "(//A)[Index]",
    help: {
      "zh-CN": "XPath 的位置索引从 1 开始。先用括号得到一组结果，再取第几个。",
      en: "XPath positions start at 1. Wrap the selector to get a result set, then choose a position."
    },
    examples: {
      "zh-CN": ["<strong>(//a)[2]</strong> 会选中第 2 个 <tag>a</tag>。"],
      en: ["<strong>(//a)[2]</strong> selects the second <tag>a</tag> element."]
    },
    boardMarkup: `<pickle/><bento><pickle class="small"/></bento><pickle class="small"></pickle><bento><pickle/></bento><bento><pickle class="small"/></bento>`
  },
  {
    helpTitle: { "zh-CN": "区分直接子 element 和更深层后代", en: "Direct children vs deeper descendants" },
    selectorName: { "zh-CN": "直接子 element", en: "Child selector" },
    doThis: { "zh-CN": "选中直接放在 plate 上的 apple", en: "Select the apple directly on a plate" },
    selector: "//plate/apple",
    syntax: "//A/B",
    help: {
      "zh-CN": "<strong>//A/B</strong> 只选直接子 element，不会选嵌套更深的后代。这里要排除 bento 里的 apple。",
      en: "<strong>//A/B</strong> selects direct children only, not deeper descendants. Exclude the apple inside bento."
    },
    examples: {
      "zh-CN": ["<strong>//plate/apple</strong> 只选直接位于 plate 下的 apple。"],
      en: ["<strong>//plate/apple</strong> selects apple elements directly under plate."]
    },
    boardMarkup: `<plate><bento><apple/></bento></plate><plate><apple/></plate><plate/><apple/><apple class="small"/>`
  },
  {
    helpTitle: { "zh-CN": "用 last() 找 HTML 顺序里的最后一项", en: "Select the last item in HTML order with last()" },
    selectorName: { "zh-CN": "last()", en: "last() selector" },
    doThis: { "zh-CN": "按 HTML 顺序，选中每个 plate 里的最后一个餐点", en: "Select the last food item in each plate by HTML order" },
    selector: "//plate/*[last()]",
    syntax: "last()",
    help: {
      "zh-CN": "<strong>last()</strong> 看的是 HTML 里的排列顺序。这里不是判断谁最大，也不是判断视觉上最后摆放；每个 plate 里，代码排在最后的餐点会被选中。",
      en: "<strong>last()</strong> matches the last child element inside a parent. If there is only one child, it is also the last child."
    },
    examples: {
      "zh-CN": ["<strong>(//div)[last()]</strong> 会选中最后一个 <tag>div</tag>。", "<strong>//plate/*[last()]</strong> 会按 HTML 顺序选中每个 plate 里的最后一个餐点。"],
      en: ["<strong>(//div)[last()]</strong> selects the last <tag>div</tag>.", "<strong>//plate/*[last()]</strong> selects the last food item in each plate by HTML order."]
    },
    boardMarkup: `<plate id="fancy"><apple class="small"/></plate><plate/><plate><orange class="small"/><orange></plate><pickle class="small"/>`
  },
  {
    helpTitle: { "zh-CN": "选择带有某个 attribute 的 element", en: "Select elements that have an attribute" },
    selectorName: { "zh-CN": "attribute 存在", en: "Attribute presence selector" },
    doThis: { "zh-CN": "选中所有带 for attribute 的餐点", en: "Select the items for someone" },
    selector: "//*[@for]",
    syntax: "//*[@attribute]",
    help: {
      "zh-CN": "attribute 写在开始 tag 里，例如 <tag>span attribute=\"value\"</tag>。<strong>[@for]</strong> 只检查 attribute 是否存在。",
      en: "Attributes appear in the opening tag, like <tag>span attribute=\"value\"</tag>. <strong>[@for]</strong> only checks whether the attribute exists."
    },
    examples: {
      "zh-CN": ["<strong>//a[@href]</strong> 会选中所有带 href attribute 的 <tag>a</tag>。", "<strong>//*[@type]</strong> 会选中所有带 type attribute 的 element。"],
      en: ["<strong>//a[@href]</strong> selects all <tag>a</tag> elements with an href attribute.", "<strong>//*[@type]</strong> selects all elements with a type attribute."]
    },
    boardMarkup: `<bento><apple class="small"/></bento><apple for="Ethan"/><plate for="Alice"><pickle/></plate><bento for="Clara"><orange/></bento><pickle/>`
  },
  {
    helpTitle: { "zh-CN": "组合 tag 和 attribute 存在条件", en: "Combine tag and attribute presence" },
    selectorName: { "zh-CN": "tag + attribute", en: "Attribute presence selector" },
    doThis: { "zh-CN": "选中带 for attribute 的 plate", en: "Select the plates for someone" },
    selector: "//plate[@for]",
    syntax: "//A[@attribute]",
    help: {
      "zh-CN": "把 attribute selector 加在 tag selector 后面，就能只选择某种 tag 中带有指定 attribute 的 element。",
      en: "Add an attribute selector after a tag selector to select only that tag when it has the target attribute."
    },
    examples: {
      "zh-CN": ["<strong>//*[@value]</strong> 会选中所有带 value attribute 的 element。", "<strong>//input[@disabled]</strong> 会选中带 disabled attribute 的 <tag>input</tag>。"],
      en: ["<strong>//*[@value]</strong> selects all elements with a value attribute.", "<strong>//input[@disabled]</strong> selects <tag>input</tag> elements with a disabled attribute."]
    },
    boardMarkup: `<plate for="Sarah"><pickle/></plate><plate for="Luke"><apple/></plate><plate/><bento for="Steve"><orange/></bento>`
  },
  {
    helpTitle: { "zh-CN": "选择 attribute 值完全匹配的 element", en: "Select an exact attribute value" },
    selectorName: { "zh-CN": "attribute value", en: "Attribute value selector" },
    doThis: { "zh-CN": "选中 Vitaly 的餐点", en: "Select Vitaly's meal" },
    selector: "//*[@for='Vitaly']",
    syntax: "//*[@attribute='value']",
    help: {
      "zh-CN": "attribute value 匹配区分大小写，字符必须完全一致。",
      en: "Attribute value matching is case-sensitive. Every character must match."
    },
    examples: {
      "zh-CN": ["<strong>//input[@type=\"checkbox\"]</strong> 会选中 type 为 checkbox 的 input。"],
      en: ["<strong>//input[@type=\"checkbox\"]</strong> selects checkbox inputs."]
    },
    boardMarkup: `<apple for="Alexei" /><bento for="Albina"><apple /></bento><bento for="Vitaly"><orange/></bento><pickle/>`
  },
  {
    helpTitle: { "zh-CN": "用 starts-with() 匹配 attribute 开头", en: "Match the start of an attribute with starts-with()" },
    selectorName: { "zh-CN": "starts-with()", en: "Attribute starts-with selector" },
    doThis: { "zh-CN": "选中名字以 Sa 开头的餐点", en: "Select the items for names that start with Sa" },
    selector: "//*[starts-with(@for,'Sa')]",
    syntax: "//*[starts-with(@attribute,'value')]",
    help: {
      "zh-CN": "<strong>starts-with()</strong> 可以判断 attribute value 是否以某段文字开头。",
      en: "<strong>starts-with()</strong> tests whether an attribute value begins with specific text."
    },
    examples: {
      "zh-CN": ["<strong>//toy[starts-with(@category,\"Swim\")]</strong> 会选中 category 以 Swim 开头的 toy。"],
      en: ["<strong>//toy[starts-with(@category,\"Swim\")]</strong> selects toy elements whose category starts with Swim."]
    },
    boardMarkup: `<plate for="Sam"><pickle/></plate><bento for="Sarah"><apple class="small"/></bento><bento for="Mary"><orange/></bento>`
  },
  {
    helpTitle: { "zh-CN": "用 substring() 模拟结尾匹配", en: "Use substring() to match the end of a value" },
    selectorName: { "zh-CN": "结尾匹配", en: "Attribute ends-with pattern" },
    doThis: { "zh-CN": "选中名字以 ato 结尾的餐点", en: "Select the items for names that end with ato" },
    selector: "//*[substring(@for, string-length(@for) - string-length('ato') +1) = 'ato']",
    syntax: "//*[substring(@attribute, string-length(@attribute) - string-length('end text') +1) = 'end text']",
    help: {
      "zh-CN": "这里想判断 attribute 的结尾。浏览器原生 XPath 通常是 XPath 1.0，没有 <strong>ends-with()</strong>，所以用 <strong>string-length()</strong> 算出结尾从哪里开始，再用 <strong>substring()</strong> 取出最后一段来比较。",
      en: "This means “the attribute ends with this text.” Browser XPath cannot use <strong>ends-with()</strong> directly, so <strong>string-length()</strong> measures the value and <strong>substring()</strong> takes the ending part for comparison."
    },
    examples: {
      "zh-CN": ["<strong>//img[substring(@src, string-length(@src) - string-length('.jpg') + 1) = '.jpg']</strong> 会选中 src 以 .jpg 结尾的图片。"],
      en: ["<strong>//img[substring(@src, string-length(@src) - string-length('.jpg') + 1) = '.jpg']</strong> selects images whose src ends with .jpg."]
    },
    boardMarkup: `<apple class="small"/><bento for="Hayato"><pickle/></bento><apple for="Ryota"></apple><plate for="Minato"><orange/></plate><pickle class="small"/>`
  },
  {
    helpTitle: { "zh-CN": "用 data-testid 做稳定定位", en: "Use data-testid as a stable locator" },
    selectorName: { "zh-CN": "data-testid", en: "data-testid selector" },
    doThis: { "zh-CN": "选中 data-testid 为 chef-special 的餐点", en: "Select the item whose data-testid is chef-special" },
    selector: "//*[@data-testid='chef-special']",
    syntax: "//*[@data-testid='value']",
    help: {
      "zh-CN": "现代 Web 测试常用 <strong>data-testid</strong> 作为稳定 locator。它不依赖布局和样式，比动态 class 更稳。",
      en: "Modern web tests often use <strong>data-testid</strong> as a stable locator. It does not depend on layout or styling, so it is safer than dynamic classes."
    },
    examples: {
      "zh-CN": ["<strong>//*[@data-testid=\"submit-order\"]</strong> 会选中 data-testid 为 submit-order 的 element。"],
      en: ["<strong>//*[@data-testid=\"submit-order\"]</strong> selects the element whose data-testid is submit-order."]
    },
    boardMarkup: `<plate data-testid="starter"><apple/></plate><bento data-testid="chef-special"><sushi/><pickle/></bento><plate data-testid="chef-special-preview"><donut/></plate><cupcake/>`
  },
  {
    helpTitle: { "zh-CN": "用 aria-label 限定语义 scope", en: "Use aria-label to scope a selection" },
    selectorName: { "zh-CN": "aria-label scope", en: "aria-label selector" },
    doThis: { "zh-CN": "选中 Dessert tray bento 里的 cupcake", en: "Select the cupcake inside the Dessert tray bento" },
    selector: "//bento[@aria-label='Dessert tray']//cupcake",
    syntax: "//A[@aria-label='value']//B",
    help: {
      "zh-CN": "<strong>aria-label</strong> 常用于描述 UI 语义。先限定 Dessert tray 这个 bento，再用 <strong>//cupcake</strong> 找它里面的目标。",
      en: "<strong>aria-label</strong> often describes UI meaning. Scope to the Dessert tray bento first, then find the <strong>cupcake</strong> inside it."
    },
    examples: {
      "zh-CN": ["<strong>//bento[@aria-label=\"Dessert tray\"]//cupcake</strong> 会在 Dessert tray 这个 bento 里找 cupcake。"],
      en: ["<strong>//bento[@aria-label=\"Dessert tray\"]//cupcake</strong> finds cupcakes inside the Dessert tray bento."]
    },
    boardMarkup: `<bento aria-label="Lunch tray"><cupcake/></bento><bento aria-label="Dessert tray"><donut/><cupcake/></bento><plate aria-label="Dessert tray preview"><cupcake/></plate>`
  },
  {
    requiresFrame: true,
    frameName: "tiny-table",
    frameSelector: "//plate[@data-testid='chef-pick']",
    selector: "//plate[@data-testid='chef-pick']",
    syntax: "//plate[@data-testid='chef-pick']",
    helpTitle: { "zh-CN": "真实 iframe 入门", en: "Real iframe basics" },
    selectorName: { "zh-CN": "iframe scope", en: "Frame selector" },
    doThis: {
      "zh-CN": "切到 tiny-table iframe 后，选中 chef-pick plate",
      en: "Switch into the tiny-table iframe, then select the chef-pick plate"
    },
    help: {
      "zh-CN": "真实页面里，主 document 的 XPath 不能直接选进 iframe。先切到 <strong>tiny-table</strong> frame，再在餐布里的餐点上运行 XPath。",
      en: "XPath from the main document cannot reach into an iframe. Switch into the <strong>tiny-table</strong> frame first, then run XPath on the food on the cloth."
    },
    examples: {
      "zh-CN": ["<strong>//iframe</strong> 只能选中主 document 里的 iframe 本身，不能选中 frame 内的 plate。", "<strong>//plate[@data-testid='chef-pick']</strong> 是切入 frame 后运行的 XPath。"],
      en: ["<strong>//iframe</strong> only selects the iframe element in the main document; it does not select plates inside the frame.", "<strong>//plate[@data-testid='chef-pick']</strong> is the XPath you run after switching into the frame."]
    },
    frameMarkup: `<main class="mini-app"><h2>Tiny table</h2><div class="mini-table"><plate data-testid="starter"><apple/></plate><plate data-testid="chef-pick"><sushi/><pickle/></plate><bento data-testid="side-box"><donut/></bento><plate data-testid="chef-pick-preview"><cupcake/></plate></div></main>`
  }
];
