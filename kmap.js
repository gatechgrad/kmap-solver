/**
 * kmap.js
 * KMap Solver
 * 2015 Levi D. Smith
 * Web - levidsmith.com
 * Twitter - @GaTechGrad
 */

var DEBUG = 0;

var X_OFFSET = 64;
var Y_OFFSET = 64;

var X_BUTTON_OFFSET = 50;
var Y_BUTTON_OFFSET = 480;
var BUTTON_RADIUS = 12;
var BUTTON_SPACING = 32;

var CELL_SIZE = 96;
var c = document.getElementById("kmap_canvas");
var iValues;
var iMarkedCells;
var circlesArray = [];
var circlesArrayText = [];
var iSelectedButton = -1;

var essentialPI = [];
var essentialPIText = [];
var essentialPINotText = [];
var nonEssentialPI = [];
var nonEssentialPIText = [];
var nonEssentialPINotText = [];

var strBooleanText = [];
var strBooleanNotText = [];

var iMapRows = 4;
var iMapCols = 4;

var  strLetterMap = {};
var  strLetterNotMap = {};

function main() {
  init();
  updateGraphics();
}

function init() {
  c.addEventListener("mousedown", getMousePosition, false);
  iValues = [[0, 0, 0, 0],
               [0, 0, 0, 0],
               [0, 0, 0, 0],
               [0, 0, 0, 0]];

  iMarkedCells = [[0, 0, 0, 0],
               [0, 0, 0, 0],
               [0, 0, 0, 0],
               [0, 0, 0, 0]];

  defineLetterMap();
}


function clearCanvas() {
  var CANVAS_WIDTH = 600;
  var CANVAS_HEIGHT = 512;
  var ctx = c.getContext("2d");
//  ctx.fillStyle = "#80FF80";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
     

}

function drawCanvas() {


  var ctx = c.getContext("2d");


  ctx.font = "30px Arial";

  var x = 0;
  var y = 0;

  var iSpacing = CELL_SIZE;

  x = X_OFFSET + (48 / 2);
  y = Y_OFFSET - 24;

  ctx.fillStyle = "#000000";
  ctx.fillText("00", x, y);

  x += iSpacing;
  ctx.fillText("01", x, y);

  x += iSpacing;
  ctx.fillText("11", x, y);

  x += iSpacing;
  ctx.fillText("10", x, y);

  x = X_OFFSET - 48;
  y = Y_OFFSET + (iSpacing / 2);

  ctx.fillText("00", x, y);

  y += iSpacing;
  ctx.fillText("01", x, y);

  y += iSpacing;
  ctx.fillText("11", x, y);

  y += iSpacing;
  ctx.fillText("10", x, y);

  var i;
  var j;

  //draw cell values
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {

      x = X_OFFSET + (j * iSpacing) + (iSpacing / 2);
      y = Y_OFFSET + (i * iSpacing) + (iSpacing / 2);

    
      if (iValues[i][j] > 0) {
        if (iSelectedButton >= 0) {
          if ( iSelectedButton < essentialPI.length ) {
            if (essentialPI[iSelectedButton][i][j] == 1)  {
              ctx.fillStyle = "#FF0000";
            } else {
              ctx.fillStyle = "#0000FF";
            }
          } else if (iSelectedButton - essentialPI.length < nonEssentialPI.length)  {
             if (nonEssentialPI[iSelectedButton - essentialPI.length][i][j] == 1) {
              ctx.fillStyle = "#FF8000";
             } else {
              ctx.fillStyle = "#0000FF";

             }

          } else {
            ctx.fillStyle = "#0000FF";
          }

        } else {
          ctx.fillStyle = "#0000FF";
        }

      } else {
        ctx.fillStyle = "#FFFFFF";

      }
      ctx.fillRect(X_OFFSET + (j * iSpacing), 
                   Y_OFFSET + (i * iSpacing), 
                   iSpacing, iSpacing);
     

      ctx.fillStyle = "#000000";
      ctx.fillText(iValues[i][j], x, y);


    }
  }

  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  //draw vertical lines
  for (i = 0; i < 5; i++) {
    x = X_OFFSET + (i * iSpacing);
    y = Y_OFFSET;
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + (4 * iSpacing));
    ctx.stroke();
  }

  //draw horizontal lines
  for (i = 0; i < 5; i++) {
    x = X_OFFSET;
    y = Y_OFFSET + (i * iSpacing);
    ctx.moveTo(x, y);
    ctx.lineTo(x + (4 * iSpacing), y);
    ctx.stroke();
  }


  //circle debug text
  if (DEBUG == 1) {
    x = 512;
    y = 20;

    for (i = 0; i < circlesArrayText.length; i++) {
      ctx.font = "12px Arial";

      if (circlesArrayText[i].search("true") >= 0) {
        ctx.fillStyle = "#00FF00";

      } else if (circlesArrayText[i].search("Check") >= 0) {
        ctx.fillStyle = "#000000";

      } else {
        ctx.fillStyle = "#FF0000";

      }

      ctx.fillText(circlesArrayText[i], x, y);
      y += 20;
      if (y > 480) {
        x += 128;
        y = 20;
      }

    }
  }

  if (DEBUG == 2) {
    x = 512;
    y = 20;

    for (i = 0; i < circlesArray.length; i++) {
      ctx.font = "12px Arial";
      ctx.fillStyle = "#FF0000";

      ctx.fillText(circlesArray[i], x, y);
      y += 20;
      if (y > 480) {
        x += 128;
        y = 20;
      }

    }

  }

  drawButtons();
}

