const cells=document.querySelectorAll(".cell");
const statusText=document.querySelector(".status");
const resetBtn=document.getElementById("resetBtn");
const resetScoresBtn=document.getElementById("resetScoresBtn");
const themeBtn=document.getElementById("themeBtn");
const modeSelect=document.getElementById("modeSelect");
const body=document.body;
const xScoreEl=document.getElementById("xScore");
const oScoreEl=document.getElementById("oScore");
const drawsEl=document.getElementById("draws");

let board=["","","","","","","","",""];
let currentPlayer="X";
let running=true;
let xScore=0,oScore=0,draws=0;
let mode="pvc";
const winConditions=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];


const clickSound=new Audio("click.mp3");
const winSound=new Audio("winner.mp3");
const drawSound=new Audio("Draw.wav");


cells.forEach(cell=>cell.addEventListener("click", cellClicked));
resetBtn.addEventListener("click", resetGame);
resetScoresBtn.addEventListener("click", resetScores);
themeBtn.addEventListener("click", toggleTheme);
modeSelect.addEventListener("change",()=>{mode=modeSelect.value; resetGame();});


function cellClicked(){
  const index=this.dataset.index;
  if(board[index]!==""||!running)return;
  makeMove(index,currentPlayer);
  clickSound.currentTime=0; clickSound.play();
  if(mode==="pvc"&&currentPlayer==="O"&&running)setTimeout(aiMove,300);
}


function makeMove(index,player){
  board[index]=player;
  cells[index].innerHTML=`<span>${player}</span>`;
  checkWinner(player);
}


function checkWinner(player){
  let winnerFound=false;
  let winningCombo=[];
  for(const condition of winConditions){
    const [a,b,c]=condition;
    if(board[a]&&board[a]===board[b]&&board[a]===board[c]){
      winnerFound=true; winningCombo=condition; break;
    }
  }
  if(winnerFound){
    highlightWinner(winningCombo);
    statusText.textContent=`🎉 Player ${player} Wins!`;
    updateScore(player);
    running=false;
    winSound.currentTime=0; winSound.play();
  } else if(!board.includes("")){
    statusText.textContent="😲 It's a Draw!";
    draws++;
    drawsEl.textContent=draws;
    running=false;
    drawSound.currentTime=0; drawSound.play();
  } else{
    currentPlayer=currentPlayer==="X"?"O":"X";
    statusText.textContent=`Player ${currentPlayer}'s Turn`;
  }
}


function highlightWinner(combo){ 
    combo.forEach(index=>cells[index].classList.add("winner")); 
}


function updateScore(player){ 
    if(player==="X"){ 
        xScore++; xScoreEl.textContent=xScore; 
    } else{ 
        oScore++; oScoreEl.textContent=oScore; 
    } 
}


function resetGame(){
    board=["","","","","","","","",""]; 
    currentPlayer="X"; 
    running=true; 
    statusText.textContent=`Player ${currentPlayer}'s Turn`; 
    cells.forEach(cell=>{cell.textContent=""; 
    cell.classList.remove("winner");}); 
}


function resetScores(){ 
    xScore=0;
    oScore=0;
    draws=0; 
    xScoreEl.textContent=xScore; 
    oScoreEl.textContent=oScore; 
    drawsEl.textContent=draws; 
}


function toggleTheme(){ 
    body.classList.toggle("dark"); 
    themeBtn.textContent=body.classList.contains("dark")?"☀️ Light Mode":"🌙 Dark Mode"; 
}


function aiMove(){ 
    const bestMove=minimax(board,"O").index; 
    makeMove(bestMove,"O"); 
    clickSound.currentTime=0; 
    clickSound.play(); 
}


function minimax(newBoard,player){
  const availSpots=newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  if(checkWin(newBoard,"X")) return {score:-10};
  if(checkWin(newBoard,"O")) return {score:10};
  if(availSpots.length===0) return {score:0};
  let moves=[];
  for(let i=0;i<availSpots.length;i++){
    let move={index:availSpots[i]}; newBoard[availSpots[i]]=player;
    if(player==="O"){ let result=minimax(newBoard,"X"); move.score=result.score; }
    else{ let result=minimax(newBoard,"O"); move.score=result.score; }
    newBoard[availSpots[i]]=""; moves.push(move);
  }
  let bestMove;
  if(player==="O"){ let bestScore=-Infinity; for(let i=0;i<moves.length;i++){ if(moves[i].score>bestScore){ bestScore=moves[i].score; bestMove=i; } } }
  else{ let bestScore=Infinity; for(let i=0;i<moves.length;i++){ if(moves[i].score<moves[i].score?moves[i].score:bestScore){ bestScore=moves[i].score; bestMove=i; } } }
  return moves[bestMove];
}


function checkWin(b,p){ 
    return winConditions.some(([a,b1,c])=>b[a]===p&&b[b1]===p&&b[c]===p); 
}