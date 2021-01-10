const buttons =  document.querySelectorAll("input");
const whiteColour = "white";
const blackColour ="black";
class GameManager{

    constructor(){
        this.gameboard = new Board(this);
        this.isGameOver = false;
        


        this.isWhitesTurn = true;
        this.isBlacksTurn = !this.isWhitesTurn;
        
        this.pieceToMove = [];
        this.clickCount = 0;
        this.pieces = {
            "white-pawn-0": new Pawn(1,0, true, whiteColour, 0, this.gameboard),
            "white-pawn-1": new Pawn(1,1, true, whiteColour, 1, this.gameboard),
            "white-pawn-2": new Pawn(1,2, true, whiteColour, 2, this.gameboard), 
            "white-pawn-3": new Pawn(1,3, true, whiteColour, 3, this.gameboard),
            "white-pawn-4": new Pawn(1,4, true, whiteColour, 4, this.gameboard),
            "white-pawn-5": new Pawn(1,5, true, whiteColour, 5, this.gameboard),
            "white-pawn-6": new Pawn(1,6, true, whiteColour, 6, this.gameboard),
            "white-pawn-7": new Pawn(1,7, true, whiteColour, 7, this.gameboard),
            "white-king-0": new King(0,4, true, whiteColour, this.gameboard), 
            "white-queen-0":new Queen(0,3, true, whiteColour, this.gameboard),
            "white-bishop-0": new Bishop(0,2, true, whiteColour, 0, this.gameboard),
            "white-bishop-1": new Bishop(0,5, true, whiteColour, 1, this.gameboard),
            "white-rook-0": new Rook(0,0, true, whiteColour, 0, this.gameboard),
            "white-rook-1": new Rook(0,7, true, whiteColour, 1, this.gameboard),
            "white-knight-0": new Knight(0,1,true, whiteColour, 0, this.gameboard),
            "white-knight-1": new Knight(0,6,true, whiteColour, 1, this.gameboard),
            "black-pawn-0": new Pawn(6,0, true, blackColour, 0, this.gameboard),
            "black-pawn-1": new Pawn(6,1, true, blackColour, 1, this.gameboard),
            "black-pawn-2": new Pawn(6,2, true, blackColour, 2, this.gameboard), 
            "black-pawn-3": new Pawn(6,3, true, blackColour, 3, this.gameboard),
            "black-pawn-4": new Pawn(6,4, true, blackColour, 4, this.gameboard),
            "black-pawn-5": new Pawn(6,5, true, blackColour, 5, this.gameboard),
            "black-pawn-6": new Pawn(6,6, true, blackColour, 6, this.gameboard),
            "black-pawn-7": new Pawn(6,7, true, blackColour, 7, this.gameboard),
            "black-king-0": new King(7,4, true, blackColour, this.gameboard), 
            "black-queen-0":new Queen(7,3, true, blackColour, this.gameboard),
            "black-bishop-0": new Bishop(7,2, true, blackColour, 0, this.gameboard),
            "black-bishop-1": new Bishop(7,5, true, blackColour, 1, this.gameboard),
            "black-rook-0": new Rook(7,0, true,blackColour, 0, this.gameboard),
            "black-rook-1": new Rook(7,7, true, blackColour, 1, this.gameboard),
            "black-knight-0": new Knight(7,1,true, blackColour, 0, this.gameboard),
            "black-knight-1": new Knight(7,6,true, blackColour, 1, this.gameboard)

        };

        this.lastIndex = {
            'white-rook':1,
            'white-bishop':1,
            'white-knight':1,
            'white-queen':0,
            'black-rook':1,
            'black-bishop':1,
            'black-knight':1,
            'black-queen':0
        };

        this.compteurTest = 0;

        this.whiteKingInDanger = false;
        this.blackKingInDanger = false;



        this.lastMoves = [];

        this.start();
    }

    toggleTurn(){
        this.isWhitesTurn = !this.isWhitesTurn;
    }

   start(){
        this.init_pieces_on_board();
        this.gameboard.tiles.forEach((tile)=>{
            //console.log(tile);
        });

        this.setEventHandlerOnClick();
   } 

   init_pieces_on_board(){
        for(var key in this.pieces){
            var piece = this.pieces[key];
            var tile = this.gameboard.findTile(piece.x, piece.y);
            tile.setPiece(key);
        }
   }

  
   get_current_gameState(){
       var currentGs = new GameState(this.pieces, this.gameboard, this.pieceToMove);
       currentGs.isWhiteTurn = this.isWhitesTurn;
       return currentGs;
   }

