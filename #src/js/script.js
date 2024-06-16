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

    // Прокрутка вверх / Плашка бонуса / Кнопка бонуса
    (function () {
        let showBonuse = "box"; // btn | box
        // Обработчик события прокрутки
        $(window).scroll(function() {
            let scrollTop = $(this).scrollTop();

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
        });

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
    })();

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

    //////////////////////////////////////////////////////////////////////////////////////

    

});