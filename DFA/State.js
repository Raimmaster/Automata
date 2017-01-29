class State{
  constructor(stateName, transitions = []){
    this.stateName = stateName;
    this.transitions = transitions;
    this.amountOfTransitions = 0;
  }

  addTransition(symbol, destinyState){
    let newTransitionId = this.stateName + this.amountOfTransitions;
    this.amountOfTransitions++;
    let newTransition = new Transition(newTransitionId, symbol, destinyState);
    this.transitions.push(newTransition);
  }
}

module.exports = State;
