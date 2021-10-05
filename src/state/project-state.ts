import { Project, ProjectStatus } from "../models/project";

// Create a Listener type
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listerner: Listener<T>) {
    this.listeners.push(listerner);
  }
}

// 3. Project State Management
export class ProjectStateManager extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectStateManager;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) return this.instance;
    else this.instance = new ProjectStateManager();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  updateListeners() {
    for (const listernerFn of this.listeners) {
      listernerFn(this.projects.slice());
    }
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const foundProject = this.projects.find((prj) => prj.id === projectId);
    if (foundProject && foundProject.status !== newStatus) {
      foundProject.status = newStatus;
      this.updateListeners();
    }
  }
}

export const projectStateManager = ProjectStateManager.getInstance();
