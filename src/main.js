import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createBoardTemplate} from "./components/board.js";
import {createSortTemplate} from "./components/sorting.js";
import {createTaskTemplate} from "./components/task.js";
import {createTaskEditTemplate} from "./components/task-edit.js";
import {createLoadMoreButtonTemplate} from "./components/load-more-button.js";
import {generateFilters} from "./mock/filter.js";

const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const filters = generateFilters();

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);


render(boardElement, createSortTemplate(), `afterbegin`);
render(taskListElement, createTaskEditTemplate());

const renderElementsList = (count, container, template, place = `beforeend`) => {
  for (let i = 0; i < count; i++) {
    render(container, template, place);
  }
};

renderElementsList(TASK_COUNT, taskListElement, createTaskTemplate());
render(boardElement, createLoadMoreButtonTemplate());
