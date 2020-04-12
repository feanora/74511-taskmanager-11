import {getRandomNumber} from "../util.js";

const MAX_FILTER_TASK_COUNT = 10;
const filterNames = [
  `all`,
  `overdue`,
  `today`,
  `favorites`,
  `repeating`,
  `archive`,
];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: getRandomNumber(MAX_FILTER_TASK_COUNT)
    };
  });
};

export {generateFilters};
