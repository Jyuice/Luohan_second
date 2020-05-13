var userId = localStorage.getItem('userId');
var scroll = document.getElementById("scroll");
var bool = true; // bool表示当前是否在home
localStorage.setItem('bool', bool);
console.log(userId);

window.onload = function() {
    var per = 0;
    var bar = document.getElementsByClassName('bar')[0];
    var pageLoadding = document.getElementsByClassName('page-loading')[0];
    var timer = setInterval(function() {
        per++;
        bar.style.width = per + '%';
        if (per == 100) {
            clearInterval(timer);
            pageLoadding.classList.add('complete');
            setTimeout(function() {
                pageLoadding.style.display = 'none';
            }, 800)
        }
    }, 10);
};

/**
 * 
 * 查看好友列表
 * 获取好友列表
 */
(function() {
    var message = document.getElementById('message');

    message.onclick = function(e) {
        var friends_box = document.getElementsByClassName('friends-box')[0];
        friends_box.style.display = 'block';
        if (e.stopPropagation) {
            e.stopPropagation(); //W3C模式下
        } else {
            e.cancelBubble = true; //IE独有
        };

        document.onclick = function(e) {
            var event = e || event;
            var target = e.target || e.srcElement;
            if (target.className != 'friends_box') { //事件对象
                friends_box.style.display = "none";
            }
        };
        var xhr = new XMLHttpRequest();
        var URL = 'http://47.97.204.234:3000/user/friendList';
        xhr.open('GET', URL + '?userId=' + userId, true);
        xhr.send();
        xhr.onload = function() {
            var returnData = JSON.parse(xhr.responseText);
            console.log(returnData);
            if (returnData.result === 'success') {
                renderFriendList(returnData);
            }
        }
    }
})();

/**
 * 渲染好友列表
 *
 * @param   {[type]}  returnData  [returnData description]
 *
 * @return  {[type]}              [return description]
 */
function renderFriendList(returnData) {
    var friends_box = document.getElementsByClassName('friends-box')[0];
    var ul_list = friends_box.getElementsByClassName('list')[0];
    var length = returnData.friends.length;
    var templete = '';
    for (var i = 0; i < length; i++) {
        var index = returnData.friends[i];
        templete +=
            `
            <li id="${index.userId}" demo="${i}">
                <img src="${index.avatar}" alt="" class="header" id="${index.userId}" demo="${i}">
                <div class="content" id="${index.userId}" demo="${i}">
                    <div class="friend-name" id="${index.userId}" demo="${i}">${index.nickname}</div>
                    <div class="message" id="${index.userId}" demo="${i}">
                        ${index.introduction}
                    </div>
                </div>
            </li>
            `
    }
    ul_list.innerHTML = templete;
    showChatArea(length, returnData)
}

/**
 * 点击弹出聊天框
 *
 * @param   {[type]}  length      [length description]
 * @param   {[type]}  returnData  [returnData description]
 *
 * @return  {[type]}              [return description]
 */
function showChatArea(length, returnData) {
    var chat_area = document.getElementById('chat-area');
    chat_area.style.height = scroll.offsetHeight + 'px';
    var friends_box = document.getElementsByClassName('friends-box')[0];
    var ul_list = friends_box.getElementsByClassName('list')[0];
    var close = chat_area.getElementsByClassName('close')[0];

    ul_list.onclick = function(e) {
        if (e.target.tagName === 'LI' || e.target.className === 'header' || e.target.parentElement.className === 'content') {
            var friendId = e.target.getAttribute('id');
            var demo = e.target.getAttribute('demo');
            chat_area.style.display = 'block';
            scroll.style.overflow = "hidden";
            handleChat(friendId);
            renderChatBox(length, returnData, demo, chat_area);
        }
        close.onclick = function() {
            chat_area.style.display = 'none';
            scroll.style.overflow = "visible";
        }
    }

}

/**
 * 渲染聊天框
 *
 * @param   {[type]}  length      [length description]
 * @param   {[type]}  returnData  [returnData description]
 * @param   {[type]}  demo        [demo description]
 * @param   {[type]}  chat_area   [chat_area description]
 *
 * @return  {[type]}              [return description]
 */
function renderChatBox(length, returnData, demo, chat_area) {
    var name = chat_area.getElementsByClassName('name')[0];
    name.innerHTML = returnData.friends[demo].nickname;
    var chat_body = document.getElementsByClassName('chat-body')[0];
    var src = returnData.friends[demo].avatar;
    for (let i = 0; i < length; i++) { //length是好友列表的长度，一个个好友这样地请求未读记录
        var xhr = new XMLHttpRequest();
        var URL = 'http://47.97.204.234:3000/chat/getMessage';
        xhr.open('GET', URL + '?userId=' + userId, true);
        xhr.send();
        xhr.onload = function() {
            var returnData = JSON.parse(this.responseText);
            console.log(returnData);
            if (returnData.result === 'success') {
                var templete = '';
                if (returnData.message === '获取成功') { //如果请求到这个好友的是有记录的，那么就渲染聊天框为有消息
                    for (let i = 0; i < returnData.newMessages.length; i++) {
                        var index = returnData.newMessages[i];
                        templete +=
                            `
                        <div class="receive clearfix">
                            <div class="time">
                                <span>${index.time.slice(12,16)}</span>
                            </div>
                            <div class="chat-message clearfix">
                                <img src="${src}" alt="" class="not-my-header">
                                <div class="inter">
                                    <xmp>${index.content}</xmp>
                                </div>
                            </div>
                        </div>
                        <div class="send clearfix">
                            <div class="time">
                                <span class="hour">${new Date().getHours()}</span>
                                <span>:</span>
                                <span class="minute">${new Date().getMinutes()}</span>
                            </div>
                        </div>
                        `
                    }
                } else { //如果没有消息那就不渲染聊天框
                    return;
                }
                chat_body.innerHTML = templete;
            }
        }
    }
}

/**
 * 发送消息
 *
 * @param   {[type]}  friendId  [friendId description]
 *
 * @return  {[type]}            [return description]
 */
