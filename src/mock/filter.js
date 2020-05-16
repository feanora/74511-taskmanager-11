import {getRandomNumber} from "../utils/common.js";

const MAX_FILTER_TASK_COUNT = 10;
const FILTER_NAMES = [
  `all`,
  `overdue`,
  `today`,
  `favorites`,
  `repeating`,
  `archive`
];

const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      count: getRandomNumber(MAX_FILTER_TASK_COUNT)
    };
  });
};

export {generateFilters};
