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

    $(window).scroll(function() {
        let scrollTop = $(this).scrollTop();
        scrollForWelcomeBonus(scrollTop);
        scrollForContentNav(scrollTop);
        scrollForNavigation(scrollTop);
    });

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

		if(w > BREAKPOINT_md3){
			additionalClassName = additionalClass === undefined ? "" : " "+additionalClass;
			
			// Определить тип попапа (Плавающий | floating) или (Центрированый | centered)
			let type = $('#'+popupID).data('type');
			if(type == 'centered'){
				bodyLock();
			}else{
				let modalRect = $('#'+popupID)[0].getBoundingClientRect();

				let top = 0, left = 0;
				if(popupID === "language"){
					top = additionalClass === undefined ? triggerRect.top + triggerRect.height + 8 
						: document.documentElement.scrollTop + triggerRect.top - modalRect.height - 8;
					left = triggerRect.left + triggerRect.width - 360;
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
	/** ======================================================================== */
/** =========== Группа скриптов для блока с горизонтальным скролла ========= */

/*Когда у скролла есть wrapScroll ему нужно задать высоту 
так как его дочерний элемент абсолютно позиционирован */
function setHeightWrapScroll() {
	if($('.wrapScroll').length !== 0){
		var scrollHeight = $('.scroll').height();
		$('.wrapScroll').css('height', scrollHeight+'px');
	}
}
setHeightWrapScroll();

/* ВНИМАНИЕ!!! 
	Если кнопки скролла внутри блока .scroll то все ок, а если снаружи то для
	.scroll нужно задать data-scroll-id="" и также и для .scroll__button.btn-prev и 
	для .scroll__button.btn-next.
*/

var ScrollElement = function(elem) {
	var body = elem.find('.scroll__body');
	var wBody = body.width();
	var scroll = elem.find('.scroll__scroll');
	var wScroll = scroll.width();
	var scrollID = elem.data('scroll-id');
	if(scrollID == undefined){ // Если кнопки управления лежат внутри .scroll
		var btn_prev = elem.find('.scroll__button.btn-prev');
		var btn_next = elem.find('.scroll__button.btn-next');
	}else{ // Если кнопки управления лежат где то снаружи
		var btn_prev = $('.js-scroll-button.btn-prev[data-scroll-id='+scrollID+']');
		var btn_next = $('.js-scroll-button.btn-next[data-scroll-id='+scrollID+']');
	}
	
	var overlay_prev = elem.find('.overlayArea-prev');
	var overlay_next = elem.find('.overlayArea-next');
	var paddingLeft = parseFloat(scroll.css('padding-left'));
	var paddingRight = parseFloat(scroll.css('padding-right'));

	// Просчитываем количество проскролла и выдаем scrollPosition
	var calcPosition = function (action, direction) {
		var diff = Math.round(scroll.width() +  paddingLeft + paddingRight - body.width());
		var scrollLeft = Math.round(body.scrollLeft());

		if(action === 'buttonClick'){
			var stepScroll = elem.width() * 0.8;
			
			if(direction === 'next'){
				scrollLeft += stepScroll;
				if(scrollLeft > diff){scrollLeft = diff;}
			}else{
				scrollLeft -= stepScroll;
				if(scrollLeft < 0){scrollLeft = 0;}
			}
		}
		if(scrollLeft === 0){
			scrollPosition('start');
		}else if(scrollLeft === diff){
			scrollPosition('finish');
		}else{
			scrollPosition('center');
		}
		return scrollLeft;
	}

	// Клик по кнопкам (только для DESKTOP)
	var buttonClick = function (direction){
		var scrollLeft = calcPosition('buttonClick', direction);
		body.stop().animate({scrollLeft:scrollLeft}, 500, 'swing');
	}

	// Скрыть показать кнопки в зависимости от положения скролла
	var scrollPosition = function (position) {
		if(position === 'start'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.addClass('open');
		}else if (position === 'center'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.addClass('open');
		}else if(position === 'finish'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.removeClass('open');
		}else if(position === 'not-scroll'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.removeClass('open');
		}
	}

	// Начальное положение скролла (скролл есть или его нет)
	wScroll > wBody ? scrollPosition('start') : scrollPosition('not-scroll');

	if(isMobile){
		btn_prev.removeClass('open');
		btn_next.removeClass('open');
	}else{
		btn_next.click(function(){ buttonClick('next'); });
		btn_prev.click(function(){ buttonClick('prev'); });
	}
	body.scroll(function(){calcPosition();});
}

$(".scroll").each(function(){new ScrollElement($(this));});

/** ======================================================================== */
/** =========== Прокрутка вверх / Плашка бонуса / Кнопка бонуса ============ */

    let showBonuse = "box"; // btn | box
    // Обработчик события прокрутки
    
    function scrollForWelcomeBonus(scrollTop){
        // Показать/Скрыть кнопку прокрутки "Вверх"
        if (scrollTop > 500) {
            $('.js-btnScrollToTop').show();
        } else {
            $('.js-btnScrollToTop').hide();
        }

        // Показать/Скрыть блок бонуса
        if (scrollTop > 1000) {
            if(showBonuse === "box"){
                $('.js-welcomeBonus').show();
                $('.js-btnScrollToTop').addClass('hasBoxWelcomeBonus');
            }else{
                $('.js-btnBonus').show();
            }
            
        } else {
            $('.js-welcomeBonus').hide();
            $('.js-btnScrollToTop').removeClass('hasBoxWelcomeBonus');
            $('.js-btnBonus').hide();
        }
    }

    // Закрыть плашку бонуса показать кнопку
    $('.js-btnWelcomeBonusClose').click(function(){
        $('.js-welcomeBonus').hide();
        $('.js-btnScrollToTop').removeClass('hasBoxWelcomeBonus');
        $('.js-btnBonus').show();
        showBonuse = "btn";
    });

    // Закрыть кнопку бонуса показать плашку
    $('.js-btnBonus').click(function(){
        $('.js-btnBonus').hide();
        $('.js-welcomeBonus').show();
        $('.js-btnScrollToTop').addClass('hasBoxWelcomeBonus');
        showBonuse = "box";
    });

    // Прокрутить вверх
    $('.js-btnScrollToTop').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 'smooth');
        return false;
    });

