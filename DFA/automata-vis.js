let alphabet, states, transitions, network;
/**Automaton logic**/
let dfa = new DFA();
let automatonAlphabet = ['0', '1'];
let acceptanceState = ['q2'];
let automata = new DFA([], automatonAlphabet, [], 'q0', acceptanceState);
automata.addState('q0');
automata.addState('q1');
automata.addState('q2');
console.log(automata.states);
automata.addTransition('q0', 'q1', '0');
automata.addTransition('q0', 'q0', '1');
automata.addTransition('q1', 'q2', '1');
automata.addTransition('q2', 'q2', '0');

/**Functions for UI**/
function addNode() {
    try {
        states.add({
            id: document.getElementById('node-id').value,
            label: document.getElementById('node-id').value
        });
    }
    catch (err) {
        alert(err);
    }
}

function addSymbol() {
  try {
    alphabet.add({
      id: document.getElementById('symbol-id'),
      symbol: document.getElementById('symbol-id')
    });
  }
  catch (err){
    alert(err);
  }
}

function updateNode() {
    try {
        states.update({
            id: document.getElementById('node-id').value,
            label: document.getElementById('node-id').value
        });
    }
    catch (err) {
        alert(err);
    }
}

function removeNode() {
    try {
        states.remove({id: document.getElementById('node-id').value});
    }
    catch (err) {
        alert(err);
    }
}

function addEdge() {
    try {
        transitions.add({
            id: document.getElementById('edge-id').value,
            from: document.getElementById('edge-from').value,
            to: document.getElementById('edge-to').value
        });
    }
    catch (err) {
        alert(err);
    }
}

function updateEdge() {
    try {
        transitions.update({
            id: document.getElementById('edge-id').value,
            from: document.getElementById('edge-from').value,
            to: document.getElementById('edge-to').value
        });
    }
    catch (err) {
        alert(err);
    }
}

function removeEdge() {
    try {
        transitions.remove({id: document.getElementById('edge-id').value});
    }
    catch (err) {
        alert(err);
    }
}

function draw() {
    // create an array with states
    states = new vis.DataSet();
    states.on('*', function () {
        document.getElementById('nodes').innerHTML = JSON.stringify(states.get(), null, 4);
    });

    //Constants for testing
    states.add([
        {id: '1', label: 'Node 1'},
        {id: '2', label: 'Node 2'},
        {id: '3', label: 'Node 3'},
        {id: '4', label: 'Node 4'},
        {id: '5', label: 'Node 5'}
    ]);

    // create an array with transitions
    transitions = new vis.DataSet();
    transitions.on('*', function () {
        document.getElementById('edges').innerHTML = JSON.stringify(transitions.get(), null, 4);
    });

    //Constants for testing
    transitions.add([
        {id: '1', from: '1', to: '2'},
        {id: '2', from: '1', to: '3'},
        {id: '3', from: '2', to: '4'},
        {id: '4', from: '2', to: '5'}
    ]);

    alphabet = new vis.DataSet();
    alphabet.on('*', function() {
      document.getElementById('alphabet').innerHTML = JSON.stringify(alphabet.get(), null, 4);
    })

    //Constants for testing
    alphabet.add([
      {id: '0', symbol: '0'},
      {id: '1', symbol: '1'}
    ]);

    // create a network
    var container = document.getElementById('network');
    var data = {
        nodes: states,
        edges: transitions,
        alphabet: alphabet
    };

    var options = {};
    network = new vis.Network(container, data, options);

}
