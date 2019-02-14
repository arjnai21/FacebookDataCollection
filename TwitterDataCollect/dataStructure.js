// I'm going to use an adjacency list to represent this graph
// Suppose that every node is given a certain ID
// Source = 0; Accounts = [1, 2, 3, ..., N]
// Each index of the adjacency list represents a node.
// It includes whether it is influenced or not and its children.
// Note: The source is considered "influenced" even though it's not an account
class Graph {
    constructor(adj) {
        this.adj = adj;
    }

    // Adds a new account to the graph given whether it's influenced or not and its children
    addNode(influenced, link) {
        let id = this.adj.length;
        this.adj.push({});

        this.adj[id].influenced = influenced;
        this.adj[id].link = link;
        this.adj[id].children = [];
    }

    // Sets a child to a parent
    addEdge(parent, child) {
        this.adj[parent].children.push(child);
    }

    printGraph() {
        for (let i = 0; i < this.adj.length; i++) {
            console.log(i + ": " + this.adj[i].influenced + " " + this.adj[i].link + "; -> " + this.adj[i].children);
        }
    }
}

class Analysis {
    constructor(shortestPath, acceptanceRate, spreadRate, level) {
        // Shortest path to a node
        this.shortestPath = shortestPath;
        // The ratio of (1 if influenced, 0 if not) / number of parents
        // This ratio only matters if the graph is not a tree
        this.acceptanceRate = acceptanceRate;
        // The percentage of influenced children
        this.spreadRate = spreadRate;
        // Number of nodes in a level (Source is level 0)
        this.level = level;
    }

    printAnalysis() {
        console.log("Shortest Path: " + this.shortestPath);
        console.log("Acceptance Rate: " + this.acceptanceRate);
        console.log("Spread Rate: " + this.spreadRate);
        console.log("Level: " + this.level);
    }
}

// We will use a BFS to calculate probabilities and shortest paths
function analyze (graph) {
    let shortest = Array.from({length: graph.adj.length}, () => 0);
    shortest[0] = 0;
    let acceptance = Array.from({length: graph.adj.length}, () => 0);
    acceptance[0] = 1;

    // This holds the parents of a node so that we can calculate the acceptance rate later
    let parents = Array.from({length: graph.adj.length}, () => []);

    let spread = Array.from({length: graph.adj.length}, () => 0);

    // Begin BFS
    let visited = Array.from({length: graph.adj.length}, () => false);
    let queue = [];
    queue.unshift(0);
    visited[0] = true;

    while(queue.length !== 0) {
        let current = queue.pop();

        // Calculate number influenced to determine spread rate
        let numberInfluenced = 0;
        for (let i in graph.adj[current].children) {
            if (!visited[graph.adj[current].children[i]]) {
                queue.unshift(graph.adj[current].children[i]);
                visited[graph.adj[current].children[i]] = true;

                // Shortest path to a node = (shortest path to the node before it) + 1
                shortest[graph.adj[current].children[i]] = shortest[current] + 1;
            }

            // Increase parent count of child (acceptanceRate)
            parents[graph.adj[current].children[i]].push(current);

            // (spreadRate)
            if (graph.adj[graph.adj[current].children[i]].influenced) {
                numberInfluenced++;
            }
        }

        // Calculate spread rate
        spread[current] = numberInfluenced / graph.adj[current].children.length;
    }

    // Calculate acceptance rate
    for (let i = 1; i < parents.length; i++) {
        // If the node is not influenced, the acceptance rate is 0.
        if (!graph.adj[i].influenced) {
            acceptance[i] = 0;
            continue;
        }

        // Sorted array of shortest paths to parents
        let sorted = Array.from(parents[i].slice(), x => shortest[x]).sort();

        // This counts the number of parents such that it is in the shortest path to the child
        // We will only use the "shortest path parents" to calculate the acceptance rate
        let closestNodes = 0;
        for (let j in sorted) {
            if (sorted[j] !== sorted[0]) {
                break;
            }

            closestNodes++;
        }

        acceptance[i] = 1 / closestNodes;
    }

    // Calculate nodes in level
    let level = Array.from({length: Math.max(...shortest) + 1}, () => 0);
    for (let i in shortest) {
        level[shortest[i]]++;
    }

    return new Analysis(shortest, acceptance, spread, level);
}

// let exampleAnalysis = analyze(exampleGraph);
// exampleAnalysis.printAnalysis();

