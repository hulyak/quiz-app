/******************************************
 *********************** QUIZ CONTROLLER
 *****************************************/
// manage quiz data
const quizController = (function () {
  //************************* question constructor *****************/
  function Question(id, questionText, options, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  // local storage
  const questionLocalStorage = {
    // assign key and value
    setQuestionCollection: function (newCollection) {
      localStorage.setItem("questionCollection", JSON.stringify(newCollection));
    },
    // get the key
    getQuestionCollection: function () {
      return JSON.parse(localStorage.getItem("questionCollection"));
    },
    // remove the key
    removeQuestionCollection: function () {
      localStorage.removeItem("questionCollection");
    },
  };

  //  start the local storage with empty array
  if (questionLocalStorage.getQuestionCollection() === null) {
    questionLocalStorage.setQuestionCollection([]);
  }

  // increase the question by 1
  const quizProgress = {
    questionIndex: 0,
  };

  //**************** PERSON CONSTRUCTOR ****************************/
  function Person(id, firstName, lastName, score) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.score = score;
  }

  const currentPersonData = {
    fullname: [],
    score: 0,
  };

  const adminFullName = ["hulya", "karakaya"];

  // prepare local storage
  const personLocalStorage = {
    setPersonData: (newPersonData) => {
      localStorage.setItem("personData", JSON.stringify(newPersonData));
    },
    getPersonData: () => JSON.parse(localStorage.getItem("personData")),
    removePersonData: () => localStorage.removeItem("personData"),
  };

  //  start the local storage with empty array
  if (personLocalStorage.getPersonData() === null) {
    personLocalStorage.setPersonData([]);
  }

  return {
    // make it public
    getQuestionLocalStorage: questionLocalStorage,
    getQuizProgress: quizProgress,
    // add questions with local storage, return method
    // for options we may have two options, use for loop and store each option in an array
    addQuestionOnLocalStorage: function (newQuestionText, options) {
      let optionsArr,
        correctAnswer,
        questionId,
        newQuestion,
        getStoredQuestions,
        isChecked;

      optionsArr = [];
      isChecked = false;
      //  start the local storage with empty array
      if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
      }

      for (let i = 0; i < options.length; i++) {
        if (options[i].value !== "") {
          optionsArr.push(options[i].value);
        }
        // if the radio button is checked and not empty
        if (
          options[i].previousElementSibling.checked &&
          options[i].value !== ""
        ) {
          correctAnswer = options[i].value;
          isChecked = true; // radio button is checked
        }
      }

      // if local storage is not empty
      if (questionLocalStorage.getQuestionCollection().length > 0) {
        // assign id to last item and increase the id by 1
        questionId =
          questionLocalStorage.getQuestionCollection()[
            questionLocalStorage.getQuestionCollection().length - 1
          ].id + 1;
      } else {
        questionId = 0;
      }

      //   make sure user don't submit empty question textarea
      if (newQuestionText.value !== "") {
        //   make sure user doesn't submit options inputs not empty
        if (optionsArr.length > 1) {
          // make sure radio button is checked for correct answer
          if (isChecked) {
            newQuestion = new Question(
              questionId,
              newQuestionText.value,
              optionsArr,
              correctAnswer
            );

            // insert new questions inside local storage
            getStoredQuestions = questionLocalStorage.getQuestionCollection();
            getStoredQuestions.push(newQuestion);
            questionLocalStorage.setQuestionCollection(getStoredQuestions);
            //    empty the text area
            newQuestionText.value = "";
            for (let x = 0; x < options.length; x++) {
              //   clear the inputs
              options[x].value = "";
              //   uncheck the radio button
              options[x].previousElementSibling.checked = false;
            }
            console.log(questionLocalStorage.getQuestionCollection());
            // add questions dynamically
            return true;
          } else {
            alert(
              "You missed to check correct answer or you checked answer without value"
            );
            return false;
          }
        } else {
          alert("You must insert at least two options");
          return false;
        }
      } else {
        alert("Please insert a question");
        return false;
      }
    },

    checkAnswer: function (answer) {
      // compares the answer with the local storage
      if (
        questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex]
          .correctAnswer === answer.textContent
      ) {
        // increase the score
        currentPersonData.score++;
        return true;
      } else {
        return false;
      }
    },

    // return boolean, check condition of question, this method shows no more question left
    isFinished: function () {
      // add 1 because last question's index is always minus 1 from its length
      return (
        quizProgress.questionIndex + 1 ===
        questionLocalStorage.getQuestionCollection().length
      );
    },

    //******************************** Person PUBLIC METHOD *******/

    // create new Person object
    addPerson: () => {
      let newPerson, personID, personData;
      // get the last item index
      if (personLocalStorage.getPersonData().length > 0) {
        personId =
          personLocalStorage.getPersonData()[
            personLocalStorage.getPersonData().length - 1
          ].id + 1;
      } else {
        personID = 0;
      }

      newPerson = new Person(
        personID,
        currentPersonData.fullname[0],
        currentPersonData.fullname[1],
        currentPersonData.score
      );
      // get person data from local storage
      personData = personLocalStorage.getPersonData();
      personData.push(newPerson); // add to local storage
      console.log(newPerson);
      personLocalStorage.setPersonData(personData); // update local storage
    },
    getPersonLocalStorage: personLocalStorage,
    getCurrentPersonData: currentPersonData,
    getAdminFullName: adminFullName,
  };
})();