function handleChat(friendId) {
    var btn = document.getElementById("chat-btn");
    var txt = document.getElementById("txt");
    var chat_body = document.getElementsByClassName('chat-body')[0];
    var src = document.getElementById('home-top-sulpture').src;

    btn.onclick = function() {
        if (txt.value == "") {
            alert("请勿发送空内容");
        } else {
            var xhr = new XMLHttpRequest();
            var URL = 'http://47.97.204.234:3000/chat/sendMessage';
            xhr.open('POST', URL, true);
            var params = {
                userId: userId,
                friendId: friendId,
                content: txt.value,
            }
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function() {
                var returnData = JSON.parse(this.responseText);
                console.log(returnData);
                if (returnData.result === 'success') {
                    var sulpure = document.createElement('img'); //自己的头像
                    var inter = document.createElement("div"); //要发送的内容
                    var sendbox = document.createElement('div');
                    var chat_message = document.createElement('div');
                    var time = document.createElement('div');
                    var templete =
                        `
                    <span class="hour">${new Date().getHours()}</span>
                    <span>:</span>
                    <span class="minute">${new Date().getMinutes()}</span>
                    `
                    inter.classList.add('inter');
                    sulpure.classList.add('my-header');
                    sendbox.classList.add('send');
                    sendbox.classList.add('clearfix');
                    chat_message.classList.add('chat-message');
                    chat_message.classList.add('clearfix');
                    time.classList.add('time');
                    time.innerHTML = templete;
                    sulpure.src = src;
                    inter.innerText = txt.value;
                    chat_message.appendChild(sulpure);
                    chat_message.appendChild(inter);
                    sendbox.appendChild(time);
                    sendbox.appendChild(chat_message);
                    chat_body.appendChild(sendbox);
                    txt.value = "";
                    inter.scrollIntoView();
                }
            }
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
                var xhr = new XMLHttpRequest();
                var URL = 'http://47.97.204.234:3000/chat/sendMessage';
                xhr.open('POST', URL, true);
                var params = {
                    userId: userId,
                    friendId: friendId,
                    content: txt.value,
                }
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function() {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        var sulpure = document.createElement('img'); //自己的头像
                        var inter = document.createElement("div"); //要发送的内容
                        var sendbox = document.createElement('div');
                        var chat_message = document.createElement('div');
                        var time = document.createElement('div');
                        var templete =
                            `
                            <span class="hour">${new Date().getHours()}</span>
                            <span>:</span>
                            <span class="minute">${new Date().getMinutes()}</span>
                            `
                        inter.classList.add('inter');
                        sulpure.classList.add('my-header');
                        sendbox.classList.add('send');
                        sendbox.classList.add('clearfix');
                        chat_message.classList.add('chat-message');
                        chat_message.classList.add('clearfix');
                        time.classList.add('time');
                        time.innerHTML = templete;
                        sulpure.src = src;
                        inter.innerText = txt.value;
                        chat_message.appendChild(sulpure);
                        chat_message.appendChild(inter);
                        sendbox.appendChild(time);
                        sendbox.appendChild(chat_message);
                        chat_body.appendChild(sendbox);
                        txt.value = "";
                        inter.scrollIntoView();
                    }
                }
            }
        }
    }
}

/**
 * 
 * 点击头像
 */
(function() {
    var head_menu = document.getElementsByClassName('head-menu')[0];
    var sulpture = document.getElementById('home-top-sulpture');

    sulpture.onclick = function(e) {
        head_menu.style.display = 'block';
        if (e.stopPropagation) {
            e.stopPropagation(); //W3C模式下
        } else {
            e.cancelBubble = true; //IE独有
        }
    };

    document.onclick = function(e) {
        var event = e || event;
        var target = e.target || e.srcElement;
        if (e.target.className != 'head_menu') //事件对象
        {
            head_menu.style.display = "none";
        }
    };
})();

/**
 * 
 * 获得文章 + 点击加载全文
 */
(function() {
    var URL = 'http://47.97.204.234:3000/article/getArticles';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL + '?userId=' + userId + '&start=0&stop=18', true);
    xhr.send();
    xhr.onload = function() {
        var returnData = JSON.parse(this.responseText);
        console.log(returnData);
        if (returnData.result === 'success') {
            renderArticalList(returnData);
            showComment();
            handleSwitch();
            renderLike();
            renderDislike();
        }
    }
})();

/**
 * 阅读全文和折叠文章
 *
 * @return  {[type]}  [return description]
 */
function handleSwitch() {
    var key = document.getElementsByClassName('inner-btn');
    var folded_article = document.getElementsByClassName('inner');
    var unfolded_article = document.getElementsByClassName('whole-article');
    var fold_key = document.getElementsByClassName('fold');
    for (let i = 0; i < key.length; i++) {
        key[i].onclick = function() {
            folded_article[i].style.display = 'none';
            unfolded_article[i].style.display = 'block';
            fold_key[i].style.display = 'block';
        }
        fold_key[i].onclick = function() {
            folded_article[i].style.display = 'block';
            unfolded_article[i].style.display = 'none';
            fold_key[i].style.display = 'none';
        }
    }
}

/**
 * 渲染文章
 *
 * @param   {[type]}  returnData  [returnData description]
 *
 * @return  {[type]}              [return description]
 */
function renderArticalList(returnData) {
    var article_list = document.getElementsByClassName('article-list')[0];
    var length = returnData.articles.length;
    var templete = '';
    for (var i = 0; i < length; i++) {
        var index = returnData.articles[i];
        templete +=
            `
                <div class="article">
                <div class="article-title">
                    <a href="">
                        ${index.title}
                    </a>
                </div>
                <div class="inner">
                    <span class="inner-text">
                        ${index.content.join('')}
                    </span>
                    <button type="button" class="inner-btn">
                        <span>阅读全文</span>
                        <i class="iconfont">&#xe698;</i>
                    </button>
                </div>

                <div class="whole-article clearfix">
                    <div class="author">
                        <img src="${index.avatar}" alt="">
                        <span class="author-name">${index.nickname}</span>
                    </div>
                    <div class="voter">
                        <span class="vote-num">${index.likeNum}</span>
                        <span>人赞同了该回答</span>
                    </div>
                    <div class="inner-whole-text">
                        ${index.content.join('')}
                    </div>
                    <div class="public-time">
                        <span>编辑于</span>
                        <span class="date">${index.issueTime.slice(0,10)}</span>
                    </div>
                </div>

                <ul class="action clearfix">
                    <li>
                        <button type="button" class="agree ${index.liked && !index.disliked  ? 'selected' : ''}" id="${index.articleId}">
                            <i class="triangle">▲</i>
                            <span class="agree-text">${index.liked ? '已赞同' : '赞同'}</span>
                            <span class="agree-num">${index.likeNum}</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="dis-agree ${index.disliked && !index.liked ? 'selected' : ''}" id="${index.articleId}">
                        ▲
                        </button>
                    </li>
                    <li>
                        <button type="button" class="inner-func comment-key" id="${index.articleId}">
                            <i class="iconfont">&#xe62e;</i>
                            <span class="comment-num">${index.commentNum}</span>
                            <span>条评论</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="inner-func">
                            <i class="iconfont">&#xe7d5;</i>
                            <span>分享</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="inner-func">
                            <i class="iconfont">&#xe671;</i>
                            <span>收藏</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="inner-func">
                            <i class="iconfont">&#xe65c;</i>
                            <span>喜欢</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="inner-func">
                            <span>···</span>
                        </button>
                    </li>
                    <li class="fold">
                        <span>收起</span>
                        <i class="iconfont">&#xe632;</i>
                    </li>
                </ul>

                <div class="comment-wrapper">
                    <div class="comment-box">
            
                    </div>
                    <div class="comment-common">
                        <div class="page-index">
                            
                        </div>

                        <div class="input-comment clearfix">
                            <input type="text" class="self-comment-text" placeholder="写下你的评论…">
                            <button type="button" class="submit-comment">发布</button>
                        </div>
                    </div>
                    <div class="mask">
                        <div class="text">
                            <span>L</span>
                            <span>O</span>
                            <span>A</span>
                            <span>D</span>
                            <span>I</span>
                            <span>N</span>
                            <span>G</span>
                        </div>
                    </div>
                </div>
            </div>
            `
    }
    article_list.innerHTML = templete;
}


