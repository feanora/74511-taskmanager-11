import {SortType} from "../const.js";
import moment from "moment";

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

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
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

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate;
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};


