import {FILTER_NAMES} from "../const.js";
import {getRandomNumber} from "../util.js";

const MAX_FILTER_TASK_COUNT = 10;

const generateFilters = () => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      count: getRandomNumber(MAX_FILTER_TASK_COUNT)
    };
  });
};

export {generateFilters};
