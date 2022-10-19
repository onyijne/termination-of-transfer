/*
    Termination of Transfer - tool to help in returning authors rights.
    Copyright (C) 2016  Creative Commons Corporation.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

////////////////////////////////////////////////////////////////////////////////
// Presentation of questions, and main flow of control
// (This is slightly overloaded)
////////////////////////////////////////////////////////////////////////////////

const TotQuestions = {};

////////////////////////////////////////////////////////////////////////////////
// Section One
////////////////////////////////////////////////////////////////////////////////

// When was the work created?

TotQuestions.s1q1a = {
  section: 1,
  question: "When was the work created?",
  explanation:
    "The year in which a work was created can affect its copyright status and its treatment under U.S. copyright law. Most importantly, the tool is concerned with whether a worked was made before or after January 1, 1978, when the most recent overhaul of U.S. copyright went into effect.",
  variable: "creation_year",
  input: "year",
  pre: () => {
    TotNavigation.disablePrevious();
    TotNotifications.displayAnswersHint();
  },
  post: () => {
    TotNotifications.removeAnswersHint();
  },
};

// Has the work been published?

TotQuestions.s1q1b = {
  question: "Has the work been published?",
  explanation:
    'Whether a work has been published can affect its copyright status and factor into the timing of a termination right. Note that "publication" has a particular meaning in U.S. copyright law, as discussed in our <a href="/glossary/#publication_date" target="_blank" title="Termination of Transfer: Glossary">glossary</a>.',
  variable: "work_published",
  input: "radio",
  pre: () => {
    TotNavigation.enablePrevious();
  },
};

// When was the work first published?

TotQuestions.s1q1bi = {
  variable: "pub_year",
  question: "When was the work first published?",
  explanation:
    'When a work was published can affect its copyright status and factor into the timing of a termination right. Note that "publication" has a particular meaning in U.S. copyright law, as discussed in our <a href="/glossary/#publication_date" target="_blank" title="Termination of Transfer: Glossary">glossary</a>.',
  input: "year",
  validate: () => {
    return (
      TotValidation.validDate() ||
      (parseInt(jQuery(".text-question").val()) < TotValues.creation_year
        ? "The publication year cannot be earlier than the creation year."
        : false)
    );
  },
};

// When was the work first published under the grant?

TotQuestions.s1q1bii = {
  section: 1,
  question: "When was the work first published under the grant?",
  explanation:
    'When a work was first published under the grant (which may be different than the the date the work was published for the first time) can factor into the timing of a termination right. Note that "publication" has a particular meaning in U.S. copyright law, as discussed in our <a href="/glossary/#publication_date">glossary</a>.',
  variable: "grant_pub_year",
  input: "year",
  validate: () => {
    let errors = TotValidation.validDate();
    if (errors == false) {
      const year = parseInt(jQuery(".text-question").val());
      if (year < TotValues.creation_year) {
        errors =
          "Year of publication under grant cannot be earlier than year of creation.";
      } else if (year < TotValues.pub_year) {
        errors =
          "Year of publication under grant cannot be earlier than year of initial publication.";
      } /* else if (year < TotValues.k_year) {
        errors = 'Year of publication under grant cannot be earlier than year of grant.';
      }*/
    }
    return errors;
  },
};

// Works from 1989 and earlier usually display a copyright notice. Did the work have a copyright notice?

TotQuestions.s1q1bi2 = {
  question:
    "Published works from 1989 and earlier usually display a copyright notice. Did the work have a copyright notice?",
  explanation:
    'For U.S. works published in certain years, U.S. law required that they feature a "copyright notice" in order to receive federal copyright protection. Whether or not the published version featured a copyright notice can affect the copyright status of these works.',
  variable: "copyright_notice",
  input: "radio",
  values: ["yes", "no", "maybe"],
};

// Has the work been registered with the United State Copyright Office?

TotQuestions.s1q1c = {
  question:
    "Has the work been registered with the United State Copyright Office?",
  explanation:
    "Before 1989, registration was one of the ways authors could secure federal copyright in their work. Whether a work was registered can affect copyright status and the timing of termination right.",
  variable: "work_registered",
  input: "radio",
  values: ["yes", "no"], //, "don't know"] GitHub issue #33
};

// When was the work registered with the United States Copyright Office?

