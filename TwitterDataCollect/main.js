
/* flow -
get repliers for first post and convert into list of nodes
for each of those nodes open profile and find influenced tweets
open influenced tweets and get repliers and search their profile
 */
//main function
post = "https://twitter.com/PV_Hockey_Assoc/status/1084261852324995072";
var allNodes = {};
if(window.location.href === post){ // to do if looking at a post
    retweetsList = getUserRepliesList(window);
    id = 0;
    replierNodes = repliesListIntoNodes(getUserRepliesList(window));
    for (let i = 0; i < replierNodes.length; i++) {
        let profWindow = window.open(replierNodes[i].link);
        profWindow.location.href = replierNodes[i].link;
        profWindow.onload= function (){mainIteration("So", profWindow, replierNodes[i])}
    }
}


function repliesListIntoNodes(repliesList){
    let nodesList = [];
    for (let i = 0; i < repliesList.length; i++) {
        let newNode = {};
        newNode.id = id++;
        newNode.link = repliesList[i].getAttribute("href");
        newNode.influenced = false; //set to false for default
        nodesList.push(newNode);
        allNodes[newNode.id.toString()] = newNode;
    }
    return nodesList
}

function mainIteration(keyword, profWindow, userNode) {
    let doc = profWindow.document;
    let tweetsList = doc.getElementsByClassName("js-tweet-text-container");
    let link;
    for (let i = 0; i < tweetsList.length; i++) {
        if (tweetsList[i].innerHTML.toLowerCase().includes(keyword.toLowerCase())) {
            userNode.influenced = true;
            let links = tweetsList[i].getElementsByClassName("TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")[0].getElementsByTagName("a")
            for (let i = 0; i < links.length; i++) {
                if (!links[i].includes("hashtag")) {
                    link = links[i];
                    break;
                }
            }
            let postWindow = window.open(link);
            postWindow.onload = function () {
                userNode.children = repliesListIntoNodes(getUserRepliesList(postWindow));
                for (let j = 0; j < userNode.children; j++) {
                    let theWindow = window.open(userNode.children[i].link);
                    mainIteration(keyword, theWindow, userNode.children[i])
                }
            }
        }
    }
}

//working
function getUserRepliesList(theWindow){
    let doc = theWindow.document;

    let userList = doc.getElementsByClassName("account-group js-user-profile-link");
    let repliesList = [];
    for (let i = 1; i < userList.length; i++) {
        if (userList[i].tagName !== "DIV") {
            repliesList.push(userList[i]);
        }
    }
    return repliesList;
}

/*function openNewTab(user){
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


/*
function iterateUsersList() {
    let userList = getUserRepliesList();
    let userHitDict = {};
    for (let i = 0; i < userList.length; i++) {
        openNewTab(userList[i]);
        userHitDict[userList[i]] = hits;
    }

    return userHitDict;


}
*/