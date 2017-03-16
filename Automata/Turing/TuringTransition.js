class TuringTransition{
  constructor(transitionId, originState, destinyState,
    symbol, newSymbol, direction){
    this.transitionId = transitionId;
    this.originState = originState;
    this.destinyState = destinyState;
    this.symbol = symbol;
    this.newSymbol = newSymbol;
    this.direction = direction;
  }
}
