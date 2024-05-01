### YouTube Search Project

This project utilizes the Bun framework to search YouTube for videos related to a specified term, creates an index with the list of videos found through the YouTube API, and generates individual pages for each video in a designated folder to store HTML pages.

### Installation

To install the necessary dependencies, run the following command:

```bash
bun install
```

### Usage

Once installed, you can execute the project using the following command:


```bash
bun run main.ts <option>
```

### Options:

- **-y, --youtube <"term">:** Search YouTube for videos related to the specified term. Enclose the term in single or double quotes.
- **-h, --help:** Display the help message.

### Functionality

Upon execution with the `-y` or `--youtube` option followed by a search term, the script interacts with the YouTube API to find relevant videos. It then generates an index listing these videos and creates individual HTML pages for each video, storing them in a dedicated folder. You can run the `index.html` file using **liveServer** (VSCode extension).


### Page Content

Each individual page contains the following information:

- **Video Player:** Displays the YouTube video.
- **Title:** Title of the video.
- **Description:** Description of the video.
- **Comments:** Comments associated with the video.

### Navigation

Navigation through the list of videos is facilitated by arrow buttons, enabling users to move left and right through the video list.

### Note

Be aware that videos with copyright restrictions may not be viewable through  liveServer.

The file env.ts with the YouTube API keys is required.