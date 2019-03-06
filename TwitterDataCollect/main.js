/*
Node Object:
node.link = link to profile
node.influence = is the user considered "influenced"
node.influenceCount = number of times keyword is found
node.children = array of child nodes
 */

//main function
const POST = "https://twitter.com/Suntimes/status/1092789944018452486";
const SEARCH_STRS = ["blackface", "racist", "mary poppins", "blacking up", "racism"];

var allNodes = [];
var dummyNode = {};
dummyNode.influenced = true; //simply for conversion algorithm
dummyNode.influenceCount = 0;

if (window.location.href === POST) { // to do if looking at the post
    let showMoreButton = document.getElementsByClassName("ThreadedConversation-showMoreThreadsButton u-textUserColor");
    if (showMoreButton.length > 0)
        showMoreButton[0].click();


    setTimeout(function () {
        let repliesList = getUserRepliesList(window.document);
        dummyNode.children = repliesListIntoNodes(repliesList, window.document);
        for (let i = 0; i < dummyNode.children.length; i++) {
            let profWindow = window.open(dummyNode.children[i].link);
            profWindow.document.body.onload = function () {
                setTimeout(function () {


                    let doc = profWindow.document;
                    profWindow.close();
                    mainIteration(doc, dummyNode.children[i])
                }, 100);

            }
        }
    }, 2000);

}


function repliesListIntoNodes(repliesList, doc) {
    let nodesList = [];
    let yes = true;
    let val;
    val = repliesList.length;
    for (let i = 0; i < val; i++) {
        if (checkVerified(repliesList[i])) continue; //makes sure no verified accounts are opened, Ex. companies / celebrities
        let newNode = {};
        newNode.link = repliesList[i].getAttribute("href");
        for (let j = 0; j < allNodes.length; j++) {
            if (allNodes[j].link === newNode.link || doc.URL.includes(newNode.link)) {
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

function checkForKeyWord(keywords, text) { //returns boolean if any term is found
    for (let i = 0; i < keywords.length; i++) {
        if (text.toLowerCase().includes(keywords[i].toLowerCase()))
            return true;
    }
    return false;

}

function mainIteration(doc, userNode) { //keyword: string profWindow: window object userNode: Node object

    localStorage.setItem("graph", JSON.stringify(dummyNode));
    if (!checkForKeyWord(SEARCH_STRS, doc.documentElement.innerHTML)) {

        return;
    }

    let tweetsList = doc.getElementsByClassName("js-stream-item stream-item stream-item");

    for (let i = 0; i < tweetsList.length; i++) {
        let tweetText = tweetsList[i].getElementsByClassName("TweetTextSize TweetTextSize--normal js-tweet-text tweet-text")[0].innerText;
        if (checkForKeyWord(SEARCH_STRS, tweetText)) {
            setTimeout(ifKeywordFound(userNode, tweetsList, i), 1000);


        }

    }


    //   profWindow.close();

        localStorage.setItem("graph", JSON.stringify(dummyNode));

}

function getLinkFromTweet(tweet) { //tweet is an <li> html object
    let innerDiv = tweet.getElementsByClassName("tweet js-stream-tweet js-actionable-tweet js-profile-popup-actionable dismissible-content original-tweet js-original-tweet")[0];
    return innerDiv.getAttribute("data-permalink-path");
}

//working
function getUserRepliesList(doc) { // tweetWindow is a window object
    let userList = doc.getElementsByClassName("account-group js-user-profile-link");
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

function ifKeywordFound(userNode, tweetsList, i) {
    userNode.influenced = true;
    userNode.influenceCount++;
    let link = getLinkFromTweet(tweetsList[i]); //get link with tweetlist[i]
    if (POST.includes(link)) return;
    let postWindow = window.open(link);

    postWindow.document.body.onload = function () {
        setTimeout(function () {
            let showMoreButton = postWindow.document.getElementsByClassName("ThreadedConversation-showMoreThreadsButton u-textUserColor");
            if (showMoreButton.length > 0)
                showMoreButton[0].click();
            setTimeout(function () {
                let doc = postWindow.document;
                postWindow.close();
                let replierList = repliesListIntoNodes(getUserRepliesList(doc), doc);

                let prevLength = userNode.children.length;
                userNode.children = userNode.children.concat(replierList);

                for (let j = prevLength; j < userNode.children.length; j++) {
                    let childProfWindow = window.open(userNode.children[j].link);
                    childProfWindow.document.body.onload = function () {
                        let doc = childProfWindow.document;
                        childProfWindow.close();
                        mainIteration(doc, userNode.children[j]);
                        //console.log(allNodes);
                    };

                }
            }, 2000);
        }, 100);
    };
}