/** ======================================================================== */
/** ============================= Блок Content ============================= */

    let isOpenContentNav = true;
    let isHideContentNavOnScroll = false;
    // При прокрутке скрываем блок contentNav__list
    function scrollForContentNav(scrollTop){
        if(isHideContentNavOnScroll === false){
            isHideContentNavOnScroll = true;
            isOpenContentNav = false;
            $('.js-contentNav .contentNav__header svg').removeClass('rotate-180');
            $('.js-contentNav .contentNav__list').slideUp(150);
        }
    }

    // Открыть/закрыть список contentNav
    $('.js-contentNav .contentNav__header').click(function(){
        if(isOpenContentNav === true){
            $('.js-contentNav .contentNav__header svg').removeClass('rotate-180');
            $('.js-contentNav .contentNav__list').slideUp(150);
            isOpenContentNav = false;
        }else{
            $('.js-contentNav .contentNav__header svg').addClass('rotate-180');
            $('.js-contentNav .contentNav__list').slideDown(150);
            isOpenContentNav = true;
        }
    });

/** ======================================================================== */
/** ========================= Блок скролл-навигации ======================== */

    // Получить id-шники элементов в scroll анимации
    function getIdsNavElem(){
        let ids = [];
        $('.js-navigation-scroll .scroll__item').each(function(){
            let id = $(this).find('a').attr('href');
            ids.push(id);
        });
        return ids;
    }
    
    // Получить offsetTop для каждого элемента
    function getOffsetTopByIds(ids){
        let offsets = [];
        for(let i = 0; i < ids.length; i++){
            let offsetTop = $(ids[i])[0] && $(ids[i])[0].offsetTop;

            offsets.push(offsetTop === undefined ? offsetTop : offsetTop - 75);
        }
        return offsets;
    }

    // Определить индекс последней проскроленной якорной ссылки
    function findLastIndexLessThan(arr, num) {
        let result = -1;
        for(let i = 0; i < arr.length; i++){
            if(arr[i] === undefined){continue;}
            if(num >= arr[i]){
                result = i;
            }else{
                break;
            }
        }
        return result;
    }

    // Устанавливаем активный элемент скролл-навигации и скролим до него
    function detectActiveNavLink(index) {
        $('.js-navigation-scroll .scroll__item').removeClass('active');
        let offsetLeft = 0;

        if(index !== -1){
            let elemLink = $('.js-navigation-scroll .scroll__item').eq(index);
            elemLink.addClass('active');
            offsetLeft = elemLink[0].offsetLeft - 8;
        }

        $('.js-navigation-scroll').stop().animate({scrollLeft: offsetLeft}, 300);
    }

    let isShowNavigation = true;
    let idsNavigationAnchor; // ID-шники ссылок
    let isActiveScrollNavigation = false;
    let $contentNav = $('.js-contentNav');
    let indexMemo = -1;
    // При скролле определяем индекс активной ссылки в скролл-навигации
    function scrollForNavigation(scrollTop){
        // Прекращаем выполнение функции если блока скролл-навигации вообще нет
        if($contentNav[0] === undefined || !isShowNavigation){ return; } 
        
        // Показать/скрыть блок скролл-навигации
        if(scrollTop > $contentNav[0].offsetTop && !isActiveScrollNavigation){
            $('.js-navigation').addClass('active');
            isActiveScrollNavigation = true;
            idsNavigationAnchor = getIdsNavElem();
        }else if(scrollTop <= $contentNav[0].offsetTop && isActiveScrollNavigation){
            $('.js-navigation').removeClass('active');
            isActiveScrollNavigation = false;
        }

        // Если скролл-навигация активна, вычисляем активные ссылки
        if(isActiveScrollNavigation){
            let offsets = getOffsetTopByIds(idsNavigationAnchor);
            let index = findLastIndexLessThan(offsets, scrollTop);
            if(index !== indexMemo){
                indexMemo = index;
                detectActiveNavLink(index);
            }
        }
    }
    scrollForNavigation($(window).scrollTop());

    // Скрываем блок скролл-навигации при клике на unpin
    $('.js-navigation-btn').click(function(){
        $('.js-navigation').removeClass('active');
        isShowNavigation = false;
        isActiveScrollNavigation = false;
    });

    // Прокрутка при клике на якорную ссылку внутри scroll-навигации
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
      
        const targetId = $(this).attr('href');
        const topHeight = isActiveScrollNavigation ? 55 : 0;
      
        $('html, body').animate({
          scrollTop: $(targetId).offset().top - topHeight
        }, 500);
    });