/**
 * 渲染点赞文章
 *
 * @return  {[type]}  [return description]
 */
function renderLike() {
    var liked = document.getElementsByClassName('agree');
    var like_text = document.getElementsByClassName('agree-text');
    var like_num = document.getElementsByClassName('agree-num');
    var URL = 'http://47.97.204.234:3000/article/likeArticle';
    for (let i = 0; i < liked.length; i++) {
        liked[i].onclick = function() {
            var articleId = this.getAttribute('id');
            var isSelected = this.classList.contains('selected');
            var dislikeDom = liked[i].parentElement.nextElementSibling.firstElementChild;
            if (!isSelected) {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    articleId: articleId,
                    like: true,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function() {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        liked[i].classList.add('selected');
                        like_text[i].innerHTML = '已赞同'
                        like_num[i].innerHTML++;
                        if (dislikeDom.classList.contains('selected')) {
                            dislikeDom.classList.remove('selected');
                            dislikeDom.style.color = '#0084ff';
                        }
                    }
                }
            } else {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    articleId: articleId,
                    like: false,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function() {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        liked[i].classList.remove('selected');
                        like_text[i].innerHTML = '赞同'
                        like_num[i].innerHTML--;
                    }
                }
            }
        }
    }
}

/**
 * 渲染点踩文章
 *
 * @return  {[type]}  [return description]
 */
function renderDislike() {
    var disliked = document.getElementsByClassName('dis-agree');
    var dislikedURL = 'http://47.97.204.234:3000/article/dislikeArticle';
    for (let i = 0; i < disliked.length; i++) {
        disliked[i].onclick = function() {
            var articleId = this.getAttribute('id');
            var isSelected = this.classList.contains('selected');
            var likeDom = disliked[i].parentElement.previousElementSibling.firstElementChild;
            if (!isSelected) {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    articleId: articleId,
                    dislike: true,
                }
                xhr.open('POST', dislikedURL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function() {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        disliked[i].classList.add('selected');
                        disliked[i].style.color = '#fff';
                        if (likeDom.classList.contains('selected')) {
                            likeDom.classList.remove('selected');
                            likeDom.firstElementChild.nextElementSibling.innerHTML = '赞同'
                            likeDom.lastElementChild.innerHTML--;
                        }
                    }
                }
            } else {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    articleId: articleId,
                    dislike: false,
                }
                xhr.open('POST', dislikedURL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function() {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        disliked[i].classList.remove('selected');
                        disliked[i].style.color = '#0084ff';
                    }
                }
            }
        }
    }

}

/**
 * 显示评论区
 *
 * @return  {[type]}  [return description]
 */
function showComment() {
    var comment_key = document.getElementsByClassName('comment-key');
    var comment_area = document.getElementsByClassName('comment-wrapper');
    var comment_common = document.getElementsByClassName('comment-common');
    var mask = document.getElementsByClassName('mask');
    var count = [];

    for (let i = 0; i < comment_key.length; i++) {
        count.push(0);
        comment_key[i].onclick = function() {
            var articleId = this.getAttribute('id');
            if (count[i] % 2 === 0) {
                setTimeout(function() {
                    comment_area[i].style.display = 'block';
                    comment_common[i].style.display = 'block';
                }, 100)
                setTimeout(function() {
                    mask[i].style.opacity = '0';
                    mask[i].style.transition = 'opacity .4s'
                }, 800)
                setTimeout(function() {
                    mask[i].style.display = 'none';
                }, 1300)
                count[i]++;
                renderComment(articleId, i);
                // mask[i].remove;
            } else {
                comment_area[i].style.display = 'none';
                comment_common[i].style.display = 'none';
                count[i]++;
            }
        }
    }
}

/**
 * 渲染评论区
 *
 * @param   {[type]}  articleId  [articleId description]
 * @param   {[type]}  i          [i description]
 *
 * @return  {[type]}             [return description]
 */
