let alphabet, states, transitions, network;
/**Automaton logic**/
let automata = new Automata([], [], [], 'undefined', []);
let automataList = [];
let transitionsCollection = [];
let cfgs = new CfgCollection([]);

/**
Automata seed
**/
function autoSeed(){
  automata = new PDA([], [], [],
    [], 'undefined', 'z0',
    []);

  automata.addSymbolToAlphabet('0');
  automata.addSymbolToAlphabet('1');
  //pipe: |, concat.; kleene = *
  let isInitial = true;
  let isAcceptance = true;
  let willPushSymbol = true;
  let willPushBackTop = true;

  automata.addState("q0", false, true);
  automata.addState("q1", false, false);
  automata.addState("q2", true, false);

  // automata.addTransition("q0", "q2", 'epsilon', 'z0', !willPushSymbol, willPushBackTop);
  // automata.addTransition("q0", "q0", '0', 'z0', willPushSymbol, willPushBackTop);
  // automata.addTransition("q0", "q0", '0', '0', willPushSymbol, willPushBackTop);
  // automata.addTransition("q0", "q1", '1', '0', !willPushSymbol, !willPushBackTop);
  // automata.addTransition("q1", "q1", '1', '0', !willPushSymbol, !willPushBackTop);
  // automata.addTransition("q1", "q2", 'epsilon', 'z0', !willPushSymbol, willPushBackTop);

  automata.addTransition("q0", "q0", '0', 'z0', willPushSymbol, willPushBackTop);
  automata.addTransition("q0", "q0", '0', '0', willPushSymbol, willPushBackTop);
  automata.addTransition("q0", "q0", '0', '1', willPushSymbol, willPushBackTop);
  automata.addTransition("q0", "q0", '1', 'z0', willPushSymbol, willPushBackTop);
  automata.addTransition("q0", "q0", '1', '0', willPushSymbol, willPushBackTop);
  automata.addTransition("q0", "q0", '1', '1', willPushSymbol, willPushBackTop);

  automata.addTransition("q0", "q1", 'epsilon', '0', !willPushSymbol, willPushBackTop);
  automata.addTransition("q0", "q1", 'epsilon', '1', !willPushSymbol, willPushBackTop);

  automata.addTransition("q1", "q1", '0', '0', !willPushSymbol, !willPushBackTop);
  automata.addTransition("q1", "q1", '1', '1', !willPushSymbol, !willPushBackTop);
  automata.addTransition("q1", "q2", 'epsilon', 'z0', !willPushSymbol, willPushBackTop);

  let automataAlt = new Automata([], [], [], 'undefined', []);
  //automataAlt.transformAutomatonToVisual(automata);

  automataList.push(automata);
}

function cfgSeed(){
  cfgs.addCfgProduction('E->T+E');
  cfgs.addCfgProduction('E->T-E');
  cfgs.addCfgProduction('E->T');

  cfgs.addCfgProduction('T->F*T');
  cfgs.addCfgProduction('T->F/T');
  cfgs.addCfgProduction('T->F');


  cfgs.addCfgProduction('F->(E)');
  cfgs.addCfgProduction('F->0');
  cfgs.addCfgProduction('F->1');
  cfgs.addCfgProduction('F->2');
  cfgs.addCfgProduction('F->3');
  cfgs.addCfgProduction('F->4');
  cfgs.addCfgProduction('F->5');
  cfgs.addCfgProduction('F->6');
  cfgs.addCfgProduction('F->7');
  cfgs.addCfgProduction('F->8');
  cfgs.addCfgProduction('F->9');
}

function emptyPdaSeed(){
  automata = new PDA([], [], [],
    [], 'undefined', 'z0-p',
    []);
  automata.type = 'empty-pda';
  automata.addSymbolToAlphabet('0');
  automata.addSymbolToAlphabet('1');

  automata.addState('q0', false, true);
  automata.addState('q1', false, false);

  // addTransition(fromState, toState, transitionSymbol,
  //   symbolOnTopOfStack, production, willPushSymbol, willPushBackTop)
  automata.addTransition('q0', 'q0', '0', 'z0-p',
    undefined, true, true);

  automata.addTransition('q0', 'q0', '0', '0',
      undefined, true, true);

  automata.addTransition('q0', 'q1', '1', '0',
      undefined, false, false);

  automata.addTransition('q1', 'q1', '1', '0',
      undefined, false, false);

  automata.addTransition('q1', 'q1', 'epsilon', '0',
        undefined, false, false);

  automata.addTransition('q1', 'q1', 'epsilon', 'z0-p',
      undefined, false, false);
}

