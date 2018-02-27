'use strict';

var NUMBER_OF_ADVERTS = 8;
var POINTER_HEIGHT = 22;

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

var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

var photos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var template = document.querySelector('template').content;

var mixElements = function (arr) {
  var newArr = arr.slice();
  var arrLength = arr.length;
  for (var i = 0; i < arrLength; i++) {
    var newValue = newArr.splice(getRandomNumber(0, arrLength - (i + 1)), 1);
    newArr.push(newValue[0]);
  }
  return newArr;
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * ((max + 1) - min) + min);
};

var generateAdverts = function () {
  var adverts = [];

  for (var i = 0; i < NUMBER_OF_ADVERTS; i++) {
    var locationX = getRandomNumber(300, 900);
    var locationY = getRandomNumber(150, 500);

    adverts[i] = {
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
        features: features.slice(0, getRandomNumber(1, features.length)),
        description: '',
        photos: mixElements(photos)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };
  }

  return adverts;
};

var createPinElement = function (advert) {
  var pinElement = template.querySelector('.map__pin').cloneNode(true);
  pinElement.style.left = advert.location.x - pinElement.offsetWidth / 2 + 'px';
  pinElement.style.top = advert.location.y - pinElement.offsetHeight + 'px';
  pinElement.querySelector('img').src = advert.author.avatar;

  var pinClickHandler = function () {
    var popup = document.querySelector('.popup');
    if (popup !== null) {
      document.querySelector('.map').removeChild(popup);
    }
    document.querySelector('.map').insertBefore(createCardElement(advert), document.querySelector('.map__filters-container'));
  };

  pinElement.addEventListener('click', pinClickHandler);

  return pinElement;
};

var createPinsFragment = function (adverts) {
  var pinsFragment = document.createDocumentFragment();
  for (var i = 0; i < adverts.length; i++) {
    pinsFragment.appendChild(createPinElement(adverts[i]));
  }
  return pinsFragment;
};

var createFeaturesFragment = function (advert) {
  var featuresFragment = document.createDocumentFragment();
  var newFeaturesList = document.createElement('ul');
  newFeaturesList.className = 'popup__features';
  for (var i = 0; i < advert.offer.features.length; i++) {
    var featureItem = document.createElement('li');
    featureItem.className = 'feature feature--' + advert.offer.features[i];
    newFeaturesList.appendChild(featureItem);
    featuresFragment.appendChild(newFeaturesList);
  }
  return featuresFragment;
};

var createPhotosFragment = function (advert, cardElement) {
  var photosFragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    var photoElement = cardElement.querySelector('.popup__pictures li').cloneNode(true);
    photoElement.querySelector('img').src = advert.offer.photos[i];
    photoElement.querySelector('img').height = '55';
    photosFragment.appendChild(photoElement);
  }
  return photosFragment;
};

var createCardElement = function (advert) {
  var cardElement = template.querySelector('.map__card').cloneNode(true);

  cardElement.querySelector('h3').textContent = advert.offer.title;
  cardElement.querySelector('p small').textContent = advert.offer.address;
  cardElement.querySelector('.popup__price').innerHTML = advert.offer.price + ' &#x20bd;/ночь';
  cardElement.querySelector('h4').textContent = typesRu[advert.offer.type];// сомнительно
  cardElement.querySelector('p:nth-of-type(3)').textContent = advert.offer.rooms
    + ' комнаты для ' + advert.offer.guests + ' гостей';
  cardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после '
    + advert.offer.checkin + ', выезд до ' + advert.offer.checkout;
  cardElement.replaceChild(createFeaturesFragment(advert), cardElement.querySelector('.popup__features'));
  cardElement.querySelector('p:nth-of-type(5)').textContent = advert.offer.description;
  cardElement.querySelector('.popup__pictures').replaceChild(createPhotosFragment(advert, cardElement), cardElement.querySelector('.popup__pictures li'));
  cardElement.querySelector('img').src = advert.author.avatar;

  return cardElement;
};

var adverts = generateAdverts();

var noticeFormFieldset = document.querySelectorAll('.notice__form fieldset');

for (var i = 0; i < noticeFormFieldset.length; i++) {
  noticeFormFieldset[i].setAttribute('disabled', 'disabled');
}

var mainPin = document.querySelector('.map__pin--main');

var inputAddress = document.querySelector('input#address');

inputAddress.value = (mainPin.offsetLeft + mainPin.offsetWidth / 2)
  + 'px, ' + (mainPin.offsetTop + mainPin.offsetHeight / 2) + 'px';

var mainPinMouseupHandler = function () {
  document.querySelector('.map').classList.remove('map--faded');
  document.querySelector('.notice__form').classList.remove('notice__form--disabled');

  for (var j = 0; j < noticeFormFieldset.length; j++) {
    noticeFormFieldset[j].removeAttribute('disabled');
  }

  inputAddress.value = (mainPin.offsetLeft + mainPin.offsetWidth / 2)
    + 'px, ' + (mainPin.offsetTop + mainPin.offsetHeight + POINTER_HEIGHT) + 'px';

  document.querySelector('.map__pins').appendChild(createPinsFragment(adverts));
};

mainPin.addEventListener('mouseup', mainPinMouseupHandler);
