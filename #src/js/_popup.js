/** ======================================================================== */
/** ====================== Группа скриптов для попапов ===================== */

var popup = $(".popup");
var lastOpenedPopupID = null;

// Показать попапы при клике
$(document).on("click", ".js-popup-opener", function(e){
	e.preventDefault();
	if($(this).hasClass('disabled')){return false;}
	const triggerRect = this.getBoundingClientRect();
	openPopup($(this).data('popup-id'), triggerRect, $(this).data('add-class'));
});

// Открыть попап
function openPopup(popupID, triggerRect, additionalClass) {
	if(lastOpenedPopupID !== popupID){
		if(lastOpenedPopupID !== null){close_popup();}
		lastOpenedPopupID = popupID;

		let additionalClassName = "";

		if(popupID == "problem"){initProblemPopup();}

		if(w > BREAKPOINT_md3){
			additionalClassName = additionalClass === undefined ? "" : " "+additionalClass;
			
			// Определить тип попапа (Плавающий | floating) или (Центрированый | centered)
			let type = $('#'+popupID).data('type');
			if(type == 'centered'){
				$(".js-popupOverlay").addClass('active');
				bodyLock();
			}else{
				let modalRect = $('#'+popupID)[0].getBoundingClientRect();
				let isRtl = $('html').attr('dir') === 'rtl';

				let top = 0, left = 0;
				if(popupID === "language"){
					top = additionalClass === undefined ? triggerRect.top + triggerRect.height + 8 
						: document.documentElement.scrollTop + triggerRect.top - modalRect.height - 8;
					left = isRtl ? triggerRect.left : triggerRect.left + triggerRect.width - 360;
				}

				$('#'+popupID).css({
					'top': top+"px",
					'left': left+"px"
				});
			}
		}else{
			$(".js-popupOverlay").addClass('active');
			bodyLock();
		}

		$('#'+popupID).addClass('isOpen'+additionalClassName);
	}else{
		close_popup();
	}
}

// Скрыть попапы при клике вне попапа и вне области вызова попапа
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	var popupTarget = $(".js-popup-opener").has(e.target).length;
	// Если (клик вне попапа && попап имеет класс isOpen)
    if (popup.has(e.target).length === 0 && popup.hasClass('isOpen') && popupTarget === 0 && $(e.target).hasClass('js-popup-opener') === false){
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
	$(".popup").removeClass('isOpen mod2');
	$(".js-popupOverlay").removeClass('active');
	bodyUnLock();
	lastOpenedPopupID = null;
}

// Закрыть попапа при нажатии на кнопки "Close"
$(document).on("click", ".js-popup-closer", function(e){
	e.preventDefault();
	close_popup();
});