$(function(){

$.getJSON("data/main.json" ,function(data,status){
    vm.$data.site = data
    vm.initData()
}).error(function() {
    vm.initData()
});
var sitime;
vm = new Vue({
    el: '#all',
    data: {
        title: '', //标题
        site: {}, //存放的数据
        questionList: [], //所有叶子的数据
        currentObj: {}, //当前叶子的数据
        currentIndex: '', //当前叶子的下标
        playTime: '', //播放时间
        isRotaryFlag: false, //转盘是否正在转
        currAnim: {}, //当前动画参数
        anglePostArr: [], //角度参数
        currentAngle: 0, //当前旋转的角度
    },
    computed: {
        /*动画参数*/
        animArr: function(){
            var obj = {
                1: {name: 'drop', option: {direction: 'right'}},
                2: {name: 'scale', option: {}},
                3: {name: 'blind', option: {direction: 'left'}},
                4: {},
            };
            return obj;
        }
    },
    methods: {
        /*初始化页面*/
        initData: function(){
            var str = sessionStorage.getItem('zhuanpan')
            var obj = JSON.parse(str)
            if(obj){
                this.site = obj;
            }
            console.log(this.site);
            this.title = this.site.questionTitle;
            this.questionList = this.site.questionList;
            this.currAnim = this.animArr[this.site.animateType]
            getArcAngleData()
            if(this.site.isAutoPlayFlag){
                this.playTime = this.site.playTime * 1000;
                if(this.site.animateType == 4){
                }
                this.lotteryFun(0)
            }else{
                this.lotteryFun(0)
            }
            drawTabel()
        },
        /*自动播放动画*/
        autoAnimteFun: function(){
            this.currentObj = this.site.questionList[this.currentIndex];
            if(this.site.animateType === 4){
                $('.animate').show(10, this.dissolveShow)
            }else{
                if(this.site.isAutoPlayFlag){
                    $('.animate').show(this.currAnim.name, this.currAnim.option, this.nextAnimFun)
                }else{
                    $('.animate').show(this.currAnim.name, this.currAnim.option)
                }
            }
        },
        /*下一个*/
        addNextNumFun: function(){
            this.currentIndex += 1;
            if(this.currentIndex === this.questionList.length){
                this.currentIndex = 0;
            }
            this.lotteryFun(this.currentIndex)
        },
        /*下一个动画*/
        nextAnimFun: function(){
            var _this = this;
            sitime = setTimeout(function(){
                _this.addNextNumFun()
            }, _this.playTime)
        },
        /*转动转盘*/
        rotaryStart: function(){
            if(this.isRotaryFlag){
                return
            }
            var len = this.site.questionList.length;
            var index = Math.floor(Math.random() * len);
            this.lotteryFun(index, 1)
        },
        /*转盘旋转*/
        lotteryFun: function(index, state){
            clearTimeout(sitime)
            var _this = this;
            var len = this.site.questionList.length;
            var angel = 360 / len;
            var startAngel = angel / 2;
            var cang = index * angel;
            cang = 360 - cang - startAngel
            if(state === 1){
                //随机转
                cang += 720
            }
            // console.log( this.currentAngle % 360+ '   ' + cang);
            // console.log(cang);
            this.isRotaryFlag = true;
            this.currentIndex = '';
            lottery(cang, function(){
                _this.isRotaryFlag = false;
                _this.initBoxData(index, cang)
            })
        },
        /*初始化当前数据*/
        initBoxData: function(index, angel){
            this.currentIndex = index;
            console.log(index);
            drawTabel(angel, index)
            this.hideAnim()
        },
        /*隐藏*/
        hideAnim: function(){
            if(this.site.animateType === 4){
                this.dissolveHide()
            }else{
                $('.animate').hide(this.currAnim.name, this.currAnim.option, 300)
                sitime = setTimeout(this.autoAnimteFun, 400)
            }
        },
        /*溶解 显示 或 隐藏*/
        dissolveShow: function(){
            var _this = this;
            $('.dongh').addClass('dh1')
            sitime = setTimeout(function(){
                $('.dongh').removeClass('dh1')
                if(_this.site.isAutoPlayFlag){
                    _this.nextAnimFun()
                }
            }, 900)
        },
        dissolveHide: function(){
            var _this = this;
            $('.dongh').addClass('dh2')
            sitime = setTimeout(function(){
                $('.dongh').removeClass('dh2')
                _this.autoAnimteFun()
            }, 900)
        },
        dissolveHide1: function(){
            var _this = this;
            $('.dongh').addClass('dh2')
            sitime = setTimeout(function(){
                $('.dongh').removeClass('dh2')
                _this.rotaryStart()
            }, 900)
        },
    }
})


/*点击圆 选中转盘中的某一个*/
$('.rmain').on('click', function(e){
    e.preventDefault();
    e.stopPropagation()
    if(vm.$data.isRotaryFlag){
        //正在转
        return
    }
    clearTimeout(sitime)
    var x = e.pageX - $('#myCanvas').offset().left;
    var y = e.pageY - $('#myCanvas').offset().top;
    var index = insideCircle(x, y)
    console.log(index);
    if(index || index === 0){
        vm.lotteryFun(index)
    }else{
        drawTabel(vm.$data.currentAngle, vm.$data.currentIndex)
    }
})

window.onresize =function(){
    if(IsPC()){
        initWidth()
        drawTabel()
    }
}


})




