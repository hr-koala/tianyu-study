$(function(){

var symbol =['＞', '≥', '＝', '≈', '≤', '＜']


var MAX_NUM = 15 //可以输入的最大字数

$.getJSON("data/main.json" ,function(data,status){
    console.log(data);
    vm.$data.infoObj.title = data.questionTitle
    var m = data.questionTitle.match(/[\s\r\n]/g) || []
    var l = m.length || 0
    $('#fontNum').html(data.questionTitle.length - l)
    vm.$data.infoObj.num = data.questionList.length
    posArr = data.questionList
    if(data.optionType){
        $('.show-c')[0].checked = true
        $('.show-i').addClass('i1')
    }
    if(data.questionList.length === 10){
        $('.add-box').css('display', 'none')
    }
    setTimeout(initMainFun, 20)
})


function initMainFun(){
    var odiv = $('.set').children()
    console.log(odiv);
    for(var i = 0; i < posArr.length; i++){
        if(posArr[i].optionLeftType === 'image'){
            $(odiv[i]).children('.box:first').children('.box-font').css('display', 'none')
            $(odiv[i]).children('.box:first').children('.box-img').css('display', 'block')
            $(odiv[i]).children('.box:first').children('.box-img').children('img').attr('src', posArr[i].optionLeftCon)
        }else if(posArr[i].optionLeftType === 'text'){
            $(odiv[i]).children('.box:first').children('.box-txt').val(posArr[i].optionLeftCon)
            $(odiv[i]).children('.box:first').find('.box-txt').html(posArr[i].optionLeftCon)
            $(odiv[i]).children('.box:first').children('.box-font').css('display', 'block')
        }
        if(posArr[i].optionRightType === 'image'){
            $(odiv[i]).children('.box:last').children('.box-font').css('display', 'none')
            $(odiv[i]).children('.box:last').children('.box-img').css('display', 'block')
            $(odiv[i]).children('.box:last').children('.box-img').children('img').attr('src', posArr[i].optionRightCon)
        }else if(posArr[i].optionRightType === 'text'){
            $(odiv[i]).children('.box:last').children('.box-txt').val(posArr[i].optionRightCon)
            $(odiv[i]).children('.box:last').find('.box-txt').html(posArr[i].optionRightCon)
            $(odiv[i]).children('.box:last').children('.box-font').css('display', 'block')
        }
        var sym = '<i style="background-position: 11px '+ (2 - posArr[i].optionAnswerNum * 46) +'px;"></i>'
        $(odiv[i]).children('.symbol').children('.btn-sym').html(sym)
    }
    var w = $('.box').outerWidth(true) * 2 + $('.h-xian').outerWidth(true) + 35
    if(vm.$data.infoObj.num % 2 === 0){
        $('.add-box').css({
            'float': 'left',
            'margin': '0px 0px 0px 50px',
            'width': w + 'px'
        })
    }else{
        $('.add-box').css({
            'float': 'right',
            'margin': '0px 15px 0px 0px',
            'width': w + 'px'
        })
    }
}


$.getJSON("config/settings.json" ,function(data,status){
    vm.$data.settings = data
    vm.startUpdataFun()
})

if(IsPC()){
    clicks = 'click'
}else {
    clicks = 'touchstart'
}

vm = new Vue({
	el: '#all',
	data(){
		return {
			nums: 1,
            settings: {},
            infoObj: {
                num: 3,
                title: ''
            },
            flagArr: [1,2,3,4,5,6],
            fl: false
		}
	},
	components: {
		'child': {
			template: '#tem',
			props: ['nums', 'num', 'flagArr'],
			methods: {
				remove: function(event){
					event.stopPropagation()
					this.$emit('remove')
				}
			}
		}
	},
	methods: {
        textFun: function(){
            var str = this.infoObj.title
            var m = str.match(/[\s\r\n]/g) || []
            var l = m.length || 0
            var len = str.length - l
            if(len > 3000){
                this.infoObj.title = this.infoObj.title.substring(0, 3000 + l)
                $('#fontNum').html(3000)
            }else{
                $('#fontNum').html(len)
            }
        },
        startUpdataFun: function(){
            if(this.settings.showBtn){
                $('.floor-btn').css('display', 'block')
            }else{
                $('.floor-btn').css('display', 'none')
            }
            var w = $('.box').outerWidth(true) * 2 + $('.h-xian').outerWidth(true) + 35
            $('.add-box').css('width', w + 'px')
        },
		addFun: function(ev){
			this.infoObj.num++	
            if(this.infoObj.num === 10){
                ev.target.style.display = 'none'
            }else{
                var w = $('.box').outerWidth(true) * 2 + $('.h-xian').outerWidth(true) + 35
                if(this.infoObj.num % 2 === 0){
                    $('.add-box').css({
                        'float': 'left',
                        'margin': '0px 0px 0px 50px',
                        'width': w + 'px'
                    })
                }else{
                    $('.add-box').css({
                        'float': 'right',
                        'margin': '0px 15px 0px 0px',
                        'width': w + 'px'
                    })
                }
            }
		},
		removeFun: function(ins){
			console.log(ins);
            var ocm = $('.set .com')
            for(var i = ins - 1; i < ocm.length - 1; i++){
                $(ocm[i]).children('.box').eq(0).html($(ocm[i + 1]).children('.box').eq(0).html())
                $(ocm[i]).children('.box').eq(1).html($(ocm[i + 1]).children('.box').eq(1).html())
            }
            this.infoObj.num--
            $('.add-box').css('display', 'inline-block')
            if(this.infoObj.num % 2 === 0){
                $('.add-box').css({
                    'float': 'left',
                    'margin': '0px 0px 0px 50px'
                })
            }else{
                $('.add-box').css({
                    'float': 'right',
                    'margin': '0px 15px 0px 0px'
                })
            }
		}
	}
})

$('.show-c').on('change', function(){
    if(this.checked){
        $('.show-i').addClass('i1')
    }else{
        $('.show-i').removeClass('i1')
    }
})




$('.set').on(clicks, '.box', function(event){
	// event.stopPropagation()
    if($(this).children('.box-img').css('display') === 'block' || $(this).children('.box-font').css('display') === 'block'){
        return
    }
	$(this).children('.box-font').css({
        'display': 'block'
    })
    $(this).find('.box-txt').focus()
    $(this).find('.box-txt').trigger('click')
})




$('.set').on('focus', '.box-txt', function(){
    $(this).closest('.box').addClass('box-bd')
    $(this).closest('.box').find('.b-txt').css('display', 'block')
    $(this).closest('.box').find('.b-txt').children('span').html($(this).html().length)
})

$('.set').on('input', '.box-txt', function(){
    var str = $(this).html()
    if(str.length > 10){
        $(this).html(str.substring(0, 10))
        po_Last_Div(this)
    }
    $(this).closest('.box').find('.b-txt').children('span').html($(this).html().length)
})

$('.set').on('blur', '.box-txt', function(){
    $(this).closest('.box').removeClass('box-bd')
    $(this).closest('.box').find('.b-txt').css('display', 'none')
})



$('.set').on('change', '.box-file', function(event) {
	event.stopPropagation();
	var oFile = this.files[0]
    var _this = this
    var fr = new FileReader();
    var rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    if (!rFilter.test(oFile.type)) {
        errorFun()
        return;
    };
    fr.readAsDataURL(oFile);
    fr.onload = function(FREvent) {
        dealImage(FREvent.target.result, {
            width : 200
        }, function(base){
            $(_this).closest('.box').children('.box-img').css('display', 'block')
            $(_this).closest('.box').children('.box-img').children('img').attr('src', base)
            $(_this).closest('.box').find('.box-txt').html('')
            $(_this).closest('.box').find('.box-txt').val('')
            $(_this).closest('.box').find('.box-font').css('display', 'none')
        })
    }
	
})

function errorFun(){
    $('.error-txt').fadeIn()
    setTimeout(function(){
        $('.error-txt').fadeOut()
    }, 3000)
}


$('.set').on('click', '.box-rep', function(event){
    event.stopPropagation();
    $(this).closest('.box').children('.box-img').children('img').attr('src', '')
    $(this).closest('.box').children('.box-img').css('display', 'none')
    $(this).closest('.box').children('.box-font').css('display', 'block')
    $(this).closest('.box').children('.box-font').children('.box-txt').focus()
})




//预览按钮
$('.btn-prev').on(clicks, function(event){
    var result = $.output()
    console.log(result);
    if(typeof result === 'string'){
        return
    }
    var str = JSON.stringify(result) // 将对象转换为字符串
    sessionStorage.setItem(result.questionType,str)
    window.open('../yulan/index.html')
})


//保存
$('.btn-save').on('click', function(){
    var result = $.output()
    if(typeof result === 'string'){
        return
    }
    var base = JSON.stringify(result)
    var blob = new Blob([base], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "main.json")
})


$.output = function(){
    if(vm.$data.infoObj.num === 0){
        return 'error=最少要设置一题'
    }
    var arr = []
    $.each($('.set .com'), function(is, el){
        var obj = {
            optionIndex: is
        }
        if($(el).children('.box').eq(0).children('.box-img').css('display') === 'block'){
            obj.optionLeftType = 'image'
            obj.optionLeftCon = $(el).children('.box').eq(0).children('.box-img').children('img').attr('src')
        }else{
            obj.optionLeftType = 'text'
            obj.optionLeftCon = $(el).children('.box').eq(0).find('.box-txt').html()
        }
        if($(el).children('.box').eq(1).children('.box-img').css('display') === 'block'){
            obj.optionRightType = 'image'
            obj.optionRightCon = $(el).children('.box').eq(1).children('.box-img').children('img').attr('src')
        }else{
            obj.optionRightType = 'text'
            obj.optionRightCon = $(el).children('.box').eq(1).find('.box-txt').html()
        }
        arr.push(obj)
    })
    for(var i = 0; i < arr.length; i++){
        if(arr[i].optionLeftType === undefined || arr[i].optionLeftCon === '' || arr[i].optionRightType === undefined || arr[i].optionRightCon === ''){
            return 'error=有选项未填写'
        }else{
            if(arr[i].optionLeftCon.search(/\S/g) === -1 || arr[i].optionRightCon.search(/\S/g) === -1 ){
                return 'error=有选项未填写'
            }
        }
    }
    if(vm.$data.infoObj.title === ''){
        vm.$data.infoObj.title = '将相对应的选项连接起来'
    }
    var fl = false
    if($('.show-c')[0].checked){
        fl = true
    }
    var subData = {
        questionType: 'LinkGame', //习题类型定义
        questionTitle: vm.$data.infoObj.title, //题干
        modelType: 'LinkGame01',
        questionList: arr,
        optionType: fl
    }
    return subData
}

/*
    optionIndex: 0, //单题编号
    optionLeftType: '', //左边类型，image 或 text
    optionLeftCon: '', //左边内容
    optionRightType: '', //右边类型，image 或 text
    optionRightCon: '', //右边内容
 */



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
        var type = 'image/jpeg'
        var str = path.substring(0, path.search(/\;/g))
        if(str.search(/(png)/g) >= 0){
            type = 'image/png'
        }
        var base64 = canvas.toDataURL(type, quality);
        // 回调函数返回base64的值
        callback(base64);
    }
}

//定位光标到最后
 function po_Last_Div(edit, ran) {
    window.setTimeout(function () {
        var sel, range;
        if (window.getSelection && document.createRange) {
            range = document.createRange();
            range.selectNodeContents(edit);
            var len = ran || edit.childNodes.length
            // console.log(edit.childNodes.length);
            range.collapse(true);
            range.setEnd(edit, len);
            range.setStart(edit, len);                
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(edit);
            range.collapse(true);
            range.select();
        }
    }, 1)
}

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



})