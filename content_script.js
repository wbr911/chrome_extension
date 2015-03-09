var currentElement = {};
var selectionRegion = [];
var selectionAncestorRegion = {};
var textNodesElements=[];
var regionSelected = false;
var candidateRegionSelected=false;
var isInputSomething = false;
var selectBox,selectionButton,generateButton,cancelButton,buttonbar,hoverBlock,hoverDropdown;

function selectTheBoundary() {

    initElement();
    registerSelectionBox();
}

function initElement() {

    selectBox = $("<div id='selectionBox'></div>").hide().appendTo($(document.body));
    selectionButton = $("<button id='selection'>select region</button>").hide();
    generateButton = $("<button id='generate'>generate</button>").hide();
    cancelButton = $("<button id='cancel'>cancel</button>").hide();
    buttonbar = $("<div id='buttonbar'></div>").append(selectionButton).append(generateButton).append(cancelButton).appendTo($(document.body));
    generateButton.click(function (e) {
        generateLayoutDefinition();
    });
    cancelButton.bind("mouseup",function () {
        buttonbar.hide();
        regionSelected = false;
        $(".selectionBackground").removeClass("selectionBackground");
        // unbind event
        $.each(textNodesElements,function(i,element){
            element.unbind("mouseenter");

        });
        textNodesElements=[];
        // remove target value attr
        $(".magicPasteTargetValue").each(function(){
            this.removeClass("magicPasteTargetValue");
        })


    });
    selectionButton.bind("click", function () {
        registerInsideRegionEvent();
        if (selectionButton.length > 0) {
            selectionButton.hide();
            generateButton.show();
            cancelButton.show();
            regionSelected = true;
            selectBox.hide();
        }
        if (selectionRegion.length > 0) {
            var baseNodeParent = selectionRegion[0];
            var endNodeParent = selectionRegion[selectionRegion.length - 1];
            var node = baseNodeParent;

            while ($(endNodeParent).parents().index($(node)) < 0) {
                node = $(node).parent();
            }
            var currentTagName = $(node).get(0).tagName;
            while (currentTagName === 'TBODY' || currentTagName === 'TR' || currentTagName === 'TD') {
                node = $(node).parent();
            }
            selectionAncestorRegion = node;
        }
    });

    hoverBlock = $("<div id='hoverBlock'></div>").hide().appendTo($(document.body));
    hoverBlock.click(toggleDropdown);
    hoverBlock.bind("mouseleave",mouseLeave);

    hoverDropdown = $("<div id='hoverDropdown'>" +
    "<span class='mq-close'></span>" +
    "<table>" +
    "<tr><td>value</td><td><input id='mp-textValue'/></td></tr>" +
    "<tr><td>targetID</td><td><input id='mp-targetId'></td></tr>" +
    "</table>" +
    "<div class='mp-buttonBar'><button id='mp-update'>update</button> <button id='mp-delete'>delete</button></div>" +
    "</div>").hide().appendTo($(document.body));

    $("#hoverDropdown>.ui-icon-close").click(function(){
        $('#hoverDropdown').slideUp(200);
    })


}
function toggleDropdown(e){
    if(hoverDropdown.css('display')==='block'){
        hoverDropdown.slideUp(200);
        return;
    }
    var offset =$(e.target).offset();
    var width = $(e.target).width();
    var height = $(e.target).height();
    var left = offset.left+width/2-hoverDropdown.width()/2;
    hoverDropdown.css("left",left>=0?left:0);
    hoverDropdown.css("top",offset.top+height+2);
    hoverDropdown.slideDown(200);
}

