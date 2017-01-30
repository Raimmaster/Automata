let alphabet, states, transitions, network;
/**Automaton logic**/
let dfa = new DFA();
let automata = new DFA([], [], [], 'undefined', []);

function addNode() {
    try {
      let stateName = document.getElementById('node-id').value;
      let isInitialState = document.getElementById('initial-state').checked;
      let isAcceptanceState = document.getElementById('acceptance-state').checked;
      let stateColor = '#2E9AFE';
      let borderColor = '#2E9AFE';

      if(isInitialState){
        stateColor = '#58FA82';
        borderColor = '#FE2E2E';
      }

      if(isAcceptanceState){
        stateColor = '#FFBF00';
      }

        states.add({
            id: stateName,
            label: stateName,
            color: {
              border: borderColor,
              background: stateColor
            }
        });
        automata.addState(stateName, isAcceptanceState, isInitialState);
    }
    catch (err) {
        alert(err);
    }
}

function addSymbol() {
  try {
    let symbolToAdd = document.getElementById('symbol-id').value;
    alphabet.add({
      id: symbolToAdd,
      symbol: symbolToAdd
    });

    automata.addSymbolToAlphabet(symbolToAdd);
  }
  catch (err){
    alert(err);
  }
}

function updateNode() {
    try {
      let oldStateName = document.getElementById('node-id').value;
      let newStateName = document.getElementById('new-state-name').value;
      automata.modifyState(newStateName);
        states.update({
            id: oldStateName,
            label: newStateName
        });
    }
    catch (err) {
        alert(err);
    }
}

function removeNode() {
    try {
      let stateToRemove = document.getElementById('node-id').value;
      let connectedEdges = network.getConnectedEdges(stateToRemove);
      states.remove({id: stateToRemove});
      automata.deleteState(stateToRemove);

      for(let edgeIndex = 0; edgeIndex < connectedEdges.length; ++edgeIndex){
        transitions.remove(connectedEdges[edgeIndex]);
        console.log(connectedEdges);
      }
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
