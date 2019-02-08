/* flow -
get repliers for first post and convert into list of nodes
for each of those nodes open profile and find influenced tweets
open influenced tweets and get repliers and search their profile
 */

/*
Node Object:
node.link = link to profile
node.influence = is the user considered "influenced
node.children = array of children nodes
 */


//main function
const POST = "https://twitter.com/PV_Hockey_Assoc/status/1084261852324995072";
const SEARCH_STR = "thank";
var counter = 0;
var allNodes = {};
if (window.location.href === POST) { // to do if looking at the post
    retweetsList = getUserRepliesList(window);
    id = 0;
    replierNodes = repliesListIntoNodes(getUserRepliesList(window));
    for (let i = 0; i < replierNodes.length; i++) {
        let profWindow = window.open(replierNodes[i].link);
        // profWindow.location.href = replierNodes[i].link;
        profWindow.onload = function () {
            mainIteration(SEARCH_STR, profWindow, replierNodes[i])
        }
    }
    var x = 0;
}


function repliesListIntoNodes(repliesList) {
    let nodesList = [];
    let yes = true;
    for (let i = 0; i < repliesList.length; i++) {
        let newNode = {};
        newNode.link = repliesList[i].getAttribute("href");
       /* for (let j = 0; j < allNodes.length; j++) {
            if (allNodes[j].link === newNode.link) {
                yes = false;
                break;
            }
        }*/
        if (yes) {
            newNode.influenced = false; //set to false for default
            nodesList.push(newNode);
            allNodes[id] = newNode;
            id++;
        }
    }
    return nodesList
}

function mainIteration(keyword, profWindow, userNode) { //keyword: string profWindow: window object userNode: Node object

    counter++;
    // if(counter>=5) return;
    let doc = profWindow.document;
    let tweetsList = doc.getElementsByClassName("js-stream-item stream-item stream-item");
    let link;

    for (let i = 0; i < tweetsList.length; i++) {
        let tweetText = tweetsList[i].getElementsByClassName("TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")[0].innerText;
        if (tweetText.toLowerCase().includes(keyword.toLowerCase())) {
            userNode.influenced = true;
            let link = getLinkFromTweet(tweetsList[i]); //get link with tweetlist[i]

            /*for (let i = 0; i < links.length; i++) {
                if (!links[i].href.includes("hashtag")) {
                    link = links[i].href;
                    break;
                }
            }*/


            let postWindow = window.open(link);
            postWindow.onload = function () {
                userNode.children = repliesListIntoNodes(getUserRepliesList(postWindow));

                for (let j = 0; j < userNode.children.length; j++) {
                    let childProfWindow = window.open(userNode.children[j].link);
                    childProfWindow.onload = function () {
                        mainIteration(keyword, childProfWindow, userNode.children[j])
                    };
                }
                postWindow.close();
            }
        }
    }


    profWindow.close();
}

function getLinkFromTweet(tweet) { //tweet is an <li> html object
    let innerDiv = tweet.getElementsByClassName("tweet js-stream-tweet js-actionable-tweet js-profile-popup-actionable dismissible-content original-tweet js-original-tweet")[0];
    return innerDiv.getAttribute("data-permalink-path");
}

//working
function getUserRepliesList(tweetWindow) { // tweetWindow is a window objext
    let doc = tweetWindow.document;
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