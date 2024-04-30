import { forceExit } from "./helpers";

if (process.argv.length != 4) {
  forceExit(1);
}

const option = process.argv[2];
const q = process.argv[3];

switch (option) {
  case "-h":
  case "--help": {
    forceExit(0);
    break;
  }

  
  case "-y":
  case "--youtube": {
    forceExit(0);
    break;
  }

  default: {
    forceExit(1);
    break;
  }
}
