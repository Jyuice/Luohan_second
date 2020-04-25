/**
 * 
 * 鼠标滚轮事件
 */
//判断鼠标滚轮滚动方向
(function() {
    if (window.addEventListener) {
        window.addEventListener('DOMMouseScroll', wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;
    //统一处理滚轮滚动事件
    function wheel(event) {
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) { //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
            delta = event.wheelDelta / 120;
            if (window.opera) delta = -delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
        } else if (event.detail) { //FF浏览器使用的是detail,其值为“正负3”
            delta = -event.detail / 3;
        }
        if (delta)
            handle(delta);
    }
    //上下滚动时的具体处理函数
    function handle(delta) {
        var container = document.getElementsByClassName('container')[0];
        if (delta < 0) { //向下滚动
            container.style.marginTop = '-52px';
            container.style.transition = 'all .5s';
        } else { //向上滚动
            container.style.marginTop = '0';
            container.style.transition = 'all .5s';
        }
    }
})()