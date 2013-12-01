var domain = require("jsdm")();
var init;

module.exports = function(findUser){
    if(init){
        return domain;
    }else{
        init = true;
        domain.register(
            "AggreClass", require("./Column"), require("./User")
            , require("./Topic"), require("./Reply"),
            "get", function () {
            },
            // "listener", require("./eventHandles"),
            "repository", require("./repos"),
            //  "commandHandle", require("./commandHandles"),
            "service", require("./services")(findUser)
        )//.closeMethod()
        .seal();

        return domain;
    }
};