/*********************************************
 ******************** UI CONTROLLER
 **********************************************/
const UIController = (function () {
  const domItems = {
    //********************************* admin panel elements *****/ 
    adminPanelSection: document.querySelector(".admin-panel-container"),
    questionInsertBtn: document.getElementById("question-insert-btn"),
    newQuestionText: document.getElementById("new-question-text"),
    adminOptions: document.querySelectorAll(".admin-option"),
    adminOptionsContainer: document.querySelector(".admin-options-container"),
    insertedQuestionsWrapper: document.querySelector(
      ".inserted-questions-wrapper"
    ),
    questionUpdateBtn: document.getElementById("question-update-btn"),
    questionDeleteBtn: document.getElementById("question-delete-btn"),
    questionsClearBtn: document.getElementById("questions-clear-btn"),
    resultsListWrapper: document.querySelector(".results-list-wrapper"),
    resultsClearBtn : document.getElementById('results-clear-btn'),
    //********************************  QUIZ SECTION *********** */
    quizSection: document.querySelector(".quiz-container"),
    askedQuestionText: document.getElementById("asked-question-text"),
    quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
    progressBar: document.querySelector("progress"),
    progressParagraph: document.getElementById("progress"),
    instantAnswerContainer: document.querySelector(".instant-answer-container"),
    instantAnswerText: document.getElementById("instant-answer-text"),
    instantAnswerDiv: document.getElementById("instant-answer-wrapper"),
    emotionIcon: document.getElementById("emotion"),
    nextQuestionBtn: document.getElementById("next-question-btn"),
    //********************* LANDING PAGE SIGN UP ****************/
    landingPageSection: document.querySelector(".landing-page-container"),
    startQuizBtn: document.getElementById("start-quiz-btn"),
    firstNameInput: document.getElementById("firstname"),
    lastNameInput: document.getElementById("lastname"),
    /********************************FINAL RESULT SECTION ****** */
    finalResultSection: document.querySelector(".final-result-container"),
    finalScoreText: document.getElementById("final-score-text"),
    
  };

  // returns as an object and make it public
  return {
    getDomItems: domItems,
    // add new inputs for question
    addInputsDynamically: function () {
      const addInput = () => {
        let inputHTML, counter;
        // increase the counter for input elements
        counter = document.querySelectorAll(".admin-option").length;
        inputHTML = `<div class="admin-option-wrapper"><input type="radio" class="admin-option-${counter}" name="answer" value="1" /><input type="text" class="admin-option admin-option-${counter}" name="answer" value=""" /></div>`;

        //  add as a last child item, add HTML
        domItems.adminOptionsContainer.insertAdjacentHTML(
          "beforeend",
          inputHTML
        );
        // remove from the last input element 2nd input
        domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener(
          "focus",
          addInput
        );
        // attach it to newly created input element
        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
          "focus",
          addInput
        );
      };
      // access to last input from its parent wrapper, from "admin-options-container" to wrapper and then input
      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener(
        "focus",
        addInput
      );
    },
    // get questions from local storage
    createQuestionList: function (getQuestions) {
      let questionHTML, numberingArr;
      numberingArr = [];
      // console.log(getQuestions);
      domItems.insertedQuestionsWrapper.innerHTML = ""; // clear the question list
      // get the updated question list
      for (let i = 0; i < getQuestions.getQuestionCollection().length; i++) {
        numberingArr.push(i + 1);
        // get the dynamic question from local storage
        questionHTML = `<p><span>${numberingArr[i]}. ${
          getQuestions.getQuestionCollection()[i].questionText
        } </span><button id="question-${
          getQuestions.getQuestionCollection()[i].id
        }">Edit</button></p>`;

        // PLACE it in HTML
        domItems.insertedQuestionsWrapper.insertAdjacentHTML(
          "afterbegin",
          questionHTML
        );
      }
    },
    // get the question from local storage
    editQuestionList: function (
      event,
      storageQuestionList,
      addInputsDynamically,
      updateQuestionListFn
    ) {
      let getId, getStorageQuestionList, foundItem, placeInArr, optionHTML;

      if ("question-".indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split("-")[1]);
        // console.log(event.target.id, storageQuestionList);
        getStorageQuestionList = storageQuestionList.getQuestionCollection();
        for (let i = 0; i < getStorageQuestionList.length; i++) {
          // get the id from storage
          if (getStorageQuestionList[i].id === getId) {
            foundItem = getStorageQuestionList[i];
            placeInArr = i;
          }
        }
        // console.log(foundItem,placeInArr);
        // display the question text
        domItems.newQuestionText.value = foundItem.questionText;
        domItems.adminOptionsContainer.innerHTML = "";

        // because of hoisting, optionHTML when it first loads returns undefined
        optionHTML = "";

        for (let x = 0; x < foundItem.options.length; x++) {
          optionHTML += `<div class="admin-option-wrapper"><input type="radio" class="admin-option-${x}" name="answer" value=${foundItem.options[x]} /><input type="text" class="admin-option admin-option-${x}" value=${foundItem.options[x]}/></div>`;
        }
        // console.log(optionHTML);
        domItems.adminOptionsContainer.innerHTML = optionHTML;

        domItems.questionUpdateBtn.style.visibility = "visible";
        domItems.questionDeleteBtn.style.visibility = "visible";
        // hide insert button
        domItems.questionInsertBtn.style.visibility = "hidden";
        // mouse events
        domItems.questionsClearBtn.style.pointerEvents = "none";

        addInputsDynamically();

        const backDefaultView = () => {
          let updatedOptions;
          updatedOptions = document.querySelectorAll(".admin-option");
          // empty the text area
          domItems.newQuestionText.value = "";
          // clear inputs
          for (let i = 0; i < updatedOptions.length; i++) {
            updatedOptions[i].value = "";
            updatedOptions[i].previousElementSibling.checked = false;
          }
          domItems.questionUpdateBtn.style.visibility = "hidden";
          domItems.questionDeleteBtn.style.visibility = "hidden";
          // hide insert button
          domItems.questionInsertBtn.style.visibility = "visible";
          // mouse events
          domItems.questionsClearBtn.style.pointerEvents = "";

          // update question list after update
          updateQuestionListFn(storageQuestionList);
        };

        const updateQuestion = () => {
          let newOptions, optionElements;
          newOptions = [];
          optionElements = document.querySelectorAll(".admin-option");

          foundItem.questionText = domItems.newQuestionText.value;
          foundItem.correctAnswer = "";
          // update the options
          for (let i = 0; i < optionElements.length; i++) {
            if (optionElements[i] !== "") {
              newOptions.push(optionElements[i].value);
              // radio button checked returns boolean
              if (optionElements[i].previousElementSibling.checked) {
                foundItem.correctAnswer = optionElements[i].value;
              }
            }
          }
          foundItem.options = newOptions;
          // validate inputs
          if (foundItem.questionText !== "") {
            if (foundItem.options.length > 1) {
              if (foundItem.correctAnswer !== "") {
                // remove 1 item and replace with the updated option
                getStorageQuestionList.splice(placeInArr, 1, foundItem);
                // update the storage with the new
                storageQuestionList.setQuestionCollection(
                  getStorageQuestionList
                );

                backDefaultView();
              } else {
                alert(
                  "You missed to check correct answer or you checked answer without value"
                );
              }
            } else {
              alert("You must insert at least two options");
            }
          } else {
            alert("Please insert a question");
          }
        };
        // update question
        domItems.questionUpdateBtn.addEventListener("click", updateQuestion);

        const deleteQuestion = () => {
          // delete from storage, delete only 1 question
          getStorageQuestionList.splice(placeInArr, 1);
          // update the array of questions
          storageQuestionList.setQuestionCollection(getStorageQuestionList);

          backDefaultView();
        };
        // delete question
        domItems.questionDeleteBtn.addEventListener("click", deleteQuestion);
      }
    },

    // clear the question list, local storage object
    clearQuestionList: function (storageQuestionList) {
      // make sure after we clear the list, it shouldn't be undefined or null
      if (storageQuestionList.getQuestionCollection() !== null) {
        // console.log(storageQuestionList)
        if (storageQuestionList.getQuestionCollection().length > 0) {
          // clear the list of questions, confirm returns boolean, ok - true, cancel false
          const confirmation = confirm(
            "Warning! You will lose entire question list"
          );
          if (confirmation) {
            storageQuestionList.removeQuestionCollection();
            // clear the question from questions list
            domItems.insertedQuestionsWrapper.innerHTML = "";
          }
        }
      }
    },

    /******************************** QUIZ SECTION ********************/
    displayQuestion: function (storageQuestionList, progress) {
      let newOptionHTML, characterArr;

      characterArr = ["A", "B", "C", "D", "E", "F"];

      if (storageQuestionList.getQuestionCollection().length > 0) {
        // an array of question items, increase the question with another object Quiz Controller
        // assign text context to the question that is typed
        domItems.askedQuestionText.textContent = storageQuestionList.getQuestionCollection()[
          progress.questionIndex
        ].questionText;
        // empty the option inputs
        domItems.quizOptionsWrapper.innerHTML = "";
        // loop through the options, get them from local storage
        for (
          let i = 0;
          i <
          storageQuestionList.getQuestionCollection()[progress.questionIndex]
            .options.length;
          i++
        ) {
          // increase the index for every option by 1
          newOptionHTML = `<div class="choice-${i}"><span class="choice-${i}">${
            characterArr[i]
          }</span><p class="choice-${i}">${
            storageQuestionList.getQuestionCollection()[progress.questionIndex]
              .options[i]
          }</p></div>`;
          // insert into DOM
          domItems.quizOptionsWrapper.insertAdjacentHTML(
            "beforeend",
            newOptionHTML
          );
        }
      }
    },

    displayProgress: function (storageQuestionList, progress) {
      domItems.progressBar.max = storageQuestionList.getQuestionCollection().length;
      // index starts from 0, make it start at 1
      domItems.progressBar.value = progress.questionIndex + 1;
      // update the question number
      domItems.progressParagraph.textContent =
        progress.questionIndex +
        1 +
        "/" +
        storageQuestionList.getQuestionCollection().length;
    },

    // if the answer is correct change the design
    newDesign: function (answerResults, selectedAnswer) {
      let twoOptions, index;

      index = 0;
      // if index is wrong it will be 0, otherwise 1 - true
      if (answerResults) {
        index = 1;
      }
      twoOptions = {
        instantAnswerText: [
          "This is a wrong answer",
          "This is a correct answer",
        ],
        instantAnswerClass: ["red", "green"], // from css
        emotionType: ["images/sad.png", "images/happy.png"],
        optionsSpanBg: ["rgba(200,0,0,.7)", "rgba(0,250,0,.2)"],
      };

      // after clicking on option disable the options wrapper
      domItems.quizOptionsWrapper.style.cssText =
        "opacity : 0.6; pointer-events: none;";

      // make answer div visible
      domItems.instantAnswerContainer.style.opacity = "1";
      // show the text for the wrong or true answer
      domItems.instantAnswerText.textContent =
        twoOptions.instantAnswerText[index];
      // change the color of answerResults
      domItems.instantAnswerDiv.className =
        twoOptions.instantAnswerClass[index];
      // change img src attribute
      domItems.emotionIcon.setAttribute("src", twoOptions.emotionType[index]);
      // change the span background color
      selectedAnswer.previousElementSibling.style.backgroundColor =
        twoOptions.optionsSpanBg[index];
    },

    // after next question enable the answers again
    resetDesign: () => {
      domItems.quizOptionsWrapper.style.cssText = "";

      // make answer div visible
      domItems.instantAnswerContainer.style.opacity = "0";
    },

    // user info
    getFullName: (currPerson, storageQuestionList, admin) => {
      // check input validation
      if (
        domItems.firstNameInput.value !== "" &&
        domItems.lastNameInput.value !== ""
      ) {
        // if the user is admin, show admin panel, if not show quiz panel
        if (
          !(
            domItems.firstNameInput.value === admin[0] &&
            domItems.lastNameInput.value === admin[1]
          )
        ) {
          // check if admin has created at least one question
          if (storageQuestionList.getQuestionCollection().length > 0) {
            currPerson.fullname.push(domItems.firstNameInput.value);
            currPerson.fullname.push(domItems.lastNameInput.value);
            // hide landing page
            domItems.landingPageSection.style.display = "none";
            domItems.quizSection.style.display = "block"; // show quiz section
            // console.log(currPerson);
          } else {
            alert("Quiz is not ready, please contact to administrator");
          }
        } else {
          domItems.landingPageSection.style.display = "none";
          domItems.adminPanelSection.style.display = "block"; // show admin panel
        }
      } else {
        alert("Please enter a first name and last name");
      }
    },

    finalResult: (currPerson) => {
      domItems.finalScoreText.textContent = `${currPerson.fullname[0]} ${currPerson.fullname[1]}, your final score is ${currPerson.score}`;

      // hide quizSection
      domItems.quizSection.style.display = "none";
      // show final result page
      domItems.finalResultSection.style.display = "block";
    },

    // show results on admin panel
    addResultOnPanel: (userData) => {
      let resultHTML;
      // start the wrapper empty
      domItems.resultsListWrapper.innerHTML = "";
      for (let i = 0; i < userData.getPersonData().length; i++) {
        resultHTML = `<p class="person person-${i}"><span class="person-${i}">${
          userData.getPersonData()[i].firstName
        } ${userData.getPersonData()[i].lastName} - ${
          userData.getPersonData()[i].score
        } Points</span><button id="delete-result-btn_${
          userData.getPersonData()[i].id
        }" class="delete-result-btn">Delete</button></p>`;
      }
      domItems.resultsListWrapper.insertAdjacentHTML("afterbegin", resultHTML);
    },

    // <button id="delete-result-btn_${
    //   userData.getPersonData()[i].id
    // }" class="delete-result-btn">Delete</button>
    deleteResult: (event, userData) => {
      let getId, personsArr;
      personsArr = userData.getPersonData(); // get the data from  local storage

      // get the clicked delete button
      if ("delete-result-btn_".indexOf(event.target.id)) {
        // get the id from id attribute
        getId = parseInt(event.target.id.split("_")[1]);
        //  console.log(getId)
        // get array of person from local storage
        for(let i=0; i < personsArr.length; i++){
          // if persons id matches
          if(personsArr[i].id === getId){
            // delete it
            personsArr.splice(i, 1);
            userData.setPersonData(personsArr); // override the old array
          }
        }
      }
    },

    clearResultList : (userData) => {
      if (userData.getPersonData() !== null) {
        if (userData.getPersonData().length > 0) {
          const confirmation = confirm(
            "Warning! You will lose entire result list"
          );
          if (confirmation) {
            userData.removePersonData();
            // clear the question from questions list
            domItems.resultsListWrapper.innerHTML = "";
          }
        }
      }
    }
  };
})();

