const fs = require('fs');
const currentVersion = require("./../package.json").version;
const file = "./sonar-project.properties";

fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
        return console.log(err);
    }
    const result = data.replace(/sonar\.projectVersion=\d+\.\d+\.\d+/g, `sonar.projectVersion=${currentVersion}`);

    fs.writeFile(file, result, 'utf8', err => {
        if (err) return console.log(err);
        //console.log(`Version ${currentVersion} was applied to sonar-project.properties`);
    });
});
