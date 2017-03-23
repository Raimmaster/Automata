function resetDataStates(){
    states.clear();
    transitions.clear();
    alphabet.clear();
}

function transformAutomatonToVisual(automaton){
  resetDataStates();
  console.log(automaton);
  for(let state of automaton.states){
    addToStateDataSet(automaton, state.stateName, state.isInitial, state.isAcceptance, state.stateId, true);
    for(let transition of state.transitions){
      addToTransitionDataSet(automaton, transition.originState.stateName,
        transition.destinyState.stateName, transition.symbol, transition.transitionID, true);
    }
  }
}

function addToTransitionDataSet(automaton, originState, destinyState, symbol, transId, setIdManual){
  let originStateId = automaton.getStateByName(originState).stateId;
  let destinyStateId = automaton.getStateByName(destinyState).stateId;
  let transitionID = setIdManual ? transId : automaton.currentTransitionId;
  transitions.add({
        id: transitionID,
        from: originStateId,
        to: destinyStateId,
        label: symbol,
        font: {align: 'top'}
  });
}

function addToStateDataSet(automaton, stateName, isInitialState, isAcceptanceState, stateId, setIdManual){
  let borderColor = '';
  let stateColor = '';

  if(isInitialState){
    stateColor = '#58FA82';
    borderColor = '#FE2E2E';
  }

  if(isAcceptanceState){
    stateColor = '#FFBF00';
  }

  let currentStateId = setIdManual ? stateId : automaton.currentStateId;

  console.log("State: " + currentStateId);
  states.add({
        id: currentStateId,
        label: stateName,
        color: {
          border: borderColor,
          background: stateColor
        }
  });
}
