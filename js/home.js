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
            if (e.target.className != 'friends_box') //事件对象
            {
                friends_box.style.display = "none";
            }
        };

        var data = {
            nickname: document.getElementsByClassName('friend-name'),
        }

        var xhr = new XMLHttpRequest();

        xhr.open('GET', 'http://47.97.204.234:3000/user/friendList?userId=5e96e56f6dc8847e998b85f5', true);

        xhr.setRequestHeader("Content-type", "application/json");

        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var returnData = JSON.parse(xhr.responseText);
                console.log(returnData);
                if (returnData.result === 'success') {
                    renderFriendList(returnData);
                }
            }
        }

        var friends_box = document.getElementsByClassName('friends-box')[0];
        var ul_list = friends_box.getElementsByClassName('list')[0];

        function renderFriendList(returnData) {
            var length = returnData.friends.length;
            var templete = '';
            for (var i = 0; i < length; i++) {
                var index = returnData.friends[i];
                templete +=
                    `
                <li>
                    <img src="${index.avatar}" alt="" class="header">
                    <div class="content">
                        <div class="friend-name">${index.nickname}</div>
                        <div class="message">
                            ${index.introduction}
                        </div>
                    </div>
                </li>
                `
            }
            ul_list.innerHTML = templete;
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
    };

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

    };
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
    };
})();

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
 * 获得文章 + 点赞点踩 + 点击加载全文 + 评论
 */