function renderComment(articleId, i) {
    var comment_box = document.getElementsByClassName('comment-box');
    var xhr = new XMLHttpRequest();
    var URL = 'http://47.97.204.234:3000/article/getComments';
    xhr.open('GET', URL + '?userId=' + userId + '&articleId=' + articleId, true);
    xhr.send();
    xhr.onload = function() {
            var returnData = JSON.parse(this.responseText);
            console.log(returnData);
            if (returnData.result === 'success') {
                if (returnData.message === '该文章没有评论') {
                    var templete = '';
                } else if (returnData.message === '请求成功') {
                    var length = returnData.comments.length;
                    var templete =
                        `
                        <div class="comment-top">
                            <div>
                                <span class="comment-num">${length}</span>
                                <span>条评论</span>
                            </div>
                        </div>
                        <div class="comment-title">
                            <span>评论</span>
                            <span>(</span>
                            <span class="all-comment-num">${length}</span>
                            <span>)</span>
                        </div>
                        `;
                    var commentIdList = [];
                    for (let i = 0; i < length; i++) {
                        var index = returnData.comments[i];
                        commentIdList.push(index.commentId);
                        templete +=
                            `
                            <div class="comment-list">
                                <div class="inner-comment-box">
                                    <div class="comment-bar">
                                        <div class="inner-comment-top clearfix">
                                            <img src="${index.avatar}" alt="" class="avatarV1">
                                            <span class="authorV1">${index.nickname}</span>
                                            <div class="comment-time">${index.time.slice(0,10)}</div>
                                        </div>
                                        <div class="inner-comment">
                                            <div class="inner-comment-text">
                                                <xmp>${index.content}</xmp>
                                            </div>
                                            <ul class="comment-footer">
                                                <li class="check-comment-box" id="${index.commentId}">
                                                    <svg class="Zi Zi--Comments" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M11 2c5.571 0 9 4.335 9 8 0 6-6.475 9.764-11.481 8.022-.315-.07-.379-.124-.78.078-1.455.54-2.413.921-3.525 1.122-.483.087-.916-.25-.588-.581 0 0 .677-.417.842-1.904.064-.351-.14-.879-.454-1.171A8.833 8.833 0 0 1 2 10c0-3.87 3.394-8 9-8zm10.14 9.628c.758.988.86 2.009.86 3.15 0 1.195-.619 3.11-1.368 3.938-.209.23-.354.467-.308.722.12 1.073.614 1.501.614 1.501.237.239-.188.562-.537.5-.803-.146-1.495-.42-2.546-.811-.29-.146-.336-.106-.563-.057-2.043.711-4.398.475-6.083-.927 5.965-.524 8.727-3.03 9.93-8.016z" fill-rule="evenodd"></path></svg>
                                                    <span>查看回复</span>
                                                </li>
                                                <li class="niceComment-key ${index.liked && !index.disliked ? 'active' : ''}" id="${index.commentId}">
                                                    <svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></path></svg>
                                                    <span>${index.likeNum}</span>
                                                </li>
                                                <li class="badComment-key ${index.disliked && !index.liked ? 'active' : ''}" id="${index.commentId}">
                                                <svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="transform: rotate(180deg); margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
                                                    <span>${index.disliked ? '取消踩' : '踩'}</span>
                                                </li>
                                                ${index.userId !== userId ? 
                                                `
                                                <li class="reply-key" id="${index.commentId}">
                                                    <svg class="Zi Zi--Reply" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M22.959 17.22c-1.686-3.552-5.128-8.062-11.636-8.65-.539-.053-1.376-.436-1.376-1.561V4.678c0-.521-.635-.915-1.116-.521L1.469 10.67a1.506 1.506 0 0 0-.1 2.08s6.99 6.818 7.443 7.114c.453.295 1.136.124 1.135-.501V17a1.525 1.525 0 0 1 1.532-1.466c1.186-.139 7.597-.077 10.33 2.396 0 0 .396.257.536.257.892 0 .614-.967.614-.967z" fill-rule="evenodd"></path></svg>
                                                    <span>回复</span>
                                                </li>
                                                ` : ''}
                                                ${index.userId === userId ? 
                                                `
                                                <li class="delete-key" id="${index.commentId}">
                                                    <svg class="Zi Zi--Trash" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M16.464 4s.051-2-1.479-2H9C7.194 2 7.465 4 7.465 4H4.752c-2.57 0-2.09 3.5 0 3.5l1.213 13.027S5.965 22 7.475 22h8.987c1.502 0 1.502-1.473 1.502-1.473l1.2-13.027c2.34 0 2.563-3.5 0-3.5h-2.7zM8.936 18.5l-.581-9h1.802v9H8.936zm4.824 0v-9h1.801l-.61 9H13.76z" fill-rule="evenodd"></path></svg>
                                                    <span>删除</span>
                                                </li>
                                                ` : ''}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="reply-wrapper">
                                ${index.replied ? 
                                    `
                                    <div class="reply-box" id="${index.commentId}">
                                    </div>
                                    ` 
                                : ''}

                                    ${index.userId !== userId ? 
                                    `
                                    <div class="input-reply" clearfix">
                                        <input type="text" class="self-reply-text" placeholder="回复${index.nickname}">
                                        <button type="button" class="submit-reply" id="${index.commentId}">发布</button>
                                    </div>
                                    `
                                    :''}
                                </div>
                            </div>
                                `
                    renderReply(commentIdList);
                }
            }
            comment_box[i].innerHTML = templete;
            handleComment(articleId, i);
        }
        paging(returnData, i);
        showCheckBox(commentIdList);
        showReplyInput(commentIdList);
    }
}

/**
 * 分页操作
 *
 * @param   {[type]}  returnData  [returnData description]
 * @param   {[type]}  i           [i description]
 *
 * @return  {[type]}              [return description]
 */
function paging(returnData, i) {
    var comment_box = document.getElementsByClassName('comment-box')[i];
    var comment_list = comment_box.getElementsByClassName('comment-list');
    var perPage = 4;
    if (returnData.comments) {
        var length = returnData.comments.length;
        var pageNum = length > perPage ? Math.ceil(length / perPage) : 0;
        if (pageNum) {
            var page_index = document.getElementsByClassName('page-index');
            page_index[i].innerHTML = '';
            for (let j = 0; j < pageNum; j++) {
                var span = document.createElement('span');
                span.classList.add('dot');
                span.innerHTML = j + 1;
                span.setAttribute('id', j + 1);
                page_index[i].appendChild(span);
                if (j === 0) {
                    span.classList.add('selected');
                }
            }
            setSpan(perPage, comment_list);
        } else {
            var length = comment_list.length;
            for (let i = 0; i < length; i++) {
                comment_list[i].style.display = 'block';
            }
        }
    }
}

function setSpan(perPage, comment_list) {
    var span = document.getElementsByClassName('dot');
    for (let i = 0; i < span.length; i++) {
        var curIndex = 1;
        for (let i = 0; i < perPage; i++) {
            comment_list[i].style.display = 'block';
        }
        span[i].onclick = function () {
            for (let i = 0; i < span.length; i++) {
                if (span[i].classList.contains('selected')) {
                    span[i].classList.remove('selected');
                }
            }
            this.classList.add('selected');
            curIndex = this.getAttribute('id');
            var length = comment_list.length;
            for (let i = 0; i < length; i++) {
                if (curIndex * 4 <= length) {
                    if (i >= curIndex * 4 - 4 && i < curIndex * 4) {
                        comment_list[i].style.display = 'block';
                    } else {
                        comment_list[i].style.display = 'none';
                    }
                } else {
                    if (i >= curIndex * 4 - 4 && i < length) {
                        comment_list[i].style.display = 'block';
                    } else {
                        comment_list[i].style.display = 'none';
                    }
                }
            }
        }
    }
}

/**
 * 发表评论
 *
 * @return  {[type]}  [return description]
 */
function handleComment(articleId, i) {
    var action = document.getElementsByClassName('action')[i];
    var comment_num = action.getElementsByClassName('comment-num')[0];
    console.log(comment_num);
    var comment_btn = document.getElementsByClassName('submit-comment');
    for (let i = 0; i < comment_btn.length; i++) {
        comment_btn[i].onclick = function () {
            var xhr = new XMLHttpRequest();
            var URL = 'http://47.97.204.234:3000/article/comment';
            xhr.open('POST', URL, true);
            var self = this;
            var params = {
                userId: userId,
                articleId: articleId,
                content: this.previousElementSibling.value,
            }
            if (params.content === '') {
                alert('请输入评论内容！');
            } else {
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    if (returnData.result === 'success') {
                        renderComment(articleId, i)
                        self.previousElementSibling.value = '';
                        comment_num.innerHTML++;
                    }
                }
            }
        }
    }
    deleteComment(i);
    likeComment();
    dislikeComment();
}

/**
 * 删除评论
 *
 * @param   {[type]}  delete-key  [delete-key description]
 *
 * @return  {[type]}              [return description]
 */
