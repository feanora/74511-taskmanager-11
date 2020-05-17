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
  constructor(container, taskModel) {
    this._container = container;
    this._tasksModel = taskModel;

    this._showedTaskControllers = [];
    this._showingTasksCount = TasksCount.ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._sortTypeChangeHandler);
    this._tasksModel.setFilterChangeHandler(this._filterChangeHandler);
  }
  render() {
    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();

    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    if (isAllTasksArchived || this._showingTasksCount === 0) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));
    this._renderLoadMoreButton();
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();
    const newTasks = renderTaskList(taskListElement, tasks, this._dataChangeHandler, this._viewChangeHandler);

    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      const tasks = this._tasksModel.getTasks();
      const taskListElement = this._tasksComponent.getElement();
      this._showingTasksCount += TasksCount.BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
      const newTasks = renderTaskList(taskListElement, sortedTasks, this._dataChangeHandler, this._viewChangeHandler);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  _sortTypeChangeHandler(sortType) {
    this._showingTasksCount = TasksCount.ON_START;

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);
    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;

    const newTasks = renderTaskList(taskListElement, sortedTasks, this._dataChangeHandler, this._viewChangeHandler);
    this._showedTaskControllers = newTasks;

    this._renderLoadMoreButton();
  }

  _dataChangeHandler(taskController, oldData, newData) {
    const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

    if (isSuccess) {
      taskController.render(newData);
    }
  }

  _viewChangeHandler() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _filterChangeHandler() {
    this._updateTasks(TasksCount.ON_START);
  }
}
