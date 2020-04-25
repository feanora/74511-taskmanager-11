import AbstractComponent from "./abstract-component.js";
import {DAYS, MONTH_NAMES, COLORS} from "../const";
import {formatTime, getCheckedValue, getAnswer, getMarkupClass} from "../utils/common.js";

const createColorsMarkup = (colors, currentColor) => {
  return colors.map((color, index) => {
    return (
      `<input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${getCheckedValue(currentColor === color)}
        />
        <label
        for="color-${color}-${index}"
        class="card__color card__color--${color}"
        >black</label
        >`
    );
  }).join(`\n`);
};

const createRepeatingDaysMarkup = (days, repeatingDays) => {
  return days.map((day, index) => {
    const isChecked = repeatingDays[day];
    return (
      `<input
      class="visually-hidden card__repeat-day-input"
      type="checkbox"
      id="repeat-${day}-${index}"
      name="repeat"
      value="${day}"
      ${getCheckedValue(isChecked)}
    />
    <label class="card__repeat-day" for="repeat-${day}-${index}"
      >${day}</label
    >`
    );
  }).join(`\n`);
};

const getTaskExpirationFlag = (dueDate) => dueDate instanceof Date && dueDate < Date.now();

const getTaskDate = (dueDate) => {
  const isDateShowing = !!dueDate;
  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;
  return {isDateShowing, date, time};
};

const getDeadlineFieldset = (isDateShowing, date, time) => {
  return isDateShowing ?
    `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${date} ${time}"
        />
      </label>
    </fieldset>`
    : ``;
};

const getTaskRepeatFlag = (repeatingDays) => Object.values(repeatingDays).some(Boolean);

export const getTaskBasicInfo = (task) => {
  const {dueDate, repeatingDays} = task;
  const isExpired = getTaskExpirationFlag(dueDate);
  const {isDateShowing, date, time} = getTaskDate(dueDate);
  const isRepeatingTask = getTaskRepeatFlag(repeatingDays);
  return {isExpired, isDateShowing, date, time, isRepeatingTask};
};

const createTaskEditTemplate = (task) => {
  const {description, repeatingDays, color} = task;
  const {isExpired, isDateShowing, date, time, isRepeatingTask} = getTaskBasicInfo(task);

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, repeatingDays);

  return (
    `<article class="card card--edit card--${color} ${getMarkupClass(isRepeatingTask, `card--repeat`)} ${getMarkupClass(isExpired, `card--deadline`)}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${getAnswer(isDateShowing)}</span>
                </button>
                ${getDeadlineFieldset(isDateShowing, date, time)}

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${getAnswer(isRepeatingTask)}</span>
                </button>

                <fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

export default class TaskEdit extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskEditTemplate(this._task);
  }
}
