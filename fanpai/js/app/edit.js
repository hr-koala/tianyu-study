$(function(){

$.getJSON("data/main.json" ,function(data,status){
    console.log(data);
    vm.$data.title = data.questionTitle;
    vm.$data.num = data.questionList.length;
    setTimeout(function(){
        startInitHtml(data.questionList)
        vm.init()
    }, 100)
}).error(function() {
    vm.init()
});

vm = new Vue({
    el: '#all',
    data() {
        return {
            num: 2, //卡牌个数
            maxNum: 99, //卡牌最大个数
            title: '', //标题
            boxWidth: 0, //方框的宽度
        }
    },
    components: {
        'child': {
            template: '#tem',
            props: ['nums', 'boxw'],
        }
    },
    methods: {
        /*初始化*/
        init: function(){
            textEdit = $('.main .box .inp-txt').textEdit({
                inpElement: '.main .box .inp-txt', //输入框类名
                parentElement: '.home', //文本编辑器的父元素类名， 不传默认body
            })
            this.initWidth()
            if(!isChrome()){
                setTimeout(this.initWidth, 100)
            }
        },
        /*计算宽度*/
        initWidth: function(){
            var w = ($('.home .main').width() - 30 * 4) / 4;
            this.boxWidth = w;
        },
        /*点击添加卡牌*/
        addNumFun: function(){
            if(this.num < this.maxNum){
                this.num += 1;
                textEdit.changeTextEdit()
            }
        },
        /*删除当前卡牌*/
        delNumFun: function(index){
            var box = $('.main .pair')
            for(var i = index - 1; i < box.length - 1; i++){
                $(box[i]).html($(box[i + 1]).html())
                $(box[i]).children('.zheng').find('.miaos').val($(box[i + 1]).children('.zheng').find('.miaos').val())
                $(box[i]).children('.zheng').find('.num').html('第'+ (i + 1) +'张（正面）')
                $(box[i]).children('.fan').find('.miaos').val($(box[i + 1]).children('.fan').find('.miaos').val())
                $(box[i]).children('.fan').find('.num').html('第'+ (i + 1) +'张（反面）')
            }
            this.num -= 1;
            textEdit.changeTextEdit()
        },
        /*选择添加文字*/
        chooseAddText: function(e){
            var $box = $(e.target).closest('.box');
            $box.find('.text').css('display', 'flex')
            $box.find('.choose').hide()
            $box.find('.text .inp-txt').focus()
            // $box.find('.text .inp-txt').textEdit()
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



window.onresize =function(){
    vm.initWidth()
}
/*选择添加文字*/
$('.main').on('click', '.pair .box .icon-text', function(e){
    vm.chooseAddText(e)
})
/*选择删除*/
$('.main').on('click', '.pair .box .close', function(e){
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
        var index = $box.parent('.pair').data('index')
        vm.delNumFun(index)
    }
})
/*输入描述*/
$('.main').on('input', '.pair .box .miaos', function(e){
    
    e.stopPropagation()
    var len = this.value.length;
    $(this).parent().children('.inp-num').html('（'+ len +'/100）')
})

//上传图片
$('.main').on('change', '.box .add-file', function(event) {
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
    var $box = $(this).closest('.box')
    fr.onload = function(FREvent) {
        dealImage(FREvent.target.result, {
            width : 500
        }, function(base){
            $box.find('.img').css('display', 'flex')
            $box.find('.img').children('img').attr('src', base)
            $box.find('.choose').hide()
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
        errorFun('最少需要1张卡牌')
        return 'error';
    }
    var box = $('.main .pair');
    var arr = [];
    $.each(box, function(is, el){
        var obj = {};
        var $zheng = $(el).children('.zheng')
        if($zheng.find('.img').css('display') === 'flex'){
            obj.optionsZhengType = 'image';
            obj.optionsZhengCon = $zheng.find('.img img').attr('src')
        }else if($zheng.find('.text').css('display') === 'flex'){
            obj.optionsZhengType = 'text';
            obj.optionsZhengCon = $zheng.find('.text .inp-txt').html()
        }else{
            obj.optionsZhengType = "";
            obj.optionsZhengCon = ""
        }
        obj.optionsZhengDes = $zheng.find('.miaos').val()

        var $fan = $(el).children('.fan')
        if($fan.find('.img').css('display') === 'flex'){
            obj.optionsFanType = 'image';
            obj.optionsFanCon = $fan.find('.img img').attr('src')
        }else if($fan.find('.text').css('display') === 'flex'){
            obj.optionsFanType = 'text';
            obj.optionsFanCon = $fan.find('.text .inp-txt').html()
        }else{
            obj.optionsFanType = "";
            obj.optionsFanCon = ""
        }
        obj.optionsFanDes = $fan.find('.miaos').val()
        arr.push(obj)
    })
    for(var i = 0; i < arr.length; i++){
        if(arr[i].optionsZhengCon === '' || arr[i].optionsFanCon === '' ){
            errorFun('有选项未填写')
            return 'error=有选项未填写';
        }else if(isEmptyFun(arr[i].optionsZhengCon) || isEmptyFun(arr[i].optionsFanCon) ){
            errorFun('有选项全是空白字符')
            return 'error=有选项全是空白字符';
        }
    }
    var subData = {
        questionType: 'choukapai', //习题类型定义
        questionTitle: title, //题干
        questionList: arr,
    }
    return subData
}

/*
    optionsZhengType: '', //正面类型，image 或 text
    optionsZhengCon: '', //正面内容
    optionsZhengDes: '', //正面描述

    optionsFanType: '', //反面类型，image 或 text
    optionsFanCon: '', //反面内容
    optionsFanDes: '', //反面描述
 */


//若有历史数据则初始化html
function startInitHtml(list){
    var box = $('.main .pair');
    $.each(box, function(is, el){
        var obj = list[is];
        var $zheng = $(el).children('.zheng')
        if(obj.optionsZhengType === 'image'){
            $zheng.find('.img').css('display', 'flex');
            $zheng.find('.img img').attr('src', obj.optionsZhengCon)
            $zheng.find('.choose').hide()
        }else{
            $zheng.find('.text').css('display', 'flex');
            $zheng.find('.text .inp-txt').html(obj.optionsZhengCon)
            $zheng.find('.choose').hide()
        }
        $zheng.find('.miaos').val(obj.optionsZhengDes);

        var $fan = $(el).children('.fan')
        if(obj.optionsFanType === 'image'){
            $fan.find('.img').css('display', 'flex');
            $fan.find('.img img').attr('src', obj.optionsFanCon)
            $fan.find('.choose').hide()
        }else{
            $fan.find('.text').css('display', 'flex');
            $fan.find('.text .inp-txt').html(obj.optionsFanCon)
            $fan.find('.choose').hide()
        }
        $fan.find('.miaos').val(obj.optionsFanDes);
    })
}


/*判断是否全是空白字符*/
function isEmptyFun(str){
    var reg = /(&nbsp;)/g;
    var arr = str.match(reg);
    if(arr){
        for(var i = 0; i < arr.length; i++){
            str = str.replace(arr[i], '')
        }
        if(str.search(/\S/g) === -1){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
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