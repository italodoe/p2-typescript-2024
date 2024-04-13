import "./style.css";
import { LocalStorage } from "./utils.ts";
import { UiManagement } from "./ui.ts";

(function () {
  LocalStorage.clearLocalStorage();
  const Ui = new UiManagement();
  Ui.initListeners();
})();
