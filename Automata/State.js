class State{
  constructor(stateId, stateName, transitions = []){
    this.stateId = stateId;
    this.stateName = stateName;
    this.transitions = transitions;
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

  getNextStatesArray(transitions){
    let states = [];
    for(let i = 0; i < transitions.length; ++i){
      states.push(transitions[i].destinyState);
    }

    return states;
  }
}
