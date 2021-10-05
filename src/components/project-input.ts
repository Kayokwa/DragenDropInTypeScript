import { Component } from "./base-component";
import { autobind } from "../decorators/autobind";
import { projectStateManager } from "../state/project-state";
import { Validatable, validate } from "../util/validation";

// 1. ProjectInputRender Class - only responsible for rendering the input form
export class ProjectInputRender extends Component<
  HTMLDivElement,
  HTMLFormElement
> {
  // Form field variables
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  //Constructor
  constructor() {
    super("project-input", "app", true, "user-input");

    //initialise form-based variables
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    // Attach the main element to the DOM
    this.configure();
  }

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    // trivial validation check

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      this.clearInput();
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInput() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault(); // prevent default submission
    const userInput = this.gatherUserInput();

    // check if we returned a valid tuple (array in JavaScript as the concept of Tuple only exists in TypeScript)
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput; //deconstruct userInput array (tuple)
      projectStateManager.addProject(title, desc, people);
      this.clearInput();
    }
  }
}
