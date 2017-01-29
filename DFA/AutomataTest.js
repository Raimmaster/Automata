let DFA = require("./DFA");

let alphabet = ['0', '1'];
console.log(alphabet);
let states = ['q0', 'q1', 'q2'];
console.log(states);
let acceptanceState = ['q2'];

let automata = new DFA(states, alphabet, [], 'q0', acceptanceState);

console.log(automata);