function deleteComment(i) {
    var action = document.getElementsByClassName('action')[i];
    var comment_num = action.getElementsByClassName('comment-num')[0];
    var delete_key = document.getElementsByClassName('delete-key');
    var URL = 'http://47.97.204.234:3000/article/deleteComment';
    for (let i = 0; i < delete_key.length; i++) {
        delete_key[i].onclick = function () {
            var self = this.parentElement.parentElement.parentElement.parentElement.parentElement;
            var delete_id = this.getAttribute('id');
            var xhr = new XMLHttpRequest();
            var params = {
                userId: userId,
                commentId: delete_id,
            }
            xhr.open('DELETE', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");

            xhr.send(JSON.stringify(params));
            xhr.onload = function () {
                var returnData = JSON.parse(this.responseText);
                console.log(returnData);
                if (returnData.result === 'success') {
                    self.parentElement.firstElementChild.nextElementSibling.lastElementChild.previousElementSibling.innerHTML--;
                    self.parentElement.firstElementChild.firstElementChild.firstElementChild.innerHTML--;
                    self.remove();
                    comment_num.innerHTML--;
                }
            }
        }
    }
}

/**
 * 点赞评论
 *
 * @param   {[type]}  niceComment-key  [niceComment-key description]
 *
 * @return  {[type]}                   [return description]
 */
function likeComment() {
    var niceComment_key = document.getElementsByClassName('niceComment-key');
    var badComment_key = document.getElementsByClassName('badComment-key');
    var URL = 'http://47.97.204.234:3000/article/likeComment';
    for (let i = 0; i < niceComment_key.length; i++) {
        niceComment_key[i].onclick = function () {
            var self = this;
            var isActive = this.classList.contains('active');
            var dislikeDom = badComment_key[i].classList.contains('active');
            var nice_id = this.getAttribute('id');
            if (!isActive) {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    commentId: nice_id,
                    like: true,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.style.color = 'rgb(0,132,255)';
                        self.classList.add('active');
                        self.lastElementChild.innerHTML++;
                        if (dislikeDom) {
                            badComment_key[i].classList.remove('active');
                            badComment_key[i].lastElementChild.innerHTML = '踩';
                            badComment_key[i].style.color = 'grey';
                        }
                    }
                }
            } else {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    commentId: nice_id,
                    like: false,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.style.color = 'gray';
                        self.classList.remove('active');
                        self.lastElementChild.innerHTML--;
                    }
                }
            }
        }
    }
}

/**
 * 点踩评论
 *
 * @param   {[type]}  badComment-key  [badComment-key description]
 *
 * @return  {[type]}                  [return description]
 */
function dislikeComment() {
    var badComment_key = document.getElementsByClassName('badComment-key');
    var niceComment_key = document.getElementsByClassName('niceComment-key');
    var URL = 'http://47.97.204.234:3000/article/dislikeComment';
    for (let i = 0; i < badComment_key.length; i++) {
        badComment_key[i].onclick = function () {
            var self = this;
            var isActive = this.classList.contains('active');
            var likeDom = niceComment_key[i].classList.contains('active');
            var bad_id = this.getAttribute('id');
            if (!isActive) {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    commentId: bad_id,
                    dislike: true,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.lastElementChild.innerHTML = '取消踩';
                        self.classList.add('active');
                        if (likeDom) {
                            niceComment_key[i].classList.remove('active');
                            niceComment_key[i].lastElementChild.innerHTML--;
                            niceComment_key[i].style.color = 'gray';
                        }
                    }
                }
            } else {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    commentId: bad_id,
                    dislike: false,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.lastElementChild.innerHTML = '踩';
                        self.classList.remove('active');
                        self.style.color = 'gray';
                    }
                }
            }
        }
    }
}

/**
 * 渲染回复
 *
 * @param   {[type]}  commentIdList  [commentIdList description]
 *
 * @return  {[type]}                 [return description]
 */
function renderReply(commentIdList) {
    var URL = 'http://47.97.204.234:3000/article/getReplies';
    var commentIdList = commentIdList;
    if (commentIdList.length) {
        for (let i = 0; i < commentIdList.length; i++) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', URL + '?userId=' + userId + '&commentId=' + commentIdList[i], true);
            xhr.send();
            xhr.onload = function () {
                var curCommentId = commentIdList[i];
                var returnData = JSON.parse(this.responseText);
                var templete = '';
                if (returnData.result === 'success') {
                    if (returnData.message === '该评论没有回复') {
                        return;
                    } else if (returnData.message === '请求成功') {
                        for (let i = 0; i < returnData.replies.length; i++) {
                            var index = returnData.replies[i];
                            templete +=
                                `
                        <div class="reply-bar">
                            <div class="inner-reply-top clearfix">
                                <img src="${index.avatar}" alt="">
                                <span class="reply-author-name">${index.nickname}</span>
                                <div class="reply-time">${index.time.slice(0,10)}</div>
                            </div>
                            <div class="inner-reply">
                                <div class="inner-reply-text">
                                    <xmp>${index.content}</xmp>
                                </div>
                                <ul class="reply-footer">
                                    <li class="niceReply-key ${index.liked && !index.disliked ? 'active' : ''}" id="${index.replyId}">
                                        <svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></path></svg>
                                        <span>${index.likeNum}</span>
                                    </li>
                                    <li class="badReply-key ${index.disliked && !index.liked ? 'active' : ''}" id="${index.replyId}">
                                        <svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="transform: rotate(180deg); margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
                                        <span>${index.disliked ? '取消踩' : '踩'}</span>
                                    </li>
                                        ${index.userId === userId ? 
                                        `
                                        <li class="delete-btn" id="${index.replyId}">
                                            <svg class="Zi Zi--Trash" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M16.464 4s.051-2-1.479-2H9C7.194 2 7.465 4 7.465 4H4.752c-2.57 0-2.09 3.5 0 3.5l1.213 13.027S5.965 22 7.475 22h8.987c1.502 0 1.502-1.473 1.502-1.473l1.2-13.027c2.34 0 2.563-3.5 0-3.5h-2.7zM8.936 18.5l-.581-9h1.802v9H8.936zm4.824 0v-9h1.801l-.61 9H13.76z" fill-rule="evenodd"></path></svg>
                                            <span>删除</span>
                                        </li>
                                        ` : ''}
                                </ul>
                            </div>
                        </div>
                        `
                        }
                        var reply_box = document.getElementsByClassName('reply-box');
                        for (let j = 0; j < reply_box.length; j++) {
                            var reply_boxId = reply_box[j].getAttribute('id');
                            if (reply_boxId === curCommentId) {
                                reply_box[j].innerHTML = templete;
                            }
                        }
                    }
                }
                deleteReply();
                likeReply();
                dislikeReply();
            }
        }
    }
}

/**
 * 显示回复的input框
 *
 * @param   {[type]}  commentIdList  [commentIdList description]
 *
 * @return  {[type]}                 [return description]
 */
function showReplyInput(commentIdList) {
    var reply_key = document.getElementsByClassName('reply-key');
    var input_area = document.getElementsByClassName('input-reply');
    var count = [];
    for (let i = 0; i < reply_key.length; i++) {
        count.push(0);
        reply_key[i].onclick = function () {
            if (count[i] % 2 === 0) {
                input_area[i].style.display = 'block';
                count[i]++;
            } else {
                input_area[i].style.display = 'none';
                count[i]++;
            }
        }
    }
    handleReply(commentIdList);
}

