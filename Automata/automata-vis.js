let alphabet, states, transitions, network;
/**Automaton logic**/
let automata = new Automata([], [], [], 'undefined', []);

/**
Automata seed
**/
automata.addSymbolToAlphabet('0');
automata.addSymbolToAlphabet('1');

automata.addState("q0", false, true);
automata.addState("q1", false, false);
automata.addState("q2", true, false);
automata.addState("q3", false, false);

automata.addTransition("q0", "q1", 0);
automata.addTransition("q1", "q2", 0);

automata.addTransition("q0", "q0", 0);
automata.addTransition("q0", "q0", 1);

automata.addTransition("q0", "q3", 1);
automata.addTransition("q3", "q2", 1);

automata.addTransition("q2", "q2", 0);
automata.addTransition("q2", "q2", 1);

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
            id: automata.currentStateId,
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
      automata.modifyState(oldStateName, newStateName);
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

      let visNode = states.get().filter(x => x.label == stateToRemove)[0];
      states.remove({id: visNode.id});
      automata.deleteState(visNode.id);

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

      //Finding originStateId
      let indexOfOriginState = automata.findStateByName(originState);
      let originStateId = automata.states[indexOfOriginState].stateId;

      //Finding destinyStateId
      let destinyStateIndex = automata.findStateByName(destinyState);
      let destinyStateId = automata.states[destinyStateIndex].stateId;

      let symbolToEval = document.getElementById('edge-id').value;
      let transitionID = automata.currentTransitionId;
        transitions.add({
            id: automata.currentTransitionId,
            from: originStateId,
            to: destinyStateId,
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
        let newSymbol = document.getElementById('edge-id').value;
        console.log("Symb: " + newSymbol);
        let visTransId = document.getElementById('edge-from').value;
        console.log("Ori: " + visTransId);
        let visTransition = transitions.get().filter(x => x.id == visTransId)[0];
        console.log(visTransition);

        transitions.update({
            id: visTransition.id,
            label: newSymbol,
            from: visTransition.from,
            to: visTransition.to,
            font: visTransition.font
        });
        automata.modifyTransition(visTransition.id, newSymbol);
    }
    catch (err) {
        alert(err);
    }
}

function removeEdge() {
    try {
      let edge = document.getElementById('edge-id').value;
      transitions.remove({id: edge});
      automata.deleteTransition(edge)
    }
    catch (err) {
      alert(err);
    }
}

function evaluateString(){
  try {
    let evaluationString = document.getElementById('eval-string').value;
    console.log("Evaluating: " + evaluationString);
    alert("String is accepted: " + automata.evaluate(Array.from(evaluationString)));
  } catch (e) {
    alert(e);
  }
}
