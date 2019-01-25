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
        cardLen: 0, //翻牌数量
        boxWidth: 0, //方框的宽度
    },
    computed: {
        
    },
    methods: {
        /*初始化页面*/
        initData: function(){
            var str = sessionStorage.getItem('choukapai')
            var obj = JSON.parse(str)
            if(obj){
                this.site = obj;
            }
            console.log(this.site);
            
            this.site = this.site;
            this.title = this.site.questionTitle;
            this.cardLen = this.site.questionList.length;
            this.initWidth()
            if(!isChrome()){
                setTimeout(this.initWidth, 100)
            }
        },
        /*计算宽度*/
        initWidth: function(){
            var w = 0;
            var width = $('.home .list').width() - 8;
            if(this.cardLen === 1){
                w = width / 3;
                $('.home .list').addClass('center')
            }else if(this.cardLen === 2){
                w = width / 3;
                $('.home .list').addClass('center')
            }else if(this.cardLen === 3){
                w = (width - 3 * 30) / 3;
                $('.home .list').addClass('center')
            }else if(this.cardLen === 4){
                w = (width - 2 * 30) / 2;;
            }else if(this.cardLen === 5){
                w = (width - 2 * 30) / 2;;
                w1 = (width - 3 * 30) / 3;
                setTimeout(function(){
                    $('.home .list .pair:gt(1)').css('width', w1 + 'px')
                }, 100)
            }else{
                w = (width - 3 * 30) / 3;
                if(this.cardLen === 8){
                    $('.home .list').addClass('left')
                }
            }
            this.boxWidth = w;
        },
    }
})

window.onresize =function(){
    vm.initWidth()
}



//选择卡牌
$('.list').on('click', '.pair', function(e){
    $(this).toggleClass('on')
})

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