(function() {
        var liked = document.getElementsByClassName('agree');
        var like_text = document.getElementsByClassName('agree-text');
        var disliked = document.getElementsByClassName('dis-agree');
        var isSelected = [];
        var isSelected_ = [];
        var newId = []; //渲染点赞的时候获取文章id的数组
        var newId_ = []; //渲染点踩的时候获取文章id的数组
        var new_Id = []; //渲染评论的时候获取文章id的数组
        var _newId = []; //发表评论的时候获取文章id的数组
        var commentIdList = []; //渲染回复的时候要用到评论的id

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://47.97.204.234:3000/article/getArticles?userId=5e96e56f6dc8847e998b85f5&start=0&stop=18', true);
        xhr.send();
        xhr.onload = function() {
            var returnData = JSON.parse(this.responseText);
            console.log(returnData);
            if (returnData.result === 'success') {
                renderArticalList(returnData);
                renderLiked(returnData);
                renderDislike(returnData);
                handleSwitch();
                handleComment(returnData);
            }
        }

        function handleComment(returnData) {
            var comment_key = document.getElementsByClassName('comment-key');
            var comment_area = document.getElementsByClassName('comment-box');
            var self_comment_input = document.getElementsByClassName('self-comment-text');
            var comment_btn = document.getElementsByClassName('submit-comment');
            var count = 0;
            var exam = 0;

            for (let i = 0; i < comment_key.length; i++) {
                var index = returnData.articles[i];
                _newId.push(index.articleId);
            }

            for (let i = 0; i < comment_key.length; i++) {
                comment_key[i].onclick = function() {

                    if (count % 2 === 0) {
                        comment_area[i].style.display = 'block';
                        count++;
                    } else {
                        comment_area[i].style.display = 'none';
                        count++;
                    }

                    /**
                     * 提交评论
                     *
                     * @return  {[type]}  [return description]
                     */
                    comment_btn[i].onclick = function() {
                        console.log(1);
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', 'http://47.97.204.234:3000/article/comment', true);

                        var params = {
                            userId: '5e96e56f6dc8847e998b85f5',
                            articleId: _newId[i],
                            content: self_comment_input[i].value,
                        }

                        xhr.setRequestHeader("Content-type", "application/json");
                        xhr.send(JSON.stringify(params));

                        xhr.onload = function() {
                            var returnData = JSON.parse(this.responseText);
                            console.log(returnData);
                            if (returnData.result === 'success') {
                                // uploadSelfComment(returnData);

                            }
                        }
                    }

                    /**
                     * 点击回复弹出回复框
                     *
                     * @param   {[type]}  reply-key  [reply-key description]
                     *
                     * @return  {[type]}             [return description]
                     */
                    var reply_key = document.getElementsByClassName('reply-key');
                    var input_reply = document.getElementsByClassName('input-reply clearfix');

                    for (let i = 0; i < reply_key.length; i++) {
                        reply_key[i].onclick = function() {
                            if (exam % 2 === 0) {
                                input_reply[i].style.display = 'block';
                                exam++;
                            } else {
                                input_reply[i].style.display = 'none';
                                exam++;
                            }

                            // /**
                            //  * 提交回复评论的信息
                            //  *
                            //  * @param   {[type]}  submit-reply  [submit-reply description]
                            //  *
                            //  * @return  {[type]}                [return description]
                            //  */
                            // var reply_btn = document.getElementsByClassName('submit-reply');
                            // var self_reply_input = document.getElementsByClassName('self-reply-text');

                            // reply_btn[i].onclick = function() {
                            //     var xhr = new XMLHttpRequest();
                            //     var reply_need_id = this.getAttribute('id');
                            //     var params = {
                            //         userId: '5e96e56f6dc8847e998b85f5',
                            //         commentId: reply_need_id,
                            //         content: self_reply_input[i].value
                            //     }
                            //     xhr.open('POST', 'http://47.97.204.234:3000/article/reply', true);
                            //     xhr.send(JSON.stringify(params));
                            //     xhr.onload = function() {
                            //         var returnData = JSON.parse(this.responseText);
                            //         console.log(returnData);
                            //     }
                            // }
                        }
                    }
                }
            }
        }

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
         * 点赞文章
         *
         * @param   {[type]}  returnData  [returnData description]
         *
         * @return  {[type]}              [return description]
         */
        function renderLiked(returnData) {
            for (let i = 0; i < liked.length; i++) {
                var index = returnData.articles[i];
                isSelected.push(false);
                newId.push(index.articleId);

                liked[i].onclick = function(returnData) {
                    //如渲染页面效果
                    var dislikeDom = this.parentElement.nextElementSibling.firstElementChild;
                    var isDislike = dislikeDom.classList.contains('selected');
                    if (!isSelected[i] && !isDislike) {

                        // 提交点赞数据
                        var xhr = new XMLHttpRequest();
                        var params = {
                            userId: '5e96e56f6dc8847e998b85f5',
                            articleId: newId[i],
                            like: true,
                        }
                        xhr.open('POST', 'http://47.97.204.234:3000/article/likeArticle', true);
                        xhr.setRequestHeader("Content-type", "application/json");
                        xhr.send(JSON.stringify(params));
                        xhr.onload = function() {
                            var returnData = JSON.parse(this.responseText);
                            if (returnData.result === 'success') {
                                index.liked = true;
                                console.log(returnData);
                                init();
                            }
                        }

                        isSelected[i] = true;

                    } else if (isSelected[i] && !isDislike) {
                        this.lastElementChild.innerHTML--;
                        this.firstElementChild.nextElementSibling.innerHTML = '赞同';
                        this.classList.remove('selected');
                        this.firstElementChild.style.color = 'rgb(15, 136, 235)';

                        // 提交取消点赞数据
                        var xhr = new XMLHttpRequest();
                        var params = {
                            userId: '5e96e56f6dc8847e998b85f5',
                            articleId: newId[i],
                            like: false,
                        }
                        xhr.open('POST', 'http://47.97.204.234:3000/article/likeArticle', true);
                        xhr.setRequestHeader("Content-type", "application/json");
                        xhr.send(JSON.stringify(params));
                        xhr.onload = function() {
                            var returnData = JSON.parse(this.responseText);
                            if (returnData.result === 'success') {
                                index.liked = false;
                                console.log(returnData);
                                init();
                            }
                        }

                        isSelected[i] = false;

                    } else if (isDislike) {
                        this.lastElementChild.innerHTML++;
                        this.firstElementChild.nextElementSibling.innerHTML = '已赞同';
                        this.classList.add('selected');
                        this.firstElementChild.style.color = '#fff';
                        dislikeDom.classList.remove('selected');

                        // 提交点赞数据
                        var xhr = new XMLHttpRequest();
                        var params = {
                            userId: '5e96e56f6dc8847e998b85f5',
                            articleId: newId[i],
                            like: true,
                        }
                        xhr.open('POST', 'http://47.97.204.234:3000/article/likeArticle', true);
                        xhr.setRequestHeader("Content-type", "application/json");
                        xhr.send(JSON.stringify(params));
                        xhr.onload = function() {
                            var returnData = JSON.parse(this.responseText);
                            if (returnData.result === 'success') {
                                index.liked = true;
                                console.log(returnData);
                            }
                        }

                        isSelected[i] = true;
                    }
                }
            }
        };

        /**
         * 点踩文章
         *
         * @param   {[type]}  returnData  [returnData description]
         *
         * @return  {[type]}              [return description]
         */
        function renderDislike(returnData) {
            for (let i = 0; i < disliked.length; i++) {
                var index = returnData.articles[i];
                isSelected_.push(false);
                newId_.push(index.articleId);

                disliked[i].onclick = function(returnData) {
                    //如渲染页面效果
                    var likeDom = this.parentElement.previousElementSibling.firstElementChild;
                    var isLike = likeDom.classList.contains('selected');

                    if (!isSelected_[i] && !isLike) {

                        // 提交点踩数据
                        var xhr = new XMLHttpRequest();
                        var params = {
                            userId: '5e96e56f6dc8847e998b85f5',
                            articleId: newId_[i],
                            dislike: true,
                        }
                        xhr.open('POST', 'http://47.97.204.234:3000/article/dislikeArticle', true);
                        xhr.setRequestHeader("Content-type", "application/json");
                        xhr.send(JSON.stringify(params));
                        xhr.onload = function() {
                            var returnData = JSON.parse(this.responseText);
                            if (returnData.result === 'success') {
                                index.disliked = true;
                                console.log(returnData);
                                init();
                            }
                        }

                        isSelected_[i] = true;
                    } else if (isSelected_[i] && !isLike) {
                        this.classList.remove('selected');

                        // 提交取消点踩数据
                        var xhr = new XMLHttpRequest();
                        var params = {
                            userId: '5e96e56f6dc8847e998b85f5',
                            articleId: newId_[i],
                            dislike: false,
                        }
                        xhr.open('POST', 'http://47.97.204.234:3000/article/dislikeArticle', true);
                        xhr.setRequestHeader("Content-type", "application/json");
                        xhr.send(JSON.stringify(params));
                        xhr.onload = function() {
                            var returnData = JSON.parse(this.responseText);
                            if (returnData.result === 'success') {
                                index.disliked = false;
                                console.log(returnData);
                                init();
                            }
                        }

                        isSelected_[i] = false;
                    } else if (isLike) {
                        likeDom.classList.remove('selected');
                        likeDom.lastElementChild.innerHTML--;
                        likeDom.firstElementChild.nextElementSibling.innerHTML = '赞同';
                        likeDom.firstElementChild.style.color = 'rgb(15, 136, 235)';
                        this.classList.add('selected');

                        // 提交点踩数据
                        var xhr = new XMLHttpRequest();
                        var params = {
                            userId: '5e96e56f6dc8847e998b85f5',
                            articleId: newId_[i],
                            dislike: true,
                        }
                        xhr.open('POST', 'http://47.97.204.234:3000/article/dislikeArticle', true);
                        xhr.setRequestHeader("Content-type", "application/json");
                        xhr.send(JSON.stringify(params));
                        xhr.onload = function() {
                            var returnData = JSON.parse(this.responseText);
                            if (returnData.result === 'success') {
                                index.disliked = true;
                                console.log(returnData);
                            }
                        }

                        isSelected_[i] = true;
                    }
                }
            }
        };

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
                        <button type="button" class="agree ${index.liked ? 'selectd' : ''}">
                            <i>▲</i>
                            <span class="agree-text">赞同</span>
                            <span class="agree-num">${index.likeNum}</span>
                        </button>
                    </li>
                    <li>
                        <button type="button" class="dis-agree ${index.disliked ? 'selectd' : ''}">▲</button>
                    </li>
                    <li>
                        <button type="button" class="inner-func comment-key">
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

                <div class="comment-box">

                </div>
            </div>
            `
            }
            article_list.innerHTML = templete;

            renderComment(returnData);
        }

        /**
         * 初始化点赞和点踩文章
         *
         * @return  {[type]}  [return description]
         */
        function init() {
            var liked = document.getElementsByClassName('agree');
            var disliked = document.getElementsByClassName('dis-agree');

            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://47.97.204.234:3000/article/getArticles?userId=5e96e56f6dc8847e998b85f5&start=0&stop=18', true);
            xhr.send();
            xhr.onload = function() {
                var returnData = JSON.parse(this.responseText);
                if (returnData.result === 'success') {
                    for (let i = 0; i < liked.length; i++) {
                        var index = returnData.articles[i];
                        if (index.liked) {
                            liked[i].lastElementChild.innerHTML++;
                            liked[i].firstElementChild.nextElementSibling.innerHTML = '已赞同';
                            liked[i].classList.add('selected');
                            liked[i].firstElementChild.style.color = '#fff';
                        } else if (index.disliked) {
                            disliked[i].classList.add('selected');
                        }
                    }
                }
            }
        };

        /**
         * 
         * 获取评论
         */
        function renderComment(returnData) {
            var comment_box = document.getElementsByClassName('comment-box');

            for (let i = 0; i < liked.length; i++) {
                var index = returnData.articles[i];
                new_Id.push(index.articleId);

                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://47.97.204.234:3000/article/getComments?userId=5e96e56f6dc8847e998b85f5&articleId=' + new_Id[i], true);
                xhr.send();
                xhr.onload = function() {
                        var returnData = JSON.parse(this.responseText);
                        console.log(returnData);
                        if (returnData.result === 'success') {
                            if (returnData.message === '该文章没有评论') {
                                var templete =
                                    `
                                    <div class="input-comment clearfix">
                                        <input type="text" class="self-comment-text" placeholder="写下你的评论…">
                                        <button type="button" class="submit-comment">发布</button>
                                    </div>
                                    `
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
                                        <span class="all-comment-num">(${length})</span>
                                    </div>
                                    `;
                                for (let i = 0; i < length; i++) {
                                    var index = returnData.comments[i];
                                    templete +=
                                        `
                            <div class="comment-list">
                                <div class="inner-comment-box">
                                    <div class="comment-bar">
                                        <div class="inner-comment-top clearfix">
                                            <img src="${index.avatar}" alt="">
                                            <span class="comment-author-name">${index.nickname}</span>
                                            <div class="comment-time">${index.time.slice(0,10)}</div>
                                        </div>
                                        <div class="inner-comment">
                                            <div class="inner-comment-text">
                                                <xmp>${index.content}</xmp>
                                            </div>
                                            <ul class="comment-footer">
                                                <li>
                                                <svg class="Zi Zi--Comments" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M11 2c5.571 0 9 4.335 9 8 0 6-6.475 9.764-11.481 8.022-.315-.07-.379-.124-.78.078-1.455.54-2.413.921-3.525 1.122-.483.087-.916-.25-.588-.581 0 0 .677-.417.842-1.904.064-.351-.14-.879-.454-1.171A8.833 8.833 0 0 1 2 10c0-3.87 3.394-8 9-8zm10.14 9.628c.758.988.86 2.009.86 3.15 0 1.195-.619 3.11-1.368 3.938-.209.23-.354.467-.308.722.12 1.073.614 1.501.614 1.501.237.239-.188.562-.537.5-.803-.146-1.495-.42-2.546-.811-.29-.146-.336-.106-.563-.057-2.043.711-4.398.475-6.083-.927 5.965-.524 8.727-3.03 9.93-8.016z" fill-rule="evenodd"></path></svg>
                                                    <span>查看回复</span>
                                                </li>
                                                <li class="niceComment-key ${index.liked ? 'active' : ''}" id="${index.commentId}">
                                                    <svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></path></svg>
                                                    <span>${index.likeNum}</span>
                                                </li>
                                                <li class="badComment-key ${index.disliked ? 'disliked' : ''}" id="${index.commentId}">
                                                <svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="transform: rotate(180deg); margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
                                                    <span>${index.disliked ? '取消踩' : '踩'}</span>
                                                </li>
                                                ${index.userId !== '5e96e56f6dc8847e998b85f5' ? 
                                                `
                                                <li class="reply-key">
                                                    <svg class="Zi Zi--Reply" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M22.959 17.22c-1.686-3.552-5.128-8.062-11.636-8.65-.539-.053-1.376-.436-1.376-1.561V4.678c0-.521-.635-.915-1.116-.521L1.469 10.67a1.506 1.506 0 0 0-.1 2.08s6.99 6.818 7.443 7.114c.453.295 1.136.124 1.135-.501V17a1.525 1.525 0 0 1 1.532-1.466c1.186-.139 7.597-.077 10.33 2.396 0 0 .396.257.536.257.892 0 .614-.967.614-.967z" fill-rule="evenodd"></path></svg>
                                                    <span>回复</span>
                                                </li>
                                                ` : ''}
                                                ${index.userId === '5e96e56f6dc8847e998b85f5' ? 
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
                                <div class="input-reply clearfix">
                                    <input type="text" class="self-reply-text" placeholder="回复${index.nickname}">
                                    <button type="button" class="submit-reply id="${index.commentId}">发布</button>
                                </div>
                                ${index.replied ? 
                                    `
                                    <div class="reply-box" id="${index.commentId}">
                                
                                    </div>
                                    `
                                    : ''}
                            </div>
                            `
                        }
                        templete +=
                            `
                            <div class="input-comment clearfix">
                                <input type="text" class="self-comment-text" placeholder="写下你的评论…">
                                <button type="button" class="submit-comment">发布</button>
                            </div>
                            `
                    }
                    comment_box[i].innerHTML = templete;
                    renderReply(returnData);
                }

                /**
                 *删除评论
                 */
                var delete_key = document.getElementsByClassName('delete-key');

                for (let i = 0; i < delete_key.length; i++) {
                    delete_key[i].onclick = function () {
                        var self = this.parentElement.parentElement.parentElement.parentElement.parentElement;
                        var delete_id = this.getAttribute('id');
                        var xhr = new XMLHttpRequest();

                        var params = {
                            userId: '5e96e56f6dc8847e998b85f5',
                            commentId: delete_id,
                        }

                        xhr.open('DELETE', 'http://47.97.204.234:3000/article/deleteComment', true);
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

                /**
                 *点赞评论
                 */
                var niceComment_key = document.getElementsByClassName('niceComment-key');
                for (let i = 0; i < niceComment_key.length; i++) {
                    var nice_count = 0;
                    niceComment_key[i].onclick = function () {
                        var self = this;
                        var nice_id = this.getAttribute('id');
                        if (nice_count % 2 === 0) {
                            var xhr = new XMLHttpRequest();
                            var params = {
                                userId: '5e96e56f6dc8847e998b85f5',
                                commentId: nice_id,
                                like: true,
                            }
                            xhr.open('POST', 'http://47.97.204.234:3000/article/likeComment', true);
                            xhr.setRequestHeader("Content-type", "application/json");
                            xhr.send(JSON.stringify(params));
                            xhr.onload = function () {
                                var returnData = JSON.parse(this.responseText);
                                console.log(returnData);
                                if (returnData.result === 'success') {
                                    self.style.color = 'rgb(0,132,255)';
                                    self.classList.add('selected');
                                    self.lastElementChild.innerHTML++;
                                }
                            }
                            nice_count++;
                        } else {
                            var xhr = new XMLHttpRequest();
                            var params = {
                                userId: '5e96e56f6dc8847e998b85f5',
                                commentId: nice_id,
                                like: false,
                            }
                            xhr.open('POST', 'http://47.97.204.234:3000/article/likeComment', true);
                            xhr.setRequestHeader("Content-type", "application/json");
                            xhr.send(JSON.stringify(params));
                            xhr.onload = function () {
                                var returnData = JSON.parse(this.responseText);
                                console.log(returnData);
                                if (returnData.result === 'success') {
                                    self.style.color = 'gray';
                                    self.classList.remove('selected');
                                    self.lastElementChild.innerHTML--;
                                }
                            }
                            nice_count++;
                        }
                    }
                }

                /**
                 *点踩评论
                 */
                var badComment_key = document.getElementsByClassName('badComment-key');
                for (let i = 0; i < badComment_key.length; i++) {
                    var bad_count = 0;
                    badComment_key[i].onclick = function () {
                        var self = this;
                        var bad_id = this.getAttribute('id');
                        if (bad_count % 2 === 0) {
                            var xhr = new XMLHttpRequest();
                            var params = {
                                userId: '5e96e56f6dc8847e998b85f5',
                                commentId: bad_id,
                                dislike: true,
                            }
                            xhr.open('POST', 'http://47.97.204.234:3000/article/dislikeComment', true);
                            xhr.setRequestHeader("Content-type", "application/json");
                            xhr.send(JSON.stringify(params));
                            xhr.onload = function () {
                                var returnData = JSON.parse(this.responseText);
                                console.log(returnData);
                                if (returnData.result === 'success') {
                                    self.lastElementChild.innerHTML = '取消踩';
                                    self.classList.add('selected');
                                }
                            }
                            bad_count++;
                        } else {
                            var xhr = new XMLHttpRequest();
                            var params = {
                                userId: '5e96e56f6dc8847e998b85f5',
                                commentId: bad_id,
                                dislike: false,
                            }
                            xhr.open('POST', 'http://47.97.204.234:3000/article/dislikeComment', true);
                            xhr.setRequestHeader("Content-type", "application/json");
                            xhr.send(JSON.stringify(params));
                            xhr.onload = function () {
                                var returnData = JSON.parse(this.responseText);
                                console.log(returnData);
                                if (returnData.result === 'success') {
                                    self.lastElementChild.innerHTML = '踩';
                                    self.classList.remove('selected');
                                }
                            }
                            bad_count++;
                        }
                    }
                }
            }
        }
    }
})();