/*************************************************
 ************************************* controller
 *************************************************/
// UIController will receive data from quizController, relationship between them, define parameters
const controller = (function (quizCtrl, UICtrl) {
  const selectedDomItems = UICtrl.getDomItems;

  UICtrl.addInputsDynamically();
  UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

  selectedDomItems.questionInsertBtn.addEventListener("click", () => {
    const adminOptions = document.querySelectorAll(".admin-option");

    const checkBoolean = quizCtrl.addQuestionOnLocalStorage(
      selectedDomItems.newQuestionText,
      adminOptions
    );
    // if it is true, add the question to the list of questions
    if (checkBoolean) {
      UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
    }
  });

  // edit question for the specified question
  selectedDomItems.insertedQuestionsWrapper.addEventListener(
    "click",
    function (e) {
      UICtrl.editQuestionList(
        e,
        quizCtrl.getQuestionLocalStorage,
        UICtrl.addInputsDynamically,
        UICtrl.createQuestionList
      );
    }
  );

  selectedDomItems.questionsClearBtn.addEventListener("click", function (e) {
    // method, access to localStorage
    UICtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);
  });

  UICtrl.displayQuestion(
    quizCtrl.getQuestionLocalStorage,
    quizCtrl.getQuizProgress
  );

  UICtrl.displayProgress(
    quizCtrl.getQuestionLocalStorage,
    quizCtrl.getQuizProgress
  );

  // event listener for quiz option a,b,c,d
  selectedDomItems.quizOptionsWrapper.addEventListener("click", (e) => {
    const updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll(
      "div"
    );
    //  check which option was selected
    for (let i = 0; i < updatedOptionsDiv.length; i++) {
      if (e.target.className === `choice-${i}`) {
        // console.log(e.target.className);
        const answer = document.querySelector(
          ".quiz-options-wrapper div p." + e.target.className
        );

        const answerResult = quizCtrl.checkAnswer(answer);

        UICtrl.newDesign(answerResult, answer);
        // change text content of 'Next Question' to 'Finish'
        if (quizCtrl.isFinished()) {
          selectedDomItems.nextQuestionBtn.textContent = "Finish";
        }

        const nextQuestion = (questionData, progress) => {
          // if we have question continue to next question, returns true or false
          if (quizCtrl.isFinished()) {
            // finish quiz, invoke the person instance, and store the person data
            quizCtrl.addPerson();
            // get the final result from local storage
            UICtrl.finalResult(quizCtrl.getCurrentPersonData);
          } else {
            UICtrl.resetDesign();
            // move on to next question
            quizCtrl.getQuizProgress.questionIndex++;

            // display next question
            UICtrl.displayQuestion(
              quizCtrl.getQuestionLocalStorage,
              quizCtrl.getQuizProgress
            );
            // update progress bar
            UICtrl.displayProgress(
              quizCtrl.getQuestionLocalStorage,
              quizCtrl.getQuizProgress
            );
          }
        };

        // move to next question
        selectedDomItems.nextQuestionBtn.addEventListener("click", () => {
          nextQuestion(
            quizCtrl.getQuestionLocalStorage,
            quizCtrl.getQuizProgress
          );
        });
      }
    }
  });

  // start quiz button when user sign up
  selectedDomItems.startQuizBtn.addEventListener("click", () => {
    UICtrl.getFullName(
      quizCtrl.getCurrentPersonData,
      quizCtrl.getQuestionLocalStorage,
      quizCtrl.getAdminFullName
    );
  });

  // enter key and start the quiz
  selectedDomItems.lastNameInput.addEventListener("focus", () => {
    selectedDomItems.lastNameInput.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        // invoke get fullname function
        UICtrl.getFullName(
          quizCtrl.getCurrentPersonData,
          quizCtrl.getQuestionLocalStorage,
          quizCtrl.getAdminFullName
        );
      }
    });
  });

  // display results on admin panel
  UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

  // delete the results from admin panel
  selectedDomItems.resultsListWrapper.addEventListener("click", (e) => {
    UICtrl.deleteResult(e, quizCtrl.getPersonLocalStorage);
    // update results dynamically
    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);
  });

  selectedDomItems.resultsClearBtn.addEventListener('click', () =>{
     UICtrl.clearResultList(quizCtrl.getPersonLocalStorage);
  })

})(quizController, UIController);
 