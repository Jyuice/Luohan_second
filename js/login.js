/**
 * 切换登陆方式
 */
(function() {
    var login_method = document.getElementsByClassName('login-method')[0];
    var fir_method = document.getElementsByClassName('form-1')[0];
    var sec_method = document.getElementsByClassName('form-2')[0];
    var count = 0;
    login_method.onclick = function(e) {
        var selectedDom = document.getElementsByClassName('selected')[0];
        var isSelected = e.target.classList.contains('selected');
        if (isSelected) {
            return;
        } else {
            e.target.classList.add('selected');
            selectedDom.classList.remove('selected');
            count++;
        }
        if (count % 2 === 0) {
            sec_method.style.display = 'none';
            fir_method.style.display = 'block';
        } else {
            sec_method.style.display = 'block';
            fir_method.style.display = 'none';
        }
    }
})();

/**
 * 下拉菜单
 */
(function() {
    var btn = document.getElementById('menu');
    var menu = document.getElementsByClassName('Select-list')[0];
    var place = document.getElementsByClassName('place')[0];
    btn.onclick = function() {
        var isBlock = window.getComputedStyle(menu, null).display;
        if (isBlock === 'none') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    };
    menu.onclick = function(e) {
        var arr = e.target.firstChild;
        place.innerHTML = e.target.innerHTML;
        menu.style.display = 'none';
    }
})();


/**
 * 登录
 */
(function() {
    var lg_btn = document.getElementById('submit');
    lg_btn.onclick = function() {
        var data = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
            }
            //建立请求对象实例
        var xhr = new XMLHttpRequest()
        xhr.open("POST", "http://47.97.204.234:3000/user/login", true);
        // xhr.open("POST", "http://47.97.204.234:3000/user/logout", true);
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/json"); //设置请求头
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var returnData = JSON.parse(xhr.responseText)
                if (returnData.result === 'success') {
                    location.reload();
                    document.getElementById('login-page').style.display = 'none';
                    document.getElementById('home-page').style.display = 'block';
                    console.log(returnData);
                } else {
                    alert('登陆失败，请重新尝试');
                }
            }
        }
    }
})();

/**
 *检查登陆状态
 */
(function() {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", "http://47.97.204.234:3000/user/state", true);
    xhr.withCredentials = true;
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var returnData = JSON.parse(this.responseText);
            if (returnData.result === 'success') {
                console.log(returnData);
                if (returnData.message === '目前处于登录状态') {
                    setTimeout(function() {
                        document.getElementById('home-page').style.display = 'block';
                    }, 300)
                    document.getElementById('login-page').style.display = 'none';
                }
            } else {
                document.getElementById('login-page').style.display = 'block';
                document.getElementById('home-page').style.display = 'none';
            }
        }
    }
})()