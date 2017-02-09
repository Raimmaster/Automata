class State{
  constructor(stateId, stateName, transitions = []){
    this.stateId = stateId;
    this.stateName = stateName;
    this.transitions = transitions;
    this.setOfNfaStates = [];
  }

  addTransition(newTransitionId, symbol,originState, destinyState){
    let newTransition = new Transition(newTransitionId, symbol, this, destinyState);
    this.transitions.push(newTransition);
  }

  getNextStates(symbol){
    let transitions = this.getTransitionsWithSymbol(symbol, this.stateName);
    return this.getNextStatesArray(transitions);
  }

  getTransitionsWithSymbol(symbol, originStateName){
    return this.transitions.filter(trans =>
      trans.symbol == symbol &&
      trans.originState.stateName == originStateName);
  }

  getClosure(revisedStates){
    let epsilonTransitionStates = this.getNextStates('#');
    let epsTransSet = new Set();
    epsilonTransitionStates.forEach(function (item) {
      epsTransSet.add(item);
    });

    for(let i = 0; i < epsilonTransitionStates.length; ++i){
      let epsState = epsilonTransitionStates[i];
      if(!revisedStates.has(epsState)){
        let newClosureStates = epsState.getClosure(epsTransSet);
        newClosureStates.forEach(function (item) {
          epsTransSet.add(item);
        });
      }
    }

    return epsTransSet;
  }

  getNextStatesArray(transitions){
    let states = [];
    for(let i = 0; i < transitions.length; ++i){
      states.push(transitions[i].destinyState);
    }

    return states;
  }
}
