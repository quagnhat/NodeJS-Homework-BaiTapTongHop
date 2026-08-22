const fs = require("fs");

fs.writeFile("Hello.txt", "Hello World!.js", (error) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log("File written");
});
