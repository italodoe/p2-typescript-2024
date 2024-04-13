import "./style.css";
import { UiManagement } from "./ui.ts";

(function () {
  const Ui = new UiManagement();
  Ui.initListeners();
})();
