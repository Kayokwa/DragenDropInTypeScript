// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  return isValid;
}
// Add an autobind decorator: Better than using .bind(this) one very call
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// 2. ProjectListClass
class ProjectList {
  // DOM element variables
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement; // there is no HTMLSectionElement! Strange?

  constructor(private type: "active" | "finished") {
    // uses `inline` variable declaration and initialization
    this.templateElement = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    ); // import with all levels of deepness
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`; // this helps with CSS and other functionality that depends on element IDs in the DOM
    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId; // Add list ID dynamically
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PROJECTS"; // Add list ID dynamically
  }
  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element);
  }
}

// 1. ProjectInputRender Class - only responsible for rendering the input form
class ProjectInputRender {
  // DOM element variables
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;

  // Form field variables
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  //Constructor
  constructor() {
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    ); // import with all levels of deepness
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input"; // this helps with CSS and other functionality that depends on element IDs in the DOM

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
    this.attach();
  }

  // Class methods

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
      console.log(title, desc, people);
      this.clearInput();
    }
  }
  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projectRenderer = new ProjectInputRender();
const activeProjects = new ProjectList("active");
const finishedProjects = new ProjectList("finished");
