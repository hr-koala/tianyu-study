(function($, d, w){
    
    var isMac = w.navigator.platform == 'MacIntel',
        mouseX = 0,
        mouseY = 0,
        cache = {
            command: false,
            shift: false,
            isSelecting: false
        },
        elemEditor,
        /*tag: html标签
         *style: 样式
         *isPop: 是否有下拉框
         *size: 字体大小*/
        options = {
            modifiers: {
                bold: {tag: 'b', isPop: false},
                italics: {tag: 'i', isPop: false},
                underline: {tag: 'u', isPop: false},
                throughline: {tag: 's', isPop: false},
                size: {tag: 'span', isPop: true},
                color: {tag: 'span', isPop: false},
            },
            fontsize: ['44px', '50px', '56px', '62px'],
            fixed: true
        },
        utils = {
            keyboard: {
                isShift: function(e, callbackTrue, callbackFalse) {
                    if (e.shiftKey) {
                        callbackTrue();
                    } else {
                        callbackFalse();
                    }
                },
                isEnter: function(e, callback) {
                    if (e.which === 13) {
                        callback();
                    }
                },
                isArrow: function(e, callback) {
                    if (e.which >= 37 || e.which <= 40) {
                        callback();
                    }
                },
                isPc: function(){
                    var userAgentInfo = navigator.userAgent;
                    var Agents = ["Android", "iPhone",
                                "SymbianOS", "Windows Phone",
                                "iPad", "iPod"];
                    var flag = true;
                    for (var v = 0; v < Agents.length; v++) {
                        if (userAgentInfo.indexOf(Agents[v]) > 0) {
                            flag = false;
                            break;
                        }
                    }
                    return flag;
                }
            },
            html: {
                addHtml: function() {
                    var div = document.createElement('div');
                    var tag =   '<div class="bold ficon" editor-command="bold" title="加粗"><i class="iconfont">&#xe625;</i></div>'
                                +'<div class="italics ficon" editor-command="italics" title="斜体"><i class="iconfont">&#xec86;</i></div>'
                                +'<div class="underline ficon" editor-command="underline" title="下划线"><i class="iconfont">&#xec85;</i></div>'
                                +'<div class="throughline ficon" editor-command="throughline" title="中划线"><i class="iconfont">&#xe609;</i></div>'
                                +'<div class="size ficon" editor-command="size" title="字体大小">'
                                    +'<i class="iconfont">&#xe676;</i>'
                                    +'<div class="arrow"><i class="iconfont">&#xe6f5;</i></div>'
                                    +'<div class="size-ul pop-ul">'
                                        +'<ul>'
                                            +'<li>小</li>'
                                            +'<li>中</li>'
                                            +'<li>大</li>'
                                            +'<li>特大</li>'
                                        +'</ul>'
                                    +'</div>'
                                +'</div>'
                                +'<div class="color ficon" editor-command="color" title="字体颜色">'
                                    +'<i class="iconfont iconfont-a">&#xec87;</i>'
                                    +'<i class="iconfont color-xian">&#xe66b;</i>'
                                    +'<div class="arrow"><i class="iconfont">&#xe6f5;</i></div>'
                                    +'<input id="choose-color" />'
                                +'</div>';
                    $(div).html(tag);
                    $(div).addClass('my-editor')
                    if(!options.fixed){
                        $(div).css('position', 'absolute')
                    }
                    if(options.parentElement){
                        $(options.parentElement).append(div)
                    }else{
                        $('body').append(div)
                    }
                    elemEditor = $(div)
                    bubble.buildMenu($(this), elemEditor)
                },
                addTag: function(elem, tag, focus, editable) {
                    var newElement = $(d.createElement(tag));
                    newElement.attr('contenteditable', Boolean(editable));
                    newElement.append(' ');
                    elem.append(newElement);
                    if (focus) {
                        cache.focusedElement = elem.children().last();
                        utils.cursor.set(elem, 0, cache.focusedElement);
                    }
                    return newElement;
                }
            },
            cursor: {
                set: function(editor, pos, elem) {
                    var range;
                    if (d.createRange) {
                        range = d.createRange();
                        var selection = w.getSelection(),
                            lastChild = editor.children().last(),
                            length = lastChild.html().length - 1,
                            toModify = elem ? elem[0] : lastChild[0],
                            theLength = typeof pos !== 'undefined' ? pos : length;
                        range.setStart(toModify, theLength);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    } else {
                        range = d.body.createTextRange();
                        range.moveToElementText(elem);
                        range.collapse(false);
                        range.select();
                    }
                }
            },
            selection: {
                save: function() {
                    if (w.getSelection) {
                        var sel = w.getSelection();
                        if (sel.rangeCount > 0) {
                            return sel.getRangeAt(0);
                        }
                    } else if (d.selection && d.selection.createRange) { // IE
                        return d.selection.createRange();
                    }
                    return null;
                },
                restore: function(range) {
                    if (range) {
                        if (w.getSelection) {
                            var sel = w.getSelection();
                            sel.removeAllRanges();
                            sel.addRange(range);
                        } else if (d.selection && range.select) { // IE
                            range.select();
                        }
                    }
                },
                getText: function() {
                    var txt = '';
                    if (w.getSelection) {
                        txt = w.getSelection().toString();
                    } else if (d.getSelection) {
                        txt = d.getSelection().toString();
                    } else if (d.selection) {
                        txt = d.selection.createRange().text;
                    }
                    return txt;
                },
                clear: function() {
                    if (window.getSelection) {
                        if (window.getSelection().empty) { // Chrome
                            window.getSelection().empty();
                        } else if (window.getSelection().removeAllRanges) { // Firefox
                            window.getSelection().removeAllRanges();
                        }
                    } else if (document.selection) { // IE?
                        document.selection.empty();
                    }
                },
                getContainer: function(sel) {
                    if (w.getSelection && sel && sel.commonAncestorContainer) {
                        return sel.commonAncestorContainer;
                    } else if (d.selection && sel && sel.parentElement) {
                        return sel.parentElement();
                    }
                    return null;
                },
                getSelection: function() {
                    if (w.getSelection) {
                        return w.getSelection();
                    } else if (d.selection && d.selection.createRange) { // IE
                        return d.selection;
                    }
                    return null;
                }
            },
            validation: {
                isUrl: function(url) {
                    return (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/).test(url);
                }
            }
        },
        colorOptions = {
            allowEmpty:true,
            color: "#278bdf",
            showInput: true,
            containerClassName: "full-spectrum",
            showInitial: true,
            showPalette: true,
            showSelectionPalette: true,
            showAlpha: true,
            maxPaletteSize: 10,
            preferredFormat: "hex",
            localStorageKey: "spectrum.demo",
            move: function (color) {
                var hexColor = color.toHexString();
                var cmd = $(this).closest('.ficon.color').attr('editor-command');
                $(this).closest('.ficon.color').find('.color-xian').css('color', hexColor)
                events.commands[cmd].call(elemEditor, hexColor);
            },
            show: function (color) {
            },
            beforeShow: function () {
                elemEditor.find('.pop-ul').hide()
            },
            hide: function (color) {
            },
            palette: [
                ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",  "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
                ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
            ]
        },
        actions = {
            changeEvent: function(){
                var elem = $(options.inpElement)
                actions.clearEvent(elem)
                actions.bindEvents(elem)
            },
            clearEvent: function(elem){
                elem.off('keydown keyup focus mousedown mouseup mousemove blur')
                $('body').off('mouseup')
            },
            bindEvents: function(elem) {
                elem.on('keydown', rawEvents.keydown);
                elem.on('keyup', rawEvents.keyup);
                elem.on('focus', rawEvents.focus);
                elem.on('mousedown', rawEvents.mouseClick);
                elem.on('mouseup', rawEvents.mouseUp);
                elem.on('mousemove', rawEvents.mouseMove);
                elem.on('blur', rawEvents.blur);
                $('body').on('mouseup', function(e) {
                    // console.log(e);
                    // console.log(cache);
                    // if (e.target == e.currentTarget && cache.isSelecting) {
                    if ( cache.isSelecting) {
                        rawEvents.mouseUp.call(elem, e);
                    }
                });
            },
            preserveElementFocus: function() {
                var anchorNode = w.getSelection() ? w.getSelection().anchorNode : d.activeElement;
                if (anchorNode) {
                    var current = anchorNode.parentNode,
                        diff = current !== cache.focusedElement,
                        children = this.children,
                        elementIndex = 0;
                    if (current === this) {
                        current = anchorNode;
                    }
                    for (var i = 0; i < children.length; i++) {
                        if (current === children[i]) {
                            elementIndex = i;
                            break;
                        }
                    }
                    if (diff) {
                        cache.focusedElement = current;
                        cache.focusedElementIndex = elementIndex;
                    }
                }
            },
            prepare: function(elem, customOptions) {
                for(var k in customOptions){
                    options[k] = customOptions[k]
                }
                elem.attr('contenteditable', true);
                elem.addClass('jquery-notebook editor');
                actions.preserveElementFocus.call(elem);
            }
        },
        bubble = {
            /*
             * 定位文本编辑器的位置
             */
            updatePos: function(editor, elem) {
                var pos = {},
                    bubbleWidth = elem.innerWidth(),
                    bubbleHeight = elem.innerHeight();
                if(utils.keyboard.isPc()){
                    var sel = w.getSelection(),
                        range = sel.getRangeAt(0),
                        boundary = range.getBoundingClientRect(),
                        pos = {
                            x: boundary.x + (boundary.width - bubbleWidth) / 2,
                            y: boundary.y - bubbleHeight - 5 
                        };
                }else{
                    var box = editor.parent().offset();
                    pos = {
                        x: box.left,
                        y: box.top - bubbleHeight - 5
                    }
                }
                if(pos.x < 0){
                    pos.x = 0;
                }
                if(pos.y < 0){
                    pos.y = 0;
                }
                elem.css({
                    top: pos.y + 'px',
                    left: pos.x + 'px',
                })
            },
            /*
             * 查找选中的文本是否有标签
             */
            updateState: function(editor, elem) {
                elem.find('.ficon').removeClass('active');
                var sel = w.getSelection(),
                    tags = {},
                    formats = [];
                bubble.checkForFormatting(sel.focusNode, formats, tags);
                var formatDict = {
                    'b': 'bold',
                    'i': 'italics',
                    'u': 'underline',
                    'strike': 'throughline',
                    'font': 'color'
                };
                var defaultColor = $(sel.focusNode.parentElement).css('color')
                elem.find('.ficon.color').find('.color-xian').css('color', defaultColor)
                // console.log(formats);
                // console.log(tags);
                for (var i = 0; i < formats.length; i++) {
                    var format = formats[i];
                    if(format !== 'font'){
                        elem.find('.ficon.' + formatDict[format]).addClass('active');
                    }else{
                        var el = tags[format];
                        elem.find('.ficon.' + formatDict[format]).find('.color-xian').css('color', $(el).css('color'))
                    }
                }
            },
            /*
             * 返回选中时存在的标签
             */
            checkForFormatting: function(currentNode, formats, tags) {
                var validFormats = ['b', 'i', 'u', 'strike', 'font'];
                tags = tags || {};
                if (currentNode.nodeName === '#text' ||
                    validFormats.indexOf(currentNode.nodeName.toLowerCase()) != -1) {
                    if (currentNode.nodeName != '#text') {
                        // console.log(currentNode);
                        var ca = currentNode.nodeName.toLowerCase()
                        formats.push(ca);
                        tags[ca] = currentNode;
                    }
                    bubble.checkForFormatting(currentNode.parentNode, formats, tags);
                }
            },
            /*编辑器上绑定事件*/
            buildMenu: function(editor, elem) {
                elem.on('click', '.ficon', function(e){
                    e.preventDefault();
                    e.stopPropagation()
                    elemEditor.find('.pop-ul').hide()
                    // console.log(e);
                    var cmd = $(this).attr('editor-command');
                    // var obj = options.modifiers[cmd];
                    if(cmd === 'size'){
                        $(this).children('.pop-ul').show()
                    } else if(cmd === 'color'){
                        
                    }else{
                        events.commands[cmd].call(editor, e);
                    }
                })
                elem.on('click', '.ficon .size-ul ul li', function(e){
                    //改变字体大小
                    e.preventDefault();
                    e.stopPropagation()
                    elemEditor.find('.pop-ul').hide()
                    var cmd = $(this).closest('.ficon').attr('editor-command');
                    var obj = options.modifiers[cmd];
                    var index = $(this).index()
                    var size = options.fontsize[index]
                    events.commands[cmd].call(editor, e, size);
                })
                elem.find('#choose-color').spectrum(colorOptions)
            },
            /*显示文本编辑器*/
            show: function() {
                // console.log($(this));
                elemEditor.addClass('active')
                bubble.updatePos($(this), elemEditor);
                bubble.update()
            },
            update: function(e) {
                bubble.updateState(this, elemEditor);
            },
            clear: function() {
                elemEditor.removeClass('active')
                elemEditor.find('.pop-ul').hide()
            },
            /*转换字体大小*/
            converFontSize: function(size){
                var sel = w.getSelection();
                var tags = {};
                bubble.checkForDiv(sel.focusNode, tags);
                $(tags.font).removeAttr('size')
                $(tags.font).attr('style', 'font-size: ' + size);
            },
            /*
             * 返回选中的FONT
             */
            checkForDiv: function(currentNode, tags) {
                if (currentNode.nodeName === 'FONT') {
                    var ca = currentNode.nodeName.toLowerCase();
                        tags[ca] = currentNode;
                }else{
                    bubble.checkForDiv(currentNode.parentNode, tags);
                }
            },
        },
        rawEvents = {
            keydown: function(e) {
                var elem = this;
                // console.log(e);
                utils.keyboard.isShift(e, function() {
                    cache.shift = true;
                }, function() {
                    cache.shift = false;
                });
                if (cache.shift) {
                    utils.keyboard.isArrow.call(this, e, function() {
                        setTimeout(function() {
                            var txt = utils.selection.getText();
                            if (txt !== '') {
                                bubble.show.call(elem);
                            } else {
                                bubble.clear.call(elem);
                            }
                        }, 100);
                    });

                } else {
                    utils.keyboard.isArrow.call(this, e, function() {
                        if(utils.keyboard.isPc()){
                            bubble.clear.call(elem);
                        }
                    });
                }
                
            },
            keyup: function(e) {
                actions.preserveElementFocus.call(this);
                if (/^\s*$/.test($(this).text())) {
                    $(this).empty();
                    utils.html.addTag($(this), 'p', true, true);
                }
            },
            focus: function(e) {
                var elem = this;
                cache.command = false;
                cache.shift = false;
                if(!utils.keyboard.isPc()){
                    bubble.show.call(elem);
                }
            },
            mouseClick: function(e) {
                var elem = this;
                cache.isSelecting = true;
                var bubble = $('.my-editor')
                if (bubble.length) {
                    var bubbleTag = bubble,
                        bubbleX = bubbleTag.offset().left,
                        bubbleY = bubbleTag.offset().top,
                        bubbleWidth = bubbleTag.width(),
                        bubbleHeight = bubbleTag.height();
                    if (mouseX > bubbleX && mouseX < bubbleX + bubbleWidth &&
                        mouseY > bubbleY && mouseY < bubbleY + bubbleHeight) {
                        return;
                    }
                }
            },
            mouseUp: function(e) {
                var elem = this;
                // console.log(e);
                cache.isSelecting = false;
                setTimeout(function() {
                    var s = utils.selection.save();
                    // console.log(s);
                    if (s) {
                        if (s.collapsed && utils.keyboard.isPc()) {
                            bubble.clear.call(elem);
                        } else {
                            bubble.show.call(elem);
                            e.preventDefault();
                        }
                    }
                }, 50);
            },
            mouseMove: function(e) {
                mouseX = e.pageX;
                mouseY = e.pageY;
            },
            blur: function(e) {
            },
        },
        events = {
            commands: {
                /*加粗*/
                bold: function(e) {
                    e.preventDefault();
                    d.execCommand('bold', false);
                    bubble.update.call(this);
                },
                /*斜体*/
                italics: function(e) {
                    e.preventDefault();
                    d.execCommand('italic', false);
                    bubble.update.call(this);
                },
                /*下划线*/
                underline: function(e) {
                    e.preventDefault();
                    d.execCommand('underline', false);
                    bubble.update.call(this);
                },
                /*中划线*/
                throughline: function(e) {
                    e.preventDefault();
                    d.execCommand('StrikeThrough', false);
                    bubble.update.call(this);
                },
                /*字体大小*/
                size: function(e, size) {
                    e.preventDefault();
                    d.execCommand('FontSize', false, size);
                    bubble.converFontSize.call(this, size);
                    bubble.update.call(this);
                },
                /*颜色*/
                color: function(color) {
                    // e.preventDefault();
                    d.execCommand('ForeColor', false, color);
                    bubble.update.call(this);
                },
            },
            
        };
    
    $.fn.textEdit = function(options) {
        options = $.extend({}, options);
        actions.prepare(this, options);
        actions.bindEvents(this);
        utils.html.addHtml()
        return this;
    };
    $.fn.changeTextEdit = function(){
        setTimeout(function(){
            actions.changeEvent()
        }, 100)
        
    }

})(jQuery, document, window);