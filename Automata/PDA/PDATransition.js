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
      let transSymbol = this.transitionSymbol;
      if(transSymbol == '#'){
        transSymbol = ' ';
      }
      let stackString =  transSymbol + this.symbolOnTopOfStack;

      if(!this.willPushSymbol && !this.willPushBackTop){
        stackString = 'ε';
      }

      return stackString;
    }
}