/**
 * 提交回复
 *
 * @return  {[type]}  [return description]
 */
function handleReply(commentIdList) {
    var reply_btn = document.getElementsByClassName('submit-reply');
    var URL = 'http://47.97.204.234:3000/article/reply';
    for (let i = 0; i < reply_btn.length; i++) {
        reply_btn[i].onclick = function () {
            var commentId = this.getAttribute('id');
            var xhr = new XMLHttpRequest();
            var params = {
                userId: userId,
                commentId: commentId,
                content: this.previousElementSibling.value,
            }
            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function () {
                var returnData = JSON.parse(this.responseText);
                renderReply(commentIdList);
            }
            renderReply(commentIdList);
            this.previousElementSibling.value = '';
        }
    }
}

/**
 * 删除回复
 *
 * @return  {[type]}  [return description]
 */
function deleteReply() {
    var delete_btn = document.getElementsByClassName('delete-btn');
    var URL = 'http://47.97.204.234:3000/article/deleteReply';
    for (let i = 0; i < delete_btn.length; i++) {
        delete_btn[i].onclick = function () {
            var self = this.parentElement.parentElement.parentElement;
            var reply_Id = this.getAttribute('id');
            var xhr = new XMLHttpRequest();
            var params = {
                userId: userId,
                replyId: reply_Id,
            }
            xhr.open('DELETE', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function () {
                var returnData = JSON.parse(this.responseText);
                console.log(returnData);
                if (returnData.result === 'success') {
                    self.remove();
                }
            }
        }
    }
}

/**
 * 点赞回复
 *
 * @return  {[type]}  [return description]
 */
function likeReply() {
    var niceReply_key = document.getElementsByClassName('niceReply-key');
    var badReply_key = document.getElementsByClassName('badReply-key');
    var URL = 'http://47.97.204.234:3000/article/likeReply';
    for (let i = 0; i < niceReply_key.length; i++) {
        niceReply_key[i].onclick = function () {
            var self = this;
            var isActive = this.classList.contains('active');
            var dislikeDom = badReply_key[i].classList.contains('active');
            var nice_id = this.getAttribute('id');
            if (!isActive) {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    replyId: nice_id,
                    like: true,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.style.color = 'rgb(0,132,255)';
                        self.classList.add('active');
                        self.lastElementChild.innerHTML++;
                        if (dislikeDom) {
                            badReply_key[i].classList.remove('active');
                            badReply_key[i].lastElementChild.innerHTML = '踩';
                            badReply_key[i].style.color = 'grey';
                        }
                    }
                }
            } else {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    replyId: nice_id,
                    like: false,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.style.color = 'gray';
                        self.classList.remove('active');
                        self.lastElementChild.innerHTML--;
                    }
                }
            }
        }
    }
}

/**
 * 点踩回复
 *
 * @return  {[type]}  [return description]
 */
function dislikeReply() {
    var badReply_key = document.getElementsByClassName('badReply-key');
    var niceReply_key = document.getElementsByClassName('niceReply-key');
    var URL = 'http://47.97.204.234:3000/article/dislikeReply';
    for (let i = 0; i < badReply_key.length; i++) {
        badReply_key[i].onclick = function () {
            var self = this;
            var isActive = this.classList.contains('active');
            var likeDom = niceReply_key[i].classList.contains('active');
            var bad_id = this.getAttribute('id');
            if (!isActive) {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    replyId: bad_id,
                    dislike: true,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.lastElementChild.innerHTML = '取消踩';
                        self.classList.add('active');
                        if (likeDom) {
                            niceReply_key[i].classList.remove('active');
                            niceReply_key[i].lastElementChild.innerHTML--;
                            niceReply_key[i].style.color = 'gray';
                        }
                    }
                }
            } else {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    replyId: bad_id,
                    dislike: false,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.lastElementChild.innerHTML = '踩';
                        self.classList.remove('active');
                        self.style.color = 'gray';
                    }
                }
            }
        }
    }
}

/**
 * 展示回复框
 *
 * @return  {[type]}  [return description]
 */
function showCheckBox(commentIdList) {
    var commentV2 = document.getElementById('commentV2');
    commentV2.style.height = document.body.offsetHeight + 'px';
    var check_key = document.getElementsByClassName('check-comment-box');
    var close = commentV2.getElementsByClassName('close')[0];
    var barV2 = document.getElementsByClassName('barV2')[0];
    if (barV2.overflow) {
        barV2.style.overflowY = 'scroll';
    } else {
        barV2.style.overflow = 'hidden';
    }
    for (let i = 0; i < check_key.length; i++) {
        check_key[i].onclick = function () {
            var commentId = this.getAttribute('id');
            commentV2.style.display = 'block';
            scroll.style.overflow = "hidden";
            renderCheckBox(commentId, i, commentIdList);
        }
    }
    close.onclick = function () {
        commentV2.style.display = 'none';
        scroll.style.overflow = "visible";
    }
}

/**
 * 渲染评论框的评论
 *
 * @param   {[type]}  commentId  [commentId description]
 * @param   {[type]}  i          [i description]
 * @param   {[type]}  commentV2  [commentV2 description]
 *
 * @return  {[type]}             [return description]
 */
function renderCheckBox(commentId, i, commentIdList) {
    var avatarV2 = null;
    var authorV2 = null;
    var timeV2 = null;
    var textV2 = null;
    var niceV2 = null;
    var badV2 = null;
    var commentId = commentId;
    var inner_comment_box = document.getElementsByClassName('inner-comment-box')[i];
    var reply_wrapper = document.getElementsByClassName('reply-wrapper')[i];

    // 获取评论框中需要填充内容的元素
    avatarV2 = document.getElementsByClassName('avatarV2')[0];
    authorV2 = document.getElementsByClassName('authorV2')[0];
    timeV2 = document.getElementsByClassName('timeV2')[0];
    textV2 = document.getElementsByClassName('inner-textV2')[0];
    niceV2 = document.getElementsByClassName('niceV2')[0];
    badV2 = document.getElementsByClassName('badV2')[0];

    // 获取评论框中该填充的内容的元素
    var avatarV1 = inner_comment_box.getElementsByTagName('img')[0];
    var authorV1 = inner_comment_box.getElementsByClassName('authorV1')[0];
    var timeV1 = inner_comment_box.getElementsByClassName('comment-time')[0];
    var textV1 = inner_comment_box.getElementsByClassName('inner-comment-text')[0];
    var niceV1 = inner_comment_box.getElementsByClassName('niceComment-key')[0];
    var badV1 = inner_comment_box.getElementsByClassName('badComment-key')[0];

    avatarV2.src = avatarV1.src + '';
    authorV2.innerHTML = authorV1.innerHTML;
    timeV2.innerHTML = timeV1.innerHTML;
    textV2.innerHTML = textV1.innerHTML;
    niceV2.innerHTML = niceV1.innerHTML;
    badV2.innerHTML = badV1.innerHTML;
    if (niceV1.classList.contains('active')) {
        niceV2.classList.add('active');
    } else {
        niceV2.classList.remove('active');
    }

    if (badV1.classList.contains('active')) {
        badV2.classList.add('active');
    } else {
        badV2.classList.remove('active');
    }

    renderCheckBoxReply(reply_wrapper, commentId)
    handleCheckCommentLike(commentId, niceV1);
    handleCheckCommentDislike(commentId, badV1);
    renderCheckBoxComment(commentId, reply_wrapper, commentIdList);
}

