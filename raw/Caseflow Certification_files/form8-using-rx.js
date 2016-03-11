(function(){
const DEFAULT_RADIO_ERROR_MESSAGE = "Oops! Looks like you missed one! Please select one of these options.";

const INTERACTIVE_QUESTIONS = [
  "5A", "5B",
  "6A", "6B",
  "7A", "7B",
  "8A2", "8A3", "8B1", "8B2", "8C",
  "9A", "9B",
  "10A", "10B", "10C",
  "11A", "11B",
  "132"
];

const REQUIRED_QUESTIONS = {
  "2":   { message: "" },
  "3":   { message: "Please enter the veteran's full name." },
  "5B":  { message: "Please enter the date of notification." },
  "6B":  { message: "Please enter the date of notification." },
  "7B":  { message: "Please enter the date of notification." },
  "8A1": { message: "Please enter the representative name." },
  "8A2": { message: DEFAULT_RADIO_ERROR_MESSAGE },
  "8A3": { message: "" },
  "8B2": { message: "Please provide the location." },
  "8C":  { message: "" },
  "9A":  { message: DEFAULT_RADIO_ERROR_MESSAGE },
  "9B":  { message: DEFAULT_RADIO_ERROR_MESSAGE },
  "10A": { message: DEFAULT_RADIO_ERROR_MESSAGE },
  "11A": { message: DEFAULT_RADIO_ERROR_MESSAGE },
  "11B": { message: DEFAULT_RADIO_ERROR_MESSAGE },
  "12A": { message: "Please enter the date of the statement of the case." },
  "12B": { message: DEFAULT_RADIO_ERROR_MESSAGE },
  "15":  { message: "" },
  "16":  { message: "" },
  "17A": { message: "Please enter the name of the Certifying Official (usually your name)." },
  "17B": { message: "Please enter the title of the Certifying Official (e.g. Decision Review Officer)." },
  "17C": { message: "" }
};



function $questionField(questionNumber) {
  return $("#question" + questionNumber).find('input,textarea');
}

function streamForQuestion(questionNumber){
  return Rx.Observable.fromEvent( $questionField(questionNumber), 'input',eventToValue );
}

function eventToValue(e){
  return $(e.target).val();
}

window.Form8 = {};
window.Form8.init = function init(){
  INTERACTIVE_QUESTIONS.forEach( function(question){
    const input$ = streamForQuestion(question);
    input$.subscribe( (i)=> console.log("field",question,i) );
  });
}

})();

