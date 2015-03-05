var currentElement={};
var selectionRegion=[];
var selectionAncestorRegion={};
var regionSelected=false;
var isInputSomething = false;
function selectTheBoundary(){
	$(document.body).append($("<div id='selectionBox'></div>"));
	registerSelectionBox();
}


function generateLayoutDefinition(){
	var clonedSelectionRegion=$(selectionAncestorRegion).clone();
	
	var allChildrenElements = $(clonedSelectionRegion).find("*");
	allChildrenElements.each(function(index, childrenElement){
		if($(childrenElement).find(".selectionBackground").length==0 && $(childrenElement).parents().filter(".selectionBackground").length==0){
			$(childrenElement).addClass("any");
		}
	});

	var valueSpans = $(clonedSelectionRegion).find(".value");
	valueSpans.each(function(index, valueSpan){
		var innerHTML = $(valueSpan).html();
		var targetItemName = $(valueSpan).attr("target-item");
		var $valueWrappedElement = $("<value target-item='"+targetItemName+"'></value>");
		$(valueSpan).replaceWith($valueWrappedElement);
	});
	
	var textManualSpans = $(clonedSelectionRegion).find("span.manual");
	textManualSpans.each(function(index, manualSpan){
		$(manualSpan).replaceWith($(manualSpan.firstChild));
	});
	
	var ignoreSpans = $(clonedSelectionRegion).find(".any");
	ignoreSpans.each(function(index, ignoreSpan){
		$(ignoreSpan).replaceWith($("<any></any>"));
	});
	
	$(clonedSelectionRegion).find(".selectionBackground").removeClass("selectionBackground");
	$(clonedSelectionRegion).find("*").each(function(index, child){
		$(child).removeAttr("width");
		$(child).removeAttr("height");
		$(child).removeAttr("style");
	});
	
//	var result = new XMLSerializer().serializeToString(clonedSelectionRegion);
	var brPatternString="<br>";
	var brPattern = new RegExp(brPatternString,"g");
	var brClosePatternString="</br>";
	var brClosePattern = new RegExp(brClosePatternString,"g");
	var newLinePattern = new RegExp("\n","g");
	var anyPattern = new RegExp("(<any></any>)+", "g");
	
	result = $(clonedSelectionRegion).html().replace(/(<img\b[^<>]*[^<>\/])>/ig, "$1 />").replace(brPattern, "<br/>").replace(/(<col\b[^<>]*[^<>\/])>/ig, "$1 />").replace(brClosePattern, "");
	result = result.replace(newLinePattern, "");
	result = result.replace(anyPattern, "<any></any>");
	var $resultDialog = $("<div id='result-dialog' title='Generated Layout Definitions'></div>");
	$resultDialog.append("<textarea id='layout-result'>"+formatForIndent(result)+"</textarea>");
	$resultDialog.dialog();
}



function mouseEnterForBoundarySelection(left, top){
$('#selection').remove();
	var $selectionButton = $("<button id='selection'>select region</button>");
	$(document.body).append($selectionButton);
	
	$selectionButton.css("position", "absolute");
	$selectionButton.css("left", left);
	$selectionButton.css("top", top);
	$selectionButton.css("opacity", "0.7");
		
}

function registerInsideRegionElementEvent(selectionRegionElement){
	textNodes=$(selectionRegionElement).contents().filter(function(){return this.nodeType == 3;});
	var textNodeLength = textNodes.length;
	for(var i=0;i<textNodeLength;i++){
		if($(textNodes[i]).text().trim()==="")
			continue;
		$(textNodes[i]).wrap( "<span class='manual'></span>" );
	}
	
	$elements = $(selectionRegionElement).find("*");
	var length = $elements.length;
	for(var i=0;i<length;i++){
		var classAttr = $($elements[i]).attr('class');
		
		//TODO need more concrete conditions
		if (classAttr===undefined || classAttr===null || classAttr==="" || classAttr.indexOf('manual')===-1){
			continue;
		}
		
		$($elements[i]).on('mouseenter',mouseEnter);
		$($elements[i]).on('mouseleave',mouseLeave);	
	}
}

function registerInsideRegionEvent(){
	makeSelectionRegion();
	var length = selectionRegion.length;
	for(var i=0;i<length;i++){
		registerInsideRegionElementEvent(selectionRegion[i]);
	}
}

function makeSelectionRegion(){
	selectionRegion=[];
	$(".selectionBackground").each(function(index, selectionElement){
		if($(selectionElement).attr("id")!=="selectionBox")
			selectionRegion.push(selectionElement);
	});
}