function renderReply(returnData) {
    var reply_box = document.getElementsByClassName('reply-box');
    var commentIdList = [];
    for (let i = 0; i < reply_box.length; i++) {
        commentIdList.push(reply_box[i].getAttribute('id'));

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://47.97.204.234:3000/article/getReplies?userId=5e96e56f6dc8847e998b85f5&commentId=' + commentIdList[i], true);
        xhr.send();
        xhr.onload = function () {
            var returnData = JSON.parse(this.responseText);
            console.log(returnData.replies[0]);
            // if (returnData.message === '请求成功') {
            //     var index_ = returnData.replies;
            //     console.log(index_);
            // }
        }
    }
    console.log(commentIdList);
    console.log(reply_box.length);
    //             if (returnData.message === '请求成功') {
    //                 var templete =
    //                     `
    //                 <div class="reply-bar">
    //                 <div class="inner-reply-top clearfix">
    //                     <img src="${index_.avatar}" alt="">
    //                     <span class="reply-author-name">${index_.nickname}</span>
    //                     <div class="reply-time">${index_.time.slice(0,10)}</div>
    //                 </div>
    //                 <div class="inner-reply">
    //                     <div class="inner-reply-text">
    //                         ${index_.content}
    //                     </div>
    //                     <ul class="reply-footer">
    //                         <li>
    //                             <svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></path></svg>
    //                             <span>${index_.likeNum}</span>
    //                         </li>
    //                         <li>
    //                             <svg class="Zi Zi--Reply" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M22.959 17.22c-1.686-3.552-5.128-8.062-11.636-8.65-.539-.053-1.376-.436-1.376-1.561V4.678c0-.521-.635-.915-1.116-.521L1.469 10.67a1.506 1.506 0 0 0-.1 2.08s6.99 6.818 7.443 7.114c.453.295 1.136.124 1.135-.501V17a1.525 1.525 0 0 1 1.532-1.466c1.186-.139 7.597-.077 10.33 2.396 0 0 .396.257.536.257.892 0 .614-.967.614-.967z" fill-rule="evenodd"></path></svg>
    //                             <span>回复</span>
    //                         </li>
    //                         <li>
    //                             <svg class="Zi Zi--Like" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="transform: rotate(180deg); margin-right: 5px;"><path d="M14.445 9h5.387s2.997.154 1.95 3.669c-.168.51-2.346 6.911-2.346 6.911s-.763 1.416-2.86 1.416H8.989c-1.498 0-2.005-.896-1.989-2v-7.998c0-.987.336-2.032 1.114-2.639 4.45-3.773 3.436-4.597 4.45-5.83.985-1.13 3.2-.5 3.037 2.362C15.201 7.397 14.445 9 14.445 9zM3 9h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1z" fill-rule="evenodd"></path></svg>
    //                             <span>踩</span>
    //                         </li>
    //                         <li>
    //                             <svg class="Zi Zi--Report" fill="currentColor" viewBox="0 0 24 24" width="16" height="16" style="margin-right: 5px;"><path d="M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z" fill-rule="evenodd"></path></svg>
    //                             <span>举报</span>
    //                         </li>
    //                     </ul>
    //                 </div>
    //             </div>
    //             `
    //             }
    //             reply_box[i].innerHTML = templete;
    //         }
    //     }
    // }
    // console.log(commentIdList);

    //         {
    //             if (returnData.comments[i].replied) {
    //                 var index = [];
    //                 index.push(returnData.comments);
    //                 commentIdList.push(index.commentId);
    //                 console.log(commentIdList);
    //                 console.log(returnData.comments.length);



    //                 }
    //             }
    //         }
}