/**
 * 渲染评论框的回复
 *
 * @param   {[type]}  reply_wrapper  [reply_wrapper description]
 * @param   {[type]}  commentId      [commentId description]
 *
 * @return  {[type]}                 [return description]
 */
function renderCheckBoxReply(reply_wrapper, commentId) {
    var listV2 = document.getElementsByClassName('listV2')[0];
    var num = commentV2.getElementsByClassName('num')[0];
    var niceReplyKeyV1 = reply_wrapper.getElementsByClassName('niceReply-key');
    var badReplyKeyV1 = reply_wrapper.getElementsByClassName('badReply-key');
    var templete = '';
    var xhr = new XMLHttpRequest();
    var URL = 'http://47.97.204.234:3000/article/getReplies';
    xhr.open('GET', URL + '?userId=' + userId + '&commentId=' + commentId, true);
    xhr.send();
    xhr.onload = function () {
        var returnData = JSON.parse(this.responseText);
        console.log(returnData);
        var length;
        if (returnData.message === '该评论没有回复') {
            templete = '';
            length = 0;
        } else if (returnData.message === '请求成功') {
            length = returnData.replies.length;
            for (let i = 0; i < length; i++) {
                var index = returnData.replies[i];
                templete +=
                    `
                <div class="infoV2">
                <div class="innerTopV2 clearfix">
                    <img src="${index.avatar}" alt="">
                    <span>${index.nickname}</span>
                    <div class="timeV2">${index.time.slice(0,10)}</div>
                </div>
                <div class="innerV2">
                    <div class="inner-textV2">
                        ${index.content}
                    </div>
                    <ul class="footerV2">
                        <li class="niceReplyV2 ${index.liked && !index.disliked ? 'active' : ''}" id="${index.replyId}">
                            <span><svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></path></svg></span>
                            <span>${index.likeNum}</span>
                        </li>
                        <li class="badReplyV2 ${index.disliked && !index.liked ? 'active' : ''}" id="${index.replyId}">
                            <span><svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="transform: rotate(180deg); margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg></span>
                            <span>${index.disliked ? '取消踩' : '踩'}</span>
                        </li>
                    </ul>
                </div>
            </div>
                `
            }
        }
        listV2.innerHTML = templete;
        num.innerHTML = length;
        handleCheckReplyLike(niceReplyKeyV1, badReplyKeyV1);
        handleCheckReplyDislike(niceReplyKeyV1, badReplyKeyV1);
    }
}

/**
 * 评论框中点赞评论
 *
 * @param   {[type]}  commentId  [commentId description]
 * @param   {[type]}  niceV1     [niceV1 description]
 *
 * @return  {[type]}             [return description]
 */
function handleCheckCommentLike(commentId, niceV1) {
    var commentId = commentId;
    var niceV1 = niceV1;
    var niceV2 = document.getElementsByClassName('niceV2')[0];
    var badV2 = document.getElementsByClassName('badV2')[0];
    var URL = 'http://47.97.204.234:3000/article/likeComment';
    niceV2.onclick = function () {
        var self = this;
        var isActive = this.classList.contains('active');
        var dislikeDom = badV2.classList.contains('active');
        if (!isActive) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', URL, true);
            var params = {
                userId: userId,
                commentId: commentId,
                like: true,
            }
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(params));
            xhr.onload = function () {
                var returnData = JSON.parse(this.responseText);
                if (returnData.result === 'success') {
                    self.style.color = 'rgb(0,132,255)';
                    self.classList.add('active');
                    self.lastElementChild.innerHTML++;
                    niceV1.style.color = 'rgb(0,132,255)';
                    niceV1.classList.add('active');
                    niceV1.lastElementChild.innerHTML++;
                    if (dislikeDom) {
                        badV2.classList.remove('active');
                        badV2.lastElementChild.innerHTML = '踩';
                        badV2.style.color = 'grey';
                    }
                }
            }
        } else {
            var xhr = new XMLHttpRequest();
            var params = {
                userId: userId,
                commentId: commentId,
                like: false,
            }
            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function () {
                var returnData = JSON.parse(this.responseText);
                console.log(returnData);
                if (returnData.result === 'success') {
                    self.style.color = 'gray';
                    self.classList.remove('active');
                    self.lastElementChild.innerHTML--;
                    niceV1.style.color = 'gray';
                    niceV1.classList.remove('active');
                    niceV1.lastElementChild.innerHTML--;
                }
            }
        }
    }
}

/**
 * 评论框中点踩评论
 *
 * @param   {[type]}  commentId  [commentId description]
 * @param   {[type]}  badV1      [badV1 description]
 *
 * @return  {[type]}             [return description]
 */
function handleCheckCommentDislike(commentId, badV1) {
    var commentId = commentId;
    var badV1 = badV1;
    var niceV2 = document.getElementsByClassName('niceV2')[0];
    var badV2 = document.getElementsByClassName('badV2')[0];
    var URL = 'http://47.97.204.234:3000/article/dislikeComment'
    badV2.onclick = function () {
        var self = this;
        var isActive = this.classList.contains('active');
        var likeDom = niceV2.classList.contains('active');
        if (!isActive) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', URL, true);
            var params = {
                userId: userId,
                commentId: commentId,
                dislike: true,
            }
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.send(JSON.stringify(params));
            xhr.onload = function () {
                var returnData = JSON.parse(this.responseText);
                if (returnData.result === 'success') {
                    self.lastElementChild.innerHTML = '取消踩';
                    self.classList.add('active');
                    badV1.lastElementChild.innerHTML = '取消踩';
                    badV1.classList.add('active');
                    if (likeDom) {
                        niceV2.classList.remove('active');
                        niceV2.lastElementChild.innerHTML--;
                        niceV2.style.color = 'gray';
                    }
                }
            }
        } else {
            var xhr = new XMLHttpRequest();
            var params = {
                userId: userId,
                commentId: bad_id,
                dislike: false,
            }
            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function () {
                var returnData = JSON.parse(this.responseText);
                console.log(returnData);
                if (returnData.result === 'success') {
                    self.lastElementChild.innerHTML = '踩';
                    self.classList.remove('active');
                    self.style.color = 'gray';
                    badV1.lastElementChild.innerHTML = '踩';
                    badV1.classList.remove('active');
                    badV1.style.color = 'gray';
                }
            }
        }
    }
}