function generateLayoutDefinition() {
    var clonedSelectionRegion = $(selectionAncestorRegion).clone();

    var allChildrenElements = $(clonedSelectionRegion).find("*");
    allChildrenElements.each(function (index, childrenElement) {
        if ($(childrenElement).find(".selectionBackground").length == 0 && $(childrenElement).parents().filter(".selectionBackground").length == 0) {
            $(childrenElement).addClass("any");
        }
    });

    var valueSpans = $(clonedSelectionRegion).find(".value");
    valueSpans.each(function (index, valueSpan) {
        var innerHTML = $(valueSpan).html();
        var targetItemName = $(valueSpan).attr("target-item");
        var $valueWrappedElement = $("<value target-item='" + targetItemName + "'></value>");
        $(valueSpan).replaceWith($valueWrappedElement);
    });

    var textManualSpans = $(clonedSelectionRegion).find("span.manual");
    textManualSpans.each(function (index, manualSpan) {
        $(manualSpan).replaceWith($(manualSpan.firstChild));
    });

    var ignoreSpans = $(clonedSelectionRegion).find(".any");
    ignoreSpans.each(function (index, ignoreSpan) {
        $(ignoreSpan).replaceWith($("<any></any>"));
    });

    $(clonedSelectionRegion).find(".selectionBackground").removeClass("selectionBackground");
    $(clonedSelectionRegion).find("*").each(function (index, child) {
        $(child).removeAttr("width");
        $(child).removeAttr("height");
        $(child).removeAttr("style");
    });

//	var result = new XMLSerializer().serializeToString(clonedSelectionRegion);
    var brPatternString = "<br>";
    var brPattern = new RegExp(brPatternString, "g");
    var brClosePatternString = "</br>";
    var brClosePattern = new RegExp(brClosePatternString, "g");
    var newLinePattern = new RegExp("\n", "g");
    var anyPattern = new RegExp("(<any></any>)+", "g");

    result = $(clonedSelectionRegion).html().replace(/(<img\b[^<>]*[^<>\/])>/ig, "$1 />").replace(brPattern, "<br/>").replace(/(<col\b[^<>]*[^<>\/])>/ig, "$1 />").replace(brClosePattern, "");
    result = result.replace(newLinePattern, "");
    result = result.replace(anyPattern, "<any></any>");
    var $resultDialog = $("<div id='result-dialog' title='Generated Layout Definitions'></div>");
    $resultDialog.append("<textarea id='layout-result'>" + formatForIndent(result) + "</textarea>");
    $resultDialog.dialog();
}


function locateBtnBar(left, top) {
    buttonbar.css("position", "absolute");
    buttonbar.css("left", left);
    buttonbar.css("top", top);
    buttonbar.css("opacity", "0.7");
}

function registerInsideRegionElementEvent(selectionRegionElement) {
    textNodes = $(selectionRegionElement).contents().filter(function () {
        return this.nodeType == 3;
    });
    var textNodeLength = textNodes.length;
    for (var i = 0; i < textNodeLength; i++) {
        if ($(textNodes[i]).text().trim() === "")
            continue;
        $(textNodes[i]).wrap("<span class='manual'></span>");
    }

    $elements = $(selectionRegionElement).find("*");
    var length = $elements.length;
    for (var i = 0; i < length; i++) {
        var classAttr = $($elements[i]).attr('class');

        //TODO need more concrete conditions
        if (classAttr === undefined || classAttr === null || classAttr === "" || classAttr.indexOf('manual') === -1) {
            continue;
        }

        $($elements[i]).on('mouseenter', mouseEnter);
        textNodesElements.push($($elements[i]));
    }
}

function registerInsideRegionEvent() {
    makeSelectionRegion();
    var length = selectionRegion.length;
    for (var i = 0; i < length; i++) {
        registerInsideRegionElementEvent(selectionRegion[i]);
    }
}

function makeSelectionRegion() {
    selectionRegion = [];
    $(".selectionBackground").each(function (index, selectionElement) {
        if ($(selectionElement).attr("id") !== "selectionBox")
            selectionRegion.push(selectionElement);
    });
}

