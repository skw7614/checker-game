// JavaScript Document
let $turn = 'red';
let $p1score = 0;
let $p2score = 0;
let board = [];

$(document).ready(function(){
        initBoard();        // function initializes and creates the board
        resetBoard();       // function "resets" the board -- places checker piece
        resetScores();      // function resets the scores to 0
        
        //*************************************************************************
        // This button resets the game
        //*************************************************************************
        $('button').click(function(){
            resetBoard();
            resetScores();
        })
        
        //*************************************************************************
        // Live function waits for clicks on checkers
        // Upon click, we make sure it's this players turn,
        // if so, we unselect any previously selected pieces and select this one
        //*************************************************************************     
        $('.checker').live('click',function(){
            if ($(this).hasClass($turn)){
                $('.movehint').remove();
                $('.selected').removeClass('selected');
                $(this).addClass('selected');
                checker_coords = parseCoords($(this).parent());
                move_indicator(valid_move(checker_coords,null,true));
            }
        });
        
        //*************************************************************************
        // This function waits for a click on a square
        // Add more documentation
        //*************************************************************************
        $('.square').live('click',function(){
            square_coords = parseCoords($(this));

            if ($('.selected')[0]){
                checker_coords = parseCoords($('.selected').parent());
                valid_move(checker_coords, square_coords, false);
            } 
        })
    })

    //*************************************************************************
    // Checks to see if the move being attempted is valid
    //*************************************************************************
    valid_move = function (checker_coords,square_coords,coordsOnly) {
        let y = checker_coords[0];
        let x = checker_coords[1];
        let result = [];
        let onemove = [];
        let twomove = [];

        let dy = ($turn === 'red') ? -1 : 1;           // 방향: red는 위, black은 아래
        let opponent = ($turn === 'red') ? 'black' : 'red';
        let dx_options = [-1, 1];                      // 좌/우 대각선

        let jump_found = false;

        for (let dx of dx_options) {
            let mid_x = x + dx;
            let mid_y = y + dy;
            let jump_x = x + dx * 2;
            let jump_y = y + dy * 2;


            if ( mid_x >= 0 && mid_x < 8 && mid_y >= 0 && mid_y < 8 && jump_x >= 0 && jump_x < 8 && jump_y >= 0 && jump_y < 8) {
                let mid_piece = board[mid_y][mid_x];
                let jump_space = board[jump_y][jump_x];

                if (mid_piece === opponent && !jump_space) {
                    jump_found = true;
                    if (coordsOnly){
                        result.push([jump_y, jump_x]);
                    }
                    else {
                        twomove = [jump_y, jump_x];
                        if (square_coords[0] === twomove[0] && square_coords[1] === twomove[1]){
                            jumping(mid_y, mid_x)
                            $el = $('.selected')[0];
                            $class = $('.selected').attr('class').split(' ')[1];
                            board[checker_coords[0]][checker_coords[1]] = null;
                            board[square_coords[0]][square_coords[1]] = $class;
                            $("#" + square_coords[0] + "_" + square_coords[1]).append($el);
                            successfulTurn();
                            $('.movehint').remove();
                        }
                    }
                }
            }

            if (!jump_found) {
                let one_x = x + dx;
                let one_y = y + dy;
                if ( one_x >= 0 && one_x < 8 && one_y >= 0 && one_y < 8 && !board[one_y][one_x]) {
                    if (coordsOnly) {
                    result.push([one_y, one_x]);
                    }
                    else {
                        onemove = [one_y, one_x];
                        if (square_coords[0] === onemove[0] && square_coords[1] === onemove[1]) {
                            $el = $('.selected')[0];
                            $class = $('.selected').attr('class').split(' ')[1];
                            board[checker_coords[0]][checker_coords[1]] = null;
                            board[square_coords[0]][square_coords[1]] = $class;
                            $("#" + square_coords[0] + "_" + square_coords[1]).append($el);
                            successfulTurn();
                            $('.movehint').remove();
                        }
                    }
                }
            }
        }

        return result;  // 예: [[4, 3]] 또는 [[5, 2]] 또는 []

    }
        

    move_indicator = function (checker_coords) {
        for (const checker_coord of checker_coords){
            let y1 = checker_coord[0];
            let x1 = checker_coord[1];
            let $movehint = $('<div class="movehint"></div>');
            $("#" + y1 + "_" + x1).append($movehint);
        }
    }
    
    //*************************************************************************
    // Checks to see if user is trying a jump move
    //*************************************************************************
    jumping = function (y,x) {
        if ($turn == 'red') {
            $p1score++;
            $('#p1 span').html($p1score);
        } else {
            $p2score++;
            $('#p2 span').html($p2score);
        }

        // 말 제거
        board[y][x] = null;
        $('#' + y + "_" + x).html('');
    }

    //*************************************************************************
    // Checks the board to see if a checker is there
    //*************************************************************************
    
    elementAt = function(coords) {
        return board[coords[0]][coords[1]];
    }

    //*************************************************************************
    // Parses an id into coordinates (eg: "3_4")
    //*************************************************************************
    
    parseCoords = function(eliment) {
        var parts = eliment.attr('id').split('_');
        return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
    }

    //*************************************************************************
    // Registers a successful turn
    // Switches to the next player
    //*************************************************************************
    
    successfulTurn = function() {
        if ($turn == 'red') $turn = 'black';
        else $turn = 'red';
        $('#turn p').html($turn);
        $('.selected').removeClass('selected');
    }

    //*************************************************************************
    // Resets scores to 0
    //*************************************************************************
    resetScores = function() {
        $('.score span').html('0'); 
        $p1score = $p2score = 0;
    }
    
    //*************************************************************************
    //  Initializes the board
    //  Build the checker board
    //*************************************************************************
    initBoard = function(){
        for (i = 0; i < 8; i ++){
            for (j = 0; j < 8; j++) {
                $el = $('<div class="square"></div>');
                if (i%2 == j%2) $el.addClass('brown');
                else $el.addClass('apricot')
                $id = i.toString()+"_"+j.toString();
                $el.attr('id',$id);
                $('#board').append($el);    
            }
        }
    }
    
    //*************************************************************************
    // Resets the board
    // Clears the board, replaces pieces
    //*************************************************************************
    resetBoard = function() {
        board = new Array(8);
        $('.square').html('');
        $turn = 'red';
        $('#turn p').html($turn);
        for (i = 0; i < 8; i++)
            board[i] = new Array(8);
        let roop_count = 0;
        for (i = 0; i < 3; i++){
            roop_count += 1;
            for (j = 0; j < 8; j++){
                roop_count += 1;
                if (roop_count %2 == 0){
                    $id = i.toString()+"_"+j.toString();
                    $el = $('<div class="checker black"></div>');
                    $('#'+$id+'.square').append($el);
                    board[i][j] = 'black';
                }
                if (roop_count%2 != 0){
                    $id = (7-i).toString()+"_"+j.toString();
                    $el2 = $('<div class="checker red"></div>');
                    $('#'+$id+'.square').append($el2);
                    board[7-i][j] = "red";
                }
            }
        }   
    }