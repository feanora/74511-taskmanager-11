import {RenderPosition} from "./const.js";

export const getRandomNumber = (max, min = 0) => {
  return Math.round(Math.random() * (max - min) + min);
};

export const getBooleanValue = () => Math.random() > 0.5;

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(array.length - 1, 0);
  return array[randomIndex];
};

export const getRandomDate = () => {
  const targetDate = new Date();
  const sign = getBooleanValue() ? 1 : -1;
  const diffValue = sign * getRandomNumber(8, 0);

  targetDate.setDate(targetDate.getDate() + diffValue);
  return targetDate;
};

const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};

export const getCheckedValue = (isChecked) => isChecked ? `checked` : ``;
export const getAnswer = (flag) => flag ? `yes` : `no`;
export const getMarkupClass = (flag, className) => flag ? className : ``;

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place = `beforeend`) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.pretend(element);
      break;
    case RenderPosition.BEFOREEDN:
      container.append(element);
      break;
  }
};
