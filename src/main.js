import BoardComponent from "./components/board.js";
import FilterComponent from "./components/filter.js";
import LoadMoreButtonComponent from "./components/load-more-button.js";
import TaskEditComponent from "./components/task-edit.js";
import TaskComponent from "./components/task.js";
import TasksComponent from "./components/tasks.js";
import NoTasksComponent from "./components/no-tasks";
import SiteMenuComponent from "./components/site-menu.js";
import SortComponent from "./components/sort.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task";
import {TasksCount} from "./const.js";
import {render} from "./utils/render.js";

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);

  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, escKeyDownHandler);
  });
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, escKeyDownHandler);
  });
  render(taskListElement, taskComponent.getElement());
};

const renderBoard = (boardComponent, tasks) => {
  let showingTasksCount = TasksCount.ON_START;
  const isAllTasksArchived = tasks.every((task) => task.isArchive);
  if (isAllTasksArchived || showingTasksCount === 0) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement());
    return;
  }
  render(boardComponent.getElement(), new SortComponent().getElement());
  render(boardComponent.getElement(), new TasksComponent().getElement());

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);
  const renderTaskList = (tasksContainer, tasksCount) => {
    tasks.slice(0, tasksCount).forEach((task) => {
      renderTask(taskListElement, task);
    });
  };
  renderTaskList(taskListElement, showingTasksCount);

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement());

  const loadMoreButtonComponentClickHandler = () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount += TasksCount.BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
      renderTask(taskListElement, task);
    });
    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  };

  loadMoreButtonComponent.getElement().addEventListener(`click`, loadMoreButtonComponentClickHandler);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const filters = generateFilters();
const tasks = generateTasks(TasksCount.ALL);

render(siteHeaderElement, new SiteMenuComponent().getElement());
render(siteMainElement, new FilterComponent(filters).getElement());

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement());
renderBoard(boardComponent, tasks);
