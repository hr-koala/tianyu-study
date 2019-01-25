$(function(){

$.getJSON("data/main.json" ,function(data,status){
    vm.$data.site = data
    vm.initData()
})
var sitime, sitime1;
vm = new Vue({
    el: '#all',
    data: {
        title: '', //标题
        site: {}, //存放的数据
        questionList: [], //所有叶子的数据
        currentObj: {}, //当前叶子的数据
        currentIndex: '', //当前叶子的下标
        playTime: '', //播放时间
        currAnim: {}, //当前动画参数
        isAutoFirstFlag: true, //自动播放时，是否是第一次播放
    },
    computed: {
        /*动画参数*/
        animArr: function(){
            var obj = {
                1: {name: 'drop', option: {direction: 'right'}},
                2: {name: 'scale', option: {}},
                3: {name: 'blind', option: {direction: 'left'}},
                4: {name: 'explode', option: {pieces: 4}},
            };
            return obj;
        }
    },
    methods: {
        /*初始化页面*/
        initData: function(){
            var str = sessionStorage.getItem('shijianzhou')
            var obj = JSON.parse(str)
            if(obj){
                this.site = obj;
            }
            this.title = this.site.questionTitle;
            this.questionList = this.site.questionList;
            this.currentIndex = 0;
            this.currentObj = this.site.questionList[0]
            this.currAnim = this.animArr[this.site.animateType]
            if(this.site.navPostType == 2){
                $('.main').addClass('nav-right')
            }
            
            if(this.site.isAutoPlayFlag){
                this.playTime = this.site.playTime * 1000;
                if(this.site.animateType == 4){
                }
                this.autoAnimteFun()
            }else{
                this.isAutoFirstFlag = false;
                $('.animate').show(this.currAnim.name, this.currAnim.option)
            }

            console.log(this.site);
            this.initWidth()
        },
        /*计算方框宽度*/
        initWidth: function(){
            var w = $('.timeline .list').width() - 36 * 4;
            var w1 = w / 2;
            this.boxWidth = w1;
            $('.timeline .item').css('width', w1 + 'px')
        },
        /*选择叶子*/
        chooseLeafIndex: function(e){
            var $box = $(e.target).closest('.box');
            var index = $box.data('index');
            this.currentIndex = index;
            this.currentObj = this.questionList[index];
            clearTimeout(sitime)
            $('.animate').hide(this.currAnim.name, this.currAnim.option, 300)
            sitime = setTimeout(this.autoAnimteFun, 400)
        },
        /*上一个*/
        addPrevNumFun: function(){
            if(this.currentIndex === 0){
                return;
            }
            clearTimeout(sitime)
            $('.animate').hide(this.currAnim.name, this.currAnim.option, 300)
            this.currentIndex -= 1;
            this.changeIconClass()
            var h = (this.currentIndex - 3) * $('.timeline .post .box:first-child').outerHeight(true)
            $('.timeline .list').scrollTop(h)
            this.currentObj = this.site.questionList[this.currentIndex]
            sitime = setTimeout(this.autoAnimteFun, 400)
        },
        /*下一个*/
        addNextNumFun: function(){
            if(this.isAutoFirstFlag){
                if(this.currentIndex === this.questionList.length - 1){
                    this.isAutoFirstFlag = false;
                }
            }else{
                if(this.currentIndex === this.questionList.length - 1){
                    return;
                }
            }
            clearTimeout(sitime)
            $('.animate').hide(this.currAnim.name, this.currAnim.option, 300)
            this.currentIndex += 1;
            if(this.currentIndex >= this.questionList.length){
                this.currentIndex = 0;
            }
            this.changeIconClass()
            var h = (this.currentIndex - 3) * $('.timeline .post .box:first-child').outerHeight(true)
            $('.timeline .list').scrollTop(h)
            this.currentObj = this.site.questionList[this.currentIndex]
            sitime = setTimeout(this.autoAnimteFun, 400)
        },
        /*改变图标样式*/
        changeIconClass: function(){
            if(this.currentIndex === 0){
                $('.timeline .icon-prev').addClass('has')
            }else{
                $('.timeline .icon-prev').removeClass('has')
            }
            if(this.currentIndex === this.questionList.length - 1){
                $('.timeline .icon-next').addClass('has')
            }else{
                $('.timeline .icon-next').removeClass('has')
            }
        },
        /*自动播放动画*/
        autoAnimteFun: function(){
            var _this = this;
            if(this.site.isAutoPlayFlag && this.isAutoFirstFlag){
                $('.animate').show(this.currAnim.name, this.currAnim.option, this.nextAnimFun)
            }else{
                $('.animate').show(this.currAnim.name, this.currAnim.option)
            }
        },
        /*下一个动画*/
        nextAnimFun: function(){
            var _this = this;
            sitime = setTimeout(function(){
                _this.addNextNumFun()
            }, _this.playTime)
        }
    }
})



})