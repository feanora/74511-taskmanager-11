import AbstractComponent from "./abstract-component.js";
import {getMarkupClass, formatDate, formatTime, isOverdueDate} from "../utils/common.js";

const createButtonMarkup = (name, isActive = true) => {
  return (
    `<button type="button" class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}">
    ${name}
    </button>`
  );
};

const createTaskTemplate = (task) => {
  const {description, dueDate, color, repeatingDays} = task;
  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isDateShowing = !!dueDate;
  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;
  const isRepeatingTask = Object.values(repeatingDays).some(Boolean);
  const editButton = createButtonMarkup(`edit`);
  const archiveButton = createButtonMarkup(`archive`, !task.isArchive);
  const favoritesButton = createButtonMarkup(`favorites`, !task.isFavorite);

  return (
    `<article class="card card--${color} ${getMarkupClass(isRepeatingTask, `card--repeat`)} ${getMarkupClass(isExpired, `card--deadline`)}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButton}
            ${archiveButton}
            ${favoritesButton}
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};


export default class Task extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, handler);
  }
}

