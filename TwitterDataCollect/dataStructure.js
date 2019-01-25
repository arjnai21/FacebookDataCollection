// I'm going to use an adjacency list to represent this graph
// Suppose that every node is given a certain ID
// Source = 0; Accounts = [1, 2, 3, ..., N]
// Each index of the adjacency list represents a node.
// It includes whether it is influenced or not and its children.
// Note: The source is considered "influenced" even though it's not an account
class Graph {
    constructor() {
        this.adj = [];
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

exampleGraph.addEdge(0, 1);
exampleGraph.addEdge(0, 2);
exampleGraph.addEdge(1, 3);
exampleGraph.addEdge(2, 4);
exampleGraph.addEdge(2, 5);

exampleGraph.printGraph();