/*全局方法，提供教学助手应用端、随堂检测、互动课堂端使用*/
var method = {};

/* 由于各应用端使用自己的提交按钮，需提供方法供获取结果
 * @return {json} 做题结果
 */
method.queryAnswers = function(options) {
    // 处理配置参数；目前只添加了学生提交结果后自动判断对错
    var opt = {
        check: false
    };
    if(options !== undefined){
        for(var key in options){
            opt[key] = options[key];
        }
    }
    if(opt.check) {
        $(".check").triggerHandler("click");
    }
    var s = $('.submit').triggerHandler('click');
    var str = JSON.stringify(s)
    return  str// 返回json数据
};



/* js修改配置参数方法
 * @param {Object} 参数项参考 config/settings.json
 * @param {String} 可选，无此参数时直接扩展$scope, 有此参数时扩展$scope指定名称的成员
 */
method.alterSettings = function(settings, key) {
    console.log(settings);
    var scope = vm.$data.settings;
    if(key === undefined){
        for(var item in settings){
            scope[item] = settings[item];
        }
    }else{
        scope[settings] = key;
    }
    vm.$data.settings = scope;
    vm.startUpdataFun();
};

/* 模拟滚动，解决电子书包端浏览器内核不支持触屏滚动
 * 需排除touchstart的元素为可拖拽元素的情况
 */
method.scroll = function() {
    var eleScroll = $('.preview');
    // 隐藏滚动条
    eleScroll.addClass('scrollHidden');
    // 拖拽的元素，一般该元素在拖拽状态下都存在transition类名，如存在特殊情况请另作处理
    var selectors = [
        '.allsym  li'
    ].join(',');

    var flag, lastY;
    eleScroll.on('mousedown touchstart', function(e) {
        var eleDragable = document.querySelectorAll(selectors);
        lastY = e.clientY || e.originalEvent.touches[0].clientY
        flag = (function() {
            for(var i = 0; i < eleDragable.length; i++){
                if($(eleDragable[i]).hasClass('transition')){
                    return false
                }
            }
            return true
        })()
    }).on('mousemove touchmove', function(e) {
        if (flag && eleScroll[0].scrollHeight > eleScroll[0].clientHeight) {
            var curY = e.clientY || e.originalEvent.touches[0].clientY;
            eleScroll[0].scrollTop = eleScroll[0].scrollTop - (curY - lastY);
            lastY = curY;
        };
        e.preventDefault();
    }).on('mouseup touchend', function(e) {
        flag = false;
    });

};


/* 修改按钮位置
 */
method.changeBtnPos = function() {
    $('.floor').css('right', 'calc((100% - 1024px) / 2 + 3.5rem)');
}


/*
滚动翻页
 */
method.pageRoller = function(){
    $('.preview').addClass('divTwo')
    var divTwo = $('.divTwo');  
  //1.禁用div的滚轮事件  
    $('.divTwo').mousewheel(function (e) {  
       return false;  
    });  
  //2.如果滚动条到底底部的时候 禁用window的滚轮滚动  
  //3.判断滚动的方向  
    divTwo.mousewheel(function (e, delta) {  
        var decoration = delta > 0 ? -1 : 1;  

        var scrollTop = divTwo.scrollTop();  
        var scrollHegiht = divTwo[0].scrollHeight;  
        var height = divTwo.height();  
          //滚动条 到底部且 滚轮向下滚动  
        var h1 = decoration * height + scrollTop;

        var x_height = Math.floor(h1/height)*height; 
        console.log(x_height);
        
        if (scrollTop + height >= scrollHegiht && delta < 0) {  
            e.preventDefault();  
        }else if (scrollTop == 0 && delta > 0) { //滚动条 到顶部 且滚轮向上  
            e.preventDefault();  
        }  
        $(divTwo).stop().animate({ scrollTop: x_height }, 400)
    });  

}


/* 互动课堂教师端（win7大触摸屏）无实体键盘时，需要呼出虚拟键盘
 * @param {function} 回调函数
 */
method.callVirtualKeyboard = function(callback) {
    // 若后续存在需要呼出虚拟键盘的输入元素，请加入selectors数组中
    var selectors = [
        ".complie textarea"
    ].join(',');
    var eleDragable = document.querySelectorAll(selectors)

    $(eleDragable).on('click', function() {
        callback.call(this);
    });
}



/* 教学助手win10下切换窗口后，输入域保持焦点，需手动清除
 */
method.cleanFocus = function() {
    // 需要手动清除焦点的元素请加入selectors数组中
    var selectors = [
        ".complie textarea"
    ].join(",");
    var selAll = document.querySelectorAll(selectors);
    $.each(selAll, function(index, item){
        if(document.activeElement === item){
            $(item).blur();
        }
    })
};

/* 获取滚动条相关信息，提供外部应用调用，以解决与外部应用滚动冲突的问题。由于外部应用无法直接获取js方法返回的值，需要通过ajax传值。
 * @return {json} 滚动条元素可视区域高度(clientHeight)、滚动内容高度(scrollHeight)、滚动距离(scrollTop)
 */
method.getScrollbarMsg = function() {
    var ele = document.querySelector('.preview');
    var data = JSON.stringify({
        clientHeight: ele.clientHeight,
        scrollHeight: ele.scrollHeight,
        scrollTop: ele.scrollTop
    });
    var xhr = new XMLHttpRequest();
    xhr.open('post', 'http://app.ldj.com', true);
    xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    xhr.send('src=H5003&' + data);
    return data;
};

