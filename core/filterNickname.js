module.exports = filter;
var _ = require("underscore");

function filter(content) {
    var names = content.match(/(?:@)\w*(?=\s|$)/gi);
    var names2 = [];
    if (names) {
        names.forEach(function (name) {
            names2.push(name.substring(1, name.length));
        });
    }
    return _.uniq(names2);
}
