import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task";
import {TasksCount} from "./const.js";
import {render} from "./utils/render.js";
import TasksModel from "./models/tasks.js";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const filters = generateFilters();
const tasks = generateTasks(TasksCount.ALL);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

render(siteHeaderElement, new SiteMenuComponent());
render(siteMainElement, new FilterComponent(filters));

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel);
render(siteMainElement, boardComponent);

boardController.render(tasks);
