import java.awt.*;
import java.awt.event.*;
import java.util.Vector;

public class KMap extends Panel implements ItemListener {

	/*
  int iKMap[][] = { {1, 1, 1, 1 },
	            {0, 1, 1, 0 },
		    {0, 0, 0, 0 },
		    {1, 1, 1, 1 } };
		    */
/*
  int iKMap[][] = { {1, 1, 1, 1 },
	            {0, 1, 1, 1 },
		    {0, 0, 1, 1 },
		    {1, 0, 0, 1 } };
*/

/*
  int iKMap[][] = { {1, 1, 0, 1 },
                    {1, 0, 0, 1 },
                    {1, 0, 0, 1 },
                    {1, 1, 1, 1 } };
*/
  int iKMap[][] = new int[4][4];

                         

  private MapDisplay md;
  private Vector vectFound;
  private List lstCircles;
  private TextField txtSumOfProducts;
  private Button butMap;


  public KMap() {
    System.out.println("KMap");
    makeWindow();
//    calculateValues();
  }

  private void makeWindow() {
    md = new MapDisplay(this);
    lstCircles = new List();

    lstCircles.addItemListener(this);
    this.add(lstCircles);

    this.add(md);

  }

  public int[][] getKMap() {
    return iKMap;
  }

  public void setMatrixValue(int iRow, int iCol, int iValue) {
    iKMap[iRow][iCol] = iValue;  
  }

