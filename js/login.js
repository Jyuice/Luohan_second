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
 * 地区下拉框
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