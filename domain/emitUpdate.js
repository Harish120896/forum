module.exports = function (AggreName,my) {
    return function (aggreObj, fieldNames) {
            var data = {};
            fieldNames.forEach(function (name) {
                data[name] = aggreObj["_" + name];
            })
            my.publish(AggreName+".*.update", aggreObj.id,data);
    };
}

