$(function(){

$.getJSON("data/main1.json" ,function(data,status){
    vm.$data.site = data
    vm.initData()
}).error(function() {
    vm.initData()
});
var sitime, sitime1;
vm = new Vue({
    el: '#all',
    data: {
        title: '', //标题
        site: {}, //存放的数据
        questionList: [], //所有的数据
        currentObj: {}, //当前的数据
        currentIndex: '', //当前的下标
        playTime: '', //播放时间
        currAnim: {}, //当前动画参数
    },
    computed: {
        /*动画参数*/
        animArr: function(){
            var obj = {
                1: {name: 'drop', option: {direction: 'right'}},
                2: {name: 'scale', option: {}},
                3: {name: 'blind', option: {direction: 'left'}},
                4: {},
                // 4: {name: 'explode', option: {pieces: 64},seconds:2000},
            };
            return obj;
        }
    },
    methods: {
        /*初始化页面*/
        initData: function(){
            var str = sessionStorage.getItem('hualang')
            var obj = JSON.parse(str)
            if(obj){
                this.site = obj;
            }
            console.log(this.site)
            this.title = this.site.questionTitle;
            this.questionList = this.site.questionList;
            this.currentIndex = 0;
            this.currentObj = this.site.questionList[0]
            this.currAnim = this.animArr[this.site.animateType]
            
            
            if(this.site.isAutoPlayFlag){
                this.playTime = this.site.playTime * 1000;
                if(this.site.animateType == 4){
                    // $('.animate').show(this.currAnim.name, this.currAnim.option,2000)
                }
            }
            this.autoAnimteFun()

            console.log(this.site);
        },

        /*选择*/
        chooseLeafIndex: function(e){
            clearTimeout(sitime)
            var $box = $(e.target).closest('.box');
            var index = $box.data('index');
            this.hideAnim()
            this.currentIndex = index;
            this.currentObj = this.questionList[index];

            /*$('.animate').hide(this.currAnim.name, this.currAnim.option, 300)
            sitime = setTimeout(this.autoAnimteFun, 400)*/
        },
        /*上一个*/
        addPrevNumFun: function(){
            if(this.currentIndex === 0){
                 this.currentIndex === this.questionList.length - 1
                //return;
            }
            clearTimeout(sitime)
            $('.animate').hide(this.currAnim.name, this.currAnim.option, 300)
            this.currentIndex -= 1;
		if(this.currentIndex < 0){
                this.currentIndex = this.questionList.length - 1;
            }
            var h = (this.currentIndex - 3) * $(' .post .box:first-child').outerHeight(true)
            $(' .list').scrollTop(h)
            this.currentObj = this.site.questionList[this.currentIndex]
            sitime = setTimeout(this.autoAnimteFun, 400)
        },
        /*下一个*/
        addNextNumFun: function(){
            clearTimeout(sitime)
            this.hideAnim()
            // $('.animate').hide(this.currAnim.name, this.currAnim.option, 300)
            this.currentIndex += 1;
            if(this.currentIndex >= this.questionList.length){
                this.currentIndex = 0;
            }
            this.currentObj = this.site.questionList[this.currentIndex]
            // sitime = setTimeout(this.autoAnimteFun, 400)
        },

        /*自动播放动画*/
        autoAnimteFun: function(){
            var _this = this;
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
        /*下一个动画*/
        nextAnimFun: function(){
            var _this = this;
            // clearTimeout(sitime)
            sitime = setTimeout(function(){
                _this.addNextNumFun()
                if(_this.site.isAutoPlayFlag){
                    _this.nextAnimFun()
                }
            }, _this.playTime)
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
    }
})

    //收起collapse（隐藏）或展开（显示）
    $('.main').on('click','.collapse img',function () {
        // $(".cinfo").slideToggle("slow");
        $(this).hide().siblings("img").show()
        console.log($(this).siblings("span").text())
        if($(this).siblings("span").text() == "收起" ){
            $(this).siblings("span").text("展开");
            $(".cinfo").hide()
        }else {
            $(this).siblings("span").text("收起");
            $(".cinfo").show()
        }
    })
    console.log($(".cinfo").eq(0).text())
    for (let i=0;i<$(".cinfo").length - 1; i++){
        if(!$(".cinfo").eq(i).text()){
            $(this).hide();
        }else {
            $(this).show();
        }
    }



})