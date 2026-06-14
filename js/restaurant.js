/*
  Function Reference
  ==================

  loadLevel() - loads up the level
  fireRule() - fires the css rule
  updateProgressUI() - adds a checkmark to the level menu and header when a correct guess is made, removes it if incorrect
  hideTooltip() - hides markup tooltip that hovers over the elements
  showHelp() - Loads help text & examples for each level

  ..to be continued!
*/

function normalizeXPath(xpathExpression) {
  if(!xpathExpression) {
    return null;
  }

  // Scope leading // to the practice area while keeping XPath's descendant semantics.
  if(xpathExpression.startsWith("//")){
    return "." + xpathExpression;
  }

  return xpathExpression;
}

function evaluateXPath(xpathExpression, rootDocument, contextNode) {
  xpathExpression = normalizeXPath(xpathExpression);
  if(!xpathExpression || !rootDocument || !contextNode) {
    return jQuery([]);
  }

  var xpathResult = rootDocument.evaluate(xpathExpression, contextNode, null, XPathResult.ANY_TYPE, null);
  var result = [];
  var elem;
  while (elem = xpathResult.iterateNext()) {
     result.push(elem);
  }

  return jQuery([]).pushStack(result);
}

$.fn.xpathEvaluate = function (xpathExpression) {
  return evaluateXPath(xpathExpression, document, document.getElementById("gametable"));
}

function getFrameElement() {
  if(!level || !level.requiresFrame) {
    return null;
  }
  return document.querySelector("#gametable iframe.practice-frame");
}

function getFrameDocument() {
  var frame = getFrameElement();
  if(!frame) {
    return null;
  }
  return frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
}

function getXPathContext() {
  if(level && level.requiresFrame) {
    var frameDocument = getFrameDocument();
    return {
      rootDocument: frameDocument,
      contextNode: frameDocument && frameDocument.body
    };
  }

  return {
    rootDocument: document,
    contextNode: document.getElementById("gametable")
  };
}

function getExpectedSelector() {
  return level && level.requiresFrame ? level.frameSelector : level.selector;
}

function sameSelection(ruleSelected, levelSelected) {
  var ruleNodes = ruleSelected.toArray();
  var levelNodes = levelSelected.toArray();

  if(ruleNodes.length !== levelNodes.length || ruleNodes.length === 0) {
    return false;
  }

  for(var i = 0; i < levelNodes.length; i++) {
    if(ruleNodes.indexOf(levelNodes[i]) === -1) {
      return false;
    }
  }

  return true;
}

function clearSelectionClasses() {
  $(".strobe,.clean,.shake").each(function(){
    $(this).width($(this).width());
    $(this).removeAttr("style");
  });
  $(".strobe,.clean,.shake").removeClass("strobe clean shake");

  var frameDocument = getFrameDocument();
  if(frameDocument) {
    $(frameDocument).find(".strobe,.clean,.shake").removeClass("strobe clean shake");
  }
}

function strobeExpectedSelection() {
  var context = getXPathContext();
  try {
    evaluateXPath(getExpectedSelector(), context.rootDocument, context.contextNode).addClass("strobe");
  }
  catch(err) {
    $(".editor").addClass("shake");
  }
}

var level;  // Holds current level info
var currentLevel = parseInt(localStorage.currentLevel,10) || 0; // Keeps track of the current level Number (0 is level 1)
var levelTimeout = 1000; // Delay between levels after completing
var finished = false;    // Keeps track if the game is showing the Your Rock! screen (so that tooltips can be disabled)

var blankProgress = {
  totalCorrect : 0,
  percentComplete : 0,
  lastPercentEvent : 0,
  guessHistory : {}
}

// Get progress from localStorage, or start from scratch if we don't have any
var progress = JSON.parse(localStorage.getItem("progress")) || blankProgress;
var currentLanguage = detectLanguage();
var currentDifficulty = localStorage.getItem("challengeDifficulty") || defaultDifficulty;
if(challengeDifficulties && challengeDifficulties.indexOf(currentDifficulty) === -1) {
  currentDifficulty = defaultDifficulty;
}
var answerRevealThreshold = 3;
var currentAttemptCount = 0;
var answerRevealed = false;
var currentChallengeKey = "";
var resultTimeout;


