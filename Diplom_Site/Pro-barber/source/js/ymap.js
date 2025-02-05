let mid = [53.19907671845772,44.98861078335629];

function init(){
    let map = new ymaps.Map("map", {
        center: mid,
        zoom: 15,
        type: 'yandex#satellite'
    });

    let placemark = new ymaps.Placemark(mid, {},{
        iconLayout: 'default#image',
        iconImageHref: 'https://cdn-icons-png.flaticon.com/128/9637/9637982.png',
        iconImageSize: [35, 40],
        iconImageOffset: [-17, -41]
    });

    map.controls.remove('geolocationControl'); // удаляем геолокацию
    map.controls.remove('searchControl'); // удаляем поиск
    map.controls.remove('trafficControl'); // удаляем контроль трафика
    map.controls.remove('typeSelector'); // удаляем тип
    map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
    map.controls.remove('zoomControl'); // удаляем контрол зуммирования
    map.controls.remove('rulerControl'); // удаляем контрол правил
    map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)

    map.geoObjects.add(placemark);
}

ymaps.ready(init);