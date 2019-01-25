$(function(){

$.getJSON("data/main.json" ,function(data,status){
    console.log(data);
    vm.$data.title = data.questionTitle;
    vm.$data.animateType = data.animateType;
    vm.$data.isAutoPlayFlag = data.isAutoPlayFlag;
    vm.$data.playTime = data.playTime;
    vm.$data.questionList = data.questionList;
    vm.$data.rotaryNum = data.questionList.length;
    setTimeout(function(){
        vm.init()
        vm.initLeafData(0)
        drawTabel(1)
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
        questionList: [], //所有的数据
        currentObj: {}, //当前的数据
        currentIndex: '', //当前的下标
        rotaryNum: 8, //转盘个数
        anglePostArr: [], //角度位置信息
    },
    computed: {
        /*当前序号*/
        currentNum: function(){
            var str = this.currentIndex + 1;
            if(str < 10){
                str = '0' + str;
            }
            return str;
        }
    },
    methods: {
        init: function(){
            $('.con-right .content').textEdit({
                inpElement: '.con-right .content', //输入框类名
                parentElement: '.home', //文本编辑器的父元素类名， 不传默认body
            })
        },
        /*初始化转盘数据*/
        initYeziData: function(){
            var arr = [];
            for(var i = 0; i < this.rotaryNum; i++){
                arr.push({
                    optionsTitle: '', //编辑标题
                    optionsText: '', //编辑内容
                    optionsType: '', //添加的元素格式 image  text  video  audio
                    optionsCon: '', //添加的元素内容
                    id: i + 1
                })
            }
            this.questionList = arr;
            this.initLeafData(0)
        },
        /*初始化转盘数据*/
        initLeafData: function(index){
            if(this.currentIndex || this.currentIndex === 0){
                this.questionList[this.currentIndex] = this.currentObj
            }
            this.currentIndex = index;
            this.currentObj = this.questionList[index];
            $('.rotary .list .box').eq(index).addClass('on').siblings().removeClass('on')
            if(this.currentObj.optionsType === 'text'){
                $('.con-right .cmain .text .content').html(this.currentObj.optionsCon)
            }
            $('.con-right .cinfo .content').html(this.currentObj.optionsText)
            $('.rotary .icon-refresh .inp-txt').html(this.currentObj.optionsTitle)
        },
        /*输入编辑标题*/
        inputOptionsTitle: function(e){
            if(this.currentIndex || this.currentIndex === 0){
                this.currentObj.optionsTitle = e.target.value;
                $('.rotary .icon-refresh .inp-txt').html(e.target.value)
            }else{
                errorFun('请先选择要操作的转盘')
                e.target.value = '';
            }
        },
        /*输入编辑内容*/
        inputOptionsText: function(e){
            if(this.currentIndex || this.currentIndex === 0){
                this.currentObj.optionsText = $(e.target).html();
            }else{
                errorFun('请先选择要操作的转盘')
                $(e.target).html('')
            }
        },
        /*选择添加文字*/
        chooseAddTextType: function(e){
            e.preventDefault()
            e.stopPropagation()
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
        /*减转盘个数*/
        subRotaryNumFun: function(){
            if(this.rotaryNum > 4){
                var index = "";
                var list = this.questionList;
                for(var i = 0; i < list.length; i++){
                    if(list[i].optionsTitle == '' && list[i].optionsText == '' && list[i].optionsCon == ''){
                        index = i;
                        break;
                    }
                }
                if(index || index === 0){
                    this.rotaryNum -= 1;
                    list.splice(index, 1)
                    this.questionList = list;
                    drawTabel(1)
                }
            }
        },
        /*加转盘个数*/
        addRotaryNumFun: function(){
            if(this.rotaryNum < 10){
                this.rotaryNum += 1;
                this.questionList.push({
                    optionsTitle: '', //编辑标题
                    optionsText: '', //编辑内容
                    optionsType: '', //添加的元素格式 image  text  video  audio
                    optionsCon: '', //添加的元素内容
                    id: this.rotaryNum
                })
                drawTabel(1)
            }
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



window.onresize =function(){
    if(IsPC()){
        initWidth()
        drawTabel(1)
    }
}

//选中转盘中的某一个
//点击输入框
$('.rotary .icon-refresh .inp-txt').on('input', function(e){
    e.preventDefault();
    e.stopPropagation()
    if(vm.$data.currentIndex || vm.$data.currentIndex === 0){
        var str = $(this).html()
        vm.$data.currentObj.optionsTitle = str;
    }
})
/*点击圆 选中转盘中的某一个*/
$('.rmain').on('click', function(e){
    e.preventDefault();
    e.stopPropagation()
    var x = e.pageX - $('#myCanvas').offset().left;
    var y = e.pageY - $('#myCanvas').offset().top;
    var index = insideCircle(x, y)
    if(index || index === 0){
        vm.initLeafData(index)
    }
    drawTabel()
})

//转盘输入
$('.rotary .list').on('input', '.box .b-int', function(e){
    e.preventDefault();
    e.stopPropagation()
    vm.$data.currentObj.title = $(this).html();
})




$('.con-right').on('click', '.choose ul li', function(){
    if(!vm.$data.currentIndex && vm.$data.currentIndex !== 0){
        errorFun('请先选择要操作的转盘')
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
        if(list[i].optionsType !== '' && list[i].optionsCon !== ''){
            if(isEmptyFun(list[i].optionsCon)){
                errorFun('有选项全是空白字符')
                vm.initLeafData(i)
                return 'error=有选项全是空白字符';
            }
            arr.push(list[i])
        }else{
            if(list[i].optionsTitle == '' && list[i].optionsType == '' && list[i].optionsCon == ''){
            }else{
                errorFun('有选项未填写')
                vm.initLeafData(i)
                drawTabel()
                return 'error';
            }
        }
    }
    if(arr.length < 3){
        errorFun('最少要有3个有内容')
        return 'error';
    }
    
    var subData = {
        questionType: 'zhuanpan', //习题类型定义
        questionTitle: title, //题干
        questionList: arr,
        isAutoPlayFlag: vm.$data.isAutoPlayFlag, //是否自动播放动画
        playTime: vm.$data.playTime, //播放时间
        animateType: vm.$data.animateType,
    }
    return subData
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


//画图
$(function(){
    myCanvas = document.getElementById('myCanvas');
    ctx = myCanvas.getContext("2d");
    var color = ['#D9EEFF', '#E6F4FF', '#C6E5FF'];
    //中间圆的半径
    var midR = $('.rotary .icon-refresh').innerWidth() / 2;

    initWidth = function(){
        width_bg = $('.rotary').width();
        height_bg = $('.rotary').height()
        r_bg = Math.min(width_bg, height_bg) / 2;
        x = width_bg / 2;
        y = height_bg / 2;
        myCanvas.width = width_bg;
        myCanvas.height = height_bg;
    }
    initWidth()

    //画转盘
    drawTabel = function(state){
        ctx.clearRect(0, 0, width_bg, height_bg)
        ctx.beginPath();
        ctx.arc(x, y, r_bg, 0, 2*Math.PI);
        ctx.fillStyle="#90caf9";
        ctx.fill()
        ctx.closePath()
        
        if(state == 1){
            getArcAngleData()
            
        }
        drawPartArc()
        initBoxHtml()
    }
    drawTabel(1)

    //判断是否在圆内
    insideCircle = function(x, y){
        var arr = vm.$data.anglePostArr;
        var index = '';
        for(var i = 0; i < arr.length; i++){
            ctx.clearRect(0, 0, width_bg, height_bg)
            var obj = arr[i];
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, obj.r, obj.sa, obj.ea);
            ctx.arc(obj.x, obj.y, midR, obj.ea, obj.sa, true);
            ctx.closePath();
            if (ctx.isPointInPath(x,y)){
                index = i;
                break;
            }
        }
        ctx.clearRect(0, 0, width_bg, height_bg)
        return index;
    }

    

    //画转盘上的角度圆
    function drawPartArc(){
        var len = vm.$data.rotaryNum;
        var arr = vm.$data.anglePostArr;
        for(var i = 0; i < len; i++){
            var obj = arr[i];
            ctx.beginPath();
            ctx.lineTo(obj.x, obj.y)
            ctx.arc(obj.x, obj.y, obj.r, obj.sa, obj.ea);
            ctx.closePath()
            if(vm.$data.currentIndex === i){
                ctx.fillStyle = '#42a5f5';
            }else{
                ctx.fillStyle = obj.color;
            }
            ctx.fill()
        }
    }

    //初始化转盘上方框的位置和个数
    function initBoxHtml(){
        var arr = vm.$data.anglePostArr;
        var len = vm.$data.rotaryNum;
        var jr = parseInt(r_bg / 1.45);
        var h = 40;
        var list = vm.$data.questionList;
        for(var i = 0; i < len; i++){
            var c_angle = (arr[i].sa + arr[i].ea) / 2;
            var y1 = parseInt(jr * Math.sin(c_angle)) + y; 
            var x1 = parseInt(jr * Math.cos(c_angle)) + x;
            var str = i + 1;
            if(str < 10){
                str = "0" + str;
            }
            ctx.save();
            ctx.beginPath();
            ctx.textBaseline="middle";
            ctx.textAlign="center"; 
            ctx.font="30px Arial";
            if(vm.$data.currentIndex === i){
                ctx.fillStyle = '#fff';
            }else{
                ctx.fillStyle = '#888';
            }
            
            ctx.fillText(str, x1, y1); 
            ctx.fill()
            ctx.restore();
        }
    }


    //得到角度路径
    function getArcAngleData(){
        var len = vm.$data.rotaryNum;
        var angel = (2 * Math.PI / 360) * (360 / len);
        var startAngel = 2 * Math.PI / 360 * (-90)
        var endAngel = 2 * Math.PI / 360 * (-90) + angel
        var c = 0;
        var arr = [];
        var r = r_bg - 8;
        for(var i = 0; i < len; i++){
            if(i === len - 1 && c === 0){
                c++;
            }
            var y1 = parseInt(midR * Math.sin(startAngel)) + y; 
            var x1 = parseInt(midR * Math.cos(startAngel)) + x;
            var y2 = parseInt(midR * Math.sin(endAngel)) + y; 
            var x2 = parseInt(midR * Math.cos(endAngel)) + x;
            arr.push({
                r: r,
                sa: startAngel,
                ea: endAngel,
                x: x,
                y: y,
                index: i,
                color: color[c],
                sx: x1,
                sy: y1,
                ex: x2,
                ey: y2
            })
            startAngel = endAngel
            endAngel += angel
            if(c < color.length - 1){
                c++
            }else{
                c = 0;
            }
        }
        vm.$data.anglePostArr = arr;
    }
})




//判断是移动端还是PC端
function IsPC() {
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


/*
function initBoxHtml(){
        var arr = vm.$data.anglePostArr;
        var len = vm.$data.rotaryNum;
        var html = '';
        var jr = parseInt(r_bg / 3);
        var w = parseInt(r_bg / 2);
        var h = 40;
        var list = vm.$data.questionList;
        for(var i = 0; i < len; i++){
            var c_angle = (arr[i].sa + arr[i].ea) / 2;
            var y1 = parseInt(jr * Math.sin(c_angle)) + y; 
            var x1 = parseInt(jr * Math.cos(c_angle)) + x;
            var cen = c_angle / Math.PI;
            var w1 = w, h1 = h;
            if(cen < 0){
                cen += 2;
            }
            if((cen >= 0.25 && cen < 0.75) || (cen >= 1.25 && cen < 1.75)){
                w1 = h;
                h1 = w;
            }
            if(cen >= 1){
                y1 -= h1
            }
            if(cen >= 0.5 && cen < 1.5){
                x1 -= w1;
            }
            var str = "";
            if(list[i] && list[i].title){
                str = list[i].title;
            }
            var cla = "";
            if(vm.$data.currentIndex === i){
                cla = 'on'
            }
            html += '<div class="box '+ cla +'" style="top: '+ y1 +'px; left: '+ x1 +'px; width: '+ w1 +'px; height: '+ h1 +'px;" data-index="'+ i +'"><div class="b-int" contenteditable="true" placeholder="编辑内容">' + str + '</div></div>';
        }
        $('.rotary .list').html(html)
    }
 */