TotQuestions.s1q1ci = {
  question:
    "When was the work registered with the United States Copyright Office?",
  explanation:
    "Before 1989, registration was one of the ways authors could secure federal copyright in their work. When a work was registered can affect copyright status and the timing of termination right.",
  variable: "reg_year",
  input: "year",
};

// What is the date of the agreement or transfer? ...

TotQuestions.s1q1d = {
  question: "What is the year of the agreement or transfer?",
  explanation:
    "When a transfer took place determines the particular set of termination rules that will be applicable. The timing of a transfer is also needed to know when a work's copyright transfer may be eligible for termination.",
  variable: "k_year",
  input: "year",
  validate: () => {
    const errors = TotValidation.validDate();
    if (errors == false) {
      // Stash the user-entered agreement year
      TotValues.user_inputted_k_year = parseInt(jQuery(".text-question").val());
      // If date is before the creation year, use the creation year instead
      if (TotValues.user_inputted_k_year < TotValues.creation_year) {
        jQuery(".text-question").val(TotValues.creation_year);
      }
    }
    return errors;
  },
  answerDisplayValue: () => {
    return `Effective: ${TotValues.k_year} <br/>User entered:  ${TotValues.user_inputted_k_year}`;
  },
};

// Did the agreement or transfer include the right of publication?

TotQuestions.s1q1f = {
  // Last question in section 1, so set this if we've arrived via back button
  section: 1,
  question: "Did the agreement or transfer include the right of publication?",
  explanation:
    'If a <a href="/glossary/#agreement" target="_blank" title="Termination of Transfer: Glossary">transfer</a> from 1978 or later includes the right of <a href="/glossary/#publication_date" target="_blank" title="Termination of Transfer: Glossary">publication</a>, there is a different set of rules for determining when the transfer is eligible for termination.',
  variable: "pub_right",
  input: "radio",
  values: ["yes", "no", "maybe"],
};

////////////////////////////////////////////////////////////////////////////////
// Section Two
////////////////////////////////////////////////////////////////////////////////

// Is the agreement or transfer you want to terminate part of a last will...

TotQuestions.s2q2a = {
  // First question in section 2
  section: 2,
  question:
    'Is the agreement or transfer in question part of a <a href="/glossary/#will" target="_blank" title="Termination of Transfer: Glossary">last will and testament</a>?',
  variable: "last_will",
  input: "radio",
};

// Are any of the authors still alive?

TotQuestions.s2q2bi = {
  question:
    'Are <i>any</i> of the <a href="/glossary/#author" target="_blank" title="Termination of Transfer: Glossary">authors or artists</a> still alive?',
  explanation:
    "The copyright term for many works is based on the life of the author.",
  variable: "any_authors_alive",
  input: "radio",
};

// What is the year the last surviving author died?

TotQuestions.s2q2bi2 = {
  question:
    'What is the year the last surviving <a href="/glossary/#author" target="_blank" title="Termination of Transfer: Glossary">author or artist</a> died?',
  explanation:
    "The copyright term for many works is based on the life of the author.",
  variable: "death",
  input: "year",
};

// Was the work created within the scope of the author’s employment?

TotQuestions.s2q2c = {
  question:
    'Was the work created within the <a href="/glossary/#scope_of_employment" target="_blank" title="Termination of Transfer: Glossary">scope of the author’s employment</a>?',
  variable: "within_scope_of_employment",
  input: "radio",
};

// Was there an express agreement between the author and the author's employer to not treat the work as a work made for hire?

TotQuestions.s2q2ci = {
  question:
    'Was there an express agreement the author and the author\'s employer to not treat the work as a <a href="/glossary/#work_for_hire" target="_blank" title="Termination of Transfer: Glossary">work for hire</a>?',
  variable: "express_agreement",
  input: "radio",
};

// Was the work created in response to a special order or commission

TotQuestions.s2q2d = {
  question:
    'Was the work created in response to a <a href="/glossary/#work_for_hire" target="_blank" title="Termination of Transfer: Glossary">special order or commission</a> by some other person or company?',
  variable: "special_order",
  input: "radio",
};

// Was there a signed written agreement regarding the special order...

TotQuestions.s2q2di = {
  question:
    'Was there a signed written agreement regarding the special order or commission which explicitly refers to the work as a <a href="/glossary/#work_for_hire" target="_blank" title="Termination of Transfer: Glossary">work for hire</a>?',
  variable: "signed_written_agreement",
  input: "radio",
};

// Was the work created for use as one of the following? ...

