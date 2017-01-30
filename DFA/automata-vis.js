let alphabet, states, transitions, network;
/**Automaton logic**/
let dfa = new DFA();
let automatonAlphabet = ['0', '1'];
let acceptanceState = ['q2'];
let automata = new DFA([], automatonAlphabet, [], 'q0', acceptanceState);
// automata.addState('q0');
// automata.addState('q1');
// automata.addState('q2');
// automata.addTransition('q0', 'q1', '0');
// automata.addTransition('q0', 'q0', '1');
// automata.addTransition('q1', 'q2', '1');
// automata.addTransition('q2', 'q2', '0');

/**Functions for UI**/
function addNode() {
    try {
      let stateName = document.getElementById('node-id').value;
        states.add({
            id: stateName,
            label: stateName
        });
        automata.addState(stateName);
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
      let originState = document.getElementById('edge-from').value;
      let destinyState = document.getElementById('edge-to').value;
      let symbolToEval = document.getElementById('edge-id').value;
      let transitionID = originState + symbolToEval;
        transitions.add({
            id: transitionID,
            from: originState,
            to: destinyState,
            label: symbolToEval,
            font: {align: 'top'}
        });
        automata.addTransition(originState, destinyState, symbolToEval);
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

function evaluateString(){
  try {
    let evaluationString = document.getElementById('eval-string').value;
    console.log("Evaluating: " + evaluationString);
    alert("String is accepted: " + automata.evaluate(evaluationString));
  } catch (e) {
    alert(e);
  }
}