function registerSelectionBox(){
    var ismove=false;
    var x,y;
    $(document).mousedown(function(e){
	ismove=true;
	isInputSomething=false;
	if($(e.target).attr('id')==='selection'){
		registerInsideRegionEvent();
		if($('#selection').length>0){
			var offset = $('#selection').offset();
			
			var $generateButton = $("<button id='generate'>generate</button>");
			$(document.body).append($generateButton);
			$generateButton.css("position", "absolute");
			$generateButton.css("left", offset.left);
			$generateButton.css("top", offset.top);
			$generateButton.css("opacity", "0.7");
			$('#selection').remove();
			regionSelected=true;
			$("#selectionBox").remove();
			$generateButton.click(function(e){
				generateLayoutDefinition();
			});
			
		}
		if(selectionRegion.length>0){
				var baseNodeParent = selectionRegion[0];
				var endNodeParent = selectionRegion[selectionRegion.length-1];
				var node = baseNodeParent;
				
				while($(endNodeParent).parents().index($(node)) < 0){
					node = $(node).parent();
				}
				var currentTagName = $(node).get(0).tagName;
				while( currentTagName==='TBODY' || currentTagName==='TR' || currentTagName==='TD'){
					node = $(node).parent();
				}
				selectionAncestorRegion=node;
			}
	}
	if(!regionSelected){
		
		$(".selectionBackground").removeClass("selectionBackground");
        x=e.pageX;
        y=e.pageY;
		
        $("#selectionBox").attr("style","").css({"left":x,"top":y});
		$("#selectionBox").css("position", "absolute");
	}
	}).mousemove(function(e){
        if(ismove && !regionSelected){
            var mx=e.pageX-x;
            /*if(e.pageX>$(window).width()-10){
                mx=$(window).width()-x;
            }*/
            var my=e.pageY-y;
            /*if(e.pageY>$(window).height()-10){
                my=$(window).height()-y;
            }*/
            if(mx<0){
                $("#selectionBox").css("left",x+mx);
            }
            if(my<0){
                $("#selectionBox").css("top",y+my);
            }
            $("#selectionBox").css({width:Math.abs(mx),height:Math.abs(my)});
        }
    }).mouseup(function(e){
		if(!regionSelected){
			ismove=false;
			highlightSelectionElements(x, y, e.pageX, e.pageY);
		
		}
    }).contextmenu(function(){
        return false;
    });
　}

function highlightSelectionElements(startX, startY, endX, endY){
	var selectionElements = $(document.body).find("*");
	selectionElements.each(function(index, selectionElement){	
		var offset = $(selectionElement).offset();
		var width = $(selectionElement).width();
		var height = $(selectionElement).height();
		if(offset.left>=startX && offset.left+width<=endX && offset.top>=startY && offset.top+height<=endY){
			$(selectionElement).addClass("selectionBackground");
		}
	});
	mouseEnterForBoundarySelection(endX, endY);
}

function mouseEnter(event){
		if(isInputSomething){
			return;
		}
		currentElement=event.target;
		var currentClass = $(currentElement).attr("class");
		
		$("#value").remove();
		$("#target-item").remove();
		
		
		var $ignoreButton = $("<button id='ignore'>ignore</button>");
		var $valueButton = $("<button id='value'>value</button>");
		var $targetItemArea = $("<input id='target-item' placeholder='target-item id'></input>");
		
		$(document.body).append($valueButton);
		$(document.body).append($targetItemArea);
		isInputSomething=false;
		$('#ignore').click(function(event){
			
			$(currentElement).attr("class","any");
		});
		$('#value').click(function(event){
		
			var $targetItemInputElement = $("#target-item");
			$(currentElement).attr("class","value");
			$(currentElement).attr("target-item", $targetItemInputElement.val());
			
		});
		$('#target-item').focus(function(event){
			isInputSomething=true;
		});
		var offset = $(event.target).offset();
		$ignoreButton.css("position", "absolute");
		$ignoreButton.css("left", offset.left-$ignoreButton.width()-10);
		$ignoreButton.css("top", offset.top-5);
		$ignoreButton.css("opacity", "0.7");
		$valueButton.css("position", "absolute");
		$valueButton.css("left", offset.left+$(event.target).width());
		$valueButton.css("top", offset.top-5);
		$valueButton.css("opacity", "0.7");
		$targetItemArea.css("position", "absolute");
		$targetItemArea.css("left", offset.left+$(event.target).width()+$valueButton.width()+15);
		$targetItemArea.css("top", offset.top-5);
		
		$(event.target).addClass("hoverBorder");
		event.stopPropagation();
		
}

function mouseLeave(event){
		
		$(event.target).removeClass("hoverBorder");
		event.stopPropagation();
		
}

function formatForIndent(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
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