TotQuestions.s2q2dia = {
  question:
    'Was the work created for use as one of the following? — <ul><li>a contribution to a collective work; a part of a motion picture or other audiovisual work;</li> <li>a translation;</li> <li>a <a href="/glossary/#supplementary_work" title="Termination of Transfer: Glossary">supplementary work</a> (such as a foreword, afterword, table, editorial note, musical arrangement, bibliography, appendix, or index);</li> <li>a <a href="/glossary/#compilation" target="_blank" title="Termination of Transfer: Glossary">compilation</a>;</li> <li>an <a href="/glossary/#instructional_text" target="_blank" title="Termination of Transfer: Glossary">instructional text (text and/or graphics)</a>;</li> <li>a test or answer material for a test;</li> <li>or as an atlas?</li></ul?>',
  variable: "created_as_part_of_motion_picture",
  input: "radio",
  values: ["yes", "no", "don't know"],
};

// Has the original transfer since been renegotiated or altered?

TotQuestions.s2q2e = {
  question: "Has the original transfer since been renegotiated or altered?",
  variable: "renego",
  input: "radio",
  values: ["yes", "no", "don't know"],
};

// Did one or more of the authors or artists enter into the agreement...

TotQuestions.s2q2f = {
  question:
    'Did one or more of the <a href="/glossary/#author" target="_blank" title="Termination of Transfer: Glossary">authors</a> enter into the agreement or transfer?',
  variable: "authors_entered_agreement",
  input: "radio",
};

// s2q2fii is part of the rule for s2q2f

// Was the agreement or transfer made by a member of...

TotQuestions.s2q2fii = {
  // Last question in section 2, so set section if we're going back
  section: 2,
  question:
    'Was the agreement or transfer made by a member of the <a href="/glossary/#author" target="_blank" title="Termination of Transfer: Glossary">author\'s</a> immediate family, or by the executors?<br><i>For more information about which family members qualify, check out the FAQ.</i>',
  variable: "agreement_by_family_or_executor",
  input: "radio",
};

////////////////////////////////////////////////////////////////////////////////
// Storing answers
////////////////////////////////////////////////////////////////////////////////

TotQuestions.validateAnswer = () => {
  let result = false;
  const question = TotQuestions[TotQuestions.current_question];
  if (question["validate"]) {
    result = question.validate();
  } else if (question.type == "year") {
    result = TotValidation.validDate();
  } else if (question.type == "text") {
    // If the text has a minimum length, check it
    if (jQuery(".text-question").val().length < question.min_chars) {
      result = `Answer is too short, it must be at least ${question.min_chars} characters`;
    }
  }
  // We don't worry about radio buttons
  return result;
};

TotQuestions.getAnswer = () => {
  const question = TotQuestions[TotQuestions.current_question];
  let answer = undefined;
  switch (question?.input) {
    case "radio":
      answer = jQuery(':input[type="radio"]:checked').val();
      break;
    case "year":
      if (
        question.optional != true ||
        (question.optional == true && jQuery(".text-question").val() != "")
      ) {
        answer = parseInt(jQuery(".text-question").val());
      }
      break;
    case "year_or_empty":
      if (jQuery(".text-question").val() != "") {
        answer = parseInt(jQuery(".text-question").val());
      }
      break;
    case "text":
    // Fall through to default
    default:
      answer = jQuery(".text-question").val();
      break;
  }
  return answer;
};

TotQuestions.processAnswer = () => {
  let result = false;
  const warnings = TotQuestions.validateAnswer();
  if (warnings === false) {
    const question = TotQuestions[TotQuestions.current_question];
    let answer = TotQuestions.getAnswer();
    TotValues[question.variable] = answer;
    // FIXME: handle converting radio buttons to correct store values
    //        while recording their label in the answers table
    if (answer) {
      if (typeof question.answerDisplayValue === "function") {
        answer = question.answerDisplayValue();
      }
      TotAnswers.appendAnswer(question.variable, question.question, answer);
    }
    TotNotifications.clearAlerts();
    result = true;
  } else {
    TotNotifications.setAlert(warnings);
  }
  return result;
};

////////////////////////////////////////////////////////////////////////////////
// Flag and result lookup
// These messages are stored in a json file so we can also use them in the PDF
////////////////////////////////////////////////////////////////////////////////

TotQuestions.resultMap = undefined;
// Asynchronous fetch of data that is accessed synchronously.
// This data won't be used until after several questions, so this is tolerable.

