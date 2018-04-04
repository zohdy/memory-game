
 // DOM element references
const deck = document.querySelector(".deck");
const stars = document.querySelectorAll(".fa-star");
const counter = document.querySelector("#movecounter");
const minutesLabel = document.querySelector("#minutes");
const secondsLabel = document.querySelector("#seconds");
const modal = document.querySelector('.modal');
let cards = document.querySelectorAll(".card");


// Sound FX
const flipSound = document.querySelector('#flip');
const levelDownSound = document.querySelector('#level-down');
const matchSound = document.querySelector('#match');
const noMatchSound = document.querySelector('#no-match');
const winSound = document.querySelector('#win');


// Global variables
const openCards = [];
const matchedCards = [];
let timeElapsed;
let numOfMoves;
let numOfStars = stars.length;
let intervalId;
let isTimerStarted;


resetGame();

function resetGame() {

   // Reset deck
   let fragment = document.createDocumentFragment();
   openCards.length = 0;
   cards = shuffle(Array.from(cards));
   cards.forEach(function(card) {
     card.classList.remove('show', 'open', 'match');
     card.addEventListener('click', onCardClick);
     fragment.appendChild(card);
   });
   deck.appendChild(fragment);

   // Reset moves
   numOfMoves = 0;
   counter.innerHTML = numOfMoves;

   // Show all stars
   numOfStars = stars.length;
   stars.forEach(function (star) {
     star.style.visibility = 'visible';
   });

   // Reset Timer
   clearInterval(intervalId);
   isTimerStarted = false;
   timeElapsed = 0;
   secondsLabel.innerHTML = "00";
   minutesLabel.innerHTML = "00";

   modal.style.display = 'none';
 }

function onCardClick() {

  flipSound.play();

  if(!isTimerStarted) {
    startTimer();
  }

  if(openCards.length < 2) {
     openCards.push(this);
     this.classList.add('open');
     this.classList.add('show');
     this.classList.add('disabled'); // 'disabled' class disables all mouse events
   }

   if(openCards.length === 2) {
      const firstCard = openCards[0].querySelector('.fa').className;
      const secondCard = openCards[1].querySelector('.fa').className;
      // If their className match eg. 'fa fa-bomb'
      if(firstCard === secondCard) {
          matchSound.play();
          handleCardMatch();
          if(matchedCards.length == cards.length) {
            showCongratulations();
          }
      } else {
          noMatchSound.play();
          handleNoMatch();
          increaseCounter();
      }
   }
 }

function handleCardMatch() {
   openCards.forEach(function (card) {
     card.classList.remove("show", "open");
     card.classList.add('match');
     matchedCards.push(card);
   });
   openCards.length = 0;
 }

function handleNoMatch() {
    disableDeck();
    openCards.forEach(function(card) {
      card.classList.add('no-match'); // 'no-match' class used purely for styling
      setTimeout(function() {
        card.classList.remove('show', 'open');
        openCards.length = 0;
        enableDeck();
      }, 1500);
    });
 }

 // Disables events on all cards temporarily, while setTimeout() is executing
function disableDeck(){
  cards.forEach(function (card) {
    card.classList.add('disabled');
  });
}

// After setTimeout() is done deck events are re-enabled
function enableDeck(){
  cards.forEach(function (card) {
    card.classList.remove('disabled', 'no-match');
  });
}

function increaseCounter(){
  numOfMoves++;
  counter.innerHTML = numOfMoves;

  if(numOfMoves === 5 || numOfMoves === 10 || numOfMoves === 15) {
    hideStar();
  }
}

function hideStar() {
  let index = numOfStars - 1;

  if(stars != null && numOfStars > 0) {
      levelDownSound.play();
      stars[index].style.visibility = 'hidden';
      numOfStars--;
  }
}

function startTimer() {
  isTimerStarted = true;
  intervalId = setInterval(function() {
      ++timeElapsed;
      secondsLabel.innerHTML = formatTime(timeElapsed % 60);
      minutesLabel.innerHTML = formatTime(parseInt(timeElapsed / 60));
    }, 1000);
}

function showCongratulations(){
  // Get the current state
  const rating = document.querySelector('.stars').innerHTML;
  const seconds = document.querySelector('#seconds').textContent;
  const minutes = document.querySelector('#minutes').textContent;
  const finalTime = minutes + ':' + seconds;

  // Set the current state in the modal popup
  document.querySelector(".moves-td").innerHTML = numOfMoves;
  document.querySelector(".time-td").innerHTML = finalTime;
  document.querySelector('.rating-td').innerHTML = rating;

  // Show the modal popup
  modal.style.display = 'block';

  winSound.play();
}


 // Helper to format the returned counter value
 // 'MM:SS' instead of 'M:S'
 function formatTime(timeValue) {
   timeAsString = timeValue + ""; // num type to string
   if (timeAsString.length < 2) {
     return "0" + timeAsString;
   } else {
     return timeAsString;
   }
 }

 // Helper method
 // Shuffle function from http://stackoverflow.com/a/2450976
 function shuffle(array) {
     var currentIndex = array.length, temporaryValue, randomIndex;
     while (currentIndex !== 0) {
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
     }
     return array;
 }
