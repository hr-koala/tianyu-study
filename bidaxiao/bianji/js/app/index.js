$(function(){

var symbol =['＞', '≥', '＝', '≤', '＜']
var posArr = [] //存放设置的选项
/*{
    optionIndex: 0, //单题编号
    optionLeftType: '', //左边类型，image 或 text
    optionLeftCon: '', //左边内容
    optionRightType: '', //右边类型，image 或 text
    optionRightCon: '', //右边内容
    optionAnswer: '', //答案 ['＞', '≥', '＝', '≈', '≤', '＜'] 
    optionAnswerNum: -1
}]*/

var MAX_NUM = 15 //可以输入的最大字数

$.getJSON("data/main.json" ,function(data,status){
    console.log(data);
    vm.$data.infoObj.title = data.questionTitle
    var m = data.questionTitle.match(/[\s\r\n]/g) || []
    var l = m.length || 0
    $('#fontNum').html(data.questionTitle.length - l)
    vm.$data.infoObj.num = data.questionList.length
    posArr = data.questionList
    if(data.questionList.length === 6){
        $('.add-box').css('display', 'none')
    }
    setTimeout(initMainFun, 20)
})


function initMainFun(){
    var odiv = $('.set').children()
    for(var i = 0; i < posArr.length; i++){
        if(posArr[i].optionLeftType === 'image'){
            $(odiv[i]).children('.box:first').children('.box-img').css('display', 'none')
            $(odiv[i]).children('.box:first').children('.box-img1').css('display', 'block')
            var img = '<input type="file" class="box-file" accept="image/*" name="" value="" placeholder=""><img src="'+ posArr[i].optionLeftCon +'">';
            $(odiv[i]).children('.box:first').children('.box-img1').children('div').html(img)
        }else{
            $(odiv[i]).children('.box:first').children('.box-txt').html(posArr[i].optionLeftCon)
            $(odiv[i]).children('.box:first').children('.box-txt').css('display', 'block')
            $(odiv[i]).children('.box:first').children('.box-img').css('display', 'block')
        }
        if(posArr[i].optionRightType === 'image'){
            $(odiv[i]).children('.box:last').children('.box-img').css('display', 'none')
            $(odiv[i]).children('.box:last').children('.box-img1').css('display', 'block')
            var img = '<input type="file" class="box-file" accept="image/*" name="" value="" placeholder=""><img src="'+ posArr[i].optionRightCon +'">'
            $(odiv[i]).children('.box:last').children('.box-img1').children('div').html(img)
        }else{
            $(odiv[i]).children('.box:last').children('.box-txt').html(posArr[i].optionRightCon)
            $(odiv[i]).children('.box:last').children('.box-txt').css('display', 'block')
            $(odiv[i]).children('.box:last').children('.box-img').css('display', 'block')
        }
        var sym = '<i style="background-position: 11px '+ (2 - posArr[i].optionAnswerNum * 46) +'px;"></i>'
        $(odiv[i]).children('.symbol').children('.btn-sym').html(sym)
    }
    var w = $('.box').outerWidth(true) * 2 + $('.symbol').outerWidth(true) + 30
    if(vm.$data.infoObj.num % 2 === 0){
        $('.add-box').css({
            'float': 'left',
            'margin': '0px 0px 0px 57px',
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

var vm = new Vue({
	el: '#all',
	data(){
		return {
			nums: 1,//序号
            settings: {},
            infoObj: {
                num: 3,//选项个数
                title: ''
            },
            flagArr: [1,2,3,4,5,6] //暂时没用
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
            }
            if(posArr.length === 0){
                for(var i = 0; i < this.infoObj.num; i++){
                    var obj = {
                        optionIndex: posArr.length,
                        optionLeftType: '',
                        optionRightType: '',
                        optionLeftCon: '',
                        optionRightCon: '',
                        optionAnswer: '',
                        optionAnswerNum: -1
                    }
                    posArr.push(obj)
                }
            }
            var w = $('.box').outerWidth(true) * 2 + $('.symbol').outerWidth(true) + 30
            $('.add-box').css('width', w + 'px')
            
        },
		addFun: function(ev){
            //增加选项
            console.log(posArr);
			var obj = {
                optionIndex: posArr.length,
			    optionLeftType: '',
                optionRightType: '',
			    optionLeftCon: '',
			    optionRightCon: '',
                optionAnswer: '',
			    optionAnswerNum: -1
		    }
		    posArr.push(obj)
			this.infoObj.num++	
			
            if(this.infoObj.num === 6){
                ev.target.style.display = 'none'
            }else{
                var w = $('.box').outerWidth(true) * 2 + $('.symbol').outerWidth(true) + 30
                if(this.infoObj.num % 2 === 0){
                    $('.add-box').css({
                        'float': 'left',
                        'margin': '0px 0px 0px 57px',
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
            //删除选项
			var ipar = ins - 1//删除选项的下标
			if(ipar < posArr.length){
                var i = ipar
                var oipt = $('.box-txt')
                var obtn = $('.btn-sym')
                var oimg = $('.box-img1')
                var oig = $('.box-img')
                //从下标开始，将后一个的内容复制到前一个
                while(i < posArr.length-1){
                	posArr[i + 1].optionIndex--
                	if(posArr[i + 1].optionLeftType === 'text'){
                		$(oipt[2 * i]).html(posArr[i + 1].optionLeftCon)
                		$(oimg[2 * i]).css({
                			'display': 'none'
                		})
                		$(oipt[2 * i]).css({
                			'display': 'block'
                		})
                		$(oig[2 * i]).css({
                			'right': '5px'
                		})
                	}else if(posArr[i + 1].optionLeftType === 'image'){
                		var img = '<img src="'+ posArr[i + 1].optionLeftCon +'">'
                		$(oimg[2 * i]).children('div').html(img)
                		$(oipt[2 * i]).html('')
                		$(oimg[2 * i]).css({
                			'display': 'block'
                		})
                		$(oipt[2 * i]).css({
                			'display': 'none'
                		})
                		$(oig[2 * i]).css({
                			'display': 'none'
                		})
                	}else if(posArr[i + 1].optionLeftType === ''){
                		$(oipt[2 * i]).html('')
                		$(oimg[2 * i]).css({
                			'display': 'none'
                		})
                		$(oipt[2 * i]).css({
                			'display': 'none'
                		})
                		$(oig[2 * i]).css({
                			'display': 'none'
                		})
                	}

                	if(posArr[i + 1].optionRightType === 'text'){
                		$(oipt[2 * i + 1]).html(posArr[i + 1].optionRightCon)
                		$(oimg[2 * i + 1]).css({
                			'display': 'none'
                		})
                		$(oipt[2 * i + 1]).css({
                			'display': 'block'
                		})
                		$(oig[2 * i + 1]).css({
                			'right': '5px'
                		})
                	}else if(posArr[i + 1].optionRightType === 'image'){
                		var img = '<img src="'+ posArr[i + 1].optionRightCon +'">'
                		$(oimg[2 * i + 1]).children('div').html(img)
                		$(oipt[2 * i + 1]).html('')
                		$(oimg[2 * i + 1]).css({
                			'display': 'block'
                		})
                		$(oipt[2 * i + 1]).css({
                			'display': 'none'
                		})
                		$(oig[2 * i + 1]).css({
                			'display': 'block'
                		})
                	}else if(posArr[i + 1].optionRightType === ''){
                		$(oipt[2 * i + 1]).html('')
                		$(oimg[2 * i + 1]).css({
                			'display': 'none'
                		})
                		$(oipt[2 * i + 1]).css({
                			'display': 'none'
                		})
                		$(oig[2 * i + 1]).css({
                			'display': 'none'
                		})
                	}

                	$(obtn[i]).html($(obtn[i + 1]).html())
                	i++
                }

                posArr.splice(ipar, 1)
            }
            $('.add-box').css('display', 'inline-block')
            this.infoObj.num--
            if(this.infoObj.num % 2 === 0){
                    $('.add-box').css({
                        'float': 'left',
                        'margin': '0px 0px 0px 57px'
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

//第一次点击选项方框
$('.set').on(clicks, '.box', function(event){
	// event.stopPropagation()
	var ipar = $(this).parent().index()
    if($(this).children('.box-img1').css('display') === 'block' || $(this).children('.box-txt').css('display') === 'block'){
        return
    }
	$('.form-set').data('ipar', ipar)
	$(this).children('.box-txt').css({
        'display': 'block'
    })
	$(this).children('.box-img').css({
		'display': 'block'
	})
    $(this).children('.box-txt').focus()
    $(this).children('.box-txt').trigger('click')
})


$('.set').on('focus', '.box-txt', function(event){
    //获得输入焦点
	event.preventDefault()
	event.stopPropagation()
	$(this).parent().css({
		'border': '1px solid #3cc452'
	})
}).on('blur', '.box-txt', function(event) {
    //失去焦点
	event.preventDefault()
	event.stopPropagation()
    $(this).parent().css({
        'border': '1px solid #959595'
    })
}).on('input', '.box-txt', function(){
    //输入内容
    var ipar = $(this).closest('.com').index()
    var ich = $(this).parent().index()
    var str = $(this).html()
    if(str.length > 15){
        $(this).html(str.substring(0, 15))
        po_Last_Div(this)
    }
    if(ich === 1){
        posArr[ipar].optionLeftCon = $(this).html()
        posArr[ipar].optionLeftType = 'text'
    }else if(ich === 3){
        posArr[ipar].optionRightCon = $(this).html()
        posArr[ipar].optionRightType = 'text'
    }
}).on('change', '.box-file', function(event) {
	// event.preventDefault();
    //上传图片 
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
        var ich
        var ipar = $(_this).closest('.com').index()
        dealImage(FREvent.target.result, {
            width : 500 //图片大小
        }, function(base){
            if($(_this).parent().parent().hasClass('box-img1')){
                $(_this).next().attr('src', base)
                ich = $(_this).parent().parent().parent().index()
            }else{
                var img = '<input type="file" class="box-file" accept="image/*" title="点击替换图片"><img src="'+ base +'">'
                $(_this).parent().next().children('div').html(img)
                ich = $(_this).parent().parent().index()
            }
            if(ich === 1){
                posArr[ipar].optionLeftCon = base
                posArr[ipar].optionLeftType = 'image'
            }else if(ich === 3){
                posArr[ipar].optionRightCon = base
                posArr[ipar].optionRightType = 'image'
            }
        })
        
    }

    if($(this).parent().parent().hasClass('box-img1')){
        return
    }

	$(this).parent().next().css('display', 'block')
	$(this).parent().css({
		'display': 'none',
		'z-index': '10'
	})
	$(this).parent().prev().css('display', 'none')
	
}).on(clicks, '.box-rep', function(event) {
    //删除图片
	event.preventDefault()
	event.stopPropagation()
    var is = $(this).closest('.box').index()
    var ipar = $(this).closest('.com').index()
    if(is === 1){
        posArr[ipar].optionLeftCon = ''
        posArr[ipar].optionLeftType = ''
    }else if(is === 3){
        posArr[ipar].optionRightCon = ''
        posArr[ipar].optionRightType = ''
    }
	$(this).parent().prev().prev().css({
		'display': 'block'
	})
    $(this).parent().prev().prev().val('')
	$(this).parent().prev().css({
		'display': 'block'
	})
	$(this).parent().css('display', 'none')
    $(this).next().html('')
})


function errorFun(){
    $('.error-txt').fadeIn()
    setTimeout(function(){
        $('.error-txt').fadeOut()
    }, 3000)
}


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


$('.set').on('mouseover', '.symbol', function(event){
	event.preventDefault()
	event.stopPropagation()
	$(this).children('div').css('display', 'block')
}).on('mouseout', '.symbol', function(event){
    event.preventDefault()
    event.stopPropagation()
    $(this).children('div').css('display', 'none')
})

//设置符号
$('.set').on(clicks, '.sym-ul li', function(event){
	event.preventDefault()
	event.stopPropagation()
    var ipar = $(this).closest('.com').index()
	var is = $(this).index()
    posArr[ipar].optionAnswerNum = is
    posArr[ipar].optionAnswer = symbol[is]
	var span = '<i style="background-position: 11px '+ (2 - is*46) +'px;"></i>'
	$(this).parent().parent().prev().html(span)
    $(this).parent().parent().css({
        'display': 'none'
    })
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
    console.log(result);
    if(typeof result === 'string'){
        return
    }
    var base = JSON.stringify(result)
    var blob = new Blob([base], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "main.json")
})


$.output = function(){
    if(posArr.length === 0){
        return 'error=最少要设置一题'
    }
    for(var i = 0; i < posArr.length; i++){
        if(posArr[i].optionLeftCon === '' || posArr[i].optionRightCon === '' || posArr[i].optionAnswerNum === -1){
            return 'error=有选项未填写'
        }
    }
    
    if(vm.$data.infoObj.title === ''){
        vm.$data.infoObj.title = '比较左右两边的大小，并填入正确的符号'
    }
    var subData = {
        questionType: 'thenSize', //习题类型定义
        questionTitle: vm.$data.infoObj.title, //题干
        modelType: 'thenSize01',
        questionList: posArr
    }
    return subData
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