let converted = new Graph([]);
function convertTree (parentID, currentNode) {
    let currentID = converted.adj.length;
    currentNode.id = currentID;
    let influenced = currentNode.influenced;
    converted.addNode(influenced, currentNode.link);
    if (converted.adj.length > 1) {
        converted.addEdge(parentID, currentID);
    }

    if (influenced) {
        for (let i = 0; i < currentNode.children.length; i++) {
            if (currentNode.children[i].id < currentID) {
                converted.addEdge(currentID, currentNode.children[i].id);
                continue;
            }
            convertTree(currentID, currentNode.children[i]);
        }
    }
}

let jsonTree = '{"influenced":true,"influenceCount":0,"children":[{"link":"/ydnahcir","children":[],"influenceCount":0,"influenced":false},{"link":"/DuncanBates1977","children":[{"link":"/polyman71","children":[],"influenceCount":0,"influenced":false},{"link":"/Subtlemayo","children":[{"link":"/WitDaScreenOnIt","children":[],"influenceCount":0,"influenced":false}],"influenceCount":1,"influenced":true},{"link":"/LizHomu","children":[],"influenceCount":0,"influenced":false},{"link":"/kimberlymccabe","children":[],"influenceCount":0,"influenced":false},{"link":"/KathyEHalvorsen","children":[],"influenceCount":0,"influenced":false},{"link":"/PAlterBoy1","children":[],"influenceCount":1,"influenced":true},{"link":"/PattyDahlgren","children":[],"influenceCount":1,"influenced":true},{"link":"/aka60643","children":[],"influenceCount":0,"influenced":false},{"link":"/CompanyThings","children":[],"influenceCount":0,"influenced":false},{"link":"/allysonb_curtis","children":[],"influenceCount":0,"influenced":false},{"link":"/Ginas1369","children":[],"influenceCount":1,"influenced":true},{"link":"/Denniseo","children":[],"influenceCount":0,"influenced":false},{"link":"/theplaterogue","children":[{"link":"/tazbruin25","children":[{"link":"/varjag","children":[],"influenceCount":0,"influenced":false},{"link":"/sophiebeanstalk","children":[],"influenceCount":2,"influenced":true},{"link":"/Lacus09","children":[],"influenceCount":3,"influenced":true},{"link":"/CarolAnnBarrows","children":[],"influenceCount":1,"influenced":true},{"link":"/ReaganiteGOPer","children":[],"influenceCount":2,"influenced":true},{"link":"/LaraLovesCrows","children":[],"influenceCount":0,"influenced":false},{"link":"/vertigayle","children":[],"influenceCount":0,"influenced":false},{"link":"/cali4nyaSun","children":[],"influenceCount":2,"influenced":true},{"link":"/MZehut","children":[{"link":"/jmhysong","children":[],"influenceCount":0,"influenced":false},{"link":"/Wanita1","children":[],"influenceCount":0,"influenced":false},{"link":"/Skywtchr","children":[],"influenceCount":0,"influenced":false},{"link":"/sleeprmustawake","children":[],"influenceCount":0,"influenced":false},{"link":"/Pokes86","children":[],"influenceCount":1,"influenced":true},{"link":"/esteckler2","children":[],"influenceCount":4,"influenced":true}],"influenceCount":1,"influenced":true},{"link":"/blueforrule","children":[],"influenceCount":2,"influenced":true},{"link":"/thegoldenfeng","children":[],"influenceCount":1,"influenced":true},{"link":"/xtrixcyclex","children":[],"influenceCount":0,"influenced":false},{"link":"/FishNurd","children":[{"link":"/DanaLathim","children":[],"influenceCount":0,"influenced":false},{"link":"/EdKrassen","children":[],"influenceCount":1,"influenced":true},{"link":"/Hollywoodabel1","children":[],"influenceCount":0,"influenced":false},{"link":"/OwenZephyr0","children":[],"influenceCount":1,"influenced":true},{"link":"/ScottPresler","children":[],"influenceCount":0,"influenced":false},{"link":"/realDennisLynch","children":[],"influenceCount":1,"influenced":true},{"link":"/timdevries2006","children":[],"influenceCount":0,"influenced":false},{"link":"/DaleLC1","children":[],"influenceCount":0,"influenced":false},{"link":"/readnallthetime","children":[],"influenceCount":0,"influenced":false},{"link":"/Csziber","children":[],"influenceCount":0,"influenced":false}],"influenceCount":1,"influenced":true},{"link":"/rmcough","children":[],"influenceCount":0,"influenced":false},{"link":"/cslarochelle","children":[],"influenceCount":0,"influenced":false},{"link":"/CleverMonsterCT","children":[],"influenceCount":1,"influenced":true},{"link":"/twit6615","children":[],"influenceCount":1,"influenced":true},{"link":"/rev_jim1","children":[],"influenceCount":0,"influenced":false},{"link":"/loreennzzoo","children":[],"influenceCount":0,"influenced":false},{"link":"/8bitrocket","children":[],"influenceCount":0,"influenced":false},{"link":"/RealStevenJames","children":[],"influenceCount":0,"influenced":false},{"link":"/ThatOneHippieK","children":[{"link":"/mammasita512","children":[],"influenceCount":0,"influenced":false},{"link":"/megwalker712","children":[],"influenceCount":0,"influenced":false},{"link":"/GidGidammit","children":[],"influenceCount":0,"influenced":false},{"link":"/dhof60","children":[],"influenceCount":0,"influenced":false},{"link":"/Juanita16861109","children":[],"influenceCount":0,"influenced":false},{"link":"/karenlynchkaren","children":[],"influenceCount":0,"influenced":false},{"link":"/MotherSmocker","children":[],"influenceCount":0,"influenced":false},{"link":"/donailin","children":[],"influenceCount":0,"influenced":false},{"link":"/prichaaarrrddd","children":[],"influenceCount":0,"influenced":false},{"link":"/lieslelove","children":[],"influenceCount":0,"influenced":false},{"link":"/SusannaWhitman","children":[],"influenceCount":0,"influenced":false},{"link":"/Jen03745571","children":[],"influenceCount":0,"influenced":false},{"link":"/ResistPres","children":[],"influenceCount":0,"influenced":false},{"link":"/asoiaf_ftw2","children":[],"influenceCount":0,"influenced":false},{"link":"/BryanFarley11","children":[],"influenceCount":0,"influenced":false},{"link":"/pjlacasse22","children":[],"influenceCount":0,"influenced":false},{"link":"/JoanneM239","children":[],"influenceCount":0,"influenced":false},{"link":"/nipper46331205","children":[],"influenceCount":0,"influenced":false},{"link":"/Leisha_17","children":[],"influenceCount":0,"influenced":false},{"link":"/Teresa_Martinez","children":[],"influenceCount":0,"influenced":false},{"link":"/starsapphire37","children":[],"influenceCount":0,"influenced":false},{"link":"/SkoumbisN","children":[],"influenceCount":0,"influenced":false},{"link":"/andreag3515","children":[],"influenceCount":0,"influenced":false},{"link":"/davlanta","children":[],"influenceCount":0,"influenced":false},{"link":"/vachon_dani","children":[],"influenceCount":0,"influenced":false},{"link":"/pritch008","children":[],"influenceCount":0,"influenced":false},{"link":"/rebel_epoch","children":[],"influenceCount":0,"influenced":false},{"link":"/nursevictoria11","children":[],"influenceCount":0,"influenced":false},{"link":"/1Iodin","children":[],"influenceCount":0,"influenced":false},{"link":"/theghostmagnet","children":[],"influenceCount":0,"influenced":false},{"link":"/MichaelaIvy75","children":[],"influenceCount":0,"influenced":false},{"link":"/dodgers88d","children":[],"influenceCount":0,"influenced":false},{"link":"/cstmoore","children":[],"influenceCount":0,"influenced":false}],"influenceCount":2,"influenced":true},{"link":"/shesnottrump","children":[],"influenceCount":0,"influenced":false},{"link":"/JeffdotLayton","children":[],"influenceCount":0,"influenced":false},{"link":"/Leafsbh","children":[],"influenceCount":0,"influenced":false}],"influenceCount":2,"influenced":true},{"link":"/evanjstern","children":[],"influenceCount":0,"influenced":false},{"link":"/curtisjcarroll","children":[],"influenceCount":0,"influenced":false},{"link":"/cxcope","children":[],"influenceCount":1,"influenced":true},{"link":"/zombieTate","children":[],"influenceCount":0,"influenced":false},{"link":"/Ovareasy","children":[],"influenceCount":0,"influenced":false},{"link":"/jaredkeeso","children":[],"influenceCount":0,"influenced":false},{"link":"/TheSansaSnark","children":[],"influenceCount":0,"influenced":false},{"link":"/Byrnzie24","children":[],"influenceCount":0,"influenced":false},{"link":"/Burkeeboy","children":[],"influenceCount":0,"influenced":false},{"link":"/PatrickEdison7","children":[],"influenceCount":1,"influenced":true}],"influenceCount":1,"influenced":true},{"link":"/KRossTheory","children":[],"influenceCount":1,"influenced":true},{"link":"/Nickeyh","children":[],"influenceCount":0,"influenced":false},{"link":"/Katie5002Mary","children":[],"influenceCount":0,"influenced":false},{"link":"/alyseelizabeth","children":[],"influenceCount":0,"influenced":false}],"influenceCount":1,"influenced":true},{"link":"/tcafla","children":[{"link":"/Jitts2220","children":[],"influenceCount":0,"influenced":false},{"link":"/HoneyNutTerrios","children":[{"link":"/snide1962","children":[],"influenceCount":0,"influenced":false},{"link":"/JGiesige","children":[{"link":"/MegTucker1","children":[],"influenceCount":0,"influenced":false},{"link":"/no_reason21","children":[{"link":"/alinavbp","children":[],"influenceCount":0,"influenced":false},{"link":"/jobykoby","children":[],"influenceCount":0,"influenced":false},{"link":"/louise_gullett","children":[],"influenceCount":0,"influenced":false},{"link":"/Rachel1383","children":[],"influenceCount":0,"influenced":false},{"link":"/NicEochain","children":[],"influenceCount":0,"influenced":false},{"link":"/greensmith68","children":[],"influenceCount":0,"influenced":false},{"link":"/p_beckett","children":[],"influenceCount":0,"influenced":false},{"link":"/sharyboo","children":[],"influenceCount":0,"influenced":false},{"link":"/robynlclarke","children":[],"influenceCount":0,"influenced":false},{"link":"/Jpoppy123Hull","children":[],"influenceCount":0,"influenced":false},{"link":"/Toffeepiglet","children":[],"influenceCount":0,"influenced":false},{"link":"/miss_luna_lily","children":[],"influenceCount":0,"influenced":false},{"link":"/leavemout","children":[],"influenceCount":0,"influenced":false},{"link":"/Miserable_Me1","children":[],"influenceCount":0,"influenced":false},{"link":"/Missjotrick","children":[],"influenceCount":0,"influenced":false},{"link":"/R3Amelia","children":[],"influenceCount":0,"influenced":false},{"link":"/JoannaPhillimo1","children":[],"influenceCount":0,"influenced":false},{"link":"/julie240967","children":[],"influenceCount":0,"influenced":false},{"link":"/happyhippochica","children":[],"influenceCount":0,"influenced":false},{"link":"/drakehereford","children":[],"influenceCount":0,"influenced":false}],"influenceCount":1,"influenced":true},{"link":"/col3man01","children":[{"link":"/Safeway","children":[],"influenceCount":0,"influenced":false}],"influenceCount":1,"influenced":true}],"influenceCount":1,"influenced":true},{"link":"/Kadoz8","children":[{"link":"/PigNMixSweetCo","children":[],"influenceCount":0,"influenced":false},{"link":"/Tong5Tong","children":[{"link":"/cotter78","children":[],"influenceCount":1,"influenced":true},{"link":"/wrxengland","children":[],"influenceCount":1,"influenced":true},{"link":"/davepettitt1","children":[],"influenceCount":1,"influenced":true},{"link":"/ClaireHamil123","children":[{"link":"/DraketheParrish","children":[],"influenceCount":3,"influenced":true},{"link":"/GaymerSalvaje69","children":[],"influenceCount":1,"influenced":true},{"link":"/Jasperline10","children":[],"influenceCount":1,"influenced":true},{"link":"/sorkubje","children":[],"influenceCount":1,"influenced":true},{"link":"/CuriousCogito","children":[],"influenceCount":0,"influenced":false},{"link":"/ColinPenDragon","children":[],"influenceCount":2,"influenced":true},{"link":"/isa_abrantes","children":[],"influenceCount":0,"influenced":false},{"link":"/TS_Claudi","children":[],"influenceCount":2,"influenced":true}],"influenceCount":4,"influenced":true},{"link":"/GranddadOlly","children":[],"influenceCount":0,"influenced":false},{"link":"/ScottRen14","children":[],"influenceCount":1,"influenced":true},{"link":"/ChrisRossin","children":[],"influenceCount":1,"influenced":true},{"link":"/Paninaro86_","children":[],"influenceCount":2,"influenced":true},{"link":"/PeteDurrand","children":[{"link":"/nibo1960","children":[],"influenceCount":0,"influenced":false}],"influenceCount":1,"influenced":true},{"link":"/DavidRankine4","children":[],"influenceCount":1,"influenced":true},{"link":"/xxSLOTxx","children":[],"influenceCount":2,"influenced":true},{"link":"/DDRF28","children":[],"influenceCount":2,"influenced":true},{"link":"/BuryRelics","children":[],"influenceCount":1,"influenced":true},{"link":"/StuartsStu","children":[{"link":"/RandoCalrisan","children":[],"influenceCount":0,"influenced":false}],"influenceCount":1,"influenced":true},{"link":"/donna1276","children":[],"influenceCount":1,"influenced":true},{"link":"/Walsy83","children":[{"link":"/littlestar1979","children":[],"influenceCount":2,"influenced":true},{"link":"/awendyburnham","children":[],"influenceCount":1,"influenced":true},{"link":"/lindaturner997","children":[],"influenceCount":4,"influenced":true},{"link":"/Jazzywazzyding","children":[],"influenceCount":3,"influenced":true},{"link":"/caro8500","children":[],"influenceCount":2,"influenced":true},{"link":"/LilMissCherryUK","children":[],"influenceCount":1,"influenced":true},{"link":"/agranto5","children":[],"influenceCount":5,"influenced":true},{"link":"/JuliaJo73466165","children":[],"influenceCount":4,"influenced":true},{"link":"/haltyballa","children":[],"influenceCount":0,"influenced":false},{"link":"/andrayasmumma","children":[],"influenceCount":2,"influenced":true},{"link":"/helenharding83","children":[],"influenceCount":0,"influenced":false}],"influenceCount":2,"influenced":true},{"link":"/dinglekiller1","children":[],"influenceCount":1,"influenced":true},{"link":"/Mariobug25","children":[],"influenceCount":0,"influenced":false},{"link":"/Millsy19691","children":[],"influenceCount":0,"influenced":false}],"influenceCount":2,"influenced":true},{"link":"/rorysdriver","children":[],"influenceCount":2,"influenced":true},{"link":"/ColinCa85008523","children":[],"influenceCount":0,"influenced":false}],"influenceCount":2,"influenced":true},{"link":"/TwitHarms","children":[],"influenceCount":2,"influenced":true},{"link":"/MichaelHolmes36","children":[],"influenceCount":2,"influenced":true},{"link":"/GolfSub70","children":[{"link":"/nuttypumpkin","children":[],"influenceCount":0,"influenced":false},{"link":"/chancethefarmer","children":[],"influenceCount":2,"influenced":true},{"link":"/frozengolfer","children":[{"link":"/KimKarrick","children":[],"influenceCount":3,"influenced":true}],"influenceCount":3,"influenced":true}],"influenceCount":5,"influenced":true},{"link":"/Eric_Attard22","children":[],"influenceCount":3,"influenced":true},{"link":"/FalconPunch85","children":[],"influenceCount":2,"influenced":true}],"influenceCount":1,"influenced":true},{"link":"/KenDowswell","children":[],"influenceCount":0,"influenced":false}],"influenceCount":2,"influenced":true},{"link":"/HOFDewey","children":[],"influenceCount":0,"influenced":false},{"link":"/SteveKirsch7","children":[],"influenceCount":0,"influenced":false},{"link":"/C4T4LDO","children":[],"influenceCount":1,"influenced":true},{"link":"/remington_sonny","children":[{"link":"/3YearLetterman","children":[],"influenceCount":0,"influenced":false}],"influenceCount":3,"influenced":true},{"link":"/dshort1960","children":[],"influenceCount":0,"influenced":false},{"link":"/mrpeebobryson","children":[],"influenceCount":0,"influenced":false},{"link":"/abizcrazy","children":[],"influenceCount":0,"influenced":false},{"link":"/bribrispinks","children":[],"influenceCount":0,"influenced":false},{"link":"/23Egremont","children":[],"influenceCount":0,"influenced":false},{"link":"/shart2shart","children":[],"influenceCount":0,"influenced":false},{"link":"/ShaneBraman","children":[{"link":"/SwampYnkStoolie","children":[],"influenceCount":0,"influenced":false},{"link":"/Joharfrejun","children":[],"influenceCount":0,"influenced":false},{"link":"/Obeytheboii_11","children":[{"link":"/getvindictive","children":[],"influenceCount":0,"influenced":false},{"link":"/SaintsNato","children":[],"influenceCount":1,"influenced":true}],"influenceCount":1,"influenced":true},{"link":"/jameoncoughlan","children":[],"influenceCount":0,"influenced":false},{"link":"/lazershow4","children":[],"influenceCount":0,"influenced":false},{"link":"/Simmerr_","children":[],"influenceCount":0,"influenced":false}],"influenceCount":1,"influenced":true}]}';
let tree = JSON.parse(jsonTree);
convertTree(0, tree);
converted.printGraph();

let analyzedData = analyze(converted);
analyzedData.printAnalysis();