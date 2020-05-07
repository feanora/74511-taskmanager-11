import TaskController from "./task.js";
import NoTasksComponent from "../components/no-tasks.js";
import SortComponent from "../components/sort.js";
import TasksComponent from "../components/tasks.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {remove, render} from "../utils/render.js";
import {TasksCount} from "../const.js";
import {getSortedTasks} from "../utils/common.js";

const renderTaskList = (tasksContainer, tasks, dataChangeHandler, viewChangeHandler) => {
  return tasks.map((task) => {
    const taskController = new TaskController(tasksContainer, dataChangeHandler, viewChangeHandler);
    taskController.render(task);
    return taskController;
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = TasksCount.ON_START;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }
  render(tasks) {
    const container = this._container.getElement();
    this._tasks = tasks;

    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);
    if (isAllTasksArchived || this._showingTasksCount === 0) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();
    const newTasks = renderTaskList(taskListElement, this._tasks.slice(0, this._showingTasksCount), this._dataChangeHandler, this._viewChangeHandler);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent);
    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      const taskListElement = this._tasksComponent.getElement();
      this._showingTasksCount += TasksCount.BY_BUTTON;

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
      const newTasks = renderTaskList(taskListElement, sortedTasks, this._dataChangeHandler, this._viewChangeHandler);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _sortTypeChangeHandler(sortType) {
    this._showingTasksCount = TasksCount.ON_START;
    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);
    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;
    const newTasks = renderTaskList(taskListElement, sortedTasks, this._dataChangeHandler, this._viewChangeHandler);
    this._showedTaskControllers = newTasks;
    this._renderLoadMoreButton();
  }

  _dataChangeHandler(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));
    taskController.render(this._tasks[index]);
  }

  _viewChangeHandler() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }
}
