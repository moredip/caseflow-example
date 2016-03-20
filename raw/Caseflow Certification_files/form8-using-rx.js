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

window.Form8 = {};
window.Form8.init = function init(){
  showAllHiddenFields();

  const fieldChanges$ = Rx.Observable.from(watchedQuestions()).flatMap( function(question){
    const input$ = streamForQuestion(question).map( function(questionValue){
      return {
        question: question,
        value: questionValue
      };
    });
    return input$;
  });

  const formState$ = fieldChanges$.scan(function(previousFormState,fieldChange){
    const mutation = {}; 
    mutation[fieldChange.question] = fieldChange.value;

    return Object.assign({},previousFormState,mutation);
  },{});

  //formState$.subscribe((x)=>console.log(x));

  const visibility$ = formState$.map(mapFormStateToVisibility);
  visibility$.subscribe((x)=>console.log(x));

  visibility$.subscribe( updateQuestionVisibility );
}

function mapFormStateToVisibility(formState){
  let visibility = {};

  visibility.question5B = !!formState['5A'];
  visibility.question6B = !!formState['6A'];
  visibility.question7B = !!formState['7A'];

  ["8A3", "8C", "9A", "9B"].forEach(function(questionNumber) {
    visibility["question" + questionNumber] = false;
  });

  switch (formState['8A2']) {
  case "Agent":
    visibility.question8C = true;
    break;
  case "Organization":
    visibility.question9A = true;
    visibility.question9B = (formState['9A'] === "No");
    break;
  case "Other":
    visibility.question8A3 = true;
  }

  visibility.question8B2 = (formState['8B1'] === "Certification that valid POA is in another VA file");
  visibility.question10B = visibility.question10C = (formState['10A'] === "Yes");
  visibility.question11B = (formState['11A'] === "Yes");
  //visibility.question132 = state.question13other;
  
  return visibility;
}

function updateQuestionVisibility(visibility){
  for( const questionNumber in visibility ){
    const shouldHide = !visibility[questionNumber];
    const $question = $("#" + questionNumber);

    $question
      .toggleClass('hidden-field', shouldHide)
      .find('input, textarea').prop('disabled',shouldHide);
  }
}

function $questionField(questionNumber) {
  $question = $("#question" + questionNumber);

  if( questionFieldIsAButtonset($question) ){
    return $question;
  }else{
    return $question.find("input[type='text'], textarea");
  }
}

function streamForQuestion(questionNumber){
  const $field = $questionField(questionNumber);

  if( questionFieldIsAButtonset($field) ){
    return streamForButtonSet($field);
  }else{
    return streamForInputField($field);
  }
}

function questionFieldIsAButtonset($question){
  return 'fieldset' === $question.prop("tagName").toLowerCase();
}

function streamForInputField($field){
  return Rx.Observable.fromEvent( $field, 'input',eventToValue )
    .startWith($field.val());
}

function streamForButtonSet($fieldset){
  const radioStreams = $fieldset.find("input[type='radio']").map( function(ix,radio){
    const $radio = $(radio);
    const radioName = $radio.val();

    const checkedStream = Rx.Observable.fromEvent( $radio,'change',(e)=> $(e.target).is(':checked') )
      .startWith( $radio.is(':checked') )
      .filter( (checked)=> checked )
      .map( ()=> radioName );
    return checkedStream;
  });

  return Rx.Observable.merge( ...radioStreams.toArray() );
}

function eventToValue(e){
  return $(e.target).val();
}

function watchedQuestions(){
  const requiredQuestionNumbers = Object.keys(REQUIRED_QUESTIONS);
  return $.unique(INTERACTIVE_QUESTIONS.concat(requiredQuestionNumbers));
}

function showAllHiddenFields(){
  $('.hidden-field').removeClass('hidden-field');
}

})();