function nfaSeed(){
  automata.type = 'nfa';
  automata.addSymbolToAlphabet('0');
  automata.addSymbolToAlphabet('1');

  automata.addState('q0', false, true);
  automata.addState('q1', false, false);
  automata.addState('q2', false, false);
  automata.addState('q3', true, false);

  automata.addTransition('q0', 'q1', '1');
  automata.addTransition('q0', 'q0', '1');
  automata.addTransition('q0', 'q0', '0');


  automata.addTransition('q1', 'q2', '0');
  automata.addTransition('q1', 'q2', '1');

  automata.addTransition('q2', 'q3', '0');
  automata.addTransition('q2', 'q3', '1');

  transformAutomatonToVisual(automata);
}

//nfaSeed();

//emptyPdaSeed();

// autoSeed();

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

    if(automata.type == 'cfg'){
      let symbols = cfgs.addTerminals(symbolToAdd);
      for(let symbol of symbols){
        alphabet.add({
          id: symbol,
          symbol: symbol
        });
      }

      return;
    }

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
      if(automata.type == 'pda' || automata.type == 'empty-pda'){
        let topSymbol = document.getElementById('top-symbol').value;
        let willPushSymbol = document.getElementById('push-symbol').checked;
        let willPushBackTop = document.getElementById('push-top').checked;
        let newTransition = automata.addTransition(originState, destinyState, symbolToEval,
          topSymbol, undefined, willPushSymbol, willPushBackTop);
        transitionsCollection.push(newTransition);
        //in pda-transitions HTML id, add each one
        document.getElementById('pda-transitions').innerHTML = getTransitionsString(transitionsCollection);
        return;
      }
      automata.addTransition(originState, destinyState, symbolToEval);
    }
    catch (err) {
        alert(err);
    }
}

function getTransitionsString(transCollection){
  let transitionString = [];

  for(let transition of transCollection){
    let transSymbol = transition.transitionSymbol;
    if(transSymbol == '#'){
      transSymbol = 'ε';
    }
    let currTransitionString = "Transition from " + transition.originState.stateName
      + " to " + transition.destinyState.stateName
      + " with " + transSymbol + "," + transition.symbolOnTopOfStack
      + "/" + transition.getStackString() + "\n";

    transitionString.push(currTransitionString);
  }

  return transitionString.join(' ');
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
  let type = document.getElementById('automata-type').value.toLowerCase();
  if(type == 'pda'){
    automata = new PDA([], [], [],
      [], 'undefined', 'z0',
      []);
  }else if (type == 'empty-pda' || type == 'cfg'){
    automata = new PDA([], [], [],
      [], 'undefined', 'z0-p',
      []);
  }
  alert("Type: " + type.toLowerCase());
  automata.setType(type.toLowerCase());
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

let increm = 0;
function automataComplement(){
  draw();
  automata.transformAutomatonToVisual(automataList[increm++]);
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
  //draw();
  //let dfaAutomaton = automata.minimize();

  //automata = dfaAutomaton;
  nfaSeed();
}

function saveCfgEntry(){
  //let cfgString = document.getElementById('cfg-string').value;
  //cfgs.addCfgProduction(cfgString);
  cfgSeed();
  updateCfgTab();
}

function updateCfgTab(){
  document.getElementById('cfg-entries').innerHTML = cfgs.getCfgCollectionString();
}

function cfgToPDA(){
  let pdaAutomaton = cfgs.convertToPDA(automata);
  automata = pdaAutomaton;
  document.getElementById('pda-transitions').innerHTML = getTransitionsString(transitionsCollection);
}

function pdaToCFG(){
  cfgs = automata.convertEmptyPdaToCFG();
  updateCfgTab();
}

function transformToRegEx(){
  let regex = automata.transformDfaToRegEx();
  console.log(regex);
  document.getElementById('reg-ex-from-dfa').innerHTML = regex;
}
