//alert(window.location.href);

//main function
if(window.location.href === "https://twitter.com/RudyGiuliani/status/1084428955384496128"){
    var retweets = getNumRetweets();
    var likes =  getNumLikes();
    var replies = getNumReplies();
    getUserRepliesList();

}

//working
function getNumRetweets(){
    var x = document.getElementsByClassName("request-retweeted-popup")[0];
    var num = x.getAttribute("data-tweet-stat-count");

    return num;
}

//working
function getNumLikes(){
    var x = document.getElementsByClassName("request-favorited-popup")[0];
    var num = Number(x.getAttribute("data-tweet-stat-count"));
    return num;
}

//working
function getNumReplies() {

    var x = document.getElementsByClassName("ProfileTweet-actionCount");
    var num = Number(x[0].getAttribute("data-tweet-stat-count"));
    return num;

}


//working
function getUserRepliesList(){
    var userList = document.getElementsByClassName("account-group js-user-profile-link");
    var repliesList = [];
    for (let i = 0; i < userList.length; i++) {
        if(userList[i].tagName !== "DIV"){
            repliesList.push(userList[i]);
        }

    }

    return repliesList;


}

function searchUserProfile(user, str){

}

function iterateUsersList() {
    var userList = getUserRepliesList();
    var userHitDict = {};
    for (let i = 0; i < userList.length; i++) {
        var hits = searchUserProfile(userList[i], "CNN");
        userHitDict[userList[i]] = hits;
    }

    return userHitDict;


}
