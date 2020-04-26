import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterComponent from "./components/filter.js";
import SiteMenuComponent from "./components/site-menu.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task";
import {TasksCount} from "./const.js";
import {render} from "./utils/render.js";

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const filters = generateFilters();
const tasks = generateTasks(TasksCount.ALL);

render(siteHeaderElement, new SiteMenuComponent());
render(siteMainElement, new FilterComponent(filters));

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);
render(siteMainElement, boardComponent);

boardController.render(tasks);
