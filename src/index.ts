import { v4 as uuidV4 } from "uuid";
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>("#list");
const completedTasksList = document.querySelector<HTMLUListElement>(
  "#completed-tasks-list"
);
const form = document.querySelector<HTMLFormElement>("#new-task-form");
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const tasks: Task[] = loadTasks();
const completedTasks: Task[] = loadCompletedTasks();

tasks.forEach(addListItem);
addCompletedListItem(completedTasks);

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input?.value == "" || input?.value == null) return;

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  saveTasks();

  addListItem(newTask);
  input.value = "";
});

function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    tasks.forEach((task) => {
      if (task.completed === true) {
        tasks.splice(tasks.indexOf(task), 1);
        completedTasks.push(task);
      }
    });
    saveTasks();
  });

  label.append(checkbox, task.title);
  item.append(label);
  list?.append(item);
}

function addCompletedListItem(completedTasks: Task[]) {
  saveTasks();

  completedTasks.map((task) => {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    label.append(checkbox, task.title);
    item.append(label);
    completedTasksList?.append(item);
  });
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
  localStorage.setItem("COMPLETED_TASKS", JSON.stringify(completedTasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [];
  return JSON.parse(taskJSON);
}
function loadCompletedTasks(): Task[] {
  const completedTasksJSON = localStorage.getItem("COMPLETED_TASKS");
  if (completedTasksJSON == null) return [];
  return JSON.parse(completedTasksJSON);
}
