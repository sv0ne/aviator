$(document).ready(function () {
	var w = $(window).outerWidth();
	var h = $(window).outerHeight();
	var isMobile = ('ontouchstart' in window);
	const $body = $('body');
	const BREAKPOINT_md1 = 1343;
	const BREAKPOINT_1045 = 1044.98;
	const BREAKPOINT_md2 = 992.98;
	const BREAKPOINT_872 = 871.98;
	const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_552 = 551.98;
	const BREAKPOINT_md4 = 479.98;

	@@include('_popup.js');

    // Изменить язык
    $(".js-change-language").click(function(){
        close_popup();
    });

    // Открыть поле поиска
    $(".js-searchField .searchField__open").click(function(){
        $(".js-searchField").addClass("active");
        $(".js-searchField input").focus();
    });

    // Закрыть поле поиска
    $(".js-searchField .searchField__close").click(function(){
        $(".js-searchField").removeClass("active");
    });

    // Блок boxInfo, кнопка "ALL" показвающая/скрывающая всю информацию
    $(".js-boxInfo-btn").click(function(){
        $(this).toggleClass('active');
        $(".js-boxInfo-casinos").fadeToggle(200);
    });
});