function drawCopyright() {


  var ctx = c.getContext("2d");

  ctx.font = "12px Arial";
  ctx.fillStyle = "#0000FF";
  ctx.fillText("Levi D. Smith @GaTechGrad - May 2015", 8, 12);
}


function drawButtons() {
  var i = 0;

  x = X_BUTTON_OFFSET;
  y = Y_BUTTON_OFFSET;

  var ctx = c.getContext("2d");

  for (i = 0; i < essentialPI.length; i++) {

    if (i == iSelectedButton) {
      ctx.beginPath();
      ctx.arc(x, y, BUTTON_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF0000";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, BUTTON_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FF0000";
    ctx.stroke();    

    x += BUTTON_SPACING;
  }


 
  for (i = 0; i < nonEssentialPI.length; i++) {

    if (i + essentialPI.length == iSelectedButton) {
      ctx.beginPath();
      ctx.arc(x, y, BUTTON_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = "#FF8000";
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(x, y, BUTTON_RADIUS, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FF8000";
    ctx.stroke();    

    x += BUTTON_SPACING;
  }



}


function drawBooleanText() {


  var ctx = c.getContext("2d");
  var x, y;

  //ctx.font = "12px Arial";
  ctx.font = "18px Courier New";
  ctx.fillStyle = "#000000";

  x = X_OFFSET - 8;
  y = Y_OFFSET - 24; 
  ctx.fillText("AB", x, y);

  x = X_OFFSET - 48;
  y = Y_OFFSET + 12; 
  ctx.fillText("CD", x, y);

  ctx.font = "18px Courier New";
  x = 480;
  y = 64;

  ctx.font = "14px Courier New";
  ctx.fillStyle = "#000000";
  ctx.fillText("Prime", x, y);
  y += 24;
  ctx.fillText("Implicants", x, y);
  y += 24;
  y += 24

  ctx.font = "14px Courier New";
  ctx.fillStyle = "#FF0000";
  ctx.fillText("Essential", x, y);
  y += 24
  ctx.font = "18px Courier New";
  for (i = 0; i < essentialPI.length; i++) {
    ctx.fillText(essentialPIText[i], x, y);
    ctx.fillText(essentialPINotText[i], x, y - 18);
    y += 24;
  }

  y += 24
  ctx.font = "14px Courier New";
  ctx.fillStyle = "#FF8000";
  ctx.fillText("Non-Essential", x, y);
  y += 24
  ctx.font = "18px Courier New";
  for (i = 0; i < nonEssentialPI.length; i++) {
    ctx.fillText(nonEssentialPIText[i], x, y);
    ctx.fillText(nonEssentialPINotText[i], x, y - 18);
    y += 24;
  }

}

function updateGraphics() {

  clearCanvas();
  drawCanvas();
  drawCopyright();
  drawBooleanText();
}


function getMousePosition(e) {
  var x;
  var y;

  var iRow;
  var iCol;

  if (e.x != undefined && e.y != undefined) {
    x = e.x;
    y = e.y;

  } else {
    x = e.clientX;
    y = e.clientY;
  }

  x -= c.offsetLeft;
  y -= c.offsetTop;

//  alert("x: " + x + " y: " + y);

  if ( (x > X_OFFSET) && (x < (X_OFFSET + (4 * CELL_SIZE))) &&
       (y > Y_OFFSET) && (y < (Y_OFFSET + (4 * CELL_SIZE)))
     ) {

    iRow = Math.floor((y - Y_OFFSET) / CELL_SIZE);
    iCol = Math.floor((x - X_OFFSET) / CELL_SIZE);

//  alert("row: " + iRow + " col: " + iCol);

    iValues[iRow][iCol] += 1
    iValues[iRow][iCol] %= 2;

    iSelectedButton = -1;
    findCircles();
  }
  

  //determine if a button was clicked
//  alert('x: ' + x + ' y: ' + y);
  if (y > Y_BUTTON_OFFSET - BUTTON_RADIUS) {
    for (i = 0; i < circlesArray.length; i++) {
      if (x > X_BUTTON_OFFSET + (i * BUTTON_SPACING - (BUTTON_RADIUS / 1))) {
        iSelectedButton = i;
      }

    }
  }

  updateGraphics();

}


function findCircles() {
  //check 4x4 
  var i;
  var j;

  circlesArray = [];
  circlesArrayText = [];
  copyArray(iValues, iMarkedCells);

  strBooleanText = [];
  strBooleanNotText = [];

  essentialPIText = [];
  essentialPINotText = [];

  nonEssentialPIText = [];
  nonEssentialPINotText = [];



//  alert('Marked cells: ' + iMarkedCells);

  var rowPower = 2;
  var colPower = 2;


  var isACircle = true;
  iCheckRows = Math.pow(2, rowPower);
  iCheckCols = Math.pow(2, colPower);

  //check 16
  circlesArrayText[circlesArrayText.length] = "Check 16"

  validCircles = [];
  validCircles[validCircles.length] = [4, 4, 0, 0]; 

  findBestCircles(validCircles);
  
  //check 8
  circlesArrayText[circlesArrayText.length] = "Check 8"


  validCircles = [];
  validCircles[validCircles.length] = [2, 4, 0, 0]; 
  validCircles[validCircles.length] = [2, 4, 1, 0]; 
  validCircles[validCircles.length] = [2, 4, 2, 0]; 
  validCircles[validCircles.length] = [2, 4, 3, 0]; 

  validCircles[validCircles.length] = [4, 2, 0, 0]; 
  validCircles[validCircles.length] = [4, 2, 0, 1]; 
  validCircles[validCircles.length] = [4, 2, 0, 2]; 
  validCircles[validCircles.length] = [4, 2, 0, 3]; 

  findBestCircles(validCircles);


  //check 4
  circlesArrayText[circlesArrayText.length] = "Check 4"

  validCircles = [];
  validCircles[validCircles.length] = [2, 2, 0, 0]; 
  validCircles[validCircles.length] = [2, 2, 1, 0]; 
  validCircles[validCircles.length] = [2, 2, 2, 0]; 
  validCircles[validCircles.length] = [2, 2, 3, 0]; 
 
  validCircles[validCircles.length] = [2, 2, 0, 1]; 
  validCircles[validCircles.length] = [2, 2, 1, 1]; 
  validCircles[validCircles.length] = [2, 2, 2, 1]; 
  validCircles[validCircles.length] = [2, 2, 3, 1]; 

  validCircles[validCircles.length] = [2, 2, 0, 2]; 
  validCircles[validCircles.length] = [2, 2, 1, 2]; 
  validCircles[validCircles.length] = [2, 2, 2, 2]; 
  validCircles[validCircles.length] = [2, 2, 3, 2]; 

  validCircles[validCircles.length] = [2, 2, 0, 3]; 
  validCircles[validCircles.length] = [2, 2, 1, 3]; 
  validCircles[validCircles.length] = [2, 2, 2, 3]; 
  validCircles[validCircles.length] = [2, 2, 3, 3]; 

  validCircles[validCircles.length] = [4, 1, 0, 0]; 
  validCircles[validCircles.length] = [4, 1, 0, 1]; 
  validCircles[validCircles.length] = [4, 1, 0, 2]; 
  validCircles[validCircles.length] = [4, 1, 0, 3]; 

  validCircles[validCircles.length] = [1, 4, 0, 0]; 
  validCircles[validCircles.length] = [1, 4, 1, 0]; 
  validCircles[validCircles.length] = [1, 4, 2, 0]; 
  validCircles[validCircles.length] = [1, 4, 3, 0]; 

  findBestCircles(validCircles);


  //check 2
  circlesArrayText[circlesArrayText.length] = "Check 2"

  validCircles = [];
  validCircles[validCircles.length] = [2, 1, 0, 0]; 
  validCircles[validCircles.length] = [2, 1, 0, 1]; 
  validCircles[validCircles.length] = [2, 1, 0, 2]; 
  validCircles[validCircles.length] = [2, 1, 0, 3]; 

  validCircles[validCircles.length] = [2, 1, 1, 0]; 
  validCircles[validCircles.length] = [2, 1, 1, 1]; 
  validCircles[validCircles.length] = [2, 1, 1, 2]; 
  validCircles[validCircles.length] = [2, 1, 1, 3]; 

  validCircles[validCircles.length] = [2, 1, 2, 0]; 
  validCircles[validCircles.length] = [2, 1, 2, 1]; 
  validCircles[validCircles.length] = [2, 1, 2, 2]; 
  validCircles[validCircles.length] = [2, 1, 2, 3]; 

  validCircles[validCircles.length] = [2, 1, 3, 0]; 
  validCircles[validCircles.length] = [2, 1, 3, 1]; 
  validCircles[validCircles.length] = [2, 1, 3, 2]; 
  validCircles[validCircles.length] = [2, 1, 3, 3]; 

  validCircles[validCircles.length] = [1, 2, 0, 0]; 
  validCircles[validCircles.length] = [1, 2, 1, 0]; 
  validCircles[validCircles.length] = [1, 2, 2, 0]; 
  validCircles[validCircles.length] = [1, 2, 3, 0]; 

  validCircles[validCircles.length] = [1, 2, 0, 1]; 
  validCircles[validCircles.length] = [1, 2, 1, 1]; 
  validCircles[validCircles.length] = [1, 2, 2, 1]; 
  validCircles[validCircles.length] = [1, 2, 3, 1]; 

  validCircles[validCircles.length] = [1, 2, 0, 2]; 
  validCircles[validCircles.length] = [1, 2, 1, 2]; 
  validCircles[validCircles.length] = [1, 2, 2, 2]; 
  validCircles[validCircles.length] = [1, 2, 3, 2]; 

  validCircles[validCircles.length] = [1, 2, 0, 3]; 
  validCircles[validCircles.length] = [1, 2, 1, 3]; 
  validCircles[validCircles.length] = [1, 2, 2, 3]; 
  validCircles[validCircles.length] = [1, 2, 3, 3]; 

  findBestCircles(validCircles);
  




  //check 1
  circlesArrayText[circlesArrayText.length] = "Check 1"

  validCircles = [];
  validCircles[validCircles.length] = [1, 1, 0, 0]; 
  validCircles[validCircles.length] = [1, 1, 0, 1]; 
  validCircles[validCircles.length] = [1, 1, 0, 2]; 
  validCircles[validCircles.length] = [1, 1, 0, 3]; 

  validCircles[validCircles.length] = [1, 1, 1, 0]; 
  validCircles[validCircles.length] = [1, 1, 1, 1]; 
  validCircles[validCircles.length] = [1, 1, 1, 2]; 
  validCircles[validCircles.length] = [1, 1, 1, 3]; 

  validCircles[validCircles.length] = [1, 1, 2, 0]; 
  validCircles[validCircles.length] = [1, 1, 2, 1]; 
  validCircles[validCircles.length] = [1, 1, 2, 2]; 
  validCircles[validCircles.length] = [1, 1, 2, 3]; 

  validCircles[validCircles.length] = [1, 1, 3, 0]; 
  validCircles[validCircles.length] = [1, 1, 3, 1]; 
  validCircles[validCircles.length] = [1, 1, 3, 2]; 
  validCircles[validCircles.length] = [1, 1, 3, 3]; 


  findBestCircles(validCircles);

  findPrimeImplicants();

}




/**
 * finds the circle with the most marked cells
 * keeps looping until it no longer finds circles with any marked cells
 */
function findBestCircles(arrValidCircles) {
  var i;

  for (i = 0; i < arrValidCircles.length; i++) {
    iCount = arrayMarkCount(arrValidCircles[i][0], arrValidCircles[i][1], arrValidCircles[i][2], arrValidCircles[i][3]);
      if ((iCount > 0) && arrayCircleCheck(arrValidCircles[i][0], arrValidCircles[i][1], arrValidCircles[i][2], arrValidCircles[i][3])) {

        iBestIndex = i;
      setBooleanText(arrValidCircles[i]);
//      unmarkCells(arrValidCircles[iBestIndex][0], arrValidCircles[iBestIndex][1], arrValidCircles[iBestIndex][2], arrValidCircles[iBestIndex][3]); 
    
      var tempArray = defineCircleArray(arrValidCircles[iBestIndex][0], arrValidCircles[iBestIndex][1], arrValidCircles[iBestIndex][2], arrValidCircles[iBestIndex][3]); 
      circlesArray[circlesArray.length] = tempArray; 
      circlesArrayText[circlesArrayText.length] = 
           arrValidCircles[iBestIndex][0] + ", " + 
           arrValidCircles[iBestIndex][1] + ", " + 
           arrValidCircles[iBestIndex][2] + ", " + 
           arrValidCircles[iBestIndex][3];




      }

    }


    //this may unmark previously unmarked cells
    for (i = 0; i < circlesArray.length; i++) {
      unmarkCellsArray(circlesArray[i]); 

    }




}


function defineLetterMap() {
//4x4
  strLetterNotMap["4400"] = " " ;
  strLetterMap   ["4400"] = "1" ;

//4x2
  strLetterNotMap["4200"] = "_" ;
  strLetterMap   ["4200"] = "A" ;

  strLetterNotMap["4201"] = " " ;
  strLetterMap   ["4201"] = "B" ;

  strLetterNotMap["4202"] = " " ;
  strLetterMap   ["4202"] = "A" ;

  strLetterNotMap["4203"] = "_" ;
  strLetterMap   ["4203"] = "B" ;


//2x4
  strLetterNotMap["2400"] = "_" ;
  strLetterMap   ["2400"] = "C" ;

  strLetterNotMap["2410"] = " " ;
  strLetterMap   ["2410"] = "D" ;

  strLetterNotMap["2420"] = " " ;
  strLetterMap   ["2420"] = "C" ;

  strLetterNotMap["2430"] = "_" ;
  strLetterMap   ["2430"] = "D" ;


//1x4
  strLetterNotMap["1400"] = "__" ;
  strLetterMap   ["1400"] = "CD" ;

  strLetterNotMap["1410"] = "_ " ;
  strLetterMap   ["1410"] = "CD" ;

  strLetterNotMap["1420"] = "  " ;
  strLetterMap   ["1420"] = "CD" ;

  strLetterNotMap["1430"] = " _" ;
  strLetterMap   ["1430"] = "CD" ;


//4x1
  strLetterNotMap["4100"] = "__" ;
  strLetterMap   ["4100"] = "AB" ;

  strLetterNotMap["4101"] = "_ " ;
  strLetterMap   ["4101"] = "AB" ;

  strLetterNotMap["4102"] = "  " ;
  strLetterMap   ["4102"] = "AB" ;

  strLetterNotMap["4103"] = " _" ;
  strLetterMap   ["4103"] = "AB" ;



//2x2
  strLetterNotMap["2200"] = "__" ;
  strLetterMap   ["2200"] = "AC" ;

  strLetterNotMap["2201"] = " _" ;
  strLetterMap   ["2201"] = "BC" ;

  strLetterNotMap["2202"] = " _" ;
  strLetterMap   ["2202"] = "AC" ;

  strLetterNotMap["2203"] = "__" ;
  strLetterMap   ["2203"] = "BC" ;


  strLetterNotMap["2210"] = "_ " ;
  strLetterMap   ["2210"] = "AD" ;

  strLetterNotMap["2211"] = "  " ;
  strLetterMap   ["2211"] = "BD" ;

  strLetterNotMap["2212"] = "  " ;
  strLetterMap   ["2212"] = "AD" ;

  strLetterNotMap["2213"] = "_ " ;
  strLetterMap   ["2213"] = "BD" ;


  strLetterNotMap["2220"] = "_ " ;
  strLetterMap   ["2220"] = "AC" ;

  strLetterNotMap["2221"] = "  " ;
  strLetterMap   ["2221"] = "BC" ;

  strLetterNotMap["2222"] = "  " ;
  strLetterMap   ["2222"] = "AC" ;

  strLetterNotMap["2223"] = "_ " ;
  strLetterMap   ["2223"] = "BC" ;

  strLetterNotMap["2230"] = "__" ;
  strLetterMap   ["2230"] = "AD" ;

  strLetterNotMap["2231"] = " _" ;
  strLetterMap   ["2231"] = "BD" ;

  strLetterNotMap["2232"] = " _" ;
  strLetterMap   ["2232"] = "AD" ;

  strLetterNotMap["2233"] = "__" ;
  strLetterMap   ["2233"] = "BD" ;





//1x2
  strLetterNotMap["1200"] = "___" ;
  strLetterMap   ["1200"] = "ACD" ;

  strLetterNotMap["1201"] = " __" ;
  strLetterMap   ["1201"] = "BCD" ;

  strLetterNotMap["1202"] = " __" ;
  strLetterMap   ["1202"] = "ACD" ;

  strLetterNotMap["1203"] = "___" ;
  strLetterMap   ["1203"] = "BCD" ;


  strLetterNotMap["1210"] = "__ " ;
  strLetterMap   ["1210"] = "ACD" ;

  strLetterNotMap["1211"] = " _ " ;
  strLetterMap   ["1211"] = "BCD" ;

  strLetterNotMap["1212"] = " _ " ;
  strLetterMap   ["1212"] = "ACD" ;

  strLetterNotMap["1213"] = "__ " ;
  strLetterMap   ["1213"] = "BCD" ;


  strLetterNotMap["1220"] = "_  " ;
  strLetterMap   ["1220"] = "ACD" ;

  strLetterNotMap["1221"] = "   " ;
  strLetterMap   ["1221"] = "BCD" ;

  strLetterNotMap["1222"] = "   " ;
  strLetterMap   ["1222"] = "ACD" ;

  strLetterNotMap["1223"] = "_  " ;
  strLetterMap   ["1223"] = "BCD" ;


  strLetterNotMap["1230"] = "_ _" ;
  strLetterMap   ["1230"] = "ACD" ;

  strLetterNotMap["1231"] = "  _" ;
  strLetterMap   ["1231"] = "BCD" ;

  strLetterNotMap["1232"] = "  _" ;
  strLetterMap   ["1232"] = "ACD" ;

  strLetterNotMap["1233"] = "_ _" ;
  strLetterMap   ["1233"] = "BCD" ;


//2x1
  strLetterNotMap["2100"] = "___" ;
  strLetterMap   ["2100"] = "ABC" ;

  strLetterNotMap["2110"] = "__ " ;
  strLetterMap   ["2110"] = "ABD" ;

  strLetterNotMap["2120"] = "__ " ;
  strLetterMap   ["2120"] = "ABC" ;

  strLetterNotMap["2130"] = "___" ;
  strLetterMap   ["2130"] = "ABD" ;


  strLetterNotMap["2101"] = "_ _" ;
  strLetterMap   ["2101"] = "ABC" ;

  strLetterNotMap["2111"] = "_  " ;
  strLetterMap   ["2111"] = "ABD" ;

  strLetterNotMap["2121"] = "_  " ;
  strLetterMap   ["2121"] = "ABC" ;

  strLetterNotMap["2131"] = "_ _" ;
  strLetterMap   ["2131"] = "ABD" ;


  strLetterNotMap["2102"] = "  _" ;
  strLetterMap   ["2102"] = "ABC" ;

  strLetterNotMap["2112"] = "   " ;
  strLetterMap   ["2112"] = "ABD" ;

  strLetterNotMap["2122"] = "   " ;
  strLetterMap   ["2122"] = "ABC" ;

  strLetterNotMap["2132"] = "  _" ;
  strLetterMap   ["2132"] = "ABD" ;


  strLetterNotMap["2103"] = " __" ;
  strLetterMap   ["2103"] = "ABC" ;

  strLetterNotMap["2113"] = " _ " ;
  strLetterMap   ["2113"] = "ABD" ;

  strLetterNotMap["2123"] = " _ " ;
  strLetterMap   ["2123"] = "ABC" ;

  strLetterNotMap["2133"] = " __" ;
  strLetterMap   ["2133"] = "ABD" ;


//1x1
  strLetterNotMap["1100"] = "____" ;
  strLetterMap   ["1100"] = "ABCD" ;

  strLetterNotMap["1101"] = "_ __" ;
  strLetterMap   ["1101"] = "ABCD" ;

  strLetterNotMap["1102"] = "  __" ;
  strLetterMap   ["1102"] = "ABCD" ;

  strLetterNotMap["1103"] = " ___" ;
  strLetterMap   ["1103"] = "ABCD" ;

  strLetterNotMap["1110"] = "___ " ;
  strLetterMap   ["1110"] = "ABCD" ;

  strLetterNotMap["1111"] = "_ _ " ;
  strLetterMap   ["1111"] = "ABCD" ;

  strLetterNotMap["1112"] = "  _ " ;
  strLetterMap   ["1112"] = "ABCD" ;

  strLetterNotMap["1113"] = " __ " ;
  strLetterMap   ["1113"] = "ABCD" ;



  strLetterNotMap["1120"] = "__  " ;
  strLetterMap   ["1120"] = "ABCD" ;

  strLetterNotMap["1121"] = "_   " ;
  strLetterMap   ["1121"] = "ABCD" ;

  strLetterNotMap["1122"] = "    " ;
  strLetterMap   ["1122"] = "ABCD" ;

  strLetterNotMap["1123"] = " _  " ;
  strLetterMap   ["1123"] = "ABCD" ;



  strLetterNotMap["1130"] = "__ _" ;
  strLetterMap   ["1130"] = "ABCD" ;

  strLetterNotMap["1131"] = "_  _" ;
  strLetterMap   ["1131"] = "ABCD" ;

  strLetterNotMap["1132"] = "   _" ;
  strLetterMap   ["1132"] = "ABCD" ;

  strLetterNotMap["1133"] = " _ _" ;
  strLetterMap   ["1133"] = "ABCD" ;




}

/**
 */
function setBooleanText(arr) {
  iIndex = strBooleanText.length;

  iRows = arr[0];
  iCols = arr[1];
  iRowOffset = arr[2];
  iColOffset = arr[3];





  strBooleanText[iIndex] = strLetterMap["" + iRows + iCols + iRowOffset + iColOffset];
  strBooleanNotText[iIndex] = strLetterNotMap["" + iRows + iCols + iRowOffset + iColOffset];

  if (strBooleanText[iIndex] == undefined) {
    strBooleanText[iIndex] = "?"; 
    strBooleanNotText[iIndex] = " "; 

  }

}




/**
 * checks to see if at least one mark exists in this check
 */
function arrayMarkCount(iRows, iCols, iStartRow, iStartCol) {
  var i;
  var j;

  iMarkCount = 0;

  for (i = iStartRow; i < iStartRow + iRows; i++) {
    for (j = iStartCol; j < iStartCol + iCols; j++) {
      if (iMarkedCells[i % iMapRows][j % iMapCols] == 1) {
        iMarkCount++;
      }  
    }
  }  

  return iMarkCount;
}


/**
 * checks to see if the values specified form a valid circle
 */
function arrayCircleCheck(iRows, iCols, iStartRow, iStartCol) {
  var i;
  var j;


  isMatch = true;

  for (i = iStartRow; i < iStartRow + iRows; i++) {
    for (j = iStartCol; j < iStartCol + iCols; j++) {
      if (iValues[i % iMapRows][j % iMapCols] == 0) {
        isMatch = false;
      }  
    }
  }  

  return isMatch;
}



/**
 * set the cells in the mark array to zero for a valid circle
 */
function unmarkCells(iRows, iCols, iStartRow, iStartCol) {
  var i;
  var j;


  var iCurrentRow;
  var iCurrentCol;

  for (i = iStartRow; i < iStartRow + iRows; i++) {
    for (j = iStartCol; j < iStartCol + iCols; j++) {
      iCurrentRow = i % iMapRows;
      iCurrentCol = j % iMapCols;
      iMarkedCells[iCurrentRow][iCurrentCol] = 0;
    }
  }  

}

/**
 * set the cells in the mark array to zero for the passed in array 
 */
function unmarkCellsArray(arr) {
  var i;
  var j;



  for (i = 0; i < iMapRows; i++) {
    for (j = 0; j < iMapCols; j++) {
      if (arr[i][j] == 1) {
        iMarkedCells[i][j] = 0;
      }
    }
  }  

}


function defineCircleArray(iRows, iCols, iStartRow, iStartCol) {
  var i;
  var j;
 
  arr = [[0, 0, 0, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0],
         [0, 0, 0, 0]];

  for (i = iStartRow; i < iStartRow + iRows; i++) {
    for (j = iStartCol; j < iStartCol + iCols; j++) {
      arr[i % iMapRows][j % iMapCols] = 1; 
    }
  }  

  return arr;
}

function copyArray(arrFrom, arrTo) {

  for (i = 0; i < iMapRows; i++) {
    for (j = 0; j < iMapCols; j++) {
      arrTo[i][j] = arrFrom[i][j];
    }
  }

}

function findPrimeImplicants() {
  var i, j;
  var i1, j1;

  essentialPI = [];
  essentialPIText = [];
  essentialPINotText = [];

  nonEssentialPI = [];
  nonEssentialPIText = [];
  nonEssentialPINotText = [];


  for (i = 0; i < circlesArray.length; i++) {
  
    tempArray = [[0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0]];
    for (j = 0; j < circlesArray.length; j++) {
      if (j != i ) {

        for (i1 = 0; i1 < iMapRows; i1++) {
          for (j1 = 0; j1 < iMapCols; j1++) {
            if (tempArray[i1][j1] == 0) {
              tempArray[i1][j1] = circlesArray[j][i1][j1];
            }
          }
        }

      }
    }  

    if (arrayContains(circlesArray[i], tempArray)) {
      iLength = nonEssentialPI.length
      nonEssentialPI[iLength] = circlesArray[i];
      nonEssentialPIText[iLength] = strBooleanText[i];
      nonEssentialPINotText[iLength] = strBooleanNotText[i];


    } else {
      iLength = essentialPI.length
      essentialPI[iLength] = circlesArray[i];
      essentialPIText[iLength] = strBooleanText[i];
      essentialPINotText[iLength] = strBooleanNotText[i];


    }


  }
}

function arrayContains(arr1, arr2) {
  var i;
  var j;

  doesContain = true;

  for (i = 0; i < iMapRows; i++) {
    for (j = 0; j < iMapCols; j++) {
      if ( (arr1[i][j] == 1) && (arr2[i][j] == 0)) {
        doesContain = false;
      }
    }
  }

  return doesContain;

}


main();
