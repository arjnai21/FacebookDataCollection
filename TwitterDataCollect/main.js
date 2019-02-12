/* flow -
get repliers for first post and convert into list of nodes
for each of those nodes open profile and find influenced tweets
open influenced tweets and get repliers and search their profile
 */

/*
Node Object:
node.link = link to profile
node.influence = is the user considered "influenced"
node.influenceCount = number of times keyword is found
node.children = array of children nodes
 */


//main function
const POST = "https://twitter.com/PV_Hockey_Assoc/status/1084261852324995072";
const SEARCH_STR = "thank";
var counter = 0;
var allNodes = [];
var dummyNode = {};
dummyNode.influenced = true; //simply for conversion algorithm
dummyNode.influenceCount = 0;

if (window.location.href === POST) { // to do if looking at the post
    retweetsList = getUserRepliesList(window);
    id = 0;
    dummyNode.children = repliesListIntoNodes(getUserRepliesList(window));
    for (let i = 0; i < dummyNode.children.length; i++) {
        let profWindow = window.open(dummyNode.children[i].link);
        // profWindow.location.href = dummyNode.children[i].link;
        profWindow.onload = function () {
            mainIteration(SEARCH_STR, profWindow, dummyNode.children[i])

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
        for (let j = 0; j < allNodes.length; j++) {
            if (allNodes[j].link === newNode.link) {
                yes = false;
                break;
            }
        }
        if (yes) {
            newNode.children = [];
            newNode.influenceCount = 0;
            newNode.influenced = false; //set to false for default
            nodesList.push(newNode);
            allNodes.push(newNode);
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
            console.log(userNode);
            userNode.influenced = true;
            userNode.influenceCount++;
            let link = getLinkFromTweet(tweetsList[i]); //get link with tweetlist[i]

            /*for (let i = 0; i < links.length; i++) {
                if (!links[i].href.includes("hashtag")) {
                    link = links[i].href;
                    break;
                }
            }*/


            let postWindow = window.open(link);
            postWindow.onload = function () {
                let replierList = repliesListIntoNodes(getUserRepliesList(postWindow));
                userNode.children = userNode.children.concat(replierList);

                for (let j = 0; j < userNode.children.length; j++) {
                    let childProfWindow = window.open(userNode.children[j].link);
                    childProfWindow.onload = function () {
                        mainIteration(keyword, childProfWindow, userNode.children[j]);
                        //console.log(allNodes);
                    };
                }
                postWindow.close();
            }
        }
    }


    profWindow.close();
    if(window.location.href === POST){
        console.log(JSON.stringify(dummyNode));
    }
}

function getLinkFromTweet(tweet) { //tweet is an <li> html object
    let innerDiv = tweet.getElementsByClassName("tweet js-stream-tweet js-actionable-tweet js-profile-popup-actionable dismissible-content original-tweet js-original-tweet")[0];
    return innerDiv.getAttribute("data-permalink-path");
}

//working
function getUserRepliesList(tweetWindow) { // tweetWindow is a window object
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