/** ======================================================================== */
/** ============ Прочее, несвязанные скрипты, каждый для разного =========== */

    // Форма в попапе "Language"
    $(".js-form-item").click(function(e){
        e.preventDefault();
        let value = $(this).data('value');
        $(this).closest('.js-form').find('.js-form-value').val(value);
        $(this).closest('.js-form').submit();
        close_popup();
    });

    // Управление полем поиска
    (function() {
        // Открыть поле поиска
        $(".js-searchField .searchField__open").click(function(){
            $(".js-searchField").addClass("active");
            $(".js-searchField input").focus();
        });

        // Закрыть поле поиска
        $(".js-searchField .searchField__close").click(function(){
            $(".js-searchField").removeClass("active");
        });
    })();

    // Управление модальными окнами на мобилках | Открыть/закрыть
    (function() {
        if(w < BREAKPOINT_md3){
            // Открыть окно
            $('.js-modalOpener').click(function(){
                $('body').addClass('lock');
                $(this).closest('.js-modalContainer').find('.js-modalBody').addClass('active');
                $(this).closest('.js-modalContainer').find('.js-modalOverlay').addClass('active');
            });

            // Закрыть окно
            $('.js-modalOverlay, .js-modalClose').click(function(e){
                e.stopPropagation();
                $('body').removeClass('lock');
                $(this).closest('.js-modalContainer').find('.js-modalBody').removeClass('active');
                $(this).closest('.js-modalContainer').find('.js-modalOverlay').removeClass('active');
            });
        }
    })();

    // Открыть/закрыть выпадающие списки меню на мобилках
    $('.js-dropdown-menu-mobile').click(function(){
        if(w < BREAKPOINT_md3){
            if($(this).hasClass('active')){
                $(this).find('.popover-popup').slideUp(150);
                $(this).removeClass('active');
            }else{
                $('.js-dropdown-menu-mobile').removeClass('active');
                $('.js-dropdown-menu-mobile').find('.popover-popup').slideUp(150);
                $(this).addClass('active');
                $(this).find('.popover-popup').slideDown(150);
            }
        }
    });

    // Плашка "Cookie"
    (function () {
        // Показать плашку через 11 сек после загрузки если еще небыла показана
        setTimeout(function(){
            let cookie = localStorage.getItem('cookie');
            if(cookie == null){
                $('.cookie').slideDown(150);
            }
        }, 11000);

        // Скрыть плашку
        $('.js-btn-cookie').click(function(){
            $('.cookie').slideUp(150);
            localStorage.setItem('cookie', 'true');
        });
    })();

    // Блок boxInfo, кнопка "ALL" показвающая/скрывающая всю информацию
    $(".js-boxInfo-btn").click(function(){
        $(this).toggleClass('active');
        $(".js-boxInfo-casinos").fadeToggle(200);
    });

    // Для блока "CERTIFICATES" определить позицию выводимой всплывашки
    if(w > BREAKPOINT_md3){
        $('.certificates__item').mouseenter(function(){
            const rect = this.getBoundingClientRect();
            if(w-rect.x < 230){
                $(this).addClass('tooltipPosLeft');
            }
        });
    }

    // Копирование текста в буфер обмена
    (function () {
        // Копировать в буфер
        function copy_in_buffer(txt) {
            var $tmp = $("<textarea>");
            $("body").append($tmp);
            $tmp.val(txt).select();
            document.execCommand("copy");
            $tmp.remove();
        }

        // Клик на скопировать ссылку
        $(".js-copy-text").click(function(){
            let txt = $(this).data('promocode');
            copy_in_buffer(txt);

            const $element = $('.js-copied');

            $element.addClass('show');
            setTimeout(function(){
                $element.removeClass('show').addClass('hide');
                setTimeout(function(){
                    $element.removeClass('hide');
                },280)
            },2000);
        });
    })();

    // Увеличиваем число tiket (делаем анимацию)
    (function () {
        function animateCounter(element, min, max, stepDelay) {
            let i = min;
            let timer = setInterval(function(){
                element.text(i+"X");
                if(i === max){ clearInterval(timer); }
                i++;
            }, stepDelay);
        }

        animateCounter($('.js-ticket-1'), 0, 75, 30);
        animateCounter($('.js-ticket-2'), 0, 10, 50);
    })();

    // Открыть полностью отзыв
    $('.js-reviews-btn').click(function(){
        $(this).closest('.js-reviews').addClass('active');
    });

/** ======================================================================== */


});