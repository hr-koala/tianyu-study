$(function(){

$.getJSON("data/main.json" ,function(data,status){
    console.log(data);
    vm.$data.title = data.questionTitle;
    vm.$data.animateType = data.animateType;
    vm.$data.isAutoPlayFlag = data.isAutoPlayFlag;
    vm.$data.playTime = data.playTime;
    vm.$data.questionList = data.questionList;
    setTimeout(function(){
        startInitHtml(data.questionList)
        vm.init()
    }, 100)
}).error(function() {
    vm.init()
    vm.initYeziData()
});

vm = new Vue({
    el: '#all',
    data: {
        title: '', //标题
        isAutoPlayFlag: true, //是否自动播放动画
        playTime: 5, //播放时间
        animateType: 1, //默认动画效果 1：推进   2：缩放   3：擦除  4：溶解
        animArr: ['推进', '缩放', '擦除', '溶解'],
        questionList: [], //所有叶子的数据
        currentObj: {}, //当前叶子的数据
        currentIndex: '', //当前叶子的下标
    },
    methods: {
        init: function(){
            $('.con-right .content').textEdit({
                inpElement: '.con-right .content', //输入框类名
                parentElement: '.home', //文本编辑器的父元素类名， 不传默认body
            })
        },
        /*初始化叶子数据*/
        initYeziData: function(){
            var arr = [];
            for(var i = 0; i < 10; i++){
                arr.push({
                    title: '', //叶子的输入内容
                    optionsTitle: '', //编辑标题
                    optionsText: '', //编辑内容
                    optionsType: '', //添加的元素格式 image  text  video  audio
                    optionsCon: '', //添加的元素内容
                    id: i + 1
                })
            }
            this.questionList = arr;
        },
        /*选择叶子*/
        chooseLeafIndex: function(e){
            var $box = $(e.target).closest('.box');
            var index = $box.data('index');
            $box.find('input').focus()
            this.initLeafData(index)
        },
        /*初始化叶子数据*/
        initLeafData: function(index){
            if(this.currentIndex || this.currentIndex === 0){
                this.questionList[this.currentIndex] = this.currentObj
            }
            this.currentIndex = index;
            this.currentObj = this.questionList[index];
            $('.tree .box').eq(index).addClass('on').siblings().removeClass('on')
            if(this.currentObj.optionsType === 'text'){
                $('.con-right .cmain .text .content').html(this.currentObj.optionsCon)
            }
            $('.con-right .cinfo .content').html(this.currentObj.optionsText)
        },
        /*输入叶子上的文字*/
        inputLearTitle: function(e){
            this.currentObj.title = e.target.value;
        },
        /*输入编辑标题*/
        inputOptionsTitle: function(e){
            if(this.currentIndex || this.currentIndex === 0){
                this.currentObj.optionsTitle = e.target.value;
            }else{
                errorFun('请先选择要操作的叶子')
                e.target.value = '';
            }
        },
        /*输入编辑内容*/
        inputOptionsText: function(e){
            if(this.currentIndex || this.currentIndex === 0){
                this.currentObj.optionsText = $(e.target).html();
            }else{
                errorFun('请先选择要操作的叶子')
                $(e.target).html('')
            }
        },
        /*选择添加文字*/
        chooseAddTextType: function(){
            if(this.currentIndex || this.currentIndex === 0){
                this.currentObj.optionsType = 'text';
                $('.con-right .cmain .text .content').html('')
                setTimeout(function(){$('.con-right .cmain .text .content').focus()}, 10)
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
        /*删除当前叶子上的所有内容*/
        delLeafFun: function(e){
            var $box = $(e.target).closest('.box');
            var index = $box.data('index');
            this.currentObj.optionsTitle = '';
            this.currentObj.optionsText = '';
            this.delOptionsType()
            this.currentObj.class = '';
            this.currentObj.title = '';
            this.questionList[index] = this.currentObj;
            this.currentIndex = '';
            $('.con-right .cinfo .content').html('')
            $box.find('input').val('')
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



$('.con-right').on('click', '.choose ul li', function(){
    if(!vm.$data.currentIndex && vm.$data.currentIndex !== 0){
        errorFun('请先选择要操作的叶子')
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
    var title = vm.$data.title;
    if(title === ''){
        title = $('#title').attr('placeholder')
    }
    var arr = [];
    var list = vm.$data.questionList;
    list[vm.$data.currentIndex] = vm.$data.currentObj;
    for(var i = 0; i < list.length; i++){
        if(list[i].title !== '' && list[i].optionsType !== '' && list[i].optionsCon !== ''){
            if(isEmptyFun(list[i].title) || isEmptyFun(list[i].optionsCon)){
                errorFun('有选项全是空白字符')
                vm.initLeafData(i)
                return 'error=有选项全是空白字符';
            }
            var $box = $('#b' + list[i].id);
            var cla = $box.data('class')
            list[i].class = cla;
            arr.push(list[i])
        }else{
            if(list[i].title == '' && list[i].optionsTitle == '' && list[i].optionsType == '' && list[i].optionsCon == ''){
            }else{
                errorFun('有选项未填写')
                vm.initLeafData(i)
                return 'error';
            }
        }
    }
    if(arr.length < 1){
        errorFun('最少要有一个叶子上有内容')
        return 'error';
    }
    
    var subData = {
        questionType: 'zhishishu', //习题类型定义
        questionTitle: title, //题干
        questionList: arr,
        isAutoPlayFlag: vm.$data.isAutoPlayFlag, //是否自动播放动画
        playTime: vm.$data.playTime, //播放时间
        animateType: vm.$data.animateType,
    }
    return subData
}


//若有历史数据则初始化html
function startInitHtml(list){
    var box = $('.tree .list .box');
    $.each(box, function(is, el){
        var id = $(el).data('id');
        var obj = {};
        for(var i = 0; i < list.length; i++){
            if(id === list[i].id){
                obj = list[i];
                break;
            }
        }
        if(obj.id){
            $(el).find('input').val(obj.title)
        }else{
            var obj1 = {
                title: '', //叶子的输入内容
                optionsTitle: '', //编辑标题
                optionsText: '', //编辑内容
                optionsType: '', //添加的元素格式 image  text  video  audio
                optionsCon: '', //添加的元素内容
                id: id
            }
            list.splice(is, 0, obj1)
        }
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

})