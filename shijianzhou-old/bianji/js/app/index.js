$(function(){

vm = new Vue({
    el: '#all',
    data: {
        title: '', //标题
        isAutoPlayFlag: true, //是否自动播放动画
        playTime: 5, //播放时间
        animateType: 1, //默认动画效果 1：推进   2：缩放   3：擦除  4：溶解
        animArr: ['推进', '缩放', '擦除', '溶解'],
        navPostType: 1, //导航位置
        navPostArr: ['左侧', '右侧', '顶部', '底部'],
        questionList: [], //所有的数据
        currentObj: {}, //当前的数据
        currentIndex: '', //当前的下标
        boxWidth: 0,//时间轴上方框的宽度
    },
    methods: {
        init: function(){
            this.initYeziData()
            this.initWidth()
            $('.con-right .content').textEdit({
                inpElement: '.con-right .content', //输入框类名
                parentElement: '.home', //文本编辑器的父元素类名， 不传默认body
            })
        },
        /*计算方框宽度*/
        initWidth: function(){
            var w = $('.timeline .list').width() - 36 * 4;
            var w1 = w / 2;
            this.boxWidth = w1;
            $('.timeline .item').css('width', w1 + 'px')
        },
        /*初始化数据列表 和 html*/
        initYeziData: function(){
            var arr = [];
            var html = '';
            for(var i = 0; i < 4; i++){
                arr.push({
                    title: '', //叶子的输入内容
                    optionsText: '', //编辑内容
                    optionsType: '', //添加的元素格式 image  text  video  audio
                    optionsCon: '', //添加的元素内容
                    id: i + 1
                })
                var c = 'left';
                if(i % 2 === 1){
                    c = 'right';
                }
                html += '<div class="box '+ c +'" data-index="'+ i +'">'
                            +'<div class="item">'
                                +'<div class="content" contenteditable="true" placeholder="编辑内容"></div>'
                                +'<div class="jian"></div>'
                            +'</div>'
                        +'</div>';
            }
            this.questionList = arr;
            $('.timeline .post').html(html)
            this.initLeafData(0)
        },
        /*上一个/在上面增加一个*/
        addPrevNumFun: function(){
            this.addBoxHtml('prev')
        },
        /*下一个/在下面增加一个*/
        addNextNumFun: function(){
            this.addBoxHtml('next')
        },
        /*增加时间轴*/
        addBoxHtml: function(state){
            var $box = $('.timeline .post .box:first-child');
            if(state === 'next'){
                $box = $('.timeline .post .box:last-child');
            }
            var c = 'left';
            if($box.hasClass('left')){
                c = 'right';
            }
            html = '<div class="box '+ c +'">'
                        +'<div class="item" style="width: '+ this.boxWidth +'px;">'
                            +'<div class="content" contenteditable="true" placeholder="编辑内容"></div>'
                            +'<div class="jian"></div>'
                        +'</div>'
                    +'</div>';
            var len = $('.timeline .post .box').length + 1;
            var obj = {
                title: '', //叶子的输入内容
                optionsText: '', //编辑内容
                optionsType: '', //添加的元素格式 image  text  video  audio
                optionsCon: '', //添加的元素内容
                id: len
            }
            if(this.currentIndex || this.currentIndex === 0 ){
                this.questionList[this.currentIndex] = this.currentObj
            }
            this.currentIndex = '';
            this.currentObj = {};
            if(state === 'prev'){
                $('.timeline .post').prepend(html)
                this.questionList.unshift(obj)
                $('.timeline .list').scrollTop(0)
            }else{
                $('.timeline .post').append(html)
                var len = $('.timeline .post .box').length - 4;
                this.questionList.push(obj)
                var h = len * $box.outerHeight(true)
                $('.timeline .list').scrollTop(h)
                // $('.timeline .post').css('top', -h + 'px')
                // $('.timeline .post .box:lt(' + len + ')').css('opacity', 0)
            }
            // console.log($box);
        },
        /*初始化当前时间数据*/
        initLeafData: function(index){
            if(this.currentIndex || this.currentIndex === 0){
                this.questionList[this.currentIndex] = this.currentObj
            }
            this.currentIndex = index;
            this.currentObj = this.questionList[index];
            $('.timeline .box').eq(index).addClass('on').siblings().removeClass('on')
            if(this.currentObj.optionsType === 'text'){
                $('.con-right .cmain .text .content').html(this.currentObj.optionsCon)
            }
            $('.con-right .cinfo .content').html(this.currentObj.optionsText)
        },
        /*输入时间上的文字*/
        inputLearTitle: function(e){
            this.currentObj.title = e.target.value;
        },
        /*输入编辑内容*/
        inputOptionsText: function(e){
            if(this.currentIndex || this.currentIndex === 0){
                this.currentObj.optionsText = $(e.target).html();
            }else{
                errorFun('请先选择要操作的时间')
                $(e.target).html('')
            }
        },
        /*选择添加文字*/
        chooseAddTextType: function(){
            if(this.currentIndex || this.currentIndex === 0){
                this.currentObj.optionsType = 'text';
                $('.con-right .cmain .text .content').html('')
                $('.con-right .cmain .text .content').focus()
            }
        },
        /*保存输入的文字*/
        inputOptonsCon: function(e){
            this.currentObj.optionsCon = $(e.target).html();
        },
        /*删除当前选择的添加方式*/
        delOptionsType: function(){
            this.currentObj.optionsType = '';
            this.currentObj.optionsCon = '';
            $('.con-right .cmain .text .content').html('')
        },
        
        /*是否自动播放*/
        changeAutoPlayFun: function(e){
            this.isAutoPlayFlag = e.target.checked;
        },
        /*减时间*/
        subTimeFun: function(){
            if(this.playTime > 3){
                this.playTime -= 1;
            }
        },
        /*加时间*/
        addTimeFun: function(){
            this.playTime += 1;
        },
        /*改变动画方式*/
        changeAnimType: function(e){
            var value = e.target.value;
            this.animateType = parseInt(value)
        },
        /*改变导航位置*/
        changeNavPostType: function(e){
            var value = e.target.value;
            this.navPostType = parseInt(value)
        },
        /*预览*/
        prevFun: function(){
            var result = $.output()
            console.log(result);
            if(typeof result === 'string'){
                return
            }
            var str = JSON.stringify(result) // 将对象转换为字符串
            sessionStorage.setItem(result.questionType,str)
            window.open('../yulan/index.html')
        },
        //保存
        saveFun: function(){
            var result = $.output()
            if(typeof result === 'string'){
                return
            }
            var base = JSON.stringify(result)
            var blob = new Blob([base], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "main.json")
        }
    }
})

vm.init()
window.onresize =function(){
    vm.initWidth()
}

/*选择时间*/
$('.timeline .list').on('click', '.box', function(e){
    e.stopPropagation()
    e.preventDefault();
    var $box = $(this).closest('.box');
    var index = $box.index();
    $box.find('.content').focus()
    vm.initLeafData(index)
})
$('.timeline .list').on('input', '.content', function(e){
    e.stopPropagation()
    e.preventDefault();
    vm.$data.currentObj.title = $(this).html()
})


$('.con-right').on('click', '.choose ul li', function(){
    if(!vm.$data.currentIndex && vm.$data.currentIndex !== 0){
        errorFun('请先选择要操作的时间')
        return;
    }
})
//上传图片
$('.con-right').on('change', '.add-img', function(event) {
    event.stopPropagation();
    var oFile = this.files[0]
    var _this = this
    var fr = new FileReader();
    var rFilter = /^(image)/g
    if (!rFilter.test(oFile.type)) {
        errorFun('图片格式不正确，请重新添加图片')
        return;
    };
    fr.readAsDataURL(oFile);
    fr.onload = function(FREvent) {
        dealImage(FREvent.target.result, {
            width : 500
        }, function(base){
            vm.$data.currentObj.optionsType = 'image';
            vm.$data.currentObj.optionsCon = base;
        })
    }
})

//上传视频
$('.con-right').on('change', '.add-video', function(event) {
    event.stopPropagation();
    var oFile = this.files[0]
    var _this = this
    var fr = new FileReader();
    var rFilter = /^(video)/g
    if (!rFilter.test(oFile.type)) {
        errorFun('视频格式不正确，请重新添加视频')
        return;
    };
    fr.readAsDataURL(oFile);
    fr.onload = function(FREvent) {
        vm.$data.currentObj.optionsType = 'video';
        vm.$data.currentObj.optionsCon = FREvent.target.result;
    }
})

//上传音频
$('.con-right').on('change', '.add-audio', function(event) {
    event.stopPropagation();
    var oFile = this.files[0]
    var _this = this
    var fr = new FileReader();
    var rFilter = /^(audio)/g
    if (!rFilter.test(oFile.type)) {
        errorFun('音频格式不正确，请重新添加音频')
        return;
    };
    fr.readAsDataURL(oFile);
    fr.onload = function(FREvent) {
        vm.$data.currentObj.optionsType = 'audio';
        vm.$data.currentObj.optionsCon = FREvent.target.result;
    }
})


//显示错误信息
function errorFun(str){
    $('.error-txt').html(str)
    $('.error-txt').fadeIn()
    setTimeout(function(){
        $('.error-txt').fadeOut()
    }, 3000)
}

$.output = function(){
    if(vm.$data.title === ''){
        errorFun('请先输入标题')
        return 'error';
    }
    var arr = [];
    var list = vm.$data.questionList;
    console.log(list);
    list[vm.$data.currentIndex] = vm.$data.currentObj;
    for(var i = 0; i < list.length; i++){
        if(list[i].title !== '' && list[i].optionsType !== '' && list[i].optionsCon !== ''){
            var $box = $('#b' + list[i].id);
            var cla = $box.data('class')
            list[i].class = cla;
            arr.push(list[i])
        }else{
            if(list[i].title == '' && list[i].optionsType == '' && list[i].optionsCon == ''){
            }else{
                errorFun('有选项未填写')
                vm.initLeafData(i)
                return 'error';
            }
        }
    }
    if(arr.length < 1){
        errorFun('最少要有一个')
        return 'error';
    }
    
    var subData = {
        questionType: 'shijianzhou', //习题类型定义
        questionTitle: vm.$data.title, //题干
        questionList: arr,
        isAutoPlayFlag: vm.$data.isAutoPlayFlag, //是否自动播放动画
        playTime: vm.$data.playTime, //播放时间
        animateType: vm.$data.animateType,
        navPostType: vm.$data.navPostType
    }
    return subData
}


/*压缩图片*/
function dealImage(path, obj, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function() {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        var quality = 0.7; // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var type = 'image/png';
        var base64 = canvas.toDataURL(type, quality);
        // 回调函数返回base64的值
        callback(base64);
    }
}

})