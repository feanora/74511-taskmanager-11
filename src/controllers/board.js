import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import {remove, render, replace} from "../utils/render";
import {TasksCount} from "../const";
import NoTasksComponent from "../components/no-tasks";
import SortComponent from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";

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
    let showingTasksCount = TasksCount.ON_START;
    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    if (isAllTasksArchived || showingTasksCount === 0) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();
    const renderTaskList = (tasksContainer, tasksCount) => {
      tasks.slice(0, tasksCount).forEach((task) => {
        renderTask(taskListElement, task);
      });
    };
    renderTaskList(taskListElement, showingTasksCount);
    render(container, this._loadMoreButtonComponent);

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

    this._loadMoreButtonComponent.setClickHandler(loadMoreButtonComponentClickHandler);
  }
}
