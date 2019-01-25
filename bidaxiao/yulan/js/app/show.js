$(function(){


var site  //题目信息
var symbol =['＞', '≥', '＝', '≤', '＜']
var answer = [] //存放答案
var startDate = new Date()

//需要提交的数据
subData = {
    questionType: 'thenSize', 
    userAnswerList: [],
    optionNum: 0, 
    errorNum: 0,
    trueNum: 0,
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
    title:''
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
        settings: {}
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
            var str = sessionStorage.getItem('thenSize')
            var obj = JSON.parse(str)
            if(obj === null){
                site = this.site
            }else{
                site = obj
            }
            
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
            subData.guessWordId = site.guessWordId || ''
            startFun()
        }
    }
})


//初始化页面
function startFun(){
    var posArr = site.questionList
    var div = ''
	for(var i = 0; i < posArr.length; i++){
    	var conl, conr
    	if(posArr[i].optionLeftType === 'text'){
    		conl = '<p>' + posArr[i].optionLeftCon + '</p>'
    	}else if(posArr[i].optionLeftType === 'image'){
    		conl = '<img src="' + posArr[i].optionLeftCon + '">'
    	}

    	if(posArr[i].optionRightType === 'text'){
    		conr = '<p>' + posArr[i].optionRightCon + '</p>'
    	}else if(posArr[i].optionRightType === 'image'){
    		conr = '<img src="' + posArr[i].optionRightCon + '">'
    	}
    	div += '<div class="col-md-6 jud-md"><div class="jud-box">'+ conl +'</div><div class="jud-sym"></div><div class="jud-box">'+ conr +'</div></div>'
        
    }
    $('.judge').html(div)
    $('.allsym').data('sign', false)

  //拖拽初始化  
$('.judge .jud-sym').droppable({
    accept: ":not(.ui-sortable-helper)",
    hoverClass: 'shad',
    drop: function(event, ui){},
    over: function(event, ui){
        $(ui.helper[0]).addClass('scale')
    },
    out: function(event, ui){
        $(ui.helper[0]).removeClass('scale')
    }
})


}





//拖拽
$('.allsym li').draggable({
    appendTo: ".allsym",
    helper: "clone",
    zIndex: 100,
    start: function(event, ui){
        var is = $(this).index()
        $(ui.helper[0]).children('span').css({
            'background-position': '7px ' + (10 - is * 60) + 'px'
        })
        $(this).addClass('transition')
    },
    stop: function(event, ui){
        $(this).removeClass('transition')
    }
})


$('.judge').on('drop', '.jud-sym', function(event, ui){
    var is = $(ui.helper.context).index()
    var ids = $(this).parent().index()
    var cons = '<span style="background-position-y:  -' + (is * 48) + 'px;"></span>'
    $(this).html(cons)
    $(ui.helper.context).removeClass('li1')
    $(this).children().data('index', is)
    answer[ids] = is
    $('.allsym').data('sign', false)
})

$('.allsym ul li').on('mousedown', function(){
    $(this).addClass('transition')
}).on('mouseup', function(){
    $(this).removeClass('transition')
})

$('.allsym ul li').on('click',  function(event) {
    event.preventDefault()
    var ismy = $(this).index()
    $('.allsym ul li').removeClass('li1')
    $(this).addClass('li1')
    $('.allsym').data('ismy', ismy)
    $('.allsym').data('sign', true)
})

$('.judge').on('click', '.jud-sym', function(event){
    event.preventDefault()
    if(!$('.allsym').data('sign')){
        return
    }
    var is = $('.allsym').data('ismy')
    var ids = $(this).parent().index()
    var cons = '<span style="background-position-y: -' + (is * 48) + 'px;"></span>'
    var oli = $('.allsym ul li')
    $(this).html(cons)
    $(this).children().data('index', is)
    answer[ids] = is
    $(oli[is]).removeClass('li1')
    $('.allsym').data('sign', false)
})

$('.judge').on('click', '.jud-box img', function(){
    $('.mask').show()
    $('.img-show').css('display', 'flex')
    var img = '<img src="'+ $(this).attr('src') +'">'
    $('.img-show').html(img)
})
$('.mask').on('click', function(){
    $('.mask').hide()
    $('.img-show').hide()
})


//判断对错
$('.check').on('click', function(){
    if($(this).hasClass('dian')){
        $('.allsym li').draggable('enable')
        $(this).removeClass('dian')
        $('.jud-sym').children('div').remove()
        $('.allsym').data('sign', true)
        $(this).removeClass('bg-cuo')
        $(this).removeClass('bg-dui')
        return
    }
    if($('.show-answer').hasClass('dian')){
        return
    }
    var osy = $('.jud-sym')
    var flags = true
    for(var i = 0; i < site.questionList.length; i++){
        if(answer[i] !== site.questionList[i].optionAnswerNum){
            $(osy[i]).append('<div class="cuo"></div>')
            flags = false
        }else{
            $(osy[i]).append('<div class="dui"></div>')
        }
    }
    if(flags){
        $(this).addClass('bg-dui')
    }else{
        $(this).addClass('bg-cuo')
    }
    
    $('.allsym li').draggable('disable')
    $(this).addClass('dian')
})


//重置
$('.reset').on('click', function(){
    answer = []
    $('.jud-sym').html('')
    $('.jud-sym').removeClass('bg-dui')
    $('.jud-sym').removeClass('bg-cuo')
    $('.allsym').data('sign', false)
    $('.allsym li').draggable('enable')
    $('.check').removeClass('bg-cuo')
    $('.check').removeClass('bg-dui')
    $('.show-answer').removeClass('bg-cuo')
    $('.show-answer').removeClass('dian')
    $('.check').removeClass('dian')
})

//显示答案
$('.show-answer').on('click', function(){
    if($(this).hasClass('dian')){
        $('.reset').triggerHandler('click')
        return
    }
    answer = []
    var osy = $('.jud-sym')
    var sp = ''
    for(var i = 0; i < osy.length; i++){
        sp = '<span style="background-position-y: -' + (site.questionList[i].optionAnswerNum * 48) + 'px;"></span><div class="dui"></div>'
        $(osy[i]).html(sp)
    }
    $('.allsym li').draggable('disable')
    $('.check').removeClass('bg-cuo')
    $('.check').removeClass('bg-dui')
    $(this).addClass('bg-cuo')
    $(this).addClass('dian')
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
    var osy = $('.jud-sym')
    subData.trueNum = 0
    subData.errorNum = 0
    subData.userAnswerList = []
    for(var i = 0; i < site.questionList.length; i++){
        if(answer[i] !== site.questionList[i].optionAnswerNum){
            subData.errorNum++
        }else{
            subData.trueNum++
        }
        subData.userAnswerList.push({index: i, selected: symbol[answer[i]]})
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




})