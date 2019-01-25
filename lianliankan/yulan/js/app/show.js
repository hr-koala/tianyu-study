$(function(){


var site  //题目信息

var answer = [] //回答的答案
var startDate = new Date()

//需要提交的数据
subData = {
    questionType: 'LinkGame', 
    checkNum: 0, 
    times: 0, 
    startTime: getDateTime(startDate), 
    endTime: '',
    userId: "000000000",                                // 预留字段固定
    userName: "cap",                                   // 预留字段固定
    platformCode: "133241",                            // 预留字段固定
    loginPlatformCode: "loginPlatformCode",            // 预留字段固定
    userSessionId: "userSessionId",   
    objectType: '',
    objectId:'',
    title:'',
    isSuccess: false,
    userAnswerList: []
} 

$.getJSON("config/settings.json" ,function(data,status){
    vm.$data.settings = data
    vm.startUpdataFun()
})

$.getJSON("data/main.json" ,function(data,status){
    vm.$data.site = data
    vm.startDateFun()
})


vm = new Vue({
    el: '#all',
    data: {
        title: '',
        site: {},
        settings: {},
        nums: 0,//总个数
        num:0,//回答的个数
        map: [], //存放选项信息的二维数组
        be_is: -1, //上一个点击index的值
        pos: {}, //上一个在二维数组中的位置
        mapPos: [], //二维数组的坐标
    },
    methods: {
        startUpdataFun: function(){
            if(this.settings.showAnswer){
                $('.show-answer').css('display', 'inline-block')
            }else{
                $('.show-answer').css('display', 'none')
            }
            if(this.settings.showCheck){
                $('.check').css('display', 'inline-block')
            }else{
                $('.check').css('display', 'none')
            }
            if(this.settings.showSubmit){
                $('.submit').css('display', 'inline-block')
            }else{
                $('.submit').css('display', 'none')
            }
            if(this.settings.showReset){
                $('.reset').css('display', 'inline-block')
            }else{
                $('.reset').css('display', 'none')
            }
            $('#theme').attr('href', 'css/theme' + this.settings.theme + '.css')
        },
        startDateFun: function(){
            var str = sessionStorage.getItem('LinkGame')
            var obj = JSON.parse(str)
            if(obj === null){
                site = this.site
            }else{
                site = obj
            }
            console.log(site);
            // this.title = site.questionTitle
            var str = site.questionTitle
            var arr = str.match(/\n/g)
            if(str.search(/\n/g) >= 0){
                $.each(arr, function(is, el){
                    str = str.replace(/\n/, '<br>')
                })
                // this.title = str
                $('.title').html(str)
            }else{
                $('.title').html(str)
            }
            this.nums = site.questionList.length
            subData.guessWordId = site.guessWordId || ''
            startFun(site.questionList)
        },
        newData : function() {
            var result = [];
            //设置二维数组
            var otr = $('.tables tr')
            for(var i = -1; i < otr.length + 1; i++){
                var arr = []
                if(i === -1 || i === otr.length){
                    arr = [0, 0, 0, 0, 0, 0]
                }else{
                    var otd = $(otr[i]).children('td')
                    for(var j = -1; j < otd.length + 1; j++){
                        if(j === -1 || j === otd.length){
                            arr.push(0)
                        }else{
                            if($(otd[j]).children().length === 0){
                                arr.push(0)
                            }else{
                                var is = $(otd[j]).children().data('index')
                                arr.push(is + 1)
                            }
                        }
                    }
                }
                result.push(arr)
            }
            this.map = result;
            var mapPos = [];
            $.each(result, function(is, it){
                var a = [];
                $.each(it, function(cis, cit){
                    if(cit === 0){
                        a.push(0)
                    }else{
                        a.push({
                            x: cis,
                            y: is,
                            num: cit
                        })
                    }
                })
                mapPos.push(a)
            })
            console.log(mapPos);
            this.mapPos = mapPos;
            otherFun()
        }
    }
})


//页面初始化
function startFun(data){
    var ron = getArr(20)//得到随机数组
    var oli = $('.left td')
    var r = 0
    $.each(data, function(is, item){
        var dl = ''
        var dr = ''
        if(item.optionLeftType === 'text'){
            dl = '<div class="tag" data-index="'+ is +'">'+ item.optionLeftCon +'</div>'
        }else{
            dl = '<img class="tag" data-index="'+ is +'" src="'+ item.optionLeftCon +'">'
        }
        if(item.optionRightType === 'text'){
            dr = '<div class="tag" data-index="'+ is +'">'+ item.optionRightCon +'</div>'
        }else{
            dr = '<img class="tag" data-index="'+ is +'" src="'+ item.optionRightCon +'">'
        }
        $(oli[ron[r]]).html(dl)
        $(oli[ron[r]]).addClass('td1')
        $(oli[ron[++r]]).html(dr)
        $(oli[ron[r]]).addClass('td1')
        r++
    })
    vm.newData()
    if(site.optionType){
        var otd = $('.left .td1')
        $('.left .td1').append('<div class="fanzhuan"></div>')
    }
}

$('.left').on('click', '.tag1', function(){
    //是否有内容
    if($(this).html() === ''){
        return
    }
    //是否重复点击
    if($(this).hasClass('td-bd')){
        $(this).removeClass('td-bd')
        return
    }
    //是否要翻牌
    if(site.optionType){
        $(this).children('.fanzhuan').css('transform', 'rotateY(90deg)')
    }
    $(this).addClass('td-bd')
    if(vm.$data.be_is === -1){//是否只点了一个
        vm.$data.be_is = $(this).children().data('index')
        vm.$data.pos = {
            x: $(this).index() + 1,
            y: $(this).parent().index() + 1
        }
        return
    }else{
        var obj = {
            x: $(this).index() + 1,
            y: $(this).parent().index() + 1
        }
        console.log(obj);
        var is = $($(this).children()[0]).data('index')
        //是否为一对
        if((vm.$data.pos.x === obj.x && vm.$data.pos.y === obj.y) || vm.$data.be_is !== is){
            //不是一对
            var otd = $('.tables td')
            var i1 = vm.$data.pos.x - 1 + (vm.$data.pos.y - 1) * 4
            var i2 = obj.x -1 + (obj.y -1) * 4
            vm.$data.pos = {}
            vm.$data.be_is = -1
            if(site.optionType){
                setTimeout(function(){
                    $(otd[i1]).children('.fanzhuan').css('transform', 'rotateY(0deg)')
                    $(otd[i2]).children('.fanzhuan').css('transform', 'rotateY(0deg)')
                    $(otd[i1]).removeClass('td-bd')
                    $(otd[i2]).removeClass('td-bd')
                }, 1100)
            }else{
                setTimeout(function(){
                    $(otd[i1]).removeClass('td-bd')
                    $(otd[i2]).removeClass('td-bd')
                }, 500)
            }
            shibaiFun(otd[i1], otd[i2])
            return
        }
        // console.log(obj);
        // console.log(vm.$data.pos);
        var res = canConnect(obj, vm.$data.pos)
        //是否有链接路径
        if(res){
            //有
            var one = getIds(obj);
            var two = getIds(vm.$data.pos);
            var otd = $('.tables td');
            console.log(res);
            //删除mapPos中对应的值
            // var mapPos = vm.$data.mapPos;
            vm.$data.mapPos[obj.y][obj.x] = 0;
            vm.$data.mapPos[vm.$data.pos.y][vm.$data.pos.x] = 0;
            
            var dl = '';
            var dr = '';
            var item = site.questionList[is];
            //消除成功在左边显示出来
            if(item.optionLeftType === 'text'){
                dl = '<div data-index="'+ is +'">'+ item.optionLeftCon +'</div>'
            }else{
                dl = '<img data-index="'+ is +'" src="'+ item.optionLeftCon +'">'
            }
            if(item.optionRightType === 'text'){
                dr = '<div data-index="'+ is +'">'+ item.optionRightCon +'</div>'
            }else{
                dr = '<img data-index="'+ is +'" src="'+ item.optionRightCon +'">'
            }
            var div = '<div class="r-row">' +
                        '<div class="r-tag">'+ dl +'</div>' +
                        '<div class="r-xian"></div>' +
                        '<div class="r-tag">'+ dr +'</div>' +
                      '</div>'
            if(site.optionType){//有翻牌效果
                setTimeout(function(){
                    $('.r-main').append(div)
                    $(otd[one]).addClass('an')
                    $(otd[two]).addClass('an')
                    setTimeout(function(){
                        $(otd[one]).html('')
                        $(otd[one]).removeClass('td1')
                        $(otd[one]).removeClass('an')
                        $(otd[two]).html('')
                        $(otd[two]).removeClass('td1')
                        $(otd[two]).removeClass('an')
                        $(otd[one]).removeClass('td-bd')
                        $(otd[two]).removeClass('td-bd')
                        if(vm.$data.num + 1 < vm.$data.nums){
                            otherFun()
                        }
                    }, 999)
                }, 1100)
            }else{
                $('.r-main').append(div)
                $(otd[one]).addClass('an')
                $(otd[two]).addClass('an')
                setTimeout(function(){
                    $(otd[one]).html('')
                    $(otd[one]).removeClass('td1')
                    $(otd[one]).removeClass('an')
                    $(otd[two]).html('')
                    $(otd[two]).removeClass('td1')
                    $(otd[two]).removeClass('an')
                    $(otd[one]).removeClass('td-bd')
                    $(otd[two]).removeClass('td-bd')
                    if(vm.$data.num + 1 < vm.$data.nums){
                        otherFun()
                    }
                }, 999)
            }
            lineFun(res)
            vm.$data.num++
            setMap(obj)
            setMap(vm.$data.pos)
        }else{
            var otd = $('.tables td')
            var i1 = vm.$data.pos.x - 1 + (vm.$data.pos.y - 1) * 4
            var i2 = obj.x -1 + (obj.y -1) * 4
            if(site.optionType){
                setTimeout(function(){
                    $(otd[i1]).children('.fanzhuan').css('transform', 'rotateY(0deg)')
                    $(otd[i2]).children('.fanzhuan').css('transform', 'rotateY(0deg)')
                    $(otd[i1]).removeClass('td-bd')
                    $(otd[i2]).removeClass('td-bd')
                }, 1100)
            }else{
                setTimeout(function(){
                    $(otd[i1]).removeClass('td-bd')
                    $(otd[i2]).removeClass('td-bd')
                }, 600)
            }
            shibaiFun(otd[i1], otd[i2])
            
        }
        
        vm.$data.pos = {}
        vm.$data.be_is = -1
    }
})

function getIds(obj){
    var one = (obj.x - 1) + 4 * (obj.y - 1)
    return one
}

function setMap(obj){
    vm.$data.map[obj.y][obj.x] = 0
}

//消除失败时的动画
function shibaiFun(a, b){
    $(a).addClass('shib')
    $(b).addClass('shib')
    setTimeout(function(){
        $(a).removeClass('shib')
        $(b).removeClass('shib')
    }, 400)
}

//判断剩下的是否有可以消除的
function otherFun(){
    var mapPos = vm.$data.mapPos;
    var flag = false;
    var map = [];
    for(var i = 0, len = mapPos.length; i < len; i++){
        var arr = mapPos[i];
        for(var j = 0, clen = arr.length; j < clen; j++){
            if(arr[j] !== 0){
                map.push(arr[j])
            }
        }
    }
    // console.log(map);
    var len = map.length
    for(var i = 0; i < len; i++){
        var fl = false;
        for(var j = i+1; j < len; j++){
            if(map[i].num === map[j].num){
                var res = canConnect(map[i], map[j])
                if(res){
                    // console.log(i + ' --- '+ j);
                    fl = true;
                }
                break;
            }
        }
        if(fl){
            flag = true;
            break;
        }
    }
    if(flag){
        console.log('有可以消除');
    }else{
        $('.succ').show()
        $('.succ').html('没有可以进行消除的了');
        setTimeout(function(){
            $('.succ').hide()
            portionFun()
        }, 1000)
    }
}

//连线
var tdpost = {
    w: $('.left .tables tr td').outerWidth(),
    h: $('.left .tables tr td').outerHeight()
}
tdpost.mr = parseInt($('.left .tables tr td').css('margin-right'))
tdpost.canvasT = Math.abs(parseInt($('.canvas').css('top')));
tdpost.canvasL = Math.abs(parseInt($('.canvas').css('left')));
tdpost.canvasW = $('.canvas').width();
tdpost.canvasH = $('.canvas').height();
var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
function lineFun(res){
    //两个图片的坐标
    var start = res[0];
    var end = res[res.length - 1];
    var can = [];
    $.each(res, function(is, it){
        var x1 = 0, y1 = 0;
        if(it.x === 0){
            x1 = 5;
        }else if(it.x === 5){
            x1 = tdpost.canvasW - 5;
        }else{
            x1 = tdpost.canvasL + (it.x - 1) * (tdpost.w + tdpost.mr) + tdpost.w/2;
        }
        if(it.y === 0){
            y1 = 5;
        }else if(it.y === 6){
            y1 = tdpost.canvasH - 5;
        }else{
            y1 = tdpost.canvasT + (it.y - 1) * (tdpost.h + tdpost.mr) + tdpost.h/2;
        }
        can.push({
            x: x1,
            y: y1
        })
    })
    // console.log(can);
    if(start.x === end.x || start.y === end.y){
        //是一条直线
        if(Math.abs(start.y - end.y) === 1 || Math.abs(start.x - end.x) === 1){
            //代表两个图片相邻
            var arr = [];
            arr[0] = can[0];
            arr[1] = can[can.length - 1];
            draw(arr)
        }else{
            draw(can)
        }
    }else{
        draw(can)
    }
}

//画线
function draw(arr){
    ctx.beginPath();
    ctx.moveTo(arr[0].x, arr[0].y);
    for(var i = 1; i < arr.length; i++){
        ctx.lineTo(arr[i].x, arr[i].y);
    }
    ctx.strokeStyle="#FF0000";
    ctx.stroke();
    lineClear();
}
function lineClear(){
    setTimeout(function(){
        ctx.clearRect(0, 0, tdpost.canvasW, tdpost.canvasH)
    }, 900)
}


   

function canConnect(obj, target) {
    //循环obj的y轴相等 ， obj.x旁边所有数据为0的元素;
    //判断两个图片是否相邻
    if((obj.x === target.x && Math.abs(target.y - obj.y) === 1) || (obj.x === target.x && Math.abs(target.y - obj.y) === 1)){
        var result = [];
        result.push(obj)
        result.push(obj)
        result.push(target)
        result.push(target)
        return result;
    }
    var map = vm.$data.map;
    // console.log(map);
    var getX = function(obj) {
        var result = [];
        //循环找出在X附近为0的元素;
        for (var i = obj.x + 1; i < map[0].length; i++) {
            if (map[obj.y][i] == 0) {
                result.push({
                    x: i,
                    y: obj.y
                })
            } else {
                break
            }
        };
        for (var i = obj.x - 1; i >= 0; i--) {
            if (map[obj.y][i] == 0) {
                result.push({
                    x: i,
                    y: obj.y
                })
            } else {
                break
            }
        };
        return result
    };
    //循环obj的x轴相等， obj.y旁边所有数据为0的元素;
    var getY = function(obj) {
        var result = [];
        for (var i = obj.y + 1; i < map.length; i++) {
            if (map[i][obj.x] == 0) {
                result.push({
                    x: obj.x,
                    y: i
                })
            } else {
                break
            }
        };
        for (var i = obj.y - 1; i >= 0; i--) {
            if (map[i][obj.x] == 0) {
                result.push({
                    x: obj.x,
                    y: i
                })
            } else {
                break
            }
        };
        return result
    };
    var arr0 = Array.prototype.concat.call([], getX(obj), obj, getY(obj)).filter(function(obj) {
        return !!obj
    });
    console.log(arr0);
    var arr1 = Array.prototype.concat.call([], getX(target), target, getY(target)).filter(function(obj) {
        return !!obj
    });
    for (i = 0; i < arr0.length; i++) {
        for (var j = 0; j < arr1.length; j++) {
            if (dirConnect(arr0[i], arr1[j])) {
                return [obj, arr0[i], arr1[j], target]
            }
        }
    };
    return false
}

/**
 * @desc 判断元素是否可以直接连接
 * @param [{x:1,y:1},{x:1,y:1}]
 * @return false || true
 * */
function dirConnect(obj, target) {
    //row是x轴 列
    //col是y轴 行
    var map = vm.$data.map;
    var min = 0,
        max = 0,
        sum = 0;
    if (obj.y === target.y) {
        if (obj.x < target.x) {
            min = obj.x;
            max = target.x
        } else {
            min = target.x;
            max = obj.x
        };
        for (var i = min; i <= max; i++) {
            sum += map[obj.y][i]
        };
        if (sum === (map[obj.y][obj.x] + map[target.y][target.x])) {
            return true
        } else {
            return false
        }
    };
    if (obj.x === target.x) {
        if (obj.y < target.y) {
            min = obj.y;
            max = target.y
        } else {
            min = target.x;
            max = obj.y
        };
        for (i = min; i <= max; i++) {
            sum += map[i][obj.x]
        };
        if (sum === (map[obj.y][obj.x] + map[target.y][target.x])) {
            return true
        } else {
            return false
        }
    }
}



//部分重置
function portionFun(){
    
    if(vm.$data.num === 0){
        $('.tables td').html('')
        $('.tables td').removeClass('td1')
        $('.tables td').removeClass('td-bd')
        $('.r-main').html('')
        startFun(site.questionList)
    }else{
        var arr = []
        $.each($('.tables .td1'), function(is, el){
            var n = $(el).children().data('index');
            var fl = true
            for(var i = 0; i < arr.length; i++){
                if(n === arr[i]){
                    fl = false
                    break
                }
            }
            if(fl){
                arr.push(n)
            }
        })
        var data = []
        $.each(arr, function(is, item){
            data.push(site.questionList[parseInt(item)])
        });
        console.log(data);
        $('.tables td').html('')
        $('.tables td').removeClass('td1')
        $('.tables td').removeClass('td-bd')
        startFun(data)
    }
}



//重置
$('.reset').on('click', function(){
    answer = []
    vm.$data.pos = {}
    vm.$data.be_is = -1
    vm.$data.num = 0
    subData.checkNum++
    $('.tables td').html('')
    $('.tables td').removeClass('td1')
    $('.tables td').removeClass('td-bd')
    $('.r-main').html('')
    startFun()
    $('.check').removeClass('bg-cuo')
    $('.check').removeClass('bg-dui')
    $('.show-answer').removeClass('bg-cuo')
    $('.check').removeClass('dian')
    $('.show-answer').removeClass('dian')
})




//提交
$('.submit').on('click', function(){
    getSubFun()
    GetQueryString()
    var endDate = new Date()
    subData.optionNum = site.questionList.length
    subData.endTime = getDateTime(endDate)
    subData.times = comTimeFun(endDate.getTime() - startDate.getTime())

    var str = JSON.stringify(subData)
    console.log(subData);

    $.ajax({
        url: subData.postUrl,
        data: str,
        type: 'post',
        dataType: 'text',
        contentType: 'application/json;charset=UTF-8',
        success: function(res, status, xhr){
            isSuccFun('提交成功')
        },
        error: function(xhr, status, error){
            isSuccFun('提交失败')
        }
     })
    return subData
    
})


function isSuccFun(str){
    $('.succ').html(str)
    $('.succ').fadeIn()
    setTimeout(function(){
        $('.succ').fadeOut()
    }, 3000)
}

function getSubFun(){
    subData.userAnswerList = []
    if(vm.$data.num < vm.$data.nums){
        subData.isSuccess = false
        var arr = []
        $.each($('.r-main .r-row'), function(is, el){
            var obj = {
                optionIndex: $(el).children('.r-tag:first').children().data('index')
            }
            if($(el).children('.r-tag:first').children('img').length === 1){
                obj.optionLeftType = 'image'
                obj.optionLeftCon = $(el).children('.r-tag:first').children('img').attr('src')
            }else if($(el).children('.r-tag:first').children('div').length === 1){
                obj.optionLeftType = 'text'
                obj.optionLeftCon = $(el).children('.r-tag:first').children('div').html()
            }
            if($(el).children('.r-tag:last').children('img').length === 1){
                obj.optionRightType = 'image'
                obj.optionRightCon = $(el).children('.r-tag:last').children('img').attr('src')
            }else if($(el).children('.r-tag:last').children('div').length === 1){
                obj.optionRightType = 'text'
                obj.optionRightCon = $(el).children('.r-tag:last').children('div').html()
            }
            arr.push(obj)
        })
        subData.userAnswerList = arr
    }else{
        subData.isSuccess = true
    }
}


function GetQueryString(){
    var urlSearch = (function() {
        var str = window.location.search.substring(1);
        var oSearch = {};
        // search 为空
        if (!str) return oSearch;
        str.split('&').filter(function(item) {
            return item;
        }).forEach(function(item) {
            var pos = item.indexOf('=');
            // 无值时，赋值为true
            if (pos == -1) {
                oSearch[item] = true;
            } else {
            oSearch[item.substring(0, pos)] = decodeURIComponent(item.substring(pos + 1));
            };
        });
        return oSearch;
    })();

    for(var key in urlSearch){
        subData[key] = urlSearch[key]
    }
}


//时间计算
function comTimeFun(times){
    var mil=(times%1000);//毫秒
    var sec=(Math.floor(times/1000)%60); //秒
    return sec
}

function getDateTime(date){
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
}

//得到一个不重复的随机数组
function getArr(len){
    var arr = []
    for(var i=0; i<len; i++){
        getx(arr, len)
    }
    return arr
}
function getx(arr, len){
    for(var i=0;i>-1;i++){
        var flag = true;
        var num = Math.floor(Math.random()*len);
        for(var i in arr){
            if(arr[i] == num){
                flag= false;
                break;
            }
        }
        if(flag == true){
            arr.push(num);
            return;
        }
    }
}



})