function registerSelectionBox() {
    var isPressed = false;
    var isDragging = false;
    var x, y;
    $(document).mousedown(function (e) {
        if(!regionSelected && e.ctrlKey) {
            $("html").css("-webkit-user-select","none");
            isPressed = true;
            isInputSomething = false;
            console.log("mousedown");
            x= e.pageX;
            y = e.pageY;
        }else{
            $("html").css("-webkit-user-select","all");
        }
    }).mousemove(function (e) {
        if (!regionSelected && e.ctrlKey) {
            if(candidateRegionSelected){
                return true;
            }
            if (isPressed && !isDragging) {
                var mx = Math.abs(x- e.pageX);
                var my = Math.abs(y- e.pageY);
                if(mx===0 && my===0){
                    //this operation is click , not the beginning of dragging;
                    return;
                }
                console.log("mouse first move");
                $(".selectionBackground").removeClass("selectionBackground");
                buttonbar.hide();;
                $("#selectionBox").attr("style", "").css({"left": x, "top": y});
                $("#selectionBox").css("position", "absolute");
                isDragging = true;
            }
            if (isPressed && isDragging) {
                var mx = e.pageX - x;
                /*if(e.pageX>$(window).width()-10){
                    mx=$(window).width()-x;
                }*/
                var my = e.pageY - y;
                /*if(e.pageY>$(window).height()-10){
                    my=$(window).height()-y;
                }*/
                if (mx < 0) {
                    $("#selectionBox").css("left", x + mx);
                }
                if (my < 0) {
                    $("#selectionBox").css("top", y + my);
                }
                $("#selectionBox").css({width: Math.abs(mx), height: Math.abs(my)});
            }
        }
        return true;
    }).mouseup(function (e) {
        if (!regionSelected&& e.ctrlKey) {
            if (isDragging) {
                console.log("drag end");
                highlightSelectionElements(x, y, e.pageX, e.pageY);
                locateBtnBar( e.pageX, e.pageY);
                selectionButton.show();
                generateButton.hide();
                cancelButton.hide();
                buttonbar.show();
                candidateRegionSelected=false;
            }
            isDragging = false;
            isPressed = false;
        }
    });
}

function highlightSelectionElements(startX, startY, endX, endY) {
    if (startX > endX) {
        var temp = endX;
        endX = startX;
        startX = temp;
    }
    if (startY > endY) {
        var temp = endY;
        endY = startY;
        startY = temp;
    }
    var selectionElements = $(document.body).find("*");
    selectionElements.each(function (index, selectionElement) {
        var offset = $(selectionElement).offset();
        var width = $(selectionElement).width();
        var height = $(selectionElement).height();
        if (offset.left >= startX && offset.left + width <= endX && offset.top >= startY && offset.top + height <= endY) {
            $(selectionElement).addClass("selectionBackground");
        }
    });
}
function mouseEnter(event) {
    var width = $(event.target).width();
    var height = $(event.target).height();
    var offset = $(event.target).offset();
    hoverBlock.css("left",offset.left);
    hoverBlock.css("top",offset.top);
    hoverBlock.css("width",width);
    hoverBlock.css("height",height);
    hoverBlock.show();
    hoverDropdown.find("#mp-textValue").val($(event.target).html());
    event.stopPropagation();
    /* if (isInputSomething) {
     return;
     }

     var $ignoreButton = $("<button id='ignore'>ignore</button>");
     var $valueButton = $("<button id='value'>value</button>");
     var $targetItemArea = $("<input id='target-item' placeholder='target-item id'></input>");
     currentElement = event.target;
     var currentClass = $(currentElement).attr("class");

     //read value input before
     if(currentClass === "magicPasteTargetValue" && $(currentElement).attr("target-item")){
     $targetItemArea.val($(currentElement).attr("target-item"));
     }

     $(document.body).append($valueButton);
     $(document.body).append($targetItemArea);
     isInputSomething = false;
     $('#ignore').click(function (event) {

     $(currentElement).attr("class", "any");
     });
     $('#value').click(function (event) {

     var $targetItemInputElement = $("#target-item");
     $(currentElement).attr("class", "magicPasteTargetValue");
     $(currentElement).attr("target-item", $targetItemInputElement.val());

     });
     $('#target-item').focus(function (event) {
     isInputSomething = true;
     });
     var offset = $(event.target).offset();
     $ignoreButton.css("position", "absolute");
     $ignoreButton.css("left", offset.left - $ignoreButton.width() - 10);
     $ignoreButton.css("top", offset.top - 5);
     $ignoreButton.css("opacity", "0.7");
     $valueButton.css("position", "absolute");
     $valueButton.css("left", offset.left + $(event.target).width());
     $valueButton.css("top", offset.top - 5);
     $valueButton.css("opacity", "0.7");
     $targetItemArea.css("position", "absolute");
     $targetItemArea.css("left", offset.left + $(event.target).width() + $valueButton.width() + 15);
     $targetItemArea.css("top", offset.top - 5);

     $(event.target).addClass("hoverBorder");
     */

}
function mouseLeave(event) {
    hoverBlock.hide();
    $(event.target).removeClass("hoverBorder");
    event.stopPropagation();

}

function formatForIndent(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function (index, node) {
        var indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else if (node.match(/^<\/\w/)) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

$(document).ready(selectTheBoundary);
