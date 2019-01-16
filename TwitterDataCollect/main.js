alert(window.location.href);

//main function
if(window.location.href === "https://twitter.com/RudyGiuliani/status/1084428955384496128"){
    var likes = getNumLikes();
    var shares = getNumShares();
    var replies = getNumReplies();

}

function getNumLikes(){
    var x = document.getElementsByClassName("request-retweeted-popup");
    alert(x);
}
//this is an important comment
function getNumShares(){
    var x = document.getElementsByClassName("request-favorited-popup");
    alert(x);
}

function getNumReplies() {

    var x = document.getElementsByClassName("ProfileTweet-actionCount");
    alert(x[0].getAttribute("data-tweet-stat-count"));

}

function getUserRetweetsList(){
    var userList = document.getElementsByClassName("account-group js-user-profile-link");
    return userList;
}

function searchUserProfile(user, str){

}

function iterateUsersList() {
    var userList = getUserRetweetsList();
    var userHitDict = {};
    for (let i = 0; i < userList; i++) {
        var hits = searchUserProfile(userList[i], "CNN");
        userHitDict[userList[i]] = hits;
    }

    return userHitDict;


}
