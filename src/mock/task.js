import {getBooleanValue, getRandomArrayItem, getRandomDate} from "../utils/common.js";
import {COLORS} from "../const.js";

const DescriptionItems = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
  `Спасти вселенную`,
  `Погладить котика`
];

const DefaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false
};

const generateRepeatingDays = () => {
  return Object.assign({}, DefaultRepeatingDays, {"mo": getBooleanValue()});
};

const generateId = () => {
  return String(new Date() + Math.random());
};

export const generateTask = () => {
  const dueDate = getBooleanValue() ? null : getRandomDate();
  return {
    id: generateId(),
    description: getRandomArrayItem(DescriptionItems),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
    color: getRandomArrayItem(COLORS),
    isArchive: getBooleanValue(),
    isFavorite: getBooleanValue()
  };
};

export const generateTasks = (count) => {
  return new Array(count).fill(``).map(generateTask);
};
