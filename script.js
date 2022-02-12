var chess = document.getElementById('chess') ;
var context = chess.getContext('2d');
var color = 1;

context.strokeStyle = "#000" ;

var drawChessBoard = function() {
    for (var i = 0; i < 15; i++) {
        context.moveTo(20, 20 + i * 40);
        context.lineTo(580, 20 + i * 40);
        context.stroke();
        context.moveTo(20 + i * 40, 20);
        context.lineTo(20 + i * 40, 580);
        context.stroke();
    }
}

drawChessBoard();

var oneStep = function (i, j, color) {
    context.beginPath();
    context.arc(20 + i * 40, 20 + j * 40, 18, 0, 2 * Math.PI);
    context.closePath();
    var gradient = context.createRadialGradient(20 + i * 40 + 2, 20 + j * 40 - 2, 20, 20 + i * 40, 20 + j * 40, 0);
    if (color) {
        gradient.addColorStop(0, "#0a0a0a");
        gradient.addColorStop(1, "#636766");
    } else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    context.fillStyle = gradient;
    context.fill();
}

var Depth = 2;
var NextStep = [];
var chessBoard = [];
var BattlePosition = [];
var PositionWeight = [];
var Direction = [];
const CHENG_5_SCORE = 5000000;
const HUO_4_SCORE = 100000;
const CHONG_4_SCORE = 1000;
const DAN_HUO_3_SCORE = 800;
const TIAO_HUO_3_SCORE = 700;
const MIAN_3_SCORE = 50;
const HUO_2_SCORE = 5;
const MIAN_2_SCORE = 1;
var CHENG_5_STRING = "11111";
var HUO_4_STRING = "011110";
var CHONG_4_STRING_1_1 = "01111-";
var CHONG_4_STRING_1_2 = "-11110";
var CHONG_4_STRING_2_1 = "10111";
var CHONG_4_STRING_2_2 = "11101";
var CHONG_4_STRING_3 = "11011";
var DAN_HUO_3_STRING = "01110";
var TIAO_HUO_3_STRING_1_1 = "1011";
var TIAO_HUO_3_STRING_1_2 = "1101";
var MIAN_3_1_1 = "00111-";
var MIAN_3_1_2 = "-11100";
var MIAN_3_2_1 = "01011-";
var MIAN_3_2_2 = "-11010";
var MIAN_3_3_1 = "01101-";
var MIAN_3_3_2 = "-10110";
var MIAN_3_4_1 = "10011";
var MIAN_3_4_2 = "11001";
var MIAN_3_5 = "10101";
var MIAN_3_6 = "-01110-";
var HUO_2_STRING_1 = "001100";
var HUO_2_STRING_2 = "01010";
var HUO_2_STRING_3 = "1001";
var MIAN_2_1_1 = "00011-";
var MIAN_2_1_2 = "-11000";
var MIAN_2_2_1 = "00101-";
var MIAN_2_2_2 = "-10100";
var MIAN_2_3_1 = "01001-";
var MIAN_2_3_2 = "-10010";
var MIAN_2_4 = "10001";

for (var i = 0; i < 4; ++i) Direction[i] = [];
Direction[0][0] = 0, Direction[0][1] = 1;
Direction[1][0] = 1, Direction[1][1] = 0;
Direction[2][0] = 1, Direction[2][1] = 1;
Direction[3][0] = 1, Direction[3][1] = -1;

for (var i = 0; i < 15; i++) {
    chessBoard[i] = [];
    PositionWeight[i] = [];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j] = 0;
        PositionWeight[i][j] = Math.min(i, j, 14 - i, 14 - j) + 1;
    }
}

var isValid = function(x, y) {
    if (x < 0 || y < 0) return 0;
    if (x >= 15 || y >= 15) return 0;
    return 1;
}

var near = function(x, y) {
    for (var i = -2; i <= 2; ++i) {
        for (var j = -2; j <= 2; ++j) {
            if (!i && !j) continue;
            if (isValid(x + i, y + j) && chessBoard[x + i][y + j] != 0) return true;
        }
    }
    return false;
}

var Min_Max_Search = function(depth, color, alpha, beta) {
    if (depth == Depth) {
        return AI(color);
    }
    var List = [];
    var cnt = 0;
    for (var i = 0; i < 15; ++i) {
        for (var j = 0; j < 15; ++j) {
            if (chessBoard[i][j] == 0 && near(i, j)) {
                List[cnt] = [];
                List[cnt][0] = i, List[cnt][1] = j;
                ++cnt;
            }
        }
    }
    for (var i = 0; i < cnt; ++i) {
        var X = List[i][0];
        var Y = List[i][1];
        chessBoard[X][Y] = color + 1;
        var val = -Min_Max_Search(depth + 1, 1 - color, -beta, -alpha);
        chessBoard[X][Y] = 0;
        if (val > alpha) {
            if (depth == 0) { 
                NextStep[0] = X;
                NextStep[1] = Y;
            }
            if (val >= beta) {
                return beta;
            }
            alpha = val;
        }
    }
    return alpha;
}

