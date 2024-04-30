import { forceExit } from "./helpers";
import { getYoutubeVideosList } from "./youtubemodel";

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
    //call load
    const search  = await getYoutubeVideosList(q)


    //exit with message




    forceExit(0, false);
    break;
  }

  default: {
    forceExit(1);
    break;
  }
}


//YOutube
