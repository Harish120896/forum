
module.exports = wrap;

function wrap(my){

    handle1.eventName = "User.*.create";

    function handle1(user){
        console.log("====");
        console.log(user);
    }

    return [hande1];
}
