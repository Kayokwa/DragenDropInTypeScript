class DragenDrop {
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

  // Methods
  private submitHandler(event: Event) {
    event.preventDefault(); // prevent default submission
    console.log(this.titleInputElement.value);
  }
  private configure() {
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }
  private attach() {
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const projectDnD = new DragenDrop();