$(document).ready(function(){

  $(".share-menu").on("click","a",function(){

    var type = $(this).attr("type");

    if(type == "twitter"){
      var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(getText("shareEmailBody")) + "&hashtags=xpath,xpathdiner,webdev&url=http%3A%2F%2Fxpath.topswagcode.com%2F";
    } else if (type == "facebook") {
      var url = "https://www.facebook.com/sharer.php?src=sp&u=http%3A%2F%2Fxpath.topswagcode.com";
    } else if (type == "email") {
      var url = "mailto:?subject=" + encodeURIComponent(getText("shareEmailSubject")) + "&body=" + encodeURIComponent(getText("shareEmailBody") + "\n\nhttp://xpath.topswagcode.com");
    }

    PopupCenter(url, "title", 600, 450);
    sendEvent("share", type, "");
    return false;
  });

  $(window).on("keydown",function(e){
    if(e.keyCode == 27) {
      closeMenu();
    }
  });

  // Custom scrollbar plugin
  $(".left-col, .level-menu").mCustomScrollbar({
    scrollInertia: 0,
    autoHideScrollbar: true
  });

  $(".note-toggle").on("click", function(){
    $(this).hide();
    $(".note").slideToggle();
  });

  $(".level-menu-toggle-wrapper").on("click",function(){
    if($(".menu-open").length == 0) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  $(".level-nav").on("click","a",function(){

    var direction;
    if($(this).hasClass("next")) {
      direction = "next";
    }

    addAnimation($(this),"link-jiggle");

    if(direction == "next") {
      currentLevel++;
      if(currentLevel >= levels.length) {
        currentLevel = levels.length - 1;
      }
    } else {
      currentLevel--;
      if(currentLevel < 0) {
        currentLevel = 0;
      }
    }

    loadLevel();
    return false;
  });

  // Resets progress and progress indicators
  $(".reset-progress").on("click",function(){
    resetProgress();
    return false;
  })

  //Handle inputs from the input box on enter
  $("input").on("keypress",function(e){
    e.stopPropagation();
    if(e.keyCode ==  13){
      enterHit();
      return false;
    }
  });

  $("input").on("keyup",function(e){
    e.stopPropagation();
    var length = $(this).val().length;
    if(length > 0) {
      $("input").removeClass("input-strobe");
    } else {
      $("input").addClass("input-strobe");
    }
  });

  $(".editor").on("click",function(){
    $("input").focus();
  });

  $(".helper").appendTo("body");

  bindHtmlPanelScroll();
  $(window).on("scroll resize", hideTooltip);
  $(".html-view .file-window").on("scroll", hideTooltip);

  //Add tooltips
  $(".table").on("mouseover","*",function(e){
    e.stopPropagation();
    showTooltip($(this));
  });

  //Shows the tooltip on the table
  $(".markup").on("mouseover","[data-frame-path], div *",function(e){
    var el = $(this);
    var frameMarkup = el.closest("[data-frame-path]");
    if(frameMarkup.length) {
      showFrameMarkupTooltip(frameMarkup);
      e.stopPropagation();
      return;
    }

    var markupElements = $(".markup *");
    var index = markupElements.index(el) -1;
    showTooltip($(".table *").eq(index));
    e.stopPropagation();
  });

  // Shows the tooltip on the table
  $(".markup").on("mouseout","*",function(e){
    e.stopPropagation();
    hideTooltip();
  });

  $(".table").on("mouseout","*", function(e){
    hideTooltip();
    e.stopPropagation();
  });

  $(".enter-button").on("click",function(){
    enterHit();
  })

  $(".daily-challenge").on("click",function(){
    loadDailyChallenge();
  });

  $(".random-challenge").on("click",function(){
    loadRandomChallenge();
  });

  $(".language-option").on("click",function(){
    setLanguage($(this).attr("data-language"));
  });

  $(".difficulty-option").on("click",function(){
    setDifficulty($(this).attr("data-difficulty"));
  });

  $(".answer-reveal-button").on("click",function(){
    answerRevealed = true;
    showHelp();
    showResult(getText("answerRevealed"), "neutral", { persist: true });
  });

  $(".completion-random-action").on("click",function(){
    loadRandomChallenge();
  });

  $(".completion-back-main").on("click",function(){
    loadFirstIncompleteMainLevel();
  });

  $(".table-wrapper,.table-edge").css("opacity",0);

  initializeChallengeLevels();
  applyLanguage();
  updateDifficultyUI();
  buildLevelmenu();

  setTimeout(function(){
    loadLevel();
    $(".table-wrapper,.table-edge").css("opacity",1);
  },50);
});

function bindHtmlPanelScroll() {
  var panel = document.querySelector(".html-view .file-window");
  if(!panel) {
    return;
  }

  panel.addEventListener("wheel", function(event) {
    var deltaY = event.deltaY || 0;
    var canScroll = panel.scrollHeight > panel.clientHeight;

    event.preventDefault();
    event.stopPropagation();

    if(!deltaY || !canScroll) {
      return;
    }

    var atTop = panel.scrollTop <= 0;
    var atBottom = Math.ceil(panel.scrollTop + panel.clientHeight) >= panel.scrollHeight;
    var canScrollUp = deltaY < 0 && !atTop;
    var canScrollDown = deltaY > 0 && !atBottom;

    if(canScrollUp || canScrollDown) {
      panel.scrollTop += deltaY;
    }
  }, { passive: false });
}

function addAnimation(el, className){
  el.addClass("link-jiggle");
  el.one("animationend",function(e){
    $(e.target).removeClass("link-jiggle");
  })
}

// Reset all progress
// * Removes checkmarks from level header and list
// * Scrolls level menu to top
// * Resets the progress object

function resetProgress(){
  currentLevel = 0;
  progress = blankProgress;
  localStorage.setItem("progress",JSON.stringify(progress));
  finished = false;

  $(".completed").removeClass("completed");
  loadLevel();
  closeMenu();
  $("#mCSB_2_container").css("top",0); // Strange element to reset scroll due to scroll plugin
}


//Checks if the level is completed

function checkCompleted(levelNumber){
  if(progress.guessHistory[levelNumber]){
    if(progress.guessHistory[levelNumber].correct){
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}


// Builds the slide-out level menu

function buildLevelmenu(){
  $(".level-menu .levels").empty();
  for(var i = 0; i < levels.length; i++){
    var level = levels[i];
    var item = document.createElement("a");
    var label = localize(level.menuLabel) || (i+1);
    $(item).html("<span class='checkmark'></span><span class='level-number'>" + label + "</span>" + level.syntax);
    $(".level-menu .levels").append(item);

    if(checkCompleted(i)){
      $(item).addClass("completed");
    }

    $(item).on("click",function(){
      finished = false;
      currentLevel = $(this).index();
      loadLevel();
      closeMenu();
    });
  }
}

function closeMenu(){
  $(".right-col").removeClass("menu-open");
}

function openMenu(){
  $(".right-col").addClass("menu-open");
}


// Hides & shows the tooltip that appears when an eleemnt
// on the table or the editor is hovered over.

function hideTooltip(){
  $(".enhance").removeClass("enhance");
  $("[data-hovered]").removeAttr("data-hovered");
  var frameDocument = getFrameDocument();
  if(frameDocument) {
    $(frameDocument).find("[data-hovered]").removeAttr("data-hovered");
  }
  $(".helper").hide();
}

function positionHelperForRect(helper, rect) {
  var margin = 10;
  helper.css({
    display: "block",
    visibility: "hidden",
    left: 0,
    top: 0
  });

  var helperWidth = helper.outerWidth();
  var helperHeight = helper.outerHeight();
  var left = rect.left + (rect.width / 2);
  var top = rect.top - helperHeight - 10;

  left = Math.max(margin + (helperWidth / 2), Math.min(window.innerWidth - margin - (helperWidth / 2), left));

  if(top < margin) {
    top = rect.bottom + 10;
  }

  if(top + helperHeight > window.innerHeight - margin) {
    top = Math.max(margin, window.innerHeight - margin - helperHeight);
  }

  helper.css({
    left: left,
    top: top,
    visibility: "visible"
  });
}

function showTooltip(el){
  if(finished){
    return; // Only show tooltip if the game isn't finished yet
  }

  if(!el || !el.length) {
    return;
  }

  if(el.is("iframe.practice-frame")) {
    hideTooltip();
    return;
  }

  el.attr("data-hovered",true);
  var tableElements = $(".table *");
  var index = tableElements.index(el);
  var that = el;
  $(".markup > div *").eq(index).addClass("enhance").find("*").addClass("enhance");

  var helper = $(".helper");

  helper.text(getElementLabel(el));
  positionHelperForRect(helper, el.get(0).getBoundingClientRect());
}

function getElementLabel(el) {
  var node = el && el.nodeType ? el : el && el.get && el.get(0);
  if(!node || !node.tagName) {
    return "";
  }

  var helpertext = "<" + node.tagName.toLowerCase();
  var attributes = node.attributes || [];
  for(var i = 0; i < attributes.length; i++) {
    var attr = attributes[i];
    if(!attr.specified || attr.name === "data-hovered") {
      continue;
    }
    var value = attr.value || "";
    if(attr.name === "class") {
      value = value.replace(/\b(strobe|clean|shake)\b/g, "").replace(/\s+/g, " ").trim();
      if(!value) {
        continue;
      }
    }
    helpertext += ' ' + attr.name + '="' + value + '"';
  }
  helpertext += "></" + node.tagName.toLowerCase() + ">";
  return helpertext;
}

function getElementByPath(root, path) {
  if(!root || path === undefined || path === null || path === "") {
    return null;
  }

  var parts = String(path).split(".");
  var current = root;
  for(var i = 0; i < parts.length; i++) {
    var index = parseInt(parts[i], 10);
    if(isNaN(index) || !current || !current.children || !current.children[index]) {
      return null;
    }
    current = current.children[index];
  }
  return current;
}

function showFrameMarkupTooltip(markupEl) {
  if(finished) {
    return;
  }

  var frameDocument = getFrameDocument();
  var frame = getFrameElement();
  var target = getElementByPath(frameDocument && frameDocument.body, markupEl.attr("data-frame-path"));

  if(!target || !frame) {
    hideTooltip();
    return;
  }

  hideTooltip();
  markupEl.addClass("enhance").find("*").addClass("enhance");
  $(target).attr("data-hovered", true);

  var frameRect = frame.getBoundingClientRect();
  var targetRect = target.getBoundingClientRect();
  var combinedRect = {
    left: frameRect.left + targetRect.left,
    top: frameRect.top + targetRect.top,
    bottom: frameRect.top + targetRect.bottom,
    width: targetRect.width,
    height: targetRect.height
  };

  var helper = $(".helper");
  helper.text(getElementLabel(target));
  positionHelperForRect(helper, combinedRect);
}

function showFrameElementTooltip(target) {
  if(finished) {
    return;
  }

  var frame = getFrameElement();
  if(!target || !frame) {
    hideTooltip();
    return;
  }

  hideTooltip();
  $(target).attr("data-hovered", true);

  var frameRect = frame.getBoundingClientRect();
  var targetRect = target.getBoundingClientRect();
  var combinedRect = {
    left: frameRect.left + targetRect.left,
    top: frameRect.top + targetRect.top,
    bottom: frameRect.top + targetRect.bottom,
    width: targetRect.width,
    height: targetRect.height
  };

  var helper = $(".helper");
  helper.text(getElementLabel(target));
  positionHelperForRect(helper, combinedRect);
}

function bindFrameTooltips() {
  var frameDocument = getFrameDocument();
  if(!frameDocument || !frameDocument.body) {
    return;
  }

  $(frameDocument.body)
    .off(".frameTooltip")
    .on("mouseover.frameTooltip", "*", function(e) {
      e.stopPropagation();
      showFrameElementTooltip(this);
    })
    .on("mouseout.frameTooltip", "*", function(e) {
      e.stopPropagation();
      hideTooltip();
    });
}


//Animate the enter button
function enterHit(){
  $(".enter-button").removeClass("enterhit");
  $(".enter-button").width($(".enter-button").width());
  $(".enter-button").addClass("enterhit");
  var value = $("input").val();
  handleInput(value);
}

function getChallengeStateKey() {
  if(!level) {
    return "";
  }

  return [
    currentLevel,
    level.generatedSeed || "",
    level.selector || "",
    level.frameName || "",
    level.boardMarkup || level.frameMarkup || ""
  ].join("|");
}

function prepareChallengeState() {
  var nextKey = getChallengeStateKey();
  if(nextKey !== currentChallengeKey) {
    currentChallengeKey = nextKey;
    currentAttemptCount = 0;
    answerRevealed = false;
  }
}

function shouldHideAnswer() {
  return !!(level && level.hideAnswer && !answerRevealed);
}

function getGeneratedHint(help) {
  if(!shouldHideAnswer()) {
    return help;
  }

  if(currentAttemptCount <= 0) {
    return getText("generatedHelpIntro");
  }

  if(currentAttemptCount === 1) {
    return getText("firstMissHint");
  }

  return help;
}

function clearResult() {
  clearTimeout(resultTimeout);
  $(".result").removeClass("visible correct incorrect neutral").text("");
}

function showResult(message, type, options) {
  options = options || {};
  clearTimeout(resultTimeout);
  $(".result")
    .removeClass("correct incorrect neutral")
    .addClass("visible " + (type || "neutral"))
    .text(message);

  if(!options.persist) {
    resultTimeout = setTimeout(function(){
      $(".result").removeClass("visible");
    }, 2200);
  }
}

function hideCompletionActions() {
  $(".completion-actions").prop("hidden", true);
}

function showCompletionActions(mode) {
  var isDaily = mode === "daily";
  $(".completion-note").text(isDaily ? getText("dailyCompleteLabel") : getText("randomCompleteLabel"));
  $(".completion-random-action").text(isDaily ? getText("startRandomPractice") : getText("randomAgain"));
  $(".completion-back-main").text(getText("backToMain"));
  $(".completion-actions").prop("hidden", false);
}

function loadFirstIncompleteMainLevel() {
  for(var i = 0; i < dailyChallengeIndex; i++) {
    if(!checkCompleted(i)) {
      currentLevel = i;
      loadLevel();
      return;
    }
  }

  currentLevel = 0;
  loadLevel();
}

function getIncorrectFeedback(ruleSelected, levelSelected, hasSyntaxError) {
  var selectedCount = ruleSelected.length;
  var expectedCount = levelSelected.length;

  if(hasSyntaxError) {
    return getText("syntaxErrorFeedback");
  }

  if(selectedCount === 0) {
    return getText("noMatchFeedback");
  }

  if(selectedCount < expectedCount) {
    return getText("selectedTooFewFeedback")(expectedCount, selectedCount);
  }

  if(selectedCount > expectedCount) {
    return getText("selectedTooManyFeedback")(expectedCount, selectedCount);
  }

  return getText("wrongSelectionFeedback")(selectedCount);
}


//Parses text from the input field
function handleInput(text){
  if(parseInt(text,10) > 0 && parseInt(text,10) < dailyChallengeIndex+1) {
    currentLevel = parseInt(text,10) - 1;
    loadLevel();
    return;
  }
  fireRule(text);
}

// Loads up the help text & examples for each level
function showHelp() {

  var helpTitle = localize(level.helpTitle) || "";
  var help = localize(level.help) || "";
  var examples = localize(level.examples) ||[];
  var selector = level.selector || "";
  var syntax = level.syntax || "";
  var syntaxExample = localize(level.syntaxExample) || "";
  var selectorName = localize(level.selectorName) || "";
  var hideAnswer = shouldHideAnswer();

  $(".display-help .syntax").text(syntax).toggle(!hideAnswer);
  $(".display-help .syntax-example").html(syntaxExample).toggle(!hideAnswer);
  $(".display-help .selector-name").html(selectorName);
  $(".display-help .title").html(helpTitle);
  $(".display-help .examples").html("");
  $(".display-help .examples-title").hide(); // Hide the "Examples" heading
  $(".answer-reveal-button").text(getText("showAnswer"));

  if(hideAnswer) {
    var remaining = Math.max(answerRevealThreshold - currentAttemptCount, 0);
    var message = currentAttemptCount >= answerRevealThreshold
      ? getText("answerRevealReady")
      : getText("answerHiddenMessage")(remaining);

    $(".answer-gate").prop("hidden", false);
    $(".answer-gate-message").text(message);
    $(".answer-reveal-button").toggle(currentAttemptCount >= answerRevealThreshold);
  } else {
    $(".answer-gate").prop("hidden", true);
    for(var i = 0; i < examples.length; i++){
      var example = $("<div class='example'>" + examples[i] + "</div>");
      $(".display-help .examples").append(example);
      $(".display-help .examples-title").show(); // Show it if there are examples
    }
  }

  $(".display-help .hint").html(getGeneratedHint(help));
  $(".display-help .selector").text(selector);
}

function resetTable(){
  $(".display-help").removeClass("open-help");
  clearSelectionClasses();
  $("input").addClass("input-strobe");
  $(".table *").each(function(){
    $(this).width($(this).width());
    // $(this).removeAttr("style");
    // TODO - needed?? Probably not, everything gets removed anyway
  });

  var tableWidth = $(".table").outerWidth();
  $(".table-wrapper, .table-edge").width(tableWidth);
}

function fireRule(rule) {

  // prevent cheating
  if(rule === ".strobe") {
    rule = null;
  }

  clearResult();
  hideCompletionActions();
  clearSelectionClasses();

  /*
  * Sean Nessworthy <sean@nessworthy.me>
  * On 03/17/14
  *
  * Allow [div][.table] to preceed the answer.
  * Makes sense if div.table is going to be included in the HTML viewer
  * and users want to try and use it in their selectors.
  *
  * However, if it is included as a specific match, filter it out.
  * This resolves the  "Match all the things!" level from beheading the table too.
  * Relatedly, watching that happen made me nearly spill my drink.
  */

  var completedLevel = currentLevel;
  var context = getXPathContext();
  var ruleSelected = jQuery([]);
  var levelSelected = jQuery([]);
  var hasSyntaxError = false;

  try {
    ruleSelected = evaluateXPath(rule, context.rootDocument, context.contextNode);
  }
  catch(err) {
    rule = null;
    ruleSelected = jQuery([]);
    hasSyntaxError = true;
  }

  try {
    levelSelected = evaluateXPath(getExpectedSelector(), context.rootDocument, context.contextNode);
  }
  catch(err) {
    levelSelected = jQuery([]);
  }

  var win = false;

  // If nothing is selected
  if(ruleSelected.length == 0) {
    $(".editor").addClass("shake");
  }

  win = sameSelection(ruleSelected, levelSelected);

  if(win){
    ruleSelected.removeClass("strobe");
    ruleSelected.addClass("clean");
    $("input").val("");
    $(".input-wrapper").css("opacity",.2);
    updateProgressUI(completedLevel, true);
    showResult(
      completedLevel === randomChallengeIndex ? getText("randomCorrectFeedback") :
      completedLevel === dailyChallengeIndex ? getText("dailyCorrectFeedback") :
      getText("correctFeedback"),
      "correct",
      { persist: completedLevel >= dailyChallengeIndex }
    );

    if(completedLevel === randomChallengeIndex) {
      showCompletionActions("random");
    } else if(completedLevel === dailyChallengeIndex) {
      showCompletionActions("daily");
    } else {
      currentLevel = completedLevel + 1;

      if(currentLevel >= dailyChallengeIndex) {
        winGame();
      } else {
        setTimeout(function(){
          loadLevel();
        },levelTimeout);
      }
    }
  } else {
    if(level.hideAnswer && !answerRevealed) {
      currentAttemptCount++;
      showHelp();
    }
    showResult(getIncorrectFeedback(ruleSelected, levelSelected, hasSyntaxError), "incorrect", { persist: true });
    ruleSelected.removeClass("strobe");
    ruleSelected.addClass("shake");

    setTimeout(function(){
      clearSelectionClasses();
      strobeExpectedSelection();
    },500);

  }

  // If answer is correct, let's track progress

  if(win){
    trackProgress(completedLevel, "correct");
  } else {
    trackProgress(completedLevel, "incorrect");
  }
}

function setLanguage(language) {
  if(supportedLanguages.indexOf(language) === -1) {
    return;
  }
  currentLanguage = language;
  localStorage.setItem("language", currentLanguage);
  applyLanguage();
  buildLevelmenu();
  loadLevel();
}

function setDifficulty(difficulty) {
  if(challengeDifficulties.indexOf(difficulty) === -1) {
    return;
  }
  currentDifficulty = difficulty;
  localStorage.setItem("challengeDifficulty", currentDifficulty);
  levels[dailyChallengeIndex] = createDailyChallenge();
  levels[randomChallengeIndex] = createRandomChallenge(currentLevel === randomChallengeIndex);
  updateDifficultyUI();
  buildLevelmenu();
  if(currentLevel >= dailyChallengeIndex) {
    loadLevel();
  }
}

function applyLanguage() {
  document.documentElement.setAttribute("lang", currentLanguage);
  document.title = getText("pageTitle");

  $("[data-i18n]").each(function(){
    $(this).text(getText($(this).attr("data-i18n")));
  });

  $("[data-i18n-html]").each(function(){
    $(this).html(getText($(this).attr("data-i18n-html")));
  });

  $("[data-i18n-placeholder]").each(function(){
    $(this).attr("placeholder", getText($(this).attr("data-i18n-placeholder")));
  });

  $(".language-option").removeClass("active");
  $('.language-option[data-language="' + currentLanguage + '"]').addClass("active");
  if(!$(".completion-actions").prop("hidden")) {
    showCompletionActions(currentLevel === dailyChallengeIndex ? "daily" : "random");
  }
  updateChallengeNote();
}

function updateDifficultyUI() {
  $(".difficulty-option").removeClass("active");
  $('.difficulty-option[data-difficulty="' + currentDifficulty + '"]').addClass("active");
  updateChallengeNote();
}

function updateChallengeNote() {
  return;
}

// Marks an individual number as completed or incompleted
// Just in the level heading though, not the level list
function updateProgressUI(levelNumber, completed){
  if(completed) {
    $(".levels a:nth-child("+ (levelNumber+1) + ")").addClass("completed");
    $(".level-header").addClass("completed");
  } else {
    $(".level-header").removeClass("completed");
  }
}

function trackProgress(levelNumber, type){
  if(levelNumber >= dailyChallengeIndex) {
    return;
  }

  if(!progress.guessHistory[levelNumber]) {
    progress.guessHistory[levelNumber] = {
      correct : false,
      incorrectCount : 0,
      gaSent : false
    };
  }

  var levelStats = progress.guessHistory[levelNumber];

  if(type == "incorrect"){
    if(levelStats.correct == false) {
      levelStats.incorrectCount++; // Only update the incorrect count until it is guessed correctly
    }
  } else {
    if(levelStats.correct == false) {
      levelStats.correct = true;
      progress.totalCorrect++;
      progress.percentComplete = progress.totalCorrect / dailyChallengeIndex;
      levelStats.gaSent = true;
      sendEvent("guess", "correct", levelNumber + 1); // Send event
    }
  }

  // Increments the completion percentage by 10%, and sends an event every time
  var increment = .1;
  if(progress.percentComplete >= progress.lastPercentEvent + increment) {
    progress.lastPercentEvent = progress.lastPercentEvent + increment;
    sendEvent("progress","percent", Math.round(progress.lastPercentEvent * 100));
  }

  localStorage.setItem("progress",JSON.stringify(progress));
}

// Sends event to Google Analytics
// Doesn't send events if we're on localhost, as the ga variable is set to false
function sendEvent(category, action, label){
  if(!ga){
    return;
  }

  ga('send', {
    hitType: "event",
    eventCategory: category,  // guess or progress
    eventAction: action,      // action (correct vs not..)
    eventLabel: label         // level number
  });
}

function winGame(){
  $(".table").html(getText("winner"));
  addNametags();
  finished = true;
  resetTable();
}

function checkResults(ruleSelected,levelSelected,rule){
  return sameSelection(ruleSelected, levelSelected);
}

// Returns all formatted markup within an element...

function getMarkup(el, path, isFrameMarkup){
  var hasChildren = el.children.length > 0 ? true : false;
  var elName = el.tagName.toLowerCase();
  var wrapperEl = $("<div/>");
  if(isFrameMarkup && path !== undefined) {
    wrapperEl.attr("data-frame-path", path);
  }
  var attributeString = "";
  $.each(el.attributes, function() {
    if(this.specified) {
     attributeString = attributeString + ' '  + this.name + '="' + this.value + '"';
   }
  });
  var attributeSpace = "";
  if(attributeString.length > 0){
    attributeSpace = " ";
  }
  if(hasChildren) {
    wrapperEl.text("<" + elName + attributeSpace + attributeString + ">");
    $(el.children).each(function(i,el){
      wrapperEl.append(getMarkup(el, path !== undefined ? path + "." + i : undefined, isFrameMarkup));
    });
    wrapperEl.append("&lt;/" + elName +  "&gt;");
  } else {
    wrapperEl.text("<" + elName + attributeSpace + attributeString + " />");
  }
  return wrapperEl;
}

function expandDinerSelfClosingTags(markup) {
  if(!markup) {
    return "";
  }

  return markup.replace(/<(plate|bento|apple|orange|pickle|donut|burger|sushi|taco|cupcake|label-chip)([^>]*)\/>/g, "<$1$2></$1>");
}

function createFrameDocument(markup) {
  markup = expandDinerSelfClosingTags(markup);

  return '<!doctype html><html><head><meta charset="utf-8"><style>' +
    ':root{color-scheme:light;--text:#5a321c;--muted:rgba(90,50,28,.72);--primary:#b95f22;--soft:#fff1d8;--warn:#f59e0b;--success:#2f8f5b;}' +
    '*{box-sizing:border-box;}' +
    'html,body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Arial,sans-serif;background:transparent;color:var(--text);overflow:hidden;}' +
    'body{min-height:100vh;padding:10px 14px 12px;background:transparent;position:relative;display:flex;flex-direction:column;justify-content:center;}' +
    'main,section,form,nav,aside,footer{display:block;margin:0;padding:0;background:transparent;border:0;box-shadow:none;}' +
    'aside{position:absolute;right:10px;bottom:7px;color:var(--muted);display:flex;align-items:center;justify-content:center;gap:6px;max-width:190px;padding:4px 6px;border-radius:999px;background:rgba(255,255,255,.5);transform:scale(.58);transform-origin:bottom right;opacity:.68;z-index:1;}' +
    'h2,h3{margin:0 0 5px 0;font-size:12px;line-height:1.2;font-weight:800;letter-spacing:0;color:rgba(90,50,28,.78);text-align:left;}' +
    'h2:before,h3:before{content:"";display:inline-block;width:8px;height:8px;margin-right:7px;border-radius:999px;background:#dd992d;box-shadow:0 0 0 4px rgba(221,153,45,.18);vertical-align:1px;}' +
    'button,input,a,li,div,span,label{font-size:14px;line-height:1.35;}' +
    'button,a.btn{appearance:none;margin:4px 5px 4px 0;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#334155;text-decoration:none;cursor:pointer;font-weight:600;box-shadow:0 1px 0 rgba(15,23,42,.05);}' +
    'button.primary,button.order-action,button.active,button[data-action="save"],button[data-action="confirm"],button[data-action="continue"],button[data-action="serve"],button[type="submit"]:not(.disabled){background:var(--primary);border-color:var(--primary);color:var(--primaryText);}' +
    'button.secondary,button.cancel,button[data-action="cancel"]{background:#f8fafc;color:#475569;}' +
    'button.disabled,button:disabled{opacity:.48;background:#f1f5f9!important;color:#64748b!important;border-color:#d8e0ea!important;cursor:not-allowed;}' +
    'a{color:#1d4ed8;text-decoration:none;font-weight:600;}' +
    'input{display:block;width:100%;margin:6px 0 12px 0;padding:9px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#111827;outline:none;}' +
    'input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(37,99,235,.14);}' +
    'label{display:block;margin:8px 0 3px;color:var(--muted);font-weight:600;}' +
    'ul{list-style:none;margin:0;padding:0;display:grid;gap:7px;}' +
    'li{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0;padding:7px 8px;border-radius:8px;background:rgba(255,255,255,.34);}' +
    '.mini-app{width:100%;margin:0 auto;position:relative;overflow:visible;text-align:center;z-index:2;}' +
    '.mini-app + .mini-app{margin-top:1px;}' +
    '.mini-app-small h2{font-size:11px;margin-bottom:2px;}' +
    '.mini-app-small .mini-table{min-height:42px;}' +
    '.mini-app-small plate,.mini-app-small bento{width:48px;height:48px;min-width:48px;}' +
    '.tray-section h2{margin-bottom:0;font-size:11px;line-height:1.1;}' +
    '.tray-section .mini-table{min-height:50px;padding-top:0;padding-bottom:0;}' +
    '.tray-section-small .mini-table{min-height:38px;}' +
    '.mini-table{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:nowrap;min-height:92px;padding:2px 8px 1px;background:transparent;border-radius:0;box-shadow:none;position:relative;}' +
    '.table-row{display:flex;align-items:center;justify-content:center;gap:12px;min-height:72px;padding:3px 6px;}' +
    '.table-row + .table-row{margin-top:2px;}' +
    '.place{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;flex:0 0 auto;min-width:0;position:relative;z-index:3;}' +
    '.place label-chip{margin-right:0;}' +
    '.place plate,.place bento{margin:0;}' +
    'plate,bento{display:inline-flex;align-items:center;justify-content:center;gap:2px;position:relative;width:68px;height:68px;min-width:68px;margin:3px 5px;border-radius:999px;background:#fff;box-shadow:0 7px 0 rgba(0,0,0,.12);vertical-align:middle;}' +
    'plate:before{content:"";position:absolute;left:calc(50% - 22px);top:calc(50% - 22px);width:44px;height:44px;border-radius:999px;border-top:5px solid #d8d8d8;opacity:.5;background:#fff;}' +
    'plate:has(> :nth-child(2)){width:104px;min-width:104px;border-radius:999px;}' +
    'plate:has(> :nth-child(3)){width:132px;min-width:132px;}' +
    'plate:has(> :nth-child(2)):before{left:8px;right:8px;width:auto;}' +
    'bento{width:auto;min-width:74px;padding:0 8px;border-radius:11px;background:#7a3b1c;border:solid #5b2715;border-width:13px 3px;box-shadow:0 7px 0 rgba(0,0,0,.14);}' +
    'apple,orange,pickle,donut,burger,sushi,taco,cupcake{display:inline-block;position:relative;flex:0 0 auto;width:34px;height:34px;margin:4px;border-radius:999px;background:#d92d20;box-shadow:inset -5px -6px 0 rgba(0,0,0,.14);vertical-align:middle;}' +
    'orange{background:#f59e0b;}' +
    'pickle{width:17px;height:42px;border-radius:999px;background:#2f8f5b;}' +
    'donut{width:42px;height:42px;background:#eaa7b8;border:5px solid #b76b7d;border-bottom-width:8px;}' +
    'donut:before{content:"";position:absolute;width:15px;height:15px;left:9px;top:9px;border-radius:999px;background:#fff8ed;border:3px solid rgba(255,255,255,.7);}' +
    'burger{width:46px;height:35px;border-radius:15px 15px 8px 8px;background:linear-gradient(#efb45b 0 35%,#4f2415 36% 51%,#2f8f5b 52% 64%,#f6d365 65% 77%,#d98635 78%);}' +
    'sushi{width:40px;height:40px;border-radius:12px;background:#1f2937;border:4px solid #111827;}' +
    'sushi:before{content:"";position:absolute;inset:7px;border-radius:8px;background:#fff7ed;}' +
    'sushi:after{content:"";position:absolute;width:15px;height:15px;left:13px;top:13px;border-radius:999px;background:#f97316;}' +
    'taco{width:48px;height:33px;border-radius:50px 50px 10px 10px;background:#f6c453;border:4px solid #b7791f;border-bottom-width:7px;}' +
    'taco:before{content:"";position:absolute;left:7px;right:7px;top:7px;height:10px;background:radial-gradient(circle at 8px 4px,#2f8f5b 0 4px,transparent 5px),radial-gradient(circle at 22px 3px,#d92d20 0 4px,transparent 5px),radial-gradient(circle at 34px 5px,#2f8f5b 0 4px,transparent 5px);}' +
    'cupcake{width:40px;height:44px;border-radius:14px 14px 8px 8px;background:linear-gradient(#ffe4f0 0 44%,#7c3f2a 45% 100%);}' +
    'cupcake:before{content:"";position:absolute;top:-7px;left:5px;width:30px;height:19px;border-radius:20px 20px 10px 10px;background:#f9a8d4;}' +
    'apple.small,orange.small{width:24px;height:24px;}' +
    'pickle.small{width:14px;height:34px;}' +
    'donut.small,burger.small,sushi.small,taco.small,cupcake.small{transform:scale(.72);}' +
    'plate apple,plate orange,plate pickle,plate donut,plate burger,plate sushi,plate taco,plate cupcake,bento apple,bento orange,bento pickle,bento donut,bento burger,bento sushi,bento taco,bento cupcake{margin:1px;transform:scale(.82);z-index:2;}' +
    '.tray-section plate,.tray-section bento{width:52px;height:52px;min-width:52px;margin:1px 4px;}' +
    '.tray-section plate:before{left:calc(50% - 17px);top:calc(50% - 17px);width:34px;height:34px;}' +
    '.tray-section plate apple,.tray-section plate orange,.tray-section plate pickle,.tray-section plate donut,.tray-section plate burger,.tray-section plate sushi,.tray-section plate taco,.tray-section plate cupcake{transform:scale(.66);}' +
    '.mini-table > apple,.mini-table > orange,.mini-table > pickle,.mini-table > donut,.mini-table > burger,.mini-table > sushi,.mini-table > taco,.mini-table > cupcake{margin:8px 10px;}' +
    'label-chip{display:inline-block;flex:0 0 auto;margin:4px 5px 4px 0;padding:6px 9px;border-radius:999px;background:rgba(255,255,255,.9);color:#9a531d;font-size:12px;font-weight:800;white-space:nowrap;box-shadow:0 4px 0 rgba(0,0,0,.08);position:relative;z-index:4;}' +
    'aside h3{margin:0;font-size:11px;white-space:nowrap;}' +
    'aside .place{flex-direction:row;gap:5px;}' +
    'aside plate,aside bento{width:52px;height:52px;min-width:52px;margin:0;}' +
    'aside apple,aside orange,aside pickle,aside donut,aside burger,aside sushi,aside taco,aside cupcake{transform:scale(.68);}' +
    '.save-copy,.preview,.coupon,.archive,.muted{background:#f8fafc;color:#64748b;}' +
    '[data-hovered]{outline:4px solid rgba(255,255,255,.85)!important;outline-offset:3px;}' +
    '.strobe{animation:frameStrobe .7s ease-out infinite;background:#fef3c7!important;outline:3px solid var(--warn)!important;outline-offset:2px;}' +
    '.clean{opacity:.45;outline:3px solid var(--success)!important;outline-offset:2px;}' +
    '.shake{animation:frameShake .15s linear 2;}' +
    '@keyframes frameStrobe{50%{transform:scale(1.04);}}' +
    '@keyframes frameShake{50%{transform:translateX(4px);}}' +
    '</style></head><body>' + markup + '</body></html>';
}

function renderMarkupViewerFromElements(elements, isFrameMarkup) {
  var markupHolder = $("<div/>");
  $(elements).each(function(i, el){
    if(el.nodeType == 1){
      markupHolder.append(getMarkup(el, String(i), isFrameMarkup));
    }
  });
  return markupHolder.html();
}

function buildLineNumberMarkup(count) {
  var lines = [];
  for(var i = 1; i <= count; i++) {
    lines.push(i);
  }
  return lines.join("<br/>");
}

function updateHtmlLineNumbers() {
  var viewer = document.querySelector(".html-view .file-window");
  var markup = document.querySelector(".html-view .markup");
  var lineNumbers = document.querySelector(".html-view .line-numbers");

  if(!viewer || !markup || !lineNumbers) {
    return;
  }

  var style = window.getComputedStyle(markup);
  var lineHeight = parseFloat(style.lineHeight);
  var fontSize = parseFloat(style.fontSize);

  if(!lineHeight || isNaN(lineHeight)) {
    lineHeight = fontSize ? fontSize * 1.5 : 21;
  }

  var viewportContentHeight = Math.max(viewer.clientHeight - 20, 0);
  var markupHeight = Math.max(
    markup.scrollHeight,
    markup.getBoundingClientRect().height,
    viewportContentHeight
  );
  var lineCount = Math.max(20, Math.ceil(markupHeight / lineHeight));

  lineNumbers.innerHTML = buildLineNumberMarkup(lineCount);
  lineNumbers.style.minHeight = Math.ceil(lineCount * lineHeight) + "px";
}

function refreshHtmlViewerLineNumbers() {
  updateHtmlLineNumbers();
  setTimeout(updateHtmlLineNumbers, 0);
}

function renderFrameMarkupViewer() {
  var frameDocument = getFrameDocument();
  var frameName = level.frameName || "practice";
  var mainMarkup = '<div>&lt;div class="table"&gt;<div>&lt;iframe class="practice-frame" name="' + frameName + '" srcdoc="..."&gt;&lt;/iframe&gt;</div>&lt;/div&gt;</div>';
  var frameMarkup = "";

  if(frameDocument && frameDocument.body) {
    frameMarkup = renderMarkupViewerFromElements(frameDocument.body.children, true);
  }

  $(".markup").html(mainMarkup + '<div class="frame-markup-label">&lt;!-- iframe: ' + frameName + ' document --&gt;</div><div class="frame-markup">&lt;body&gt;' + frameMarkup + '&lt;/body&gt;</div>');
  refreshHtmlViewerLineNumbers();
}

//new board loader...

function loadBoard(){
  showHelp();

  if(level.requiresFrame) {
    var frameName = level.frameName || "practice";
    var frameSource = createFrameDocument(level.frameMarkup || "");
    var iframe = $('<iframe class="practice-frame" sandbox="allow-same-origin" />');

    iframe.attr("name", frameName);
    iframe.attr("title", frameName + " frame");
    iframe.attr("srcdoc", frameSource);
    iframe.on("load", function(){
      bindFrameTooltips();
      renderFrameMarkupViewer();
      strobeExpectedSelection();
      $(".pop").removeClass("pop");
    });

    $(".table").empty().append(iframe);
    $(".nametags *").remove();
    $(".table-wrapper").css("transform","rotateX(20deg)");
    $(".table").addClass("frame-table");
    renderFrameMarkupViewer();
    setTimeout(function(){
      bindFrameTooltips();
      renderFrameMarkupViewer();
      strobeExpectedSelection();
      $(".pop").removeClass("pop");
    }, 0);

    return;
  }

  $(".table").removeClass("frame-table");

  var markupHolder = $("<div/>")
  var boardMarkup = expandDinerSelfClosingTags(level.boardMarkup);

  $(boardMarkup).each(function(i,el){
    if(el.nodeType == 1){
      var result = getMarkup(el, String(i), false);
      markupHolder.append(result);
    }
  });

  $(".table").html(boardMarkup);
  addNametags();
  $(".table *").addClass("pop");


  $(".markup").html('<div>&lt;div class="table"&gt;' + markupHolder.html() + '&lt;/div&gt;</div>');
  refreshHtmlViewerLineNumbers();
}

// Adds nametags to the items on the table
function addNametags(){
  $(".nametags *").remove();
  $(".table-wrapper").css("transform","rotateX(0)");
  $(".table-wrapper").width($(".table-wrapper").width());

  $(".table *").each(function(){
    if($(this).attr("for")){
      var pos = $(this).position();
      var width = $(this).width();
      var nameTag = $("<div class='nametag'>" + $(this).attr("for") + "</div>");
      $(".nametags").append(nameTag);
      var tagPos = pos.left + (width/2) - nameTag.width()/2 + 12;
      nameTag.css("left",tagPos);
    }
  });

  $(".table-wrapper").css("transform","rotateX(20deg)");
}


function loadLevel(){
  // Make sure we don't load a level we don't have
  if(currentLevel < 0 || currentLevel >= levels.length) {
    currentLevel = 0;
  }

  hideTooltip();

  level = levels[currentLevel];
  prepareChallengeState();
  clearResult();
  hideCompletionActions();

  // Show the help link only for the first three levels
  if(currentLevel < 3) {
    $(".note-toggle").show();
  } else {
    $(".note-toggle").hide();
  }

  $(".level-menu .current").removeClass("current");
  $(".level-menu div a").eq(currentLevel).addClass("current");

  var percent = Math.min((currentLevel+1)/dailyChallengeIndex * 100, 100);
  $(".progress").css("width",percent + "%");

  localStorage.setItem("currentLevel",currentLevel);

  loadBoard();
  resetTable();

  if(level.challengeLabel) {
    $(".level-header .level-text").html(localize(level.challengeLabel));
  } else {
    $(".level-header .level-text").html(getText("levelCount")(currentLevel+1, dailyChallengeIndex));
  }

  updateProgressUI(currentLevel, checkCompleted(currentLevel));

  $(".order").text(localize(level.doThis));
  $("input").val("").focus();

  $(".input-wrapper").css("opacity",1);

  //Strobe what's supposed to be selected
  setTimeout(function(){
    strobeExpectedSelection();
    $(".pop").removeClass("pop");
  },200);

}

// Popup positioning code from...
// http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen

function PopupCenter(url, title, w, h) {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
  var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
  }
}
