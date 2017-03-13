class PDAState {
  constructor(stateId, stateName, transitions = [], isInitial, isAcceptance){
    this.stateId = stateId;
    this.stateName = stateName;
    this.transitions = transitions;
    this.isInitial = isInitial;
    this.isAcceptance = isAcceptance;
  }

  addTransition(newTransitionId, originState, destinyState, transitionSymbol,
    symbolOnTopOfStack, production, willPushSymbol, willPushBackTop){
    let newTransition = new PDATransition(newTransitionId, originState, destinyState,
      transitionSymbol, symbolOnTopOfStack, production, willPushSymbol, willPushBackTop);
    this.transitions.push(newTransition);

    return newTransition;
  }

  getNextStates(symbol, stack){
    let symbolOnTop = this.getStackTopSymbol(stack);
    let transitions = this.getTransitionsWithSymbol(symbol, this.stateName, symbolOnTop);
    return this.getNextStatesArray(transitions, stack);
  }

  getTransitionsWithSymbol(symbol, originStateName, symbolOnTop){
    return this.transitions.filter(trans =>
      trans.transitionSymbol == symbol &&
      trans.originState.stateName == originStateName &&
      trans.symbolOnTopOfStack == symbolOnTop);
  }

  getClosure(revisedStates, stack){
    let epsilonTransitionStates = this.getNextStates('#', stack);
    let epsTransSet = new Set();
    epsTransSet.add(new TransitionTuple(this, stack));
    epsilonTransitionStates.forEach(x => epsTransSet.add(x));

    for(let epsStateTuple of epsilonTransitionStates){
      if(!revisedStates.has(epsStateTuple)){
        let newClosureStates = epsStateTuple.destinyState.getClosure(epsTransSet, epsStateTuple.stack);
        newClosureStates.forEach( x => epsTransSet.add(x) );
      }
    }

    return epsTransSet;
  }

  getNextStatesArray(transitions, stack){
    let stateTuples = [];
    for(let trans of transitions){
      let newStack = stack.slice();//copy of stack; snapshot


      if(!trans.willPushBackTop){
        let top = newStack.pop();
        console.log("We're popping: " + top);
      }

      if(trans.willPushSymbol){
        if(trans.production != undefined){
          let prodArr = Array.from(trans.production);
          prodArr = prodArr.reverse();
          prodArr.forEach(x => newStack.push(x));
          console.log("Current new stack from prod:");
          console.log(newStack);
        }else {
          newStack.push(trans.transitionSymbol);
        }
      }
      let tuple = new TransitionTuple(trans.destinyState, newStack);
      stateTuples.push(tuple);
    }
    return stateTuples;
  }

  getStackTopSymbol(stack){
    return stack[stack.length - 1];
  }
}
