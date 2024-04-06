import { User } from "./users.js";

const head = (title: string) => `
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    .user {
      font-family: sans-serif;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: .4rem;
      border-bottom: 1px solid #ddd;
    }
    .user img {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      margin-right: 0.7rem;
    }
    .user .name {
      font-weight: bold;
    }
    .user .email {
      font-family: monospace;
    }
  </style>
</head>`;

const renderUsers = (users: Array<User>) => {
  let html = "";
  for (const user of users) {
    html += `<div class="user">
      <img src="${user.picture.medium}" />
      <div class="data">
        <div class="name">${user.fullName}</div>
        <div class="email">${user.email}</div>
      </div>
    </div>`;
  }
  return html;
}

export const render = (users: Array<User>) => {
  return `
<html>
  ${head("User List")}
  <body>
    ${renderUsers(users)}
  </body>
</html>`;
};
