'use strict';

var NUMBER_OF_ADVERTS = 8;
var POINTER_HEIGHT = 22;
var ESC_KEYCODE = 27;

var template = document.querySelector('template').content;
var map = document.querySelector('.map');
var mainPin = document.querySelector('.map__pin--main');
var noticeForm = document.querySelector('.notice__form');
var noticeFormFieldset = noticeForm.querySelectorAll('fieldset');
var noticeFormTitle = noticeForm.querySelector('#title');
var noticeFormAddress = noticeForm.querySelector('#address');
var noticeFormType = noticeForm.querySelector('#type');
var noticeFormPrice = noticeForm.querySelector('#price');
var noticeFormTimeIn = noticeForm.querySelector('#timein');
var noticeFormTimeOut = noticeForm.querySelector('#timeout');
var noticeFormRoomNumber = noticeForm.querySelector('#room_number');
var noticeFormCapacity = noticeForm.querySelector('#capacity');
var capacityOptions = noticeFormCapacity.querySelectorAll('option');

var mainPinX = mainPin.offsetLeft + mainPin.offsetWidth / 2;
var mainPinYMiddle = mainPin.offsetTop + mainPin.offsetHeight / 2;
var mainPinYBottom = mainPin.offsetTop + mainPin.offsetHeight + POINTER_HEIGHT;

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

var types = {
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

var minPrice = {
  flat: 1000,
  bungalo: 0,
  house: 5000,
  palace: 10000
};

var setMainPinAddress = function (x, y) {
  noticeFormAddress.value = x + ', ' + y;
};

var deactivatePage = function () {
  map.classList.add('map--faded');
  noticeForm.classList.add('notice__form--disabled');
  setMainPinAddress(mainPinX, mainPinYMiddle);
  roomNumberChangeHandler();

  for (var i = 0; i < noticeFormFieldset.length; i++) {
    noticeFormFieldset[i].disabled = true;
  }
};

var activatePage = function () {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  typeChangeHandler();
  roomNumberChangeHandler();

  for (var i = 0; i < noticeFormFieldset.length; i++) {
    noticeFormFieldset[i].disabled = false;
  }
};

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
        type: Object.keys(types)[getRandomNumber(0, Object.keys(types).length - 1)],
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
    closePopup();
    map.insertBefore(createCardElement(advert), document.querySelector('.map__filters-container'));

    document.querySelector('.popup__close').addEventListener('click', function () {
      closePopup();
    });

    document.addEventListener('keydown', popupEscPressHandler);
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
  cardElement.querySelector('h4').textContent = types[advert.offer.type];
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

var closePopup = function () {
  var popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
    document.removeEventListener('keydown', popupEscPressHandler);
  }
};

var setDefoltBorder = function (element) {
  element.style.border = '1px solid #d9d9d3';
};

var mainPinMouseupHandler = function () {
  if (map.classList.contains('map--faded')) {
    activatePage();
  }

  setMainPinAddress(mainPinX, mainPinYBottom);

  document.querySelector('.map__pins').appendChild(createPinsFragment(adverts));
};

var popupEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var typeChangeHandler = function () {
  var typeName = noticeFormType.value;
  noticeFormPrice.min = minPrice[typeName];
  noticeFormPrice.placeholder = minPrice[typeName];
};

var roomNumberChangeHandler = function () {
  var roomNumberValue = noticeFormRoomNumber.value;
  if (roomNumberValue === '100') {
    noticeFormCapacity.value = '0';
    for (var i = 0; i < capacityOptions.length; i++) {
      capacityOptions[i].disabled = (capacityOptions[i].value !== '0');
    }
  } else {
    noticeFormCapacity.value = '1';
    for (i = 0; i < capacityOptions.length; i++) {
      capacityOptions[i].disabled = (capacityOptions[i].value === '0' || capacityOptions[i].value > roomNumberValue);
    }
  }
};

var formInvalidHandler = function (evt) {
  evt.target.style.border = '2px solid red';
};

var formChangeHandler = function (evt) {
  if (evt.target.checkValidity()) {
    setDefoltBorder(evt.target);
  }
};

var formResetHandler = function () {
  deactivatePage();
  closePopup();
  setDefoltBorder(noticeFormTitle);
  setDefoltBorder(noticeFormPrice);

  var pins = document.querySelectorAll('.map__pin');
  for (var i = 1; i < pins.length; i++) {
    pins[i].remove();
  }
};

deactivatePage();

var adverts = generateAdverts();

mainPin.addEventListener('mouseup', mainPinMouseupHandler);

noticeForm.action = 'https://js.dump.academy/keksobooking';

noticeFormTitle.required = true;
noticeFormTitle.minLength = 30;
noticeFormTitle.maxLength = 100;

noticeFormAddress.readOnly = true;

noticeFormPrice.required = true;
noticeFormPrice.type = 'number';
noticeFormPrice.max = 1000000;
noticeFormPrice.placeholder = 1000;

noticeFormType.addEventListener('change', typeChangeHandler);

noticeFormTimeIn.addEventListener('change', function () {
  noticeFormTimeOut.value = noticeFormTimeIn.value;
});

noticeFormTimeOut.addEventListener('change', function () {
  noticeFormTimeIn.value = noticeFormTimeOut.value;
});

noticeFormRoomNumber.addEventListener('change', roomNumberChangeHandler);

noticeForm.addEventListener('invalid', formInvalidHandler, true);

noticeForm.addEventListener('change', formChangeHandler);

noticeForm.addEventListener('reset', formResetHandler);
