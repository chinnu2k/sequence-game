const boardEl = document.getElementById("board");
const turnText = document.getElementById("turn");
const redHandEl = document.getElementById("redHand");
const blueHandEl = document.getElementById("blueHand");

let current = "red";
let selectedCard = null;
let scores = { red: 0, blue: 0 };
let sequenceCells = new Set();


const cards = ["2","3","4","5","6","7","8","9","10","J","Q","K","A"];

const board = Array.from({length:100},()=>({
  card: cards[Math.floor(Math.random()*cards.length)],
  chip: null
}));

let deck = [];
function buildDeck(){
  deck = [];

  // 2 decks → 8 of each normal card
  for(let i=0;i<8;i++){
    cards.forEach(c => deck.push(c));
  }

  // Limited special cards
  for(let i=0;i<4;i++){
    deck.push("JE");   // remove opponent
    deck.push("JEE");  // wild place
  }

  deck.sort(()=>Math.random()-0.5);
}



buildDeck();

let hands = { red:deck.splice(0,5), blue:deck.splice(0,5) };

function drawBoard(){
  boardEl.innerHTML="";
  board.forEach((c,i)=>{
    const d=document.createElement("div");
    d.className="cell";
    if(c.chip) d.classList.add(c.chip);
    d.innerText=c.card;
    d.onclick=()=>playMove(i);
    boardEl.appendChild(d);
  });
}

function drawHands(){
  redHandEl.innerHTML = "🔴 " + hands.red.map(c =>
    `<span class="card ${current==='red'?'':'disabled'}" 
     onclick="${current==='red' ? `selectCard('${c}')` : ''}">
     ${c}</span>`).join("");

  blueHandEl.innerHTML = "🔵 " + hands.blue.map(c =>
    `<span class="card ${current==='blue'?'':'disabled'}" 
     onclick="${current==='blue' ? `selectCard('${c}')` : ''}">
     ${c}</span>`).join("");
}


function cardHTML(c){
  return `<span class="card" onclick="selectCard('${c}')">${c}</span>`;
}

function selectCard(c){
  selectedCard=c;
  document.querySelectorAll(".card").forEach(e=>e.classList.remove("selected"));
  [...document.querySelectorAll(".card")].find(e=>e.innerText===c).classList.add("selected");
}

function playMove(i){
  if(!selectedCard) return alert("Select a card first!");

  const cell = board[i];

  if(selectedCard==="JE"){
    if(cell.chip && cell.chip!==current) cell.chip=null;
    else return;
  }
  else if(selectedCard==="JEE"){
    if(!cell.chip) cell.chip=current;
    else return;
  }
  else{
    if(cell.card!==selectedCard || cell.chip) return;
    cell.chip = current;

if(checkSequence(current)){
  scores[current]++;
  document.getElementById("redScore").innerText = scores.red;
  document.getElementById("blueScore").innerText = scores.blue;

  alert(current.toUpperCase() + " formed a SEQUENCE! 🎉");

  if(scores[current] === 2){
    alert(current.toUpperCase() + " WINS THE GAME! 🏆");
    location.reload();
  }
}


  }

  hands[current].splice(hands[current].indexOf(selectedCard),1);
  hands[current].push(deck.pop());

  selectedCard=null;
  current=current==="red"?"blue":"red";
  turnText.innerText=current==="red"?"🔴 Red's Turn":"🔵 Blue's Turn";
  drawBoard(); drawHands();
}

function checkSequence(color){
  const directions = [
    [0,1],[1,0],[1,1],[1,-1]
  ];

  for(let i=0;i<100;i++){
    if(board[i].chip !== color || sequenceCells.has(i)) continue;

    const r = Math.floor(i/10), c = i%10;

    for(const [dx,dy] of directions){
      let cells = [i];

      for(let k=1;k<5;k++){
        let x = r + dx*k;
        let y = c + dy*k;
        let idx = x*10+y;

        if(board[idx]?.chip === color && !sequenceCells.has(idx)){
          cells.push(idx);
        } else break;
      }

      if(cells.length === 5){
        cells.forEach(c=>sequenceCells.add(c));
        return true;
      }
    }
  }
  return false;
}




drawBoard(); drawHands();
