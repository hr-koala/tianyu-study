$(function(){

$.getJSON("data/main.json" ,function(data,status){
    vm.$data.site = data
    vm.initData()
}).error(function() {
    vm.initData()
});

vm = new Vue({
    el: '#all',
    data: {
        title: '', //标题
        site: {}, //存放的数据
        sortArr: [], //卡牌顺序 上 > 左 > 下 > 右
        postArr: [], //位置信息
        chooseId: 10, //主位上牌的id，默认10
        cardLen: 10, //卡牌个数， 默认10个
    },
    computed: {
        /*所有卡牌顺序*/
        sortList: function(){
            var obj = {
                3: [2, 10, 6],
                4: [1, 3, 10, 7],
                5: [2, 4, 10, 8, 6],
                6: [1, 2, 4, 10, 8, 6],
                7: [2, 3, 5, 10, 9, 7, 6],
                8: [1, 2, 3, 5, 10, 9, 7, 6],
                9: [2, 3, 4, 5, 10, 9, 8, 7, 6],
                10: [1, 2, 3, 4, 5, 10, 9, 8, 7, 6]
            };
            return obj;
        }
    },
    methods: {
        /*初始化页面*/
        initData: function(){
            var str = sessionStorage.getItem('choukapai')
            var obj = JSON.parse(str)
            if(obj){
                this.site = obj;
            }
            this.site = this.site;
            this.title = this.site.questionTitle;
            this.cardLen = this.site.questionList.length;
            console.log(this.site);
            this.sortArr = this.sortList[this.cardLen]

            this.initCardHtml()
            setTimeout(this.getCardPostData, 200)
        },
        /*选择卡牌*/
        chooseCardFun: function(e){
            var $box = $(e.target).closest('.box');
            var id = $box.data('id')
            if(id === this.chooseId){
                //翻牌
                if($box.hasClass('on')){
                    $box.removeClass('on')
                }else{
                    $box.addClass('on')
                }
            }else{
                //移动牌
                var cindex = this.sortArr.indexOf(this.chooseId); //主牌的下标
                var index = this.sortArr.indexOf(id); //当前牌的下标
                var a = cindex - index;
                if(a > 0){
                    //左 > 右
                    this.leftMoveRightFun(this.postArr, a)
                    this.leftMoveRightFun(this.sortArr, a)
                }else{
                    //右 > 左
                    this.rightMoveLeftFun(this.postArr, a, index)
                    this.rightMoveLeftFun(this.sortArr, a, index)
                }
                this.initCardFun()
                this.chooseId = id;
            }
        },
        /*换牌*/
        againFun: function(){
            var box = $('.list .box');
            var list = this.site.questionList;
            var arr = getArr(this.cardLen);
            var left1 = ($('.home .main .list').width() - $('.list .box.inside').innerWidth()) / 2;
            var left2 = ($('.home .main .list').width() - $('.list .box.active').innerWidth()) / 2;
            console.log(left1);
            $.each(this.postArr, function(is, it){
                if($(box[is]).hasClass('active')){
                    $(box[is]).css({
                        top: '78px',
                        left: left2,
                    })
                }else{
                    $(box[is]).css({
                        top: '128px',
                        left: left1,
                    })
                }
                $(box[is]).removeClass('inside middle active on').addClass(it.type)

                var obj = list[arr[is]];
                if(obj.optionsType === 'image'){
                    $(box[is]).find('.zhen .img').css('display', 'flex')
                    $(box[is]).find('.zhen .text').hide()
                    $(box[is]).find('.zhen .img img').attr('src', obj.optionsCon)
                    $(box[is]).find('.zhen .text .inp-txt').html('')
                }else{
                    $(box[is]).find('.zhen .img').hide()
                    $(box[is]).find('.zhen .text').css('display', 'flex')
                    $(box[is]).find('.zhen .img img').attr('src', '')
                    $(box[is]).find('.zhen .text .inp-txt').html(obj.optionsCon)
                }
                
            })
            setTimeout(this.initCardFun, 1000)
        },
        /*左 > 右*/
        leftMoveRightFun: function(arr, a){
            var ar1 = arr.slice(0, a)
            arr.splice(0, a)
            for(var k in ar1){
                arr.push(ar1[k])
            }
        },
        /*右 > 左*/
        rightMoveLeftFun: function(arr, a, index){
            var ar1 = arr.slice(a)
            var b = arr.length - Math.abs(a)
            arr.splice(b, Math.abs(a))
            for(var i = ar1.length - 1; i >= 0; i--){
                arr.unshift(ar1[i])
            }
        },
        /*初始化卡牌的html*/
        initCardHtml: function(){
            var box = $('.list .box');
            var list = this.site.questionList;
            var arr = getArr(this.cardLen)
            var html = '';
            $.each(this.sortArr, function(is, it){
                var obj = list[arr[is]]
                html += '<div class="box w'+ it +'" data-id="'+ it +'" >'
                html += '<div class="fan"></div><div class="zhen">'
                if(obj.optionsType === 'image'){
                    html += '<div class="img" style="display: flex;"><img src="'+ obj.optionsCon +'" alt=""></div>';
                    html += '<div class="text"><div class="inp-txt"></div></div>';
                }else{
                    html += '<div class="img"><img src="" alt=""></div>';
                    html += '<div class="text" style="display: flex;"><div class="inp-txt">'+ obj.optionsCon +'</div></div>';
                }
                html += '</div><div class="yuan"></div></div>';
            })
            $('.list').html(html)
            this.chooseId = 10;
        },
        
        /*得到卡牌位置*/
        getCardPostData: function(){
            var box = $('.list .box');
            var arr = [];
            var ar1 = [1, 2, 3, 6, 7];//浅色的id
            var ar2 = [4, 5, 8, 9]; //中间的id
            $.each(this.sortArr, function(is, it){
                var w = $(box[is]).css('width'), h = $(box[is]).css('height');
                var type = '', left = $(box[is]).css('left');
                if(ar1.indexOf(it) > -1){
                    type = 'inside'
                }else if(ar2.indexOf(it) > -1){
                    type = 'middle'
                }
                if(it === 10){
                    w = '240px';
                    h = '345px';
                    type = 'active';
                }
                if(it === 1 || it === 10){
                    left = ($('.home .main .list').width() - parseInt(w)) / 2;
                }
                var marginLeft = $(box[is]).css('margin-left');
                arr.push({
                    top: $(box[is]).css('top'),
                    left: left,
                    padding: $(box[is]).css('padding'),
                    w: w,
                    h: h,
                    id: it,
                    el: $(box[is]),
                    type: type
                })
                $(box[is]).data('id', it)
                $(box[is]).addClass(type)
            })
            this.postArr = arr;
            this.initCardFun()
        },
        /*初始化卡牌位置*/
        initCardFun: function(){
            var box = $('.list .box');
            $.each(this.postArr, function(is, it){
                $(box[is]).css({
                    top: it.top,
                    left: it.left,
                    padding: it.padding,
                    width: it.w,
                    height: it.h,
                })
                // setTimeout(function(){
                //     $(box[is]).css({
                //         width: it.w,
                //         height: it.h,
                //     })
                // },10)
                $(box[is]).removeClass('inside middle active on').addClass(it.type)
            })
        },
    }
})



//选择卡牌
$('.list').on('click', '.box', function(e){
    vm.chooseCardFun(e)
})


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