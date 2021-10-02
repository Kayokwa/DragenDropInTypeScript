namespace App {
  // Project Type
  export enum ProjectStatus {
    Active,
    Finished,
  }

  // 4. Project
  export class Project {
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      public status: ProjectStatus
    ) {}
  }
}
