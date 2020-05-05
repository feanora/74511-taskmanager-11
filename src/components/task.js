import AbstractComponent from "./abstract-component.js";
import {getTaskBasicInfo} from "./task-edit.js";
import {getMarkupClass} from "../utils/common.js";

const createTaskTemplate = (task) => {
  const {description, color, isArchive, isFavorite} = task;
  const {isExpired, date, time, isRepeatingTask} = getTaskBasicInfo(task);
  return (
    `<article class="card card--${color} ${getMarkupClass(isRepeatingTask, `card--repeat`)} ${getMarkupClass(isExpired, `card--deadline`)}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive ${getMarkupClass(isArchive, `card__btn--disabled`)}">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites ${getMarkupClass(isFavorite, `card__btn--disabled`)}"
            >
              favorites
            </button>
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

