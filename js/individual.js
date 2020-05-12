var bool = localStorage.getItem('bool');
var userId = '5e96e56f6dc8847e998b85f5';

/**
 * 
 * 点击弹出修改资料
 */
(function() {
    var key = document.getElementsByClassName('key');
    var formmer = document.getElementsByClassName('formmer');
    var choice = document.getElementsByClassName('choices');
    var cancel = document.getElementsByClassName('grey');

    for (let i = 0; i < key.length; i++) {
        key[i].onclick = function(e) {
            if (e.target.classList.contains('key') || e.target.parentElement.classList.contains('key')) {
                formmer[i].style.display = 'none';
                choice[i].style.display = 'block';
            }
        }
        cancel[i].onclick = function() {
            formmer[i].style.display = 'block';
            choice[i].style.display = 'none';
        }
    }
})();

/**
 * 
 * 换首图和头像
 */
(function() {
    var form = document.getElementById('form');
    var file = document.getElementById('file');

    file.onchange = function() {
        var xhr = new XMLHttpRequest();

        var formData = new FormData(form);
        formData.append('attrName', file.files[0]);

        xhr.open("GET", "http://47.97.204.234:3000/user/getInfo?userId=" + userId, true);
        xhr.open('POST', 'http://47.97.204.234:3000/user/alterAvatar', true);
        xhr.withCredentials = true;
        // xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(formData);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var returnData = JSON.parse(xhr.responseText);
                console.log(returnData);

                (function() {
                    var sulpture1 = document.getElementById('sulpture');
                    var sulpture2 = document.getElementById('individual-top-sulpture');
                    var sulpture3 = document.getElementById('home-top-sulpture');

                    var xhr = new XMLHttpRequest();
                    var URL = 'http://47.97.204.234:3000/user/getInfo';
                    xhr.open("GET", URL + "?userId=" + userId, true);
                    xhr.withCredentials = true;
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.send(JSON.stringify(data));

                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var returnData = JSON.parse(xhr.responseText);
                            if (returnData.result === 'success') {
                                sulpture1.src = returnData.info.avatar;
                                sulpture2.src = returnData.info.avatar;
                                sulpture3.src = returnData.info.avatar;
                                console.log(returnData);
                            }
                        }
                    }
                })();
            }
        }
    }
})();

/**
 * onload时就显示修改后的头像
 */
(function() {
    var sulpture1 = document.getElementById('sulpture');
    var sulpture2 = document.getElementById('individual-top-sulpture');
    var sulpture3 = document.getElementById('home-top-sulpture');

    var xhr = new XMLHttpRequest();
    var URL = 'http://47.97.204.234:3000/user/getInfo';
    xhr.open("GET", URL + "?userId=" + userId, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var returnData = JSON.parse(xhr.responseText);
            if (returnData.result === 'success') {
                var data = returnData.info
                sulpture1.src = data.avatar;
                sulpture2.src = data.avatar;
                sulpture3.src = data.avatar;
                var formmer_Data = document.getElementsByClassName('content-text');
                var name_ = formmer_Data[0];
                var sex_ = formmer_Data[1];
                var intro_ = formmer_Data[2];
                var area_ = formmer_Data[3];
                var recommend_ = formmer_Data[4];

                name_.innerHTML = data.nickname;
                sex_.innerHTML = data.gender;
                intro_.innerHTML = data.introduction;
                area_.innerHTML = data.trade;
                recommend_.innerHTML = data.resume;

                console.log(returnData);
            }
        }
    }
})();


/**
 * 
 * 修改用户信息
 * 
 */
(function() {
    var individualPage = document.getElementById('individual-page');
    var change_btn_list = document.getElementsByClassName('keep-blue');
    var content_text = document.getElementsByClassName('content-text');
    // var info = individualPage.getElementsByClassName('info')[0];
    var input_list = individualPage.getElementsByTagName('input');
    var formmer = document.getElementsByClassName('formmer');
    var choice = document.getElementsByClassName('choices');
    var val = null;

    //nickname
    function changeName() {
        input_list[0].onchange = function() {
            val = input_list[0].value;
        }

        change_btn_list[0].onclick = function() {
            formmer[0].style.display = 'block';
            content_text[0].innerHTML = val;
            choice[0].style.display = 'none';

            var xhr = new XMLHttpRequest();
            var URL = 'http://47.97.204.234:3000/user/alterInfo'
            var params = {
                "userId": userId,
                "direction": 0,
                "content": document.getElementById('name').value
            }
            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function() {
                console.log(JSON.parse(this.responseText));
            }
        }
    }

    //sex
    function changeSex() {
        for (var i = 1; i < 3; i++) {
            if (input_list[i].checked == true) {
                console.log(1);
                val = this.value;
            }
        }

        change_btn_list[1].onclick = function() {
            formmer[1].style.display = 'block';
            content_text[1].innerHTML = val;
            choice[1].style.display = 'none';

            var xhr = new XMLHttpRequest();
            var URL = 'http://47.97.204.234:3000/user/alterInfo'
            var params = {
                "userId": userId,
                "direction": 1,
                "content": val,
            }
            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function() {
                console.log(JSON.parse(this.responseText));
            }
        }
    }

    //introduction
    function changeIntroduction() {
        input_list[3].onchange = function() {
            val = input_list[3].value;
        }

        change_btn_list[2].onclick = function() {
            formmer[2].style.display = 'block';
            content_text[2].innerHTML = val;
            choice[2].style.display = 'none';
            var xhr = new XMLHttpRequest();
            var URL = 'http://47.97.204.234:3000/user/alterInfo';
            var params = {
                "userId": userId,
                "direction": 2,
                "content": document.getElementById('introduction').value
            }
            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function() {
                console.log(JSON.parse(this.responseText));
            }
        }
    }


    //area
    function changeArea() {
        input_list[4].onchange = function() {
            val = input_list[4].value;
        }

        change_btn_list[3].onclick = function() {
            formmer[3].style.display = 'block';
            content_text[3].innerHTML = val;
            choice[3].style.display = 'none';

            var xhr = new XMLHttpRequest();
            var URL = 'http://47.97.204.234:3000/user/alterInfo';
            var params = {
                "userId": userId,
                "direction": 3,
                "content": document.getElementById('area').value
            }
            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function() {
                console.log(JSON.parse(this.responseText));
            }
        }
    }

    //recommend
    function changeRecommend() {
        input_list[5].onchange = function() {
            val = input_list[5].value;
        }
        change_btn_list[4].onclick = function() {
            formmer[4].style.display = 'block';
            content_text[4].innerHTML = val;
            choice[4].style.display = 'none';

            var xhr = new XMLHttpRequest();
            var URL = 'http://47.97.204.234:3000/user/alterInfo';
            var params = {
                "userId": userId,
                "direction": 4,
                "content": document.getElementById('recommend').value
            }

            xhr.open('POST', URL, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.send(JSON.stringify(params));
            xhr.onload = function() {
                console.log(JSON.parse(this.responseText));
            }
        }
    }
    changeName();
    changeSex();
    changeIntroduction();
    changeArea();
    changeRecommend();
})();

function handleReturn() {
    var returnBtn = document.getElementsByClassName('return')[0];
    returnBtn.onclick = function() {
        document.getElementById('home-page').style.display = 'block';
        document.getElementById('individual-page').style.display = 'none';
        bool = true;
    }
}