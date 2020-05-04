import TaskController from "./task.js";
import NoTasksComponent from "../components/no-tasks.js";
import SortComponent from "../components/sort.js";
import TasksComponent from "../components/tasks.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {remove, render} from "../utils/render.js";
import {TasksCount, SortType} from "../const.js";

const renderTaskList = (tasksContainer, tasks) => {
  return tasks.map((task) => {
    const taskController = new TaskController(tasksContainer);
    taskController.render(task);
    return taskController;
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
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
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
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
    const newTasks = renderTaskList(taskListElement, this._tasks.slice(0, this._showingTasksCount));
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
      const newTasks = renderTaskList(taskListElement, sortedTasks);
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
    const newTasks = renderTaskList(taskListElement, sortedTasks);
    this._showedTaskControllers = newTasks;
    this._renderLoadMoreButton();
  }
}
