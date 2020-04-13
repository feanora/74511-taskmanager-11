import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createBoardTemplate} from "./components/board.js";
import {createSortTemplate} from "./components/sorting.js";
import {createTaskTemplate} from "./components/task.js";
import {createTaskEditTemplate} from "./components/task-edit.js";
import {createLoadMoreButtonTemplate} from "./components/load-more-button.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task";

const TASK_COUNT = 22;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const filters = generateFilters();
const tasks = generateTasks(TASK_COUNT);

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const boardElement = siteMainElement.querySelector(`.board`);
const taskListElement = boardElement.querySelector(`.board__tasks`);
const renderTaskList = (tasksList) => {
  for (let i = 1; i < tasksList.length; i++) {
    render(taskListElement, createTaskTemplate(tasksList[i]), `beforeend`);
  }
};

render(boardElement, createSortTemplate(), `afterbegin`);
render(taskListElement, createTaskEditTemplate(tasks[0]));
renderTaskList(tasks);
render(boardElement, createLoadMoreButtonTemplate());
