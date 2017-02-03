class State{
  constructor(stateName, transitions = []){
    this.stateName = stateName;
    this.transitions = transitions;
  }

  //needs to be tested
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

    //Has to be fixed/updated
  getNextState(symbol){
    let transitionToFind = this.findTransitionWithSymbol(symbol);
    //let indexOfTransition = this.findTransitionByName(transitionToFind);
    if(transitionToFind != 'undefined'){

      return transitionToFind.destinyState;
    }

    return 'undefined';
  }
}

// module.exports = State;
