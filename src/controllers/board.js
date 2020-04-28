import TaskComponent from "../components/task.js";
import TaskEditComponent from "../components/task-edit.js";
import NoTasksComponent from "../components/no-tasks.js";
import SortComponent from "../components/sort.js";
import TasksComponent from "../components/tasks.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import {remove, render, replace} from "../utils/render.js";
import {TasksCount, SortType} from "../const.js";

const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const escKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };
  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, escKeyDownHandler);
  });
  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, escKeyDownHandler);
  });
  render(taskListElement, taskComponent);
};

const renderTaskList = (tasksContainer, tasks) => {
  tasks.forEach((task) => {
    renderTask(tasksContainer, task);
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
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }
  render(tasks) {
    const container = this._container.getElement();
    const loadMoreButtonComponentClickHandler = () => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount += TasksCount.BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
        renderTask(taskListElement, task);
      });
      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    };
    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }
      if (this._loadMoreButtonComponent) {
        remove(this._loadMoreButtonComponent);
      }
      render(container, this._loadMoreButtonComponent);
      this._loadMoreButtonComponent.setClickHandler(loadMoreButtonComponentClickHandler);
    };

    let showingTasksCount = TasksCount.ON_START;
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    if (isAllTasksArchived || showingTasksCount === 0) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();

    renderTaskList(taskListElement, tasks.slice(0, showingTasksCount));
    renderLoadMoreButton();
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = TasksCount.BY_BUTTON;
      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);
      taskListElement.innerHTML = ``;
      renderTaskList(taskListElement, sortedTasks);
      renderLoadMoreButton();
    });
  }
}