jQuery
  .getJSON(
    jQuery("script[src*='/termination-of-transfer/assets/js/questions.js']")
      .attr("src")
      .replace(/questions\.js.*$/, "") + "results.json",
  )
  .done((result) => {
    resultMap = result;
  })
  .fail((jqxhr, textStatus, error) => {
    const err = textStatus + ", " + error;
    console.log("Request Failed: " + err);
  });

TotQuestions.getConclusionDetails = (specifier) => {
  const path = specifier.split(".");
  const result = resultMap["Conclusion"][path[0]][path[1]];
  return result;
};

////////////////////////////////////////////////////////////////////////////////
// Flow of control
////////////////////////////////////////////////////////////////////////////////

TotQuestions.first_question = "s1q1a";
TotQuestions.last_question = "s2q2fii";

TotQuestions.start = () => {
  jQuery(".questionnaire-section, .question-progress-buttons").removeClass(
    "hidden",
  );
  jQuery(".no-javascript-alert").addClass("hidden");
  //TotNavigation.disablePrevious();
  TotRendering.transitionTo(TotQuestions.first_question);
};

TotQuestions.transitionQuestion = (next_question) => {
  const previous_question = TotQuestions[TotQuestions.current_question];
  if (previous_question) {
    if (previous_question.post) {
      previous_question.post();
    }
  }
  if (next_question == "finish") {
    TotQuestions.finish();
  } else {
    TotQuestions.current_question = next_question;
    const question = TotQuestions[TotQuestions.current_question];
    if (question["pre"]) {
      question.pre();
    }
    TotRendering.transitionTo(question);
  }
};

TotQuestions.nextQuestionID = () => {
  let next_question = TotQuestions.current_question;
  const rule = TotRules[TotQuestions.current_question];
  if (typeof rule == "function") {
    next_question = rule();
  } else {
    next_question = rule;
  }
  return next_question;
};

TotQuestions.nextQuestion = () => {
  // If the answer was OK, move on
  if (TotQuestions.processAnswer()) {
    ValuesStack.push();
    const id = TotQuestions.nextQuestionID();
    TotValues.question_id = id;
    if (id == "finish") {
      TotQuestions.finish();
    } else {
      TotQuestions.transitionQuestion(TotValues.question_id);
      // Scroll down to make sure the input UI is visible
      jQuery("html,body").animate(
        {
          scrollTop: jQuery("#button-question-next").offset().top,
        },
        "slow",
      );
    }
  }
};

TotQuestions.previousQuestion = () => {
  // If we are going back from *after* the last question, re-enable UI
  if (TotValues.question_id == "finish") {
    TotNavigation.unfinishQuestions();
  }
  // Don't pop past the very first item
  if (ValuesStack.height() > 0) {
    // Go back
    ValuesStack.pop();
    TotQuestions.transitionQuestion(TotValues.question_id);
    TotNotifications.clearAlerts();
    // Clear previous answer
    const previous_question = TotQuestions[TotValues.question_id];
    TotAnswers.removeAnswer(previous_question.variable);
    // Scroll down to make sure the input UI is visible
    jQuery("html,body").animate(
      {
        scrollTop: jQuery("#button-question-next").offset().top,
      },
      "slow",
    );
  }
};

TotQuestions.finish = () => {
  const obj = TotQuestions.getConclusionDetails(TotValues.conclusion);
  TotValues.termination_type = obj.title;
  TotNotifications.setResultAreaMessage(obj, "panel-success");
  TotNavigation.finishQuestions();
  if (TotValues.conclusion_generate_pdf) {
    TotPdf.request();
  }
};

TotQuestions.start = () => {
  TotValues.reset();
  TotNavigation.showQuestions();
  TotNavigation.showAnswersTable();
  TotNavigation.showNextPrevious();
  jQuery("#button-question-next").on("click", TotQuestions.nextQuestion);
  jQuery("#button-question-back").on("click", TotQuestions.previousQuestion);
  // When the user presses "return" in a text area, move to next question
  jQuery("#question-rendering-area").on("submit", () => {
    if (jQuery("#button-question-next").is(":enabled")) {
      jQuery("#button-question-next").click();
    }
    return false;
  });
  TotQuestions.transitionQuestion(TotQuestions.first_question);
  TotValues.question_id = TotQuestions.first_question;
};

jQuery(document).ready(() => {
  TotQuestions.start();
});
