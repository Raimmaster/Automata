class Tape{
  constructor(string){
    this.originalString = string;
    this.emptyValue = ['β'];
    let initialTape = [];
    initialTape = initialTape.concat(this.emptyValue);
    initialTape = initialTape.concat(Array.from(string));
    this.tape = initialTape.concat(this.emptyValue);
    this.cursor = 1;
    this.noMoreCursorMovement = false;
  }

  moveTape(transition){
    let moveValue = transition.direction == 'right' ? 1 : -1;
    this.tape[this.cursor] = transition.newSymbol;
    console.log("Current cursor: " + this.cursor);
    this.cursor += moveValue;
    console.log("New cursor: " + this.cursor);
    if(transition.destinyState.isAcceptance){
      this.noMoreCursorMovement = true;
    }
  }

  getCurrChar(){
    return this.tape[this.cursor];
  }
}
