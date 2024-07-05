$(document).ready(function() {

// ВНИМАНИЕ!!! Это файл подгружается ajax-ом через 11 сек.

/** ======================================================================== */
/** ============================= Слайдер-баннер =========================== */

let currentSlide = 0, banersTimer;
const $slider = $('.baners__slider');
const totalSlides = $('.baners__slider img').length;

// Динамически добавляем прогресс-бары
const $timelane = $('.baners__timelane');
for (let i = 0; i < totalSlides; i++) {
    $timelane.append('<div class="baners__progressBar"></div>');
}

// Теперь получаем все прогресс-бары
const $progressBars = $('.baners__timelane .baners__progressBar');

// Показать слайд по индексу
function showSlide(index) {
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    $slider.css('transform', `translateX(-${currentSlide * 320}px)`);
    
    $progressBars.each(function(idx){
        let elem = $(this);
        if(currentSlide > idx){
            elem.removeClass('animate');
            setTimeout(function () { elem.addClass('active'); }, 15);
        }else if(currentSlide == idx){
            elem.removeClass('active');
            setTimeout(function () { elem.addClass('animate'); }, 15);
        }else{
            elem.removeClass('animate active');
        }
    });
}

// Следующий слайд
function nextSlide() {
    clearTimeout(banersTimer);
    showSlide(currentSlide + 1);
    banersTimer = setTimeout(nextSlide, 5000);
}

// Предыдущий слайд
function prevSlide() {
    clearTimeout(banersTimer);
    showSlide(currentSlide - 1);
    banersTimer = setTimeout(nextSlide, 5000);
}

// Пнопки переключения слайдера
$('.baners__btn.baners__btn_next').click(nextSlide);
$('.baners__btn.baners__btn_prev').click(prevSlide);

let isShowSlider = false;
// Показать слайдер
function showSlider(){
    if(isShowSlider === true) { return; }
    $("#ajax-content").removeClass('dn');
    $('.baners').addClass('active');
    showSlide(0);
    banersTimer = setTimeout(nextSlide, 5000);
    isShowSlider = true;
}

// Скрыть слайдер
function hideSlider(){
    $('.baners').removeClass('active');
    clearTimeout(banersTimer);
    isShowSlider = false;
}

// Закрыть слайдер
$('.baners__btn.baners__btn_close').click(function(){
    hideSlider();
    sessionStorage.setItem('banersHide', 'true');
});

/** ======================================================================== */
/** ========== Анимированный title, логика появления слайдер-баннера ======= */

let titleDefault = $('title').text();
let subTextTitle_1 = "💵—FREE MONEY—";
let subTextTitle_2 = "—FREE MONEY—";

let animateTitleTimer;
// Анимируем title
function setAnimatedTitle() {
    $('title').text(subTextTitle_1+" "+titleDefault);
    setTimeout(function () {
        $('title').text(subTextTitle_2+" "+titleDefault);
    },1000);

    animateTitleTimer = setTimeout(function () {
        setAnimatedTitle();
    },10000);
}

// Возвращаем нормальный title
function setDefaultTitle() {
    clearTimeout(animateTitleTimer);
    $('title').text(titleDefault);
}

let timeMouseLeave;
// Через 60 сек после ухода, анимируем title, показываем баннер.
$(document).on("mouseleave", function(){
    if(sessionStorage.getItem('banersHide') != 'true'){
        showSlider();
    }

    timeMouseLeave = setTimeout(() => {
        setAnimatedTitle();
        showSlider();
    }, 60 * 1000);
});

// При возврате на страницу, возвращаем дефолтный title
$(document).on("mouseenter", function(){
    clearTimeout(timeMouseLeave);
    setDefaultTitle();
});

/** ======================================================================== */

});