/**
 * 点赞
 */
(function () {
    var liked = document.getElementsByClassName('agree');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://47.97.204.234:3000/article/getArticles?userId=5e96e56f6dc8847e998b85f5&start=0&stop=18', true);
    xhr.send();
    xhr.onload = function () {
        var returnData = JSON.parse(this.responseText);
        if (returnData.result === 'success') {
            for (let i = 0; i < liked.length; i++) {
                var index = returnData.articles[i];
                // console.log(index.liked);
                if (index.liked) {
                    liked[i].firstElementChild.nextElementSibling.innerHTML = '已赞同';
                    liked[i].classList.add('selected');
                    liked[i].firstElementChild.style.color = '#fff';
                }
            }
        }
    }
})();

/**
 * 点踩
 */

(function () {
    var disliked = document.getElementsByClassName('dis-agree');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://47.97.204.234:3000/article/getArticles?userId=5e96e56f6dc8847e998b85f5&start=0&stop=18', true);
    xhr.send();
    xhr.onload = function () {
        var returnData = JSON.parse(this.responseText);
        if (returnData.result === 'success') {
            for (let i = 0; i < disliked.length; i++) {
                var index = returnData.articles[i];
                if (index.disliked) {
                    disliked[i].classList.add('selected');
                }
            }
        }
    }
})();