module.exports = wrap;
var createModel = require("model-brighthas");

function wrap(my) {

    var Photo = createModel("Photo");

    Photo
        .attr("id", {
            readonly: true
        })
        .attr("authorId", {
            required: true
        })
        .method("addImage", function (imgId) {
            if(imgId){
                my.publish("addImage", {authorId: this.authorId, photoId: this.id, imageId: imgId,createTime:Date.now()});
            }
        })
        .method("delImage", function (imgId) {
            if(imgId){
                my.publish("delImage", {authorId: this.authorId, photoId: this.id, imageId: imgId});
            }
        });

    Photo.className = "Photo";

    return Photo;

}
