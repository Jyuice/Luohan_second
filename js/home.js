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
        if (!event) {
            event = window.event;
        }
        if (event.wheelDelta) { //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
            delta = event.wheelDelta / 120;
            if (window.opera) {
                delta = -delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
            }
        } else if (event.detail) { //FF浏览器使用的是detail,其值为“正负3”
            delta = -event.detail / 3;
        }
        if (delta) {
            handle(delta);
        }
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
})();


/**
 * 
 * 好友列表
 */

(function() {
    var message = document.getElementById('message');
    var friends_box = document.getElementsByClassName('friends-box')[0];

    message.onclick = function(e) {
        var event = e || window.event;
        friends_box.style.display = 'block';
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    };

    document.onclick = function(e) {
        var event = e || event;
        var target = e.target || e.srcElement;
        if (e.target.className != 'friends_box') //事件对象
        {
            friends_box.style.display = "none";
        }
    };

})();

/**
 * 
 * 聊天框
 * 1、点击li弹出聊天框
 * 2、聊天
 */
(function() {
    //  点击li弹出聊天框
    var friends_box = document.getElementsByClassName('friends-box')[0];
    var ul_list = friends_box.getElementsByClassName('list')[0];
    var chat_area = document.getElementById('chat-area');
    var close = chat_area.getElementsByClassName('close')[0];
    var scroll = document.getElementById("scroll")

    ul_list.onclick = function(e) {
        console.log(e.target);
        if (e.target.tagName === 'LI') {
            chat_area.style.display = 'block';
            scroll.style.overflow = "hidden";
        }
        close.onclick = function() {
            chat_area.style.display = 'none';
            scroll.style.overflow = "visible";
        }
    }

    //聊天
    var btn = document.getElementById("chat-btn");
    var txt = document.getElementById("txt");
    var recerive = document.getElementsByClassName('receive')[0];
    var send = document.getElementsByClassName('send')[0];
    var r_chat_message = recerive.getElementsByClassName("chat-message")[0];
    var s_chat_message = send.getElementsByClassName("chat-message")[0];
    var inter = document.getElementsByClassName('inter')[0];
    var chat_body = document.getElementsByClassName('chat-body')[0];

    btn.onclick = function() {
        if (txt.value == "") {
            alert("请勿发送空内容");
        } else {
            var sulpure = document.createElement('img');
            var inter = document.createElement("div");
            var sendbox = document.createElement('div');
            var chat_message = document.createElement('div')
            inter.classList.add('inter');
            sulpure.classList.add('my-header');
            sendbox.classList.add('send');
            sendbox.classList.add('clearfix');
            chat_message.classList.add('chat-message');
            chat_message.classList.add('clearfix');
            sulpure.src = 'img/head sulpture.jpg';
            inter.innerText = txt.value;
            chat_message.appendChild(sulpure);
            chat_message.appendChild(inter);
            sendbox.appendChild(chat_message);
            chat_body.appendChild(sendbox);
            txt.value = "";
            inter.scrollIntoView();
        }

    }
    document.onkeydown = function(evt) {
        var e = evt || event;
        e.keyCode = e.which = e.charCode;
        if (e.keyCode == 13 || e.keyCode == 10) {
            event.preventDefault(); //阻止enter键回车换行
            event.stopPropagation();

            if (txt.value == "") {
                alert("请勿发送空内容");
            } else {
                var sulpure = document.createElement('img');
                var inter = document.createElement("div");
                var sendbox = document.createElement('div');
                var chat_message = document.createElement('div')
                inter.classList.add('inter');
                sulpure.classList.add('my-header');
                sendbox.classList.add('send');
                sendbox.classList.add('clearfix');
                chat_message.classList.add('chat-message');
                chat_message.classList.add('clearfix');
                sulpure.src = 'img/head sulpture.jpg';
                inter.innerText = txt.value;
                chat_message.appendChild(sulpure);
                chat_message.appendChild(inter);
                sendbox.appendChild(chat_message);
                chat_body.appendChild(sendbox);
                txt.value = "";
                inter.scrollIntoView();
            }
        }
    }
})();