  public void calculateValues() {
    int i, j;                   //to loop through all of the cells
    int a, b;
    int iRow, iCol;             //iterators
    int iRowValue, iColValue;   //actual row and column values to span

    int iCheckedMap[][];        //stores the values that need to be checked
    int iArrayTemp[][];         //temporary storage for a circle to be added to the vector
    int iArrayMax[][];
    int iChecked;
    int iSpaces;
    int iSpacesUsed;

    vectFound = new Vector();
    lstCircles.removeAll();

    iArrayTemp = new int[4][4];
    iArrayMax = new int[4][4];

    iCheckedMap = new int[4][4];
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        iCheckedMap[i][j] = iKMap[i][j];
      }
    }

    i = 0;
    j = 0;

    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {

        if (iCheckedMap[i][j] == 1) {
    iSpaces = 0;
    iSpacesUsed = 0;

    iArrayTemp = new int[4][4];


    for (iRow = -1; iRow <= 2; iRow++) {
      for (iCol = -1; iCol <= 2; iCol++) {
        iChecked = 1;

        iRowValue = iRow * 2;
        if (iRowValue == 0) {
          iRowValue = 1;
        }

        iColValue = iCol * 2;
        if (iColValue == 0) {
          iColValue = 1;
        }



        if (checkValues(iKMap, i, j, iRowValue, iColValue)) {
          if ((countChecked(iKMap, i, j, iRowValue, iColValue) >= iSpaces) &&
              (countChecked(iCheckedMap, i, j, iRowValue, iColValue) >= iSpacesUsed)) {
            iSpaces = countChecked(iKMap, i, j, iRowValue, iColValue);
            iSpacesUsed = countChecked(iCheckedMap, i, j, iRowValue, iColValue);
            createArray(iArrayTemp, i, j, iRowValue, iColValue);

          }
        }

      }
    }

    subtractMatrix(iCheckedMap, iArrayTemp);
    vectFound.addElement(iArrayTemp);
    md.repaint();

    try {
      Thread.sleep(500);
    } catch (Exception e) { }

        }
      }
    }

 
    //System.out.print("Found: " + vectFound.size());
    //Print Arrays
    for (i = 0; i < vectFound.size(); i++) {
      printArray((int[][]) vectFound.elementAt(i));
    }

    for (i = 0; i < vectFound.size(); i++) {
      lstCircles.addItem("Circle " + i);
    }

    md.repaint();


  }

  private void subtractMatrix(int[][] iArrayOne, int[][] iArrayTwo) {
    int i, j;

    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        if (iArrayTwo[i][j] == 1) {
          iArrayOne[i][j] = 0;
        }
      }
    }
  }

  private boolean checkValues(int[][] iArray, int i, int j, int iRows, int iCols) {
    int a, b;
    boolean bAllChecked;
    int iRowIterator, iColIterator;
    int iRowValue, iColValue;

    bAllChecked = true;

    if ((iRows > 0) && (iCols > 0)) {

      for (a = 0; a < iRows; a++) {
        for (b = 0; b < iCols; b++) {
          iRowValue = (i + a) % 4;
          iColValue = (j + b) % 4;
          if (iArray[iRowValue][iColValue] == 0) {
            bAllChecked = false;
          }
        }
      }
    } else if ((iRows > 0) && (iCols <= 0)) {
      for (a = 0; a < iRows; a++) {
        for (b = 0; b > iCols; b--) {
          iRowValue = (i + a) % 4;
          if ((j + b) < 0) {
            iColValue = (j + b) + 4;
          } else {
            iColValue = (j + b);
          }

          if (iArray[iRowValue][iColValue] == 0) {
            bAllChecked = false;
          }
        }
      }

    } else if ((iRows <= 0) && (iCols > 0)) {

      for (a = 0; a > iRows; a--) {
        for (b = 0; b < iCols; b++) {
          if ((i + a) < 0) {
            iRowValue = (i + a) + 4;
          } else {
            iRowValue = (i + a);
          }
          iColValue = (j + b) % 4;

          if (iArray[iRowValue][iColValue] == 0) {
            bAllChecked = false;
          }
        }
      }

    } else if ((iRows <= 0) && (iCols <= 0)) {
      for (a = 0; a > iRows; a--) {
        for (b = 0; b > iCols; b--) {
          if ((i + a) < 0) {
            iRowValue = (i + a) + 4;
          } else {
            iRowValue = (i + a);
          }
          if ((j + b) < 0) {
            iColValue = (j + b) + 4;
          } else {
            iColValue = (j + b);
          }

          if (iArray[iRowValue][iColValue] == 0) {
            bAllChecked = false;
          }
        }
      }
    } else {
      bAllChecked = false;

    }


    return bAllChecked;

  }


  private void createArray(int[][] iArray, int i, int j, int iRows, int iCols) {
    int a, b;
    boolean bAllChecked;
    int iRowIterator, iColIterator;
    int iRowValue, iColValue;

    for (a = 0; a < 4; a++) {
      for (b = 0; b < 4; b++) {
        iArray[a][b] = 0;
      }
    }


    if ((iRows > 0) && (iCols > 0)) {

      for (a = 0; a < iRows; a++) {
        for (b = 0; b < iCols; b++) {
          iRowValue = ((i + a) + 4) % 4;
          iColValue = ((j + b) + 4) % 4;

          iArray[iRowValue][iColValue] = 1;
        }
      }
    } else if ((iRows > 0) && (iCols <= 0)) {
      for (a = 0; a < iRows; a++) {
        for (b = 0; b > iCols; b--) {
          iRowValue = ((i + a) + 4) % 4;
          iColValue = ((j + b) + 4) % 4;

          iArray[iRowValue][iColValue] = 1;

        }
      }

    } else if ((iRows <= 0) && (iCols > 0)) {

      for (a = 0; a > iRows; a--) {
        for (b = 0; b < iCols; b++) {
          iRowValue = ((i + a) + 4) % 4;
          iColValue = ((j + b) + 4) % 4;

          iArray[iRowValue][iColValue] = 1;
        }
      }

    } else if ((iRows <= 0) && (iCols <= 0)) {
      for (a = 0; a > iRows; a--) {
        for (b = 0; b > iCols; b--) {
          iRowValue = ((i + a) + 4) % 4;
          iColValue = ((j + b) + 4) % 4;

          iArray[iRowValue][iColValue] = 1;
        }
      }
    }

  }


  private int countChecked(int[][] iArray, int i, int j, int iRows, int iCols) {
    int a, b;
    int iChecked;
    int iRowIterator, iColIterator;
    int iRowValue, iColValue;

    iChecked = 0;

    if ((iRows > 0) && (iCols > 0)) {

      for (a = 0; a < iRows; a++) {
        for (b = 0; b < iCols; b++) {
          iRowValue = (i + a) % 4;
          iColValue = (j + b) % 4;
          if (iArray[iRowValue][iColValue] > 0) {
            iChecked++;
          }
        }
      }
    } else if ((iRows > 0) && (iCols <= 0)) {
      for (a = 0; a < iRows; a++) {
        for (b = 0; b > iCols; b--) {
          iRowValue = (i + a) % 4;
          if ((j + b) < 0) {
            iColValue = (j + b) + 4;
          } else {
            iColValue = (j + b);
          }

          if (iArray[iRowValue][iColValue] > 0) {
            iChecked++;
          }
        }
      }

    } else if ((iRows <= 0) && (iCols > 0)) {

      for (a = 0; a > iRows; a--) {
        for (b = 0; b < iCols; b++) {
          if ((i + a) < 0) {
            iRowValue = (i + a) + 4;
          } else {
            iRowValue = (i + a);
          }
          iColValue = (j + b) % 4;

          if (iArray[iRowValue][iColValue] > 0) {
            iChecked++;
          }
        }
      }

    } else if ((iRows <= 0) && (iCols <= 0)) {
      for (a = 0; a > iRows; a--) {
        for (b = 0; b > iCols; b--) {
          if ((i + a) < 0) {
            iRowValue = (i + a) + 4;
          } else {
            iRowValue = (i + a);
          }
          if ((j + b) < 0) {
            iColValue = (j + b) + 4;
          } else {
            iColValue = (j + b);
          }

          if (iArray[iRowValue][iColValue] > 0) {
            iChecked++;
          }
        }
      }
    } else {
      iChecked = -1;

    }


    return iChecked;

  }


  public void printArray(int[][] iArray) {
    int i, j;

    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        System.out.print(iArray[i][j] + ", ");
      }
      System.out.print("\n");
    }
    System.out.print("\n");
  }

  public void initArray(int[][] iArray) {
    int i, j;

    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        iArray[i][j] = 0;
      }
    }
  }

  public Vector getMapCircles() {
    return vectFound;
  }

  public int getSelectedCircle() {
    return lstCircles.getSelectedIndex();
  }

  public void itemStateChanged(ItemEvent e) {
    System.out.println("Repainting");
    md.repaint();

  }

  public static void main(String args[]) {
    new KMap();
  }

}
