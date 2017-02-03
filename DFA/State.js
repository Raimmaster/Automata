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

  findTransitionWithSymbol(symbol){
    for(let index = 0; index < this.transitions.length; ++index){
      let transi = this.transitions[index]
      if(transi.symbol === symbol){
        return transi
      }
    }

    return 'undefined';
  }

  getNextState(symbol){
    let transitionToFind = this.findTransitionWithSymbol(symbol);
    if(transitionToFind != 'undefined'){
      return transitionToFind.destinyState;
    }

    return 'undefined';
  }
}

// module.exports = State;
