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
        scrollForTicket3(scrollTop);
        scrollForIframe(scrollTop);
    });

	@@include('_popup.js')
	@@include('_scroll.js')

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
/** ======================= Обработка проблем с видео ====================== */

    // Валидный ли email
    function isValidEmail (value) {
        if(value === ""){return true;}
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(value) === false){return "wrongEmail";}
        return true;
    }

    // Отправка данных формы на сервер
    function sendFormProblem() {
        const form = $('.js-problem-form')[0];
        const formData = new FormData(form);
        const endpoint = $('.js-problem-form').attr('action');
       
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    let stepProblem = 0;
    // Вызывается при инициализации попапа
    function initProblemPopup() {
        stepProblem = 0;
        setStepProblem(stepProblem);
        $('.js-problem-form .js-problem-next').removeClass('dn');
        $('.js-problem-form .js-popup-closer').addClass('dn');
    }

    // Менять контент попапа в зависимости от шага
    function setStepProblem(step){
        $('.js-problem-form .problem-step').each(function(index){
            $(this).toggleClass('dn', index !== stepProblem);
        });
        if(step === 2){
            sendFormProblem();
            $('.js-problem-form .js-problem-next').addClass('dn');
            $('.js-problem-form .js-popup-closer').removeClass('dn');
        }
    }

    // Выбираем одну из проблем
    $('.js-problem-form input[type=radio]').click(function(){
        $('.js-problem-next').removeClass('disabled');
        if($(this).hasClass('js-problem-other')){
            $('.js-problem-textarea').toggleClass('dn');
        }else{
            $('.js-problem-textarea').addClass('dn');
        }
    });

    // Переходим на следующий этап
    $('.js-problem-next').click(function(){
        stepProblem = stepProblem + 1;
        setStepProblem(stepProblem);
        $('.js-problem-next').addClass('disabled');
    });

    // Проверяем поле input
    $('.js-problem-form input.inputText').on('input change', function(){
        let value = $(this).val();
        $('.js-problem-next').toggleClass('disabled', isValidEmail(value) !== true);
    });

/** ======================================================================== */
/** ============= Коментарии: Оставить/ответить на комментарий ============= */

    // Ответить на комментарий
    $('.js-btn-reply').click(function(){
        let id = $(this).data('user-id');
        let name = $(this).closest('.comment').find('.js-comment-name').text();

        $('.js-leaveComment_text-default').addClass('dn');
        $('.js-leaveComment_btn-cancel').removeClass('dn');
        $('.js-leaveComment_text-reply span').text(name);
        $('.js-leaveComment-user-id').val(id);
        $('.js-leaveComment_text-reply').removeClass('dn');

        $('html, body').animate({
            scrollTop: $('.js-form-leaveComment').offset().top - (isActiveScrollNavigation ? 55 : 0)
        }, 500);
    });

    // Отменить ответ на комментарий
    $('.js-leaveComment_btn-cancel').click(function(){
        $('.js-leaveComment_text-default').removeClass('dn');
        $('.js-leaveComment_btn-cancel').addClass('dn');
        $('.js-leaveComment-user-id').val('');
        $('.js-leaveComment_text-reply').addClass('dn');
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
    

    // Открыть полностью отзыв
    $('.js-reviews-btn').click(function(){
        $(this).closest('.js-reviews').addClass('active');
    });

    // Если это пк то подгружаем баннера через 11 сек. вместе с их js и css файлами
    if(w > BREAKPOINT_md3){
        setTimeout(function () {
            function addCSS(href) {
                const link = $('<link>', {rel: 'stylesheet', type: 'text/css', href: href});
                $('head').append(link);
            }
            
            function addJS(src) {
                const script = $('<script>', {type: 'text/javascript', src: src});
                $('head').append(script);
            }

            $("#ajax-content").load(bannersAjax.html);
            addCSS(bannersAjax.css);
            addJS(bannersAjax.js);
        }, 11000);
    }

    // При клике на Play free запускаем iframe
    $('.js-play-iframe').click(function(){
        $('.js-iframe-control').addClass('dn');
        let iframe = $('.js-iframe-body').find('iframe');
        iframe.attr('src', iframe.data('src'));
        $('.js-iframe-body').removeClass('dn');
    });

    let isAnimatedTicket_3 = false;
    let $ticketAnchor = $('.js-ticket-anchor')
    // При доскроле до элемента .js-ticket-3 анимируем его
    function scrollForTicket3(scrollTop){
        if(isAnimatedTicket_3){ return }
        if(scrollTop > $ticketAnchor[0].offsetTop - h + 150){
            animateCounter($('.js-ticket-3'), 0, 10, 50);
            isAnimatedTicket_3 = true;
        }
    }

    let iframesVideo = $('.js-iframe-start-on-screen');
    // Запускаем видео в iframe при докрутке до него
    function scrollForIframe(scrollTop){
        iframesVideo.each(function() {
            if (scrollTop > $(this).offset().top - h) {
                // Вставляем ссылку в src
                let iframe = $(this).find('iframe');
                if(w > BREAKPOINT_md3){
                    iframe.attr('src', iframe.data('src-pc'));
                }else{
                    iframe.attr('src', iframe.data('src-mobile'));
                }
                
                // Удаляем из массива текущий элемент
                iframesVideo = iframesVideo.not(this);
            }
        });
    }

/** ======================================================================== */

});