/**
 * 评论框里提交回复
 *
 * @param   {[type]}  commentId  [commentId description]
 *
 * @return  {[type]}             [return description]
 */
function renderCheckBoxComment(commentId, reply_wrapper, commentIdList) {
    var input_commentV2 = document.getElementsByClassName('input-commentV2')[0];
    var reply_keyV2 = document.getElementsByClassName('replyV2')[0];
    var submit_commentV2 = document.getElementsByClassName('submit-commentV2')[0];
    var count = 0;
    reply_keyV2.onclick = function () {
        console.log(count);
        if (count % 2 === 0) {
            input_commentV2.style.display = 'block';
            count++;
        } else {
            input_commentV2.style.display = 'none';
            count++;
        }
    }

    submit_commentV2.onclick = function () {
        var xhr = new XMLHttpRequest();
        var URL = 'http://47.97.204.234:3000/article/reply';
        var params = {
            userId: userId,
            commentId: commentId,
            content: this.previousElementSibling.value,
        }
        xhr.open('POST', URL, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(params));
        xhr.onload = function () {
            var returnData = JSON.parse(this.responseText);
            console.log(returnData);
            renderCheckBoxReply(reply_wrapper, commentId);
            renderReply(commentIdList);
        }
        this.previousElementSibling.value = '';
    }
}

/**
 * 评论框内点赞回复
 *
 * @param   {[type]}  niceReplyKeyV1  [niceReplyKeyV1 description]
 *
 * @return  {[type]}                  [return description]
 */
function handleCheckReplyLike(niceReplyKeyV1, badReplyKeyV1) {
    var niceReplyV2 = document.getElementsByClassName('niceReplyV2');
    var badReplyV2 = document.getElementsByClassName('badReplyV2');
    var URL = 'http://47.97.204.234:3000/article/likeReply';
    for (let i = 0; i < niceReplyV2.length; i++) {
        niceReplyV2[i].onclick = function () {
            var replyId = this.getAttribute('id');
            var self = this;
            var isActive = this.classList.contains('active');
            var dislikeDom = badReplyV2[i].classList.contains('active');
            if (!isActive) {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    replyId: replyId,
                    like: true,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.style.color = 'rgb(0,132,255)';
                        self.classList.add('active');
                        self.lastElementChild.innerHTML++;
                        niceReplyKeyV1[i].style.color = 'rgb(0,132,255)';
                        niceReplyKeyV1[i].classList.add('active');
                        niceReplyKeyV1[i].lastElementChild.innerHTML++;
                        if (dislikeDom) {
                            badReplyV2[i].classList.remove('active');
                            badReplyV2[i].lastElementChild.innerHTML = '踩';
                            badReplyV2[i].style.color = 'grey';
                            badReplyKeyV1[i].classList.remove('active');
                            badReplyKeyV1[i].lastElementChild.innerHTML = '踩';
                            badReplyKeyV1[i].style.color = 'grey';
                        }
                    }
                }
            } else {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    replyId: replyId,
                    like: false,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.style.color = 'gray';
                        self.classList.remove('active');
                        self.lastElementChild.innerHTML--;
                        niceReplyKeyV1[i].style.color = 'gray';
                        niceReplyKeyV1[i].classList.remove('active');
                        niceReplyKeyV1[i].lastElementChild.innerHTML--;
                    }
                }
            }
        }
    }
}

/**
 * 评论框内点踩回复
 *
 * @param   {[type]}  niceReplyKeyV1  [niceReplyKeyV1 description]
 * @param   {[type]}  badReplyKeyV1   [badReplyKeyV1 description]
 *
 * @return  {[type]}                  [return description]
 */
function handleCheckReplyDislike(niceReplyKeyV1, badReplyKeyV1) {
    var niceReplyV2 = document.getElementsByClassName('niceReplyV2');
    var badReplyV2 = document.getElementsByClassName('badReplyV2');
    var URL = 'http://47.97.204.234:3000/article/dislikeReply';
    for (let i = 0; i < badReplyV2.length; i++) {
        badReplyV2[i].onclick = function () {
            var replyId = this.getAttribute('id');
            var self = this;
            var isActive = this.classList.contains('active');
            var likeDom = niceReplyV2[i].classList.contains('active');
            if (!isActive) {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    replyId: replyId,
                    dislike: true,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.lastElementChild.innerHTML = '取消踩';
                        self.classList.add('active');
                        badReplyKeyV1[i].lastElementChild.innerHTML = '取消踩';
                        badReplyKeyV1[i].classList.add('active');
                        if (likeDom) {
                            niceReplyV2[i].classList.remove('active');
                            niceReplyV2[i].lastElementChild.innerHTML--;
                            niceReplyV2[i].style.color = 'gray';
                            niceReplyKeyV1[i].classList.remove('active');
                            niceReplyKeyV1[i].lastElementChild.innerHTML--;
                            niceReplyKeyV1[i].style.color = 'gray';
                        }
                    }
                }
            } else {
                var xhr = new XMLHttpRequest();
                var params = {
                    userId: userId,
                    replyId: replyId,
                    dislike: false,
                }
                xhr.open('POST', URL, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.send(JSON.stringify(params));
                xhr.onload = function () {
                    var returnData = JSON.parse(this.responseText);
                    console.log(returnData);
                    if (returnData.result === 'success') {
                        self.lastElementChild.innerHTML = '踩';
                        self.classList.remove('active');
                        self.style.color = 'gray';
                        badReplyKeyV1[i].lastElementChild.innerHTML = '踩';
                        badReplyKeyV1[i].classList.remove('active');
                        badReplyKeyV1[i].style.color = 'gray';
                    }
                }
            }
        }
    }
}

var username = localStorage.getItem('username');
var password = localStorage.getItem('password');
console.log(username,password);

/**
 * 退出登录
 *
 * @return  {[type]}  [return description]
 */
function handleLogout() {
    var logoutBtn = document.getElementsByClassName('logout')[0];

    logoutBtn.onclick = function () {
        var xhr = new XMLHttpRequest();
        var URL = 'http://47.97.204.234:3000/user/logout';
        var params = {
            username: username,
            password: password,
        }
        xhr.open('POST', URL, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(JSON.stringify(params));
        xhr.onload = function () {
            var returnData = JSON.parse(this.responseText);
            if (returnData.result === 'success') {
                document.getElementById('login-page').style.display = 'block';
                document.getElementById('home-page').style.display = 'none';
                console.log(returnData);
            }
        }
    }
}

/**
 * 去到个人主页
 *
 * @return  {[type]}  [return description]
 */
function handleIndividual() {
    var individualBtn = document.getElementsByClassName('goto-individual')[0];
    individualBtn.onclick = function () {
        document.getElementById('home-page').style.display = 'none';
        document.getElementById('individual-page').style.display = 'block';
        bool = false;
    }
}

handleLogout();
handleIndividual();
handleIndividual();
handleIndividual();