var CheckOver = function(x, y) {
    var CenterColor = chessBoard[x][y];
    var cnt = 1;
    for (var i = 0; i < 4; ++i) {
        cnt = 1;
        for (var j = 1; j < 5; ++j) {
            var dx = x + Direction[i][0] * j;
            var dy = y + Direction[i][1] * j;
            if (!isValid(dx, dy) || chessBoard[dx][dy] != CenterColor) break;
            ++cnt;
        }
        for (var j = -1; j > -5; --j) {
            var dx = x + Direction[i][0] * j;
            var dy = y + Direction[i][1] * j;
            if (!isValid(dx, dy) || chessBoard[dx][dy] != CenterColor) break;
            ++cnt;
        }
        if (cnt >= 5) return true;
    }
    return false;
}


var ChessBoardEvaluate = function(x, y, color) {
    var Value = 0;
    var Weight = PositionWeight[x][y];
    for (var i = 0; i < 4; ++i) {
        var dx = Direction[i][0];
        var dy = Direction[i][1];
        var State = new String("");
        var check = 0;
        for (var j = -4; j <= 4; ++j) {
            var TargetX = x + dx * j;
            var TargetY = y + dy * j;
            check = isValid(TargetX, TargetY);
            if (!check) {
               State += '#';
               continue;
            }
            var Kind = chessBoard[TargetX][TargetY];
            if (Kind == 0) State += '0';
            else if (Kind == color + 1) State += '1';
            else State += '-';
        }
        if (State.indexOf(CHENG_5_STRING) != -1) Value += CHENG_5_SCORE;
        if (State.indexOf(HUO_4_STRING) != -1) Value += HUO_4_SCORE;
        if (State.indexOf(CHONG_4_STRING_1_1) != -1) Value += CHONG_4_SCORE;
        else if (State.indexOf(CHONG_4_STRING_1_2) != -1) Value += CHONG_4_SCORE;
        else if (State.indexOf(CHONG_4_STRING_2_1) != -1) Value += CHONG_4_SCORE;
        else if (State.indexOf(CHONG_4_STRING_2_2) != -1) Value += CHONG_4_SCORE;
        else if (State.indexOf(CHONG_4_STRING_3) != -1) Value += CHONG_4_SCORE;
        if (State.indexOf(DAN_HUO_3_STRING) != -1) Value += DAN_HUO_3_SCORE;
        if (State.indexOf(TIAO_HUO_3_STRING_1_1) != -1) Value += TIAO_HUO_3_SCORE;
        else if (State.indexOf(TIAO_HUO_3_STRING_1_2) != -1) Value += TIAO_HUO_3_SCORE;
        if (State.indexOf(MIAN_3_1_1) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_1_2) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_2_1) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_2_2) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_3_1) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_3_2) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_4_1) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_4_2) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_5) != -1) Value += MIAN_3_SCORE;
        else if (State.indexOf(MIAN_3_6) != -1) Value += MIAN_3_SCORE;
        if (State.indexOf(HUO_2_STRING_1) != -1) Value += HUO_2_SCORE;
        else if (State.indexOf(HUO_2_STRING_2) != -1) Value += HUO_2_SCORE;
        else if (State.indexOf(HUO_2_STRING_3) != -1) Value += HUO_2_SCORE;
        if (State.indexOf(MIAN_2_1_1) != -1) Value += MIAN_2_SCORE;
        else if (State.indexOf(MIAN_2_1_2) != -1) Value += MIAN_2_SCORE;
        else if (State.indexOf(MIAN_2_2_1) != -1) Value += MIAN_2_SCORE;
        else if (State.indexOf(MIAN_2_2_2) != -1) Value += MIAN_2_SCORE;
        else if (State.indexOf(MIAN_2_3_1) != -1) Value += MIAN_2_SCORE;
        else if (State.indexOf(MIAN_2_3_2) != -1) Value += MIAN_2_SCORE;
        else if (State.indexOf(MIAN_2_4) != -1) Value += MIAN_2_SCORE;
    }
    return Value * Weight;
}

var AI = function(color) {
    var AI_Value = 0;
    var Player_Value = 0;
    for (var i = 0; i < 15; ++i) {
        for (var j = 0; j < 15; ++j) {
            if (chessBoard[i][j] == color + 1) {
                AI_Value += ChessBoardEvaluate(i, j, color);
            } else if (chessBoard[i][j] != 0) {
                Player_Value += ChessBoardEvaluate(i, j, 1 - color);
            }
        }
    }
    return AI_Value * 10 - Player_Value;
}

chess.onclick = function(e) {
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 40);
	var j = Math.floor(y / 40);
	if(chessBoard[i][j] == 0) {
		oneStep(i, j, color);
		chessBoard[i][j] = color + 1;
        if (CheckOver(i, j)) {
            confirm("You Win!");
            location.reload();
        }
    	color = 1 - color;
        Min_Max_Search(0, color, -Infinity, Infinity);
        oneStep(NextStep[0], NextStep[1], color);
        chessBoard[NextStep[0]][NextStep[1]] = color + 1;
        if (CheckOver(NextStep[0], NextStep[1])) {
            confirm("You Lose!");
            location.reload();
        }
        color = 1 - color;
	}
}
