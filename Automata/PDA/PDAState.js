class PDAState {
  constructor(stateId, stateName, transitions = [], isInitial, isAcceptance){
    this.stateId = stateId;
    this.stateName = stateName;
    this.transitions = transitions;
    this.isInitial = isInitial;
    this.isAcceptance = isAcceptance;
  }

  addTransition(newTransitionId, transitionSymbol, originState, destinyState,
    symbolOnTopOfStack, willPushSymbol, willPushBackTop){
    let newTransition = new PDATransition(newTransitionId, originState, destinyState,
      transitionSymbol, symbolOnTopOfStack, willPushSymbol, willPushBackTop);
    this.transitions.push(newTransition);
  }

  getNextStates(symbol, symbolOnTop){
    let transitions = this.getTransitionsWithSymbol(symbol, this.stateName, symbolOnTop);
    return this.getNextStatesArray(transitions);
  }

  getTransitionsWithSymbol(symbol, originStateName, symbolOnTop){
    return this.transitions.filter(trans =>
      trans.transitionSymbol == symbol &&
      trans.originState.stateName == originStateName &&
      trans.symbolOnTopOfStack == symbolOnTop);
  }

  getClosure(revisedStates, symbolOnTop){
    let epsilonTransitionStates = this.getNextStates('#', symbolOnTop);
    let epsTransSet = new Set();
    epsTransSet.add(this);
    epsilonTransitionStates.forEach(function (item) {
      epsTransSet.add(item);
    });

    for(let epsState of epsilonTransitionStates){
      if(!revisedStates.has(epsState)){
        let newClosureStates = epsState.getClosure(epsTransSet, symbolOnTop);
        newClosureStates.forEach(function (item) {
          epsTransSet.add(item);
        });
      }
    }

    return epsTransSet;
  }

  getNextStatesArray(transitions){
    let states = [];
    for(let trans of transitions){
      states.push(trans.destinyState);
    }
    return states;
  }
}
