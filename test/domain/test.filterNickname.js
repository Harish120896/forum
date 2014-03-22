var filterNickName = require("../../domain/filterNickName");
var should = require("should");

describe("filterNickName", function () {
    it("#filterNickName", function () {
        var result = filterNickName("abcd @leo fdsfs @brighthas ");
        result.should.eql(["leo", "brighthas"]);
    })
});
