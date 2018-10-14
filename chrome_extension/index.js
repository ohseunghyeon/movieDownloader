var currDoc = null;
var DelayTimer = undefined;
var ToolTipWord = "";
var CursorX = 0;
var CursorY = 0;
var fontType = "맑은 고딕";
var fontWeight = "bold";
var fontSize = 9;
var fontColor = "#000000";
var borderSize = 0;
var borderColor = "#707070";
var backColor1 = "#F0F0F0";
var backColor2 = "#DCDCDC";
var boxPosition = "DOWN";
var offsetDistance = 30;
var delayedTime = 200;

function createHoverTip() {
  console.log('in createHoverTip');
  if (!currDoc) return null;
  var hoverTipDiv = gethoverDiv();
  if (hoverTipDiv) return hoverTipDiv;
  if (!currDoc.body) return null;
  hoverTipDiv = currDoc.createElement("DIV");
  hoverTipDiv.id = "ToolTipDic";
  hoverTipDiv.style.setProperty("display", "none", "important");
  hoverTipDiv.style.setProperty("visibility", "hidden", "important");
  hoverTipDiv.style.setProperty("text-align", "none", "center");
  hoverTipDiv.style.setProperty("position", "absolute", "important");
  hoverTipDiv.style.setProperty("height", "auto", "important");
  hoverTipDiv.style.setProperty("width", "auto", "important");
  hoverTipDiv.style.setProperty("z-index", "1410065406", "important");
  hoverTipDiv.style.setProperty("vertical-align", "middle", "important");
  hoverTipDiv.style.setProperty("padding", "1px 1px 1px 1px", "important");
  hoverTipDiv.style.setProperty("margin", "0px 0px 0px 0px", "important");
  hoverTipDiv.style.setProperty("align", "absmiddle", "important");
  hoverTipDiv.style.setProperty("font-size", String(fontSize) + "pt", "important");
  hoverTipDiv.style.setProperty("line-height", "normal", "important");
  (currDoc.body).appendChild(hoverTipDiv);
  $('#ToolTipDic').attr('class', 'tooltip_dic');
  var fontTypeValue = fontType;
  var fontWeightValue = fontWeight;
  var backgroundColorValue = "-webkit-gradient(linear, left top, left bottom, from(" + backColor1 + "), to(" + backColor2 + "))";
  var borderValue = "solid " + String(borderSize) + "px " + borderColor;
  var fontValue = fontColor;
  $('#ToolTipDic').css({ 'align': 'absmiddle ', 'vertical-align': 'middle ', 'padding': '1px 1px 1px 1px ', 'font-family': fontTypeValue, 'font-weight': fontWeightValue, 'color': fontValue, 'border': borderValue, 'background': backgroundColorValue, 'overflow': 'hidden', 'white-space': 'nowrap', '-webkit-border-radius': '.2em', '-webkit-box-shadow': '2px 2px 5px rgba(0,0,0,.4)' });
  return hoverTipDiv
}
function gethoverDiv(event) {
  // console.log('in gethoverDiv');
  var hoverTipDiv;
  if (currDoc) hoverTipDiv = currDoc.getElementById("ToolTipDic");
  if (!hoverTipDiv && event) { hoverTipDiv = event.target.ownerDocument.getElementById("ToolTipDic") } return hoverTipDiv
}
function killHoverTip() {
  // console.log('in killHoverTip');

  var hoverTipDiv = gethoverDiv();
  if (hoverTipDiv && hoverTipDiv.parentNode) hoverTipDiv.parentNode.removeChild(hoverTipDiv)
}
function DelayedRequest(text) {
  // console.log('in DelayedRequest');

  clearTimeout(DelayTimer);
  if (!text) return;
  ToolTipWord = text;
  DelayTimer = setTimeout(function () {
    DelayTimer = undefined;
    doRequest(text)
  }, parseInt(delayedTime), text)
}
function parsingWord(str, offset) {
  // console.log('in parsingWord'); // str는 그 줄에 있는 모든 것 offset은 그 줄에서 마우스가 있는 위치

  var start = offset;
  var end = offset + 1;
  var valid_chars = /[A-Za-z0-9-]/m;
  // var valid_chars = /[^\s,;:_#~=()\/&%?<—>‘’“”!{}\$\*\+\\\|\^\.\?\[\]\'""]/m;
  if (!valid_chars.test(str.substring(start, start + 1))) return null;
  while (start > 0) {
    if (valid_chars.test(str.substring(start - 1, start))) start--;
    else break
  }
  while (end < str.length) {
    if (valid_chars.test(str.substring(end, end + 1))) end++;
    else break
  }
  var word = str.substring(start, end);
  if (start == offset) return null;
  if (/^[A-Za-z]*$/.test(word)) return null;
  if (/^[0-9]*$/.test(word)) {
    console.log('숫자가 없어요.')
    return null;
  }
  // to do: -가 여러개인 경우도 제외하기
  word = word.toLowerCase();
  word = decodeUnicode(word);
  word = word.replace(/^[\s\.,!;\“\"\:'\[\]]+$/, "");
  word = word.replace(/,\s+?(,|$)/gm, "");
  word = word.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");
  console.log('word', word);
  return word
}
function decodeUnicode(data) {
  // console.log('in decodeUnicode');

  if (!data) return data;
  data = data.replace(/&#(\d+);/gm, function () { return String.fromCharCode(RegExp.$1) });
  return data
}

function getHoverText(event) {
  // console.log('in getHoverText');

  var text;
  if (currDoc.caretRangeFromPoint) {
    var range = currDoc.caretRangeFromPoint(event.clientX, event.clientY);
    if (range && range.commonAncestorContainer && range.commonAncestorContainer.nodeName.indexOf("text") != -1) text = parsingWord(range.commonAncestorContainer.textContent, range.startOffset)
  } if (!text || !text.length) {
    DelayedRequest(null);
    killHoverTip();
    return false
  } var hoverTipDiv = currDoc.getElementById("ToolTipDic");
  if (hoverTipDiv && ToolTipWord.indexOf(text) != -1) return false;
  killHoverTip();
  hoverTipDiv = createHoverTip();
  var zoom = 1.0;
  if (currDoc.body.style.zoom) zoom = parseFloat(currDoc.body.style.zoom);
  var dLeft = parseInt(currDoc.defaultView.getComputedStyle(currDoc.body, null).getPropertyValue("left"));
  if (isNaN(dLeft)) dLeft = 0;
  hoverTipDiv.style.setProperty("left", String((event.pageX - dLeft) / zoom) + "px", "important");
  var dTop = parseInt(currDoc.defaultView.getComputedStyle(currDoc.body, null).getPropertyValue("top"));
  if (isNaN(dTop)) dTop = 0;
  var top;
  if (boxPosition == "UP") top = (event.pageY - parseInt(offsetDistance) - hoverTipDiv.offsetHeight - dTop) / zoom;
  else top = (event.pageY + parseInt(offsetDistance) - dTop) / zoom;
  hoverTipDiv.style.setProperty("top", String(top) + "px", "important");
  return text
}

function PositionCorrection(elem) {
  // console.log('in PositionCorrection');

  var zoom = 1.0;
  if (currDoc.body.style.zoom) zoom = parseFloat(currDoc.body.style.zoom);
  var aTop = parseInt(currDoc.defaultView.getComputedStyle(elem, null).getPropertyValue("top"));
  var aHeight = parseInt(currDoc.defaultView.getComputedStyle(elem, null).getPropertyValue("height"));
  var clientWidth = window.document.body.clientWidth;
  var clientHeight = window.document.body.clientHeight;
  var top, left;
  if (boxPosition == "UP") top = (CursorY - parseInt(offsetDistance) - elem.offsetHeight) / zoom;
  else top = (CursorY + parseInt(offsetDistance)) / zoom;
  if (top < 0) top = 0;
  var pXOffset = (window.pageXOffset) / zoom;
  var pYOffset = (window.pageYOffset) / zoom;
  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();
  var posBottom = pYOffset + viewportHeight;
  if (top + elem.offsetHeight > posBottom) top = posBottom - elem.offsetHeight;
  if (top < pYOffset) top = pYOffset;
  elem.style.setProperty("top", String(top) + "px", "important");
  if ((parseFloat(elem.style.left) + parseFloat(elem.offsetWidth)) * zoom > window.pageXOffset + viewportWidth) left = window.pageXOffset + viewportWidth - parseFloat(elem.offsetWidth) * zoom - 5;
  else left = CursorX;
  elem.style.setProperty("left", String(left / zoom) + "px", "important")
}
function doRequest(word) {
  console.log('in doRequest');

  var hoverTipDiv = gethoverDiv();
  var TootipText = "";
  var message = { queryWord: word };
  var request = JSON.stringify(message);
  chrome.extension.sendRequest(request, function (response) {
    if (response.mean != undefined) {
      var mean = response.mean.join(', ');
      TootipText = response.entryName + " : " + mean;
      var zoom = 1.0;
      if (currDoc.body.style.zoom) { zoom = parseFloat(currDoc.body.style.zoom) } hoverTipDiv.style.setProperty("font-size", String(fontSize / zoom) + "pt", "important");
      hoverTipDiv.textContent = TootipText;
      hoverTipDiv.style.setProperty("display", "inline", "important");
      hoverTipDiv.style.setProperty("visibility", "visible", "important");
      PositionCorrection(hoverTipDiv)
    }
  })
}

function mousemoveCapture(event) {

  // #document
  currDoc = event.target.ownerDocument;
  if (!currDoc) return;
  var text;
  console.log(event.pageX, event.pageY)
  CursorX = window.Event ? event.pageX : event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
  CursorY = window.Event ? event.pageY : event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
  text = getHoverText(event);
  if (text) DelayedRequest(text);
  $(currDoc).mouseleave(function () {
    DelayedRequest(null);
    killHoverTip()
  })
};

console.log('init');
window.addEventListener('mousemove', mousemoveCapture, true)