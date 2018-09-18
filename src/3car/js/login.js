import '../css/login.less'

$(function(){
    $('#loginNav span').click(function(){
        $('#loginNav span').removeClass('on');
        $(this).addClass('on');
        
        $('.loginbox .box').hide();
        $(this.lang).show();
    });
})