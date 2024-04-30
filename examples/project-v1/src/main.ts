import "./styles/style.css";
import "./styles/style-list.css";
import { UiManagement } from "./ui.ts";

(function () {
  const Ui = new UiManagement();
  Ui.initListeners();
})();
