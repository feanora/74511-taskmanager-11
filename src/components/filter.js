import {getCheckedValue} from "../util.js";

const CHECKED_FILTER_INDEX = 0;

const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;
  return (
    `<input
          type="radio"
          id="filter__${name}"
          class="filter__input visually-hidden"
          name="filter"
          ${getCheckedValue(isChecked)}
        />
        <label for="filter__${name}" class="filter__label">
          ${name} <span class="filter__${name}-count">${count}</span>
         </label>`
  );
};

export const createFilterTemplate = (filters) => {
  const filterMarkup = filters.map((it, i) => createFilterMarkup(it, i === CHECKED_FILTER_INDEX)).join(`\n`);
  return (
    `<section class="main__filter filter container">
        ${filterMarkup}
      </section>`
  );
};
