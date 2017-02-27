let alphabet, states, transitions, network;
/**Automaton logic**/
let automata = new Automata([], [], [], 'undefined', []);
let automataList = [];
/**
Automata seed
**/
function autoSeed(){
  automata.addSymbolToAlphabet('0');
  automata.addSymbolToAlphabet('1');
  //pipe: |, concat.; kleene = *
  let isInitial = true;
  let isAcceptance = true;


  automata.addState("q0", false, true);
  automata.addState("q1", false, false);
  automata.addState("q2", true, false);
  automata.addState("q3", true, false);

  automata.addTransition("q0", "q1", 1);
  automata.addTransition("q1", "q1", 1);
  automata.addTransition("q1", "q2", 0);
  automata.addTransition("q2", "q3", 1);

  automataList.push(automata);

  automata = new Automata([], automata.alphabet, [], 'undefined', []);

  automata.addState("a", false, true);
  automata.addState("b", false, false);
  automata.addState("c", true, false);
  automata.addState("d", true, false);

  automata.addTransition("a", "a", 1);
  automata.addTransition("a", "b", 0);
  automata.addTransition("b", "c", 1)
  automata.addTransition("c", "d", 0);

  automataList.push(automata);
}

autoSeed();

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

function transformNtoD(){
  let dfaAutomaton = automata.transformNfaToDfa();
  automata = dfaAutomaton;
}

function transformEpsilon(){
  let dfaAutomaton = automata.transformEpsilonToDfa();
  automata = dfaAutomaton;
}

function setAutomatonType(){
  let type = document.getElementById('automata-type').value;
  alert("Type: " + type);
  automata.setType(type);
}

function regexToEpsilon(){
  let regEx = document.getElementById('regex').value;
  let nfaEpsilon = automata.transformRegexToNfaEpsilon(regEx);

  automata = nfaEpsilon;
}

function automataUnion(){
  draw();
  let dfaAutomaton = automata.unionIntersect(automataList, statesArrayHasAcceptance);
  automata = dfaAutomaton;

}

function automataIntersection(){
  draw();
  let dfaAutomaton = automata.unionIntersect(automataList, statesArrayHasBothAcceptance);
  automata = dfaAutomaton;
}

function automataComplement(){

}

function saveAutomaton(){
  if(automataList.length === 2){
    automataList = [];
  }
  let newAutomaton = automata;
  automataList.push(newAutomaton);
  automata.resetDataStates();
  automata = new Automata([], [], [], 'undefined', []);
  draw();
}

function statesArrayHasAcceptance(statesArray){
  let acceptances = statesArray.filter(state => state.isAcceptance);
  //console.log("Acceptances length: " + acceptances.length);
  return acceptances.length > 0;
}

function statesArrayHasBothAcceptance(statesArray){
  let acceptances = statesArray.filter(state => state.isAcceptance);

  return acceptances.length === 2;
}

function minimizeDFA(){
  let dfaAutomaton = automata.minimize();

  automata = dfaAutomaton;
}