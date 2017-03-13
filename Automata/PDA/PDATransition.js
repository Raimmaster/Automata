class PDATransition{
  constructor(transitionID, originState, destinyState,
    transitionSymbol, symbolOnTopOfStack, production,
    willPushSymbol, willPushBackTop){
      this.transitionID = transitionID;
      this.originState = originState;
      this.destinyState = destinyState;
      this.transitionSymbol = transitionSymbol;
      this.symbolOnTopOfStack = symbolOnTopOfStack;
      this.willPushSymbol = willPushSymbol;
      this.willPushBackTop = willPushBackTop;
      this.production = production;
    }

    getStackString(){
      let transSymbol = this.transitionSymbol;
      let stackString = '';
      if(transSymbol == '#'){
        transSymbol = ' ';
      }
      if(this.production !== undefined){
          stackString = this.production;
      }else {
        stackString =  transSymbol + this.symbolOnTopOfStack;
      }

      if(!this.willPushSymbol && !this.willPushBackTop){
        stackString = 'ε';
      }

      return stackString;
    }
}
