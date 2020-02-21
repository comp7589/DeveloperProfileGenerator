const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const open = require("open");
const convertFactory = require("html-pdf");
var options = { format: 'Letter' };
const api = require("./api");
const generateHTML = require("./generateHTML");
const questions = [

    {
        type: "input",
        name: "gitHub",
        message: "What's your gitHub user name?"
    },
    {
        type: "list",
        name: "color",
        message: "What is your favorite color??",
        choices: ["red", "blue", "green", "pink"]
    }

];

// function writeToFile(fileName, data) {

// }

function init() {
    inquirer.prompt(questions).then(({ gitHub, color }) => {
        console.log("Searching...");

        api
            .getUser(gitHub).then(response =>
                api.getStars(gitHub).then(stars => {
                    return generateHTML({
                        stars,
                        color,
                        ...response.data
                    });
                })
            )
            .then(html => {
                // console.log(html);
                // const convert = convertFactory({
                //     converterPath: convertFactory.converters.PDF
                // });
                convertFactory.create(html, options).toFile('./profile.pdf', function (err, result) {
                    console.log(result);
                    if (err) {
                        return console.log(err);
                    }
                //     result.stream.pipe(//THIS LINE THROUGH 56 is unncessary!
                //         fs.createWriteStream(path, join("./", "profile.pdf"))
                //     );
                // convert.kill();
                });
                // open(path.join(process.cwd(), "profile.pdf"))
            })
    })
}
init();
