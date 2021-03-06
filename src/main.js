import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterController from "./controllers/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import {generateTasks} from "./mock/task";
import {TasksCount, MenuItem} from "./const.js";
import {render} from "./utils/render.js";
import TasksModel from "./models/tasks.js";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();
render(siteHeaderElement, siteMenuComponent);

const tasks = generateTasks(TasksCount.ALL);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent);
const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

siteMenuComponent.setChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      boardController.createTask();
      break;
  }
});
