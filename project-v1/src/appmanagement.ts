export class AppManagement {
    app: HTMLElement;
    constructor(app: HTMLElement) {
      this.app = app;
    }
  
    append(element: HTMLElement) {
      this.app.append(element);
    }

    clear(){
        this.app.textContent = "";
    }
  }
  