class EqTuple{
	constructor(firstState, secondState, discovered, equivalent){
		this.firstState = firstState;
		this.secondState = secondState;
		this.discovered = discovered;
		this.equivalent = equivalent;
		this.equivalenceVerified = false;
	}

	setCheckedStatus(discovered, equivalent, verified){
		this.discovered = discovered;
		this.equivalent = equivalent;
		this.equivalenceVerified = verified;
	}

	getStateArray(){
		let statesArray = [this.firstState, this.secondState];

		return statesArray;
	}

	containsInitial(){
		return this.firstState.isInitial || this.secondState.isInitial;
	}

	containsAcceptance(){
		return this.firstState.isAcceptance && this.secondState.isAcceptance;
	}

	hasAnAcceptance(){
		return this.firstState.isAcceptance || this.secondState.isAcceptance;	
	}
}