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

let jsonTree = '{"influenced":true,"influenceCount":0,"children":[{"link":"/ssteachero","children":[{"link":"/MissRudolphPPHS","children":[{"link":"/NFHSCounselors","children":[],"influenceCount":0,"influenced":false}],"influenceCount":4,"influenced":true}],"influenceCount":3,"influenced":true},{"link":"/tinafinster","children":[],"influenceCount":0,"influenced":false}]}';
let tree = JSON.parse(jsonTree);
convertTree(0, tree);
converted.printGraph();

let analyzedData = analyze(converted);
analyzedData.printAnalysis();