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
 * 
 * 
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
 * 
 * 登录
 */

var lg_btn = document.getElementById('submit');

lg_btn.onclick = function() {
    var data = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
        }
        //建立请求对象实例
    var xhr = new XMLHttpRequest()

    // xhr.open("POST", "http://47.97.204.234:3000/user/login", true);
    // xhr.open("GET", "http://47.97.204.234:3000/user/state", true);
    xhr.open("POST", "http://47.97.204.234:3000/user/logout", true);
    xhr.withCredentials = true;

    xhr.setRequestHeader("Content-type", "application/json"); //设置请求头

    xhr.send(JSON.stringify(data));
    //onreadystatechange，当服务器有响应的时候就会触发这个方法
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //此时这个返回的数据是个字符串，需要调用JSON.parse方法把他转成js对象才能够操作
            var returnData = JSON.parse(xhr.responseText)
                //成功对应做成功的业务逻辑，x`失败对应做失败的业务逻辑
            if (returnData.result === 'success') {
                // document.getElementById('login-page').style.display = 'none';
                // document.getElementById('home-page').style.display = 'block';
                console.log(returnData);
            } else {
                alert('登陆失败，请重新尝试');
            }
        }
    }
}