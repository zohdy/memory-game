// UI
const ui = {
  deck : document.querySelector('.deck'),
  stars : document.querySelectorAll('.fa-star'),
  counter : document.querySelector('#movecounter'),
  minutesLabel : document.querySelector('#minutes'),
  secondsLabel : document.querySelector('#seconds'),
  modal : document.querySelector('.modal'),
  cards : document.querySelectorAll('.card'),
  playAgain : document.querySelector('.play-again-btn'),
  resetGame : document.querySelector('.fa-repeat')
}


// Sounds
const sounds = {
  flip : document.querySelector('#flip'),
  levelDown : document.querySelector('#level-down'),
  match :  document.querySelector('#match'),
  noMatch : document.querySelector('#no-match'),
  win : document.querySelector('#win')
};


// Game state
const game = {
  openCards : [],
  matchedCards : [],
  timeElapsed : 0,
  numOfMoves : 0,
  numOfStars : ui.stars.length,
  intervalId : 0,
  isTimerStarted : false
};


const utils = {
  // Helper to format the returned counter value
  // 'MM:SS' instead of 'M:S'
  formatTime : function(timeValue) {
    let timeAsString = timeValue + ""; // num type to string
    if (timeAsString.length < 2) {
      return timeAsString.padStart(2, '0');
    } else {
      return timeValue;
    }
  },
  // Helper method
  // Shuffle function from http://stackoverflow.com/a/2450976
  shuffle : function(array) {
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
};

resetGame();

function resetGame() {
   // Reset deck
   let fragment = document.createDocumentFragment();
   game.openCards.length = 0;
   ui.cards = utils.shuffle(Array.from(ui.cards));
   ui.cards.forEach(function(card) {
     card.classList.remove('show', 'open', 'match');
     card.addEventListener('click', onCardClick);
     fragment.appendChild(card);
   });
   ui.deck.appendChild(fragment);
   game.matchedCards.length = 0;

   // Reset moves
   game.numOfMoves = 0;
   ui.counter.innerHTML = game.numOfMoves;

   // Show all stars
   game.numOfStars = ui.stars.length;
   ui.stars.forEach(function (star) {
     star.style.visibility = 'visible';
   });

   // Reset Timer
   clearInterval(game.intervalId);
   game.isTimerStarted = false;
   game.timeElapsed = 0;
   ui.secondsLabel.innerHTML = "00";
   ui.minutesLabel.innerHTML = "00";

   ui.modal.style.display = 'none';

   initResetListeners();
 }

 function initResetListeners() {
   ui.resetGame.addEventListener('click', function() {
     resetGame();
   })
   ui.playAgain.addEventListener('click', function() {
     resetGame();
   });
 }

function onCardClick() {

  sounds.flip.play();

  if(!game.isTimerStarted) {
    startTimer();
  }

  if(game.openCards.length < 2) {
     game.openCards.push(this);
     this.classList.add('open');
     this.classList.add('show');
     this.classList.add('disabled'); // 'disabled' class disables all mouse events
   }

   if(game.openCards.length === 2) {
      const firstCard = game.openCards[0].querySelector('.fa').className;
      const secondCard = game.openCards[1].querySelector('.fa').className;
      // If their className match eg. 'fa fa-bomb'
      if(firstCard === secondCard) {
          sounds.match.play();
          handleCardMatch();
          if(game.matchedCards.length == ui.cards.length) {
            showCongratulations();
          }
      } else {
          sounds.noMatch.play();
          handleNoMatch();
          increaseCounter();
      }
   }
 }

function handleCardMatch() {
   game.openCards.forEach(function (card) {
     card.classList.remove("show", "open");
     card.classList.add('match');
     game.matchedCards.push(card);
   });
   game.openCards.length = 0;
 }

function handleNoMatch() {
    disableDeck();
    game.openCards.forEach(function(card) {
      card.classList.add('no-match'); // 'no-match' class used purely for styling
      setTimeout(function() {
        card.classList.remove('show', 'open');
        game.openCards.length = 0;
        enableDeck();
      }, 1500);
    });
 }

 // Disables events on all cards temporarily, while setTimeout() is executing
function disableDeck(){
  ui.cards.forEach(function (card) {
    card.classList.add('disabled');
  });
}

// After setTimeout() is done deck events are re-enabled
function enableDeck(){
  ui.cards.forEach(function (card) {
    card.classList.remove('disabled', 'no-match');
  });
}

function increaseCounter(){
  game.numOfMoves++;
  ui.counter.innerHTML = game.numOfMoves;

  if(game.numOfMoves === 10 || game.numOfMoves === 15) {
    hideStar();
  }
}

function hideStar() {
  let index = game.numOfStars - 1;

  if(ui.stars != null && game.numOfStars > 1) {
      sounds.levelDown.play();
      ui.stars[index].style.visibility = 'hidden';
      game.numOfStars--;
  }
}

function startTimer() {
  game.isTimerStarted = true;
  game.intervalId = setInterval(function() {
      ++game.timeElapsed;
      ui.secondsLabel.innerHTML = utils.formatTime(game.timeElapsed % 60);
      ui.minutesLabel.innerHTML = utils.formatTime(parseInt(game.timeElapsed / 60));
    }, 1000);
}

function showCongratulations(){
  // Get the current state
  const rating = document.querySelector('.stars').innerHTML;
  const seconds = document.querySelector('#seconds').textContent;
  const minutes = document.querySelector('#minutes').textContent;
  const finalTime = minutes + ':' + seconds;

  // Set the current state in the modal popup
  document.querySelector(".moves-td").innerHTML = game.numOfMoves;
  document.querySelector(".time-td").innerHTML = finalTime;
  document.querySelector('.rating-td').innerHTML = rating;

  // Show the modal popup
  ui.modal.style.display = 'block';

  sounds.win.play();
}
