import {SortType} from "../const.js";

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
export const getSaveButtonCondition = (isBlockSaveButton) => isBlockSaveButton ? `disabled` : ``;

export const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};