   makeMove(fromX, fromY, toX, toY){
        if(this.get_current_gameState().isValidMove(fromX, fromY, toX, toY)){
            var startingTile = this.gameboard.findTile(fromX, fromY);
            var endingTile = this.gameboard.findTile(toX, toY);
            var piece = this.gameboard.findOccupant(fromX, fromY);


            var pieceType = piece.split('-')[1];
            var pieceColour = piece.split('-')[0];

            if(pieceType=="pawn"){
                var currentX = this.pieces[piece].x;
                var currentY =this.pieces[piece].y;
                if(toX - currentX == this.pieces[piece].direction &&
                    toY - currentY != 0){
                        //console.log("called 1");
                        var ennemyTile = this.gameboard.findTile(currentX,toY);
                        //console.log(ennemyTile);
                        if(ennemyTile.isOccupied && 
                        ennemyTile.occupantType =="pawn" &&
                        ennemyTile.colour != pieceColour && this.pieces[this.gameboard.findOccupant(currentX, toY)].hasJumped &&
                        this.pieces[this.gameboard.findOccupant(currentX, toY)].numberOfMoves == 1){
        
                            var ennemy = ennemyTile.occupant;
                            this.pieces[ennemy].alive = false;
                            ennemyTile.reset();
                        }
                    }
            }            

            this.pieces[piece].x = toX;
            this.pieces[piece].y = toY;
            startingTile.reset();

            if(endingTile.isOccupied){
                var ennemy = endingTile.occupant;
                this.pieces[ennemy].alive = false;
            }
            endingTile.setPiece(piece);
            
            
            

            if(pieceType == "pawn"){
                this.pieces[piece].numberOfMoves += 1;
                var target = pieceColour == "white"?3:4;
                if(this.pieces[piece].numberOfMoves == 1 && this.pieces[piece].x == target)
                    this.pieces[piece].hasJumped =true;
                var cibleX = pieceColour == "white"?7:0;

                if(toX == cibleX){
                    //le pion peut devenir ce qu'il veut
                    //queen, rook, knight, bishop
                    var piecePromotion = prompt("The pawn is being promoted to a :", "queen").toLowerCase();
                    delete this.pieces[piece];
                    var index;
                    index = this.lastIndex[pieceColour+'-'+piecePromotion] + 1;
                    this.lastIndex[pieceColour +'-'+piecePromotion]++;

                    if(piecePromotion == "queen"){
                        this.pieces[pieceColour + '-'+piecePromotion+'-'+index.toString()] = new Queen(toX, toY, true, pieceColour);
                    }else if(piecePromotion == "bishop"){
                        this.pieces[pieceColour + '-'+piecePromotion+'-'+index.toString()] = new Bishop(toX, toY, true, pieceColour);
                    }else if(piecePromotion == "rook"){
                        this.pieces[pieceColour + '-'+piecePromotion+'-'+index.toString()] = new Rook(toX, toY, true, pieceColour);
                    }else if(piecePromotion == "knight"){
                        this.pieces[pieceColour + '-'+piecePromotion+'-'+index.toString()] = new Knight(toX, toY, true, pieceColour);
                    }
                    
                    endingTile.setPiece(pieceColour +"-"+piecePromotion+"-"+index.toString());
                }
            }
                
            if(pieceType == "king"){
                this.pieces[piece].numberOfMoves = 1;
                if(this.pieces[piece].switchWithRook()){
                    var kingColour = piece.split('-')[0];
                    var kingPosX = kingColour == "white"?0:7;
                    this.pieces[kingColour +"-rook-1"].y = 5;
                    this.gameboard.findTile(kingPosX,7).reset();
                    this.gameboard.findTile(kingPosX, this.pieces[kingColour +"-rook-1"].y).setPiece(kingColour +"-rook-1");
                }
                this.pieces[piece].hasJump =  true;
            }

            this.toggleTurn();
           
            if(this.get_current_gameState().checkIfGameOver()){
                //console.log(this.get_current_gameState());
                this.isGameOver = true;
                alert("congrats fucker la partie est terminé");
            }
           
            if(!this.isWhitesTurn)
                {
                setTimeout( ()=>{

                let gs = this.get_current_gameState();    
                var mcts = new Montecarlo_TS(gs);
                var atk = mcts.find_best_move();
                
                this.makeMove(atk.fromX, atk.fromY, atk.toX, atk.toY);
                
                }, 1500);
                
                
                }
    
        }else{
            console.log("invalid move");
            return false;
        }

   }


    setEventHandlerOnClick(){
        buttons.forEach((button)=>{
            button.addEventListener('click', ()=>{
                if(!this.isGameOver){
                    if(this.clickCount == 0 ){
                        var fromTile =  button.getAttribute('id');
                        var x = parseInt(fromTile[1]);
                        var y = parseInt(fromTile[2]);
                        
                        var colourTurn = this.isWhitesTurn?"white":"black";

                        if(this.gameboard.findTile(x , y).isOccupied && this.gameboard.findTile(x , y).colour == colourTurn){
                            var nbMovePossible = 0;
                            this.get_current_gameState().findTileValidMoves(x, y).forEach((pos) => {
                                nbMovePossible++;
                                var doc =  document.getElementById('t'+pos);
                                doc.style.background = '#8a1582';
                            });
                            if(nbMovePossible!= 0){
                                this.clickCount++;
                                this.pieceToMove.push(fromTile);
                            }
                        }
                    }else{
                        var toTile = button.getAttribute('id');
                        
                        this.pieceToMove.push(toTile);


                        var fromX = parseInt(this.pieceToMove[this.pieceToMove.length-2][1]);
                        var fromY = parseInt(this.pieceToMove[this.pieceToMove.length-2][2]);
                        var toX = parseInt(this.pieceToMove[this.pieceToMove.length-1][1]);
                        var toY = parseInt(this.pieceToMove[this.pieceToMove.length-1][2]);

                        if(fromX != toX || fromY !=toY){
                            this.get_current_gameState().findTileValidMoves(fromX,fromY).forEach((pos) => {
                                var doc =  document.getElementById('t'+pos);
                                if(doc == null)
                                    console.log("C'est null : " + pos);
                                doc.style.background = null;
                            });
                            this.makeMove(fromX, fromY, toX, toY);
                            this.clickCount=0;
                            //this.pieceToMove.pop();
                            //this.pieceToMove.pop();
                        }else{
                            this.pieceToMove.pop();
                        }
                    }
                }
            });
        });
    }
}

