//alert(window.location.href);


/* flow -
main
iterate userlist
opennewtab each user
eac huser search profile
save in local storage

 */
//main function
post = "https://twitter.com/PV_Hockey_Assoc/status/1084261852324995072";
if(window.location.href === post){ // to do if looking at a post
    var users = getUserRetweetsList();
    localStorage.setItem("key", "value")
    window.open("https://www.google.com")
    id = 0;
    //openNewTab(users[0]);
}
else if (window.location.href === "twitter.com"){
    var d = localStorage.getItem("key")
}

//searchUserProfile

function repliesListIntoNodes(repliesList){
    nodesList = [];
    for (let i = 0; i < repliesList.length; i++) {
        var newNode = {};
        newNode.id = id++;
        // here we get the full url for the userProfile newNode.link =
        newNode.influenced = false; //set to false for default
        nodesList.push(newNode);
    }
    return nodesList
}

function mainIteration(keyword, profWindow, userNode){
    var doc = profWindow.document;
    var tweetsList = doc.getElementsByClassName("js-tweet-text-container");
    for (var i = 0; i < tweetsList.length; i++){
        if(tweetsList[i].innerHTML.includes(keyword)){
            userNode.influenced = true;
            var link = tweetsList[i].getElementsByClassName("TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")[0].getElementsByTagName("a").getAttribute("href");
            var postWindow = window.open(link);
            userNode.children = repliesListIntoNodes(getUserRepliesList(postWindow));
            for (let j = 0; j < userNode.children; j++) {
                var theWindow = window.open(userNode.children[i].link);
                mainIteration(keyword, theWindow, userNode.children[i])
            }
                //for each child open prof window and skrt
        }
    }
}




//working
function getUserRepliesList(theWindow){
    var doc = theWindow.document;
    var userList = doc.getElementsByClassName("account-group js-user-profile-link");
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
        openNewTab(userList[i]);
        userHitDict[userList[i]] = hits;
    }

    return userHitDict;


}
