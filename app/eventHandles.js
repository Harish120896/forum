var db = require("./db");

module.exports = wrap;

function wrap(my){

    handle1.eventName = "*.*.create";

    function handle1(user){
        console.log(arguments)
    }

    return handle1;
}
