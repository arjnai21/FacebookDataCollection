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
    addNode(influenced) {
        let id = this.adj.length;
        this.adj.push({});

        this.adj[id].influenced = influenced;
        this.adj[id].children = [];
    }

    // Sets a child to a parent
    addEdge(parent, child) {
        this.adj[parent].children.push(child);
    }

    printGraph() {
        for (let i = 0; i < this.adj.length; i++) {
            console.log(i + ": " + this.adj[i].influenced + "; -> " + this.adj[i].children);
        }
    }
}

// In this example, the source reaches Accounts 1 and 2
// Account 1 has been influenced, so Account 3 reacts to 1. However, Account 3 hasn't been influenced.
// Account 2 has been influenced, so Accounts 4 and 5 react to 2.
// Account 4 has been influenced, but no one else reacts to their posts (therefore it has no children)
// Account 5 has not bee influenced.
let exampleGraph = new Graph();
exampleGraph.addNode(true);
exampleGraph.addNode(true);
exampleGraph.addNode(true);
exampleGraph.addNode(false);
exampleGraph.addNode(true);
exampleGraph.addNode(false);

exampleGraph.addNode(true);
exampleGraph.addNode(false);

exampleGraph.addEdge(0, 1);
exampleGraph.addEdge(0, 2);
exampleGraph.addEdge(1, 3);
exampleGraph.addEdge(2, 4);
exampleGraph.addEdge(2, 5);
exampleGraph.addEdge(0, 6);

exampleGraph.addEdge(6, 2);
exampleGraph.addEdge(1, 4);
exampleGraph.addEdge(4, 7);

exampleGraph.printGraph();

class Analysis {
    constructor(sp, ar, sr, level) {
        // Shortest path to node
        this.sp = sp;
        // Acceptance rate for a node
        this.ar = ar;
        // Spread rate for a node
        this.sr = sr;
        // Nodes in a level - Source: Level = 0
        this.level = level;
    }

    printAnalysis() {
        console.log("SP: " + this.sp);
        console.log("AR: " + this.ar);
        console.log("SR: " + this.sr);
        console.log("Level: " + this.level);
    }
}

// We will use a BFS to calculate probabilities and shortest paths
function analyze (graph) {
    let shortest = Array.from({length: graph.adj.length}, () => 0);
    shortest[0] = 0;
    window.localStorage
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

            // Increase parent count of child (ar)
            parents[graph.adj[current].children[i]].push(current);

            // (sr)
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

let exampleAnalysis = analyze(exampleGraph);
exampleAnalysis.printAnalysis();