const inquirer = require("inquirer");

function play() {
  inquirer
    .prompt({
      type: "input",
      name: "action",
      message: "action: "
    })
    .then(({ action }) => {
      switch (action) {
        case "pick":
          console.log("picked some coins");
          // ...
          // nextTurn();
          break;
        case "buy":
          console.log("bought some card");
          break;
        default:
          console.log("action not valid");
          break;
      }

      play();

      // check if that move fulfills the winning condition
      // if yes, we have a winner, if not, ask();
    });
}

play();
