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

  findTransitionByName(transitionID){
    for(let index = 0; index < this.transitions.length; ++index){
      if(this.transitions[index].transitionID === transitionID){
        return index;
      }
    }

    return -1;
  }

  //DEPRECATED: DFA ONLY
  findTransitionWithSymbol(symbol){
    for(let index = 0; index < this.transitions.length; ++index){
      let transi = this.transitions[index]
      if(transi.symbol === symbol){
        return transi
      }
    }

    return 'undefined';
  }

  //DEPRECATED: DFA ONLY
  getNextState(symbol){
    let transitionToFind = this.findTransitionWithSymbol(symbol);
    if(transitionToFind != 'undefined'){
      return transitionToFind.destinyState;
    }

    return 'undefined';
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
