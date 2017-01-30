let alphabet, states, transitions, network;
/**Automaton logic**/
let dfa = new DFA();
let automatonAlphabet = ['0', '1'];
let acceptanceState = ['q2'];
let automata = new DFA([], automatonAlphabet, [], 'q0', acceptanceState);
automata.addState('q0');
automata.addState('q1');
automata.addState('q2');
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
        {id: 'q0', label: 'q0'},
        {id: 'q1', label: 'q1'},
        {id: 'q2', label: 'q2'}
    ]);

    // create an array with transitions
    transitions = new vis.DataSet();
    transitions.on('*', function () {
        document.getElementById('edges').innerHTML = JSON.stringify(transitions.get(), null, 4);
    });

    //Constants for testing
    transitions.add([
        {id: 'q00', from: 'q0', to: 'q1', label: 'q00', font: {align: 'top'}},
        {id: 'q01', from: 'q0', to: 'q0', label: 'q01', font: {align: 'top'}},
        {id: 'q11', from: 'q1', to: 'q2', label: 'q11', font: {align: 'top'}},
        {id: 'q20', from: 'q2', to: 'q2', label: 'q20', font: {align: 'top'}}
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

    var options = {
      edges: {
        arrows: {
          to: {enabled : true}
        }
      }
    };
    network = new vis.Network(container, data, options);

}
