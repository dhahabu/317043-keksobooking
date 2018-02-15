'use strict';

var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var types = ['flat', 'house', 'bungalo'];

var typesRu = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var times = ['12:00', '13:00', '14:00'];

var featureItems = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var photoItems = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var mixElements = function (arr) {
  var newArr = arr.slice();
  var arrLength = arr.length;
  for (var i = 0; i < arrLength; i++) {
    var newValue = newArr.splice(getRandomNumber(0, arrLength - (i + 1)), 1);
    newArr.push(newValue[0]);
  }
  return newArr;
};

// генерация случайного целого числа от min до max (включительно!)
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * ((max + 1) - min) + min);
};

var getAdvertArray = function () {
  var advert = [];

  for (var i = 0; i < 8; i++) {
    var locationX = getRandomNumber(300, 900);
    var locationY = getRandomNumber(150, 500);

    advert[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },

      offer: {
        title: titles[i],
        address: locationX + ', ' + locationY,
        price: getRandomNumber(1000, 1000000),
        type: types[getRandomNumber(0, types.length - 1)],
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 10),
        checkin: times[getRandomNumber(0, times.length - 1)],
        checkout: times[getRandomNumber(0, times.length - 1)],
        features: featureItems.slice(0, getRandomNumber(1, featureItems.length)),
        description: '',
        photos: mixElements(photoItems)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
  }

  return advert;
};

var renderMapPinElement = function (index) {
  var mapPinElement = template.querySelector('.map__pin').cloneNode(true);
  mapPinElement.style.left = advertArray[index].location.x - mapPinElement.querySelector('img').width / 2 + 'px';
  mapPinElement.style.top = advertArray[index].location.y - mapPinElement.querySelector('img').height + 'px';
  mapPinElement.querySelector('img').src = advertArray[index].author.avatar;
  return mapPinElement;
};

var getAdvertElement = function (index) {
  var advertElement = template.querySelector('.map__card').cloneNode(true);

  advertElement.querySelector('h3').textContent = advertArray[index].offer.title;
  advertElement.querySelector('p small').textContent = advertArray[index].offer.address;
  advertElement.querySelector('.popup__price').innerHTML = advertArray[index].offer.price + ' &#x20bd;/ночь';
  advertElement.querySelector('h4').textContent = typesRu[advertArray[index].offer.type];// сомнительно
  advertElement.querySelector('p:nth-of-type(3)').textContent = advertArray[index].offer.rooms
    + ' комнаты для ' + advertArray[index].offer.guests + ' гостей';
  advertElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после '
    + advertArray[index].offer.checkin + ', выезд до ' + advertArray[index].offer.checkout;

  // фрагмент для списка фич
  var featuresFragment = document.createDocumentFragment();
  var newFeaturesList = document.createElement('ul');
  newFeaturesList.className = 'popup__features';
  for (var j = 0; j < advertArray[index].offer.features.length; j++) {
    var featureItem = document.createElement('li');
    featureItem.className = 'feature feature--' + advertArray[index].offer.features[j];
    newFeaturesList.appendChild(featureItem);
    featuresFragment.appendChild(newFeaturesList);
  }
  advertElement.replaceChild(newFeaturesList, advertElement.querySelector('.popup__features'));

  advertElement.querySelector('p:nth-of-type(5)').textContent = advertArray[index].offer.description;

  // фрагмент для списка фотографий
  var photosFragment = document.createDocumentFragment();
  for (var k = 0; k < photoItems.length; k++) {
    var photoItem = advertElement.querySelector('.popup__pictures li').cloneNode(true);
    photoItem.querySelector('img').src = advertArray[index].offer.photos[k];
    photoItem.querySelector('img').height = '55';
    photosFragment.appendChild(photoItem);
  }
  advertElement.querySelector('.popup__pictures').replaceChild(photosFragment, advertElement.querySelector('.popup__pictures li'));

  advertElement.querySelector('img').src = advertArray[index].author.avatar;

  return advertElement;
};

var advertArray = getAdvertArray();

document.querySelector('.map').classList.remove('map--faded');

var template = document.querySelector('template').content;

var mapPinFragment = document.createDocumentFragment();

for (var i = 0; i < 8; i++) {
  mapPinFragment.appendChild(renderMapPinElement(i));
}

document.querySelector('.map__pins').appendChild(mapPinFragment);

var advertFragment = document.createDocumentFragment();

advertFragment.appendChild(getAdvertElement(0));

document.querySelector('.map').insertBefore(advertFragment, document.querySelector('.map__filters-container'));
