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
const POST = "https://twitter.com/Oregonian/status/1095074408891338754";
const SEARCH_STRS = ["blackface", "racist", "mary poppins"];
depth = 0;
var counter = 0;
var allNodes = [];
var dummyNode = {};
dummyNode.influenced = true; //simply for conversion algorithm
dummyNode.influenceCount = 0;

if (window.location.href === POST) { // to do if looking at the post
    let showMoreButton = document.getElementsByClassName("ThreadedConversation-showMoreThreadsButton u-textUserColor");
    if (showMoreButton.length > 0)
        showMoreButton[0].click();


    setTimeout(function () {
        let repliesList = getUserRepliesList(window);
        dummyNode.children = repliesListIntoNodes(repliesList, window);
        for (let i = 0; i < dummyNode.children.length; i++) {
            let profWindow = window.open(dummyNode.children[i].link);
            // profWindow.location.href = dummyNode.children[i].link;
            profWindow.onload = function () {
                mainIteration(SEARCH_STRS, profWindow, dummyNode.children[i])

            }
        }
    }, 1000);

    var x = 0;
}


function repliesListIntoNodes(repliesList, postWindow) {
    let nodesList = [];
    let yes = true;
    let val;
    // if (repliesList.length >= 15) val = 15; // just for cutting it short
    val = repliesList.length;
    for (let i = 0; i < val; i++) {
        if (checkVerified(repliesList[i])) continue; //makes sure no verified accounts are opened, Ex. companies / celebrities
        let newNode = {};
        newNode.link = repliesList[i].getAttribute("href");
        for (let j = 0; j < allNodes.length; j++) {
            if (allNodes[j].link === newNode.link || postWindow.location.href.includes(newNode.link)) {
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
        }
    }
    return nodesList
}

function checkForKeyWord(keywords, tweetText) { //returns boolean if any term is found
    for (let i = 0; i < keywords.length; i++) {
        if (tweetText.toLowerCase().includes(keywords[i].toLowerCase()))
            return true;
    }
    return false;

}

function mainIteration(keywords, profWindow, userNode) { //keyword: string profWindow: window object userNode: Node object

    // if(counter>=5) return;
    let doc = profWindow.document;
    let tweetsList = doc.getElementsByClassName("js-stream-item stream-item stream-item");
    let link;

    for (let i = 0; i < tweetsList.length; i++) {
        let tweetText = tweetsList[i].getElementsByClassName("TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")[0].innerText;
        if (checkForKeyWord(keywords, tweetText)) {
            //console.log(userNode);
            setTimeout(function () {
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
                    let showMoreButton = postWindow.document.getElementsByClassName("ThreadedConversation-showMoreThreadsButton u-textUserColor");
                    if (showMoreButton.length > 0)
                        showMoreButton[0].click();
                    setTimeout(function () {
                        let replierList = repliesListIntoNodes(getUserRepliesList(postWindow), postWindow);
                        let prevLength = userNode.children.length;
                        userNode.children = userNode.children.concat(replierList);

                        for (let j = prevLength; j < replierList.length + prevLength; j++) {
                            let childProfWindow = window.open(replierList[j].link);
                            childProfWindow.onload = function () {
                                mainIteration(keywords, childProfWindow, userNode.children[j]);
                                //console.log(allNodes);
                            };

                        }
                        postWindow.close();
                    }, 1000);
                };
            }, 1000);


        }

    }


    profWindow.close();
    if (window.location.href === POST) {
        console.log(dummyNode);
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
    //account-group js-account-group js-action-profile js-user-profile-link js-nav
    let repliesList = [];

    for (let i = 1; i < userList.length; i++) {
        if (userList[i].tagName !== "DIV") {
            repliesList.push(userList[i]);
        }
    }

    return repliesList; //returns HTML div element of user
}

function checkVerified(user) {
    return (user.getElementsByClassName("Icon Icon--verified").length > 0);
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
