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

	/////////////////// Скрипты для попапов ///////////////////////////

var popup = $(".popup");
var lastOpen = false;

// Показать попапы при клике
$(document).on("click", ".js-popup-opener", function(e){
	e.preventDefault();
	if($(this).hasClass('disabled')){return false;}
	openPopup($(this).data('popup-id'));
});

// Открыть попап
function openPopup(popupID) {
	if(lastOpen !== popupID){
		if(lastOpen !== false){close_popup();}
		lastOpen = popupID;
		$('#'+popupID).addClass('isOpen');
		//bodyLock();
	}else{
		close_popup();
	}
}

// Скрыть попапы при клике вне попапа и вне области вызова попапа
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	var popupTarget = $(".js-popup-opener").has(e.target).length;
	// Если (клик вне попапа && попап имеет класс isOpen)
    if (popup.has(e.target).length === 0 && popup.hasClass('isOpen') && popupTarget === 0){
	    close_popup();
	}
});

// Скрыть попап при нажатии на клавишу "Esc"
$(document).on("keydown", function (e) {
	if(e.which === 27){
		close_popup();
	}
});

// Блокировка скролла при открытии попапа
function bodyLock() {
	$body.addClass('lock');
}

// Разблокировка скролла при закрытии попапа
function bodyUnLock() {
	$body.removeClass('lock');
}

// Закрыть popup
function close_popup() {
	$(".popup").removeClass('isOpen');
	bodyUnLock();
	lastOpen = false;
}

// Закрыть попапа при нажатии на кнопки "Close"
$(document).on("click", ".js-popup-closer", function(e){
	e.preventDefault();
	close_popup();
});;

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