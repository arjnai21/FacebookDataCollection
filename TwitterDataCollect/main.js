//alert(window.location.href);

//main function
post = "https://twitter.com/RudyGiuliani/status/1084428955384496128";
if(window.location.href === post){ // to do if looking at a post
    var retweets = getNumRetweets();
    var likes =  getNumLikes();
    var replies = getNumReplies();
    var users = getUserRepliesList();
    openNewTab(users[0], "skr");
}

//searchUserProfile

else if(document.body.getAttribute("class").includes("ProfilePage")){

    //after done, close tab, send message back with count
    searchProfile("CNN");

}

function searchProfile(str){
    var text = document.documentElement.innerHTML;
    var count = text.split(str).length-1;
    console.log(count);
    setTimeout(function (){
        window.close();},  10000);
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
    for (let i = 1; i < userList.length; i++) {
        if(userList[i].tagName !== "DIV"){
            repliesList.push(userList[i]);
        }

    }

    return repliesList;


}

function openNewTab(user){
    //text = new XMLSerializer().serializeToString(document);
    var link = "https://twitter.com" + user.getAttribute("href");
    //open new tab with that link, search entire dom with innerHTML
    var req = {};
    req.message = "open_new_tab";
    req.url = link;
    var pause = false;
    chrome.runtime.sendMessage(req);
    //makes code wait until message is received
    /*while (true){
        if (pause){
            break;
        }
    }*/
    //var text = document.documentElement.innerHTML;

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
