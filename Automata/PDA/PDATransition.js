class PDATransition{
  constructor(transitionID, originState, destinyState,
    transitionSymbol, symbolOnTopOfStack, willPushSymbol,
    willPushBackTop){
      this.transitionID = transitionID;
      this.originState = originState;
      this.destinyState = destinyState;
      this.transitionSymbol = transitionSymbol;
      this.symbolOnTopOfStack = symbolOnTopOfStack;
      this.willPushSymbol = willPushSymbol;
      this.willPushBackTop = willPushBackTop;
    }

    getStackString(){
      let stackString = this.transitionSymbol + this.symbolOnTopOfStack;

      if(!this.willPushSymbol && !this.willPushBackTop){
        stackString = 'ε';
      }

      return stackString;
    }
}
