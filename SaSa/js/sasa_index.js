if(!window.jQuery){
    throw new Error("jd_index.js依赖于jQuery！");
}
jQuery.fn.carousel=function(){
    var interval=3000;//每隔多久轮换一张图片
    var duration=1000;//没隔多久轮换动画的持续时间
    var $imgList=this.children('img');//所有img组成的类数组对象
    var $liList=this.find('li');//所有的li组成的类数组对象
    var cur=0;//当前显示的广告的序号
    var next=1;//下一次要显示的广告的序号

    //开启一个周期性定时器，每隔一个interval启动一次轮换
    setInterval(function(){
        lunHuan();
      },interval);
    $liList.click(function(){
        var i=$liList.index(this);//点击的li在所有li中的序号
        next=i;
        lunHuan();
    });


    //进行广告轮换
    function lunHuan(){
        //让第next个li圆饼添加.active,其兄弟删除.active
        $liList.eq(next).addClass("active").siblings(".active").removeClass("active");
        //让当前显示的广告启动动画向左滑动，滑出去后，删除.active
        $imgList.eq(cur).animate({left:"-100%"},duration,function(){
            $(this).removeClass("active");
        });
        //让即将要显示的下一张广告添加.active,出现在最右侧，开始动画慢慢向左滑动
        $imgList.eq(next).addClass("active").css("left","100%").animate({left:"0"},duration);
        //修改cur和next变量的值，第cur张移走后next移入
        cur=next;
        next++;
        if(next>=$imgList.length){
            next=0;
        }
    }



    };

//公告
//设置一个定时器，每隔一定时间，div的margin-top -28px;
var marTop=0;
var plus=-1;
var noti=setInterval(function(){
    marTop+=28*plus;
    $('.notice_content').css('margin-top',marTop);
    if(marTop===-140){
        marTop=0;
    }
},3000);


/**
 * 滚动监听插件
 * $(window).scrollspy(options)
 */
jQuery.fn.scrollspy=function(options){
    var $liList=$(options.target).find('li');
    //点击附加导航中的某个超链接时，页面主体滚动到指定楼层位置
    $liList.on('click','a',function(e){
        e.preventDefault();
        //this>a
        //根据a的href属性，找到其对应的楼层的距离页面顶部的偏移量
        var floorId=$(this).attr('href');
        var top=$(floorId).offset().top;
        //让页面主体滚动到指定的高度
        $('body').animate({scrollTop:top},500);
    });
    //监听页面的滚动事件，进行楼层开关的点亮
    //window.onscroll=function(){}
    $(window).scroll(function(){
        //获取window距离滚动条顶部的距离
        var top=$(window).scrollTop();
        if(top<600){//现在滚动到f1上方
           $(options.target).fadeOut();
        }else if(top>6500){//f3下方
            $(options.target).fadeOut();
        }else{//f1至f3之间
            $(options.target).fadeIn();
        }
        //点亮当前滚动到的楼层的开关
        //思路：遍历每个楼层开关，查看当前的window滚动偏移量超过那个楼层的偏移量
        $liList.each(function(i,li){
            var floorId=$(this).children("a").attr("href");
            var floorTop=$(floorId).offset().top;//每个楼层距离顶部的偏移量
            if(top>=floorTop-200){
                $(li).addClass('active').siblings('.active').removeClass('active');
            }

        });

    })
}

























