class TuringState{
  constructor(stateId, stateName, isInitial, isAcceptance){
    this.stateId = stateId;
    this.stateName = stateName;
    this.isInitial = isInitial;
    this.isAcceptance = isAcceptance;
    this.transitions = [];
  }

  addTransition(transitionId, destinyState, symbol, newSymbol, direction){
    let newTransition = new TuringTransition(transitionId,
      this, destinyState, symbol, newSymbol, direction);

    this.transitions.push(newTransition);

    return newTransition;
  }

  getNextState(stringTape){
    let currChar = stringTape.getCurrChar();
    let transition = this.findTransitionWithSymbol(currChar);

    if(transition !== undefined){
      stringTape.moveTape(transition);
      return transition.destinyState;
    }

    return undefined;
  }

  findTransitionWithSymbol(symbol){
    return this.transitions.find(trans => trans.symbol == symbol
      && trans.originState == this);
  }
}