//画图
$(function(){
    myCanvas = document.getElementById('myCanvas');
    ctx = myCanvas.getContext("2d");
    var color = ['#D9EEFF', '#E6F4FF', '#C6E5FF'];
    //中间圆的半径
    var midR = $('.rotary .icon-refresh').outerWidth() / 2;
    

    initWidth = function(){
        width_bg = $('.rotary').width();
        height_bg = $('.rotary').height()
        r_bg = Math.min(width_bg, height_bg) / 2;
        x = width_bg / 2;
        y = height_bg / 2;
        myCanvas.width = width_bg;
        myCanvas.height = height_bg;
        // 画布中心移动到canvas中心
        ctx.translate(x, y)
    }
    initWidth()


    lottery = function(angel, callback){
        angel = angel;
        
        vm.$data.currentAngle = angel;
        // 基值（减速）
        var baseStep = 30
        // 起始滚动速度
        var baseSpeed = 0.3
        // 步长
        var count = 1;
        var _this = this
        var timer = setInterval(function () {
            drawTabel(count)
            if (count == angel) {
                clearInterval(timer)
                if (typeof callback == "function") {
                    callback()
                }
            }
            count = count + baseStep * (((angel - count) / angel) > baseSpeed ? baseSpeed : ((angel - count) / angel))
            if (angel - count < 0.5) {
                count = angel
            }

        }, 25)
    }

    //判断是否在圆内
    insideCircle = function(x, y){
        var arr = vm.$data.anglePostArr;
        var index = '';
        ctx.save()
        ctx.rotate(vm.$data.currentAngle * Math.PI / 180);
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
        ctx.restore()
        return index;
    }
    

    //画转盘
    drawTabel = function(angelTo, index){
        angelTo = angelTo || 0;
        ctx.clearRect(-x, -y, width_bg, height_bg)
        ctx.save()
        ctx.rotate(angelTo * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(0, 0, r_bg, 0, 2*Math.PI);
        ctx.fillStyle="#90caf9";
        ctx.fill()
        ctx.closePath()

        drawPartArc()
        if(index || index === 0){
            drawText(angelTo)
        }else{
            drawText()
        }
        
        ctx.restore();
    }
    

    //画转盘上的角度圆
    function drawPartArc(){
        var arr = vm.$data.anglePostArr;
        // console.log(arr);
        for(var i = 0; i < arr.length; i++){
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

    //画转盘上的文字
    function drawText(angelTo){
        angelTo = angelTo || 0;
        var arr = vm.$data.anglePostArr;
        var len = arr.length;
        var jr = parseInt(r_bg / 1.45);
        var h = 40;
        var list = vm.$data.questionList;
        ctx.save();
        if(angelTo > 0){
            ctx.rotate(-angelTo * Math.PI / 180);
        }
        for(var i = 0; i < len; i++){
            var sa = arr[i].sa + angelTo * Math.PI / 180, ea = arr[i].ea + angelTo * Math.PI / 180;
            var c_angle = (sa + ea) / 2;
            var y1 = parseInt(jr * Math.sin(c_angle)) + 0; 
            var x1 = parseInt(jr * Math.cos(c_angle)) + 0;
            var str = arr[i].index + 1;
            if(str < 10){
                str = "0" + str;
            }
            
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
            
        }
        ctx.restore();
    }


    //得到角度路径
    getArcAngleData = function(){
        var len = vm.$data.site.questionList.length;
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
            var y1 = parseFloat(midR * Math.sin(startAngel)) ; 
            var x1 = parseFloat(midR * Math.cos(startAngel)) ;
            var y2 = parseFloat(midR * Math.sin(endAngel)) ; 
            var x2 = parseFloat(midR * Math.cos(endAngel));
            arr.push({
                r: r,
                sa: startAngel,
                ea: endAngel,
                x: 0,
                y: 0,
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
function drawText(){
        var list = vm.$data.site.questionList;
        var len = list.length;
        var angel = (2 * Math.PI / 360) * (360 / len);
        var startAngel = angel/2;
        var arr = vm.$data.anglePostArr;
        for(var i = 0; i < len; i++){
            ctx.save();
            ctx.beginPath();
            ctx.rotate(startAngel)
            ctx.textBaseline="middle";
            ctx.textAlign="center"; 
            if(vm.$data.currentIndex === i){
                ctx.fillStyle = '#fff';
                ctx.font="30px Arial";
            }else{
                ctx.font="22px Arial";
                ctx.fillStyle = '#888';
            }
            ctx.fillText(list[i].title, 0, -r_bg + 40); 
            ctx.fill()
            startAngel += angel
            ctx.restore();
        }
    }
 */