$(function(){

$.getJSON("data/main.json" ,function(data,status){
    console.log(data);
    vm.$data.title = data.questionTitle;
    vm.$data.num = data.questionList.length;
    vm.$data.isAutoPlayFlag = data.isAutoPlayFlag;
    vm.$data.playTime = data.playTime;
    vm.$data.animateType = data.animateType;
    setTimeout(function(){
        startInitHtml(data.questionList)
        vm.init()
    }, 100)
}).error(function() {
    vm.init()
});


vm = new Vue({
    el: '#all',
    data: {
        isAutoPlayFlag: true, //是否自动播放动画
        playTime: 5, //播放时间
        animateType: 1, //默认动画效果 1：推进   2：缩放   3：擦除  4：溶解
        animArr: ['推进', '缩放', '擦除', '溶解'],
        num: 3, //初始个数
        maxNum: 10, //最多添加个数
        title: '', //标题
    },
    methods: {
        /*初始化*/
        init: function(){
            textEdit = $('.main .box .inp-txt').textEdit({
                inpElement: '.main .box .inp-txt', //输入框类名
                parentElement: '.home', //文本编辑器的父元素类名， 不传默认body
            })
        },
        /*点击添加牌数*/
        addNumFun: function(){
            if(this.num < this.maxNum){
                this.num += 1;
                textEdit.changeTextEdit()
            }
        },
        /*删除当前牌数*/
        delNumFun: function(index){
            console.log("删除");
            var boxCon = $('.main .item')
            for(var i = index - 1; i < boxCon.length - 1; i++){
                $(boxCon[i]).html($(boxCon[i + 1]).html())
            }
            this.num -= 1;
            textEdit.changeTextEdit()
        },
        /*选择添加文字*/
        chooseAddText: function(e){
            // console.log(e)
            console.log("添加");
            var $box = $(e.target).closest('.box');
            $box.find('.text').css('display', 'flex')
            $box.find('.choose').hide()
            $box.find('.text .inp-txt').focus()
            // $box.find('.text .inp-txt').textEdit()
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
        /*预览*/
        prevFun: function(){
            var result = $.output()
            console.log(result);
            if(typeof result === 'string'){
                return
            }
            var str = JSON.stringify(result) // 将对象转换为字符串
            sessionStorage.setItem(result.questionType,str)
            window.open('index.html')
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

//上传图片
$('.main').on('change', '.box .add-file', function(event) {
    event.stopPropagation();
    var oFile = this.files[0]
    var _this = this
    var fr = new FileReader();
    var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    if (!rFilter.test(oFile.type)) {
        errorFun('图片格式不正确，请重新添加图片')
        return;
    };
    fr.readAsDataURL(oFile);
    var $box = $(this).closest('.box')
    fr.onload = function(FREvent) {
        dealImage(FREvent.target.result, {
            width : 1500
        }, function(base){
            $box.children(".box-top").children('.img').css('display', 'flex')
            $box.children(".box-top").children('.img').children('img').attr('src', base)
            $box.children(".box-top").children('.choose').hide()
        })
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
    var title = vm.$data.title;
    if(title === ''){
        title = $('#title').attr('placeholder')
    }
    if(vm.$data.num < 1){
        errorFun('最少需要1张牌')
        return 'error';
    }
    var box = $('.main .item');
    var arr = [];
    $.each(box, function(is, el){
        console.log(is);
        console.log($(el).children(".box-top").children('.img'));
        var obj = {};
        if($(el).children(".box-top").children('.img').css('display') === 'flex'){
            obj.optionsType = 'image';
            obj.optionsCon = $(el).children(".box-top").find('.img img').attr('src')
        }else if($(el).children(".box-top").children('.text').css('display') === 'flex'){
            obj.optionsType = 'text';
            obj.optionsCon = $(el).children(".box-top").find('.text .inp-txt').html()
        }else{
            obj.optionsType = "";
            obj.optionsCon = ""
        }
        console.log($(el).children(".box-bot").find('.box-bot-txt').html());
        obj.optionsBotCon = $(el).children(".box-bot").find('.box-bot-txt').html()
        arr.push(obj)
    })
    for(var i = 0; i < arr.length; i++){
        if(!arr[i].optionsCon || arr[i].optionsCon.search(/\S/g) === -1 ){
            errorFun('有选项未填写')
            return 'error';
        }
    }
    var subData = {
        questionType: 'hualang', //习题类型定义
        questionTitle: vm.$data.title, //题干
        questionList: arr,
        isAutoPlayFlag: vm.$data.isAutoPlayFlag, //是否自动播放动画
        playTime: vm.$data.playTime, //播放时间
        animateType: vm.$data.animateType,
    }
    return subData
}

    $(".main").on('input','.box-bot',function () {
        //输入内容,文字的处理
        var str = $(this).children('.box-bot-txt').html();
        if(str.length >100){
            $(this).children('.desc-num').children('.box-bottom-fontNum').html(100);
            str = str.slice(0,100)
        }else{
            $(this).children('.desc-num').children('.box-bottom-fontNum').html(str.length);
        }
    })


    $('.main').on('click', '.box .icon-text', function(e){
        vm.chooseAddText(e)
    })
    /*选择删除*/
    $('.main').on('click', '.box .close', function(e){
        var $box = $(this).closest('.box');
        if($box.find('.choose').css('display') === 'none'){
            //返回选择页
            $box.find('.choose').css('display', 'flex')
            $box.find('.img').hide()
            $box.find('.img').children('img').attr('src', '')
            $box.find('.text').hide()
            $box.find('.text .inp-txt').html('')
        }else{
            //直接删除
            // var index = $box.parent().data('index')
            var index = $box.data('index')
            vm.delNumFun(index)
        }
    })
/*
    optionsType: '', //类型，image 或 text
    optionsCon: '', //内容
 */


//若有历史数据则初始化html
function startInitHtml(list){
    var box = $('.main .item');
    $.each(box, function(is, el){
        var obj = list[is];
        if(obj.optionsType === 'image'){
            $(el).find('.img').css('display', 'flex');
            $(el).find('.img img').attr('src', obj.optionsCon)
            $(el).find('.choose').hide()
        }else{
            $(el).find('.text').css('display', 'flex');
            $(el).find('.text .inp-txt').html(obj.optionsCon)
            $(el).find('.choose').hide()
        }
        $(el).find('.box-bot-txt').html(obj.optionsBotCon)
    })
}


//

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
    function isChrome(){
        var str = navigator.userAgent;
        var reg = /(Chrome)/g
        if(reg.test(str)){
            return true;
        }else{
            return false
        }
    }

})