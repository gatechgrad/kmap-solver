import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.util.Vector;

class MapDisplay extends JComponent implements MouseListener {
  public static final int GRID_X_OFFSET = 16;
  public static final int GRID_Y_OFFSET = 16;
  public static final int GRID_COL_SPACING = 32;
  public static final int GRID_ROW_SPACING = 32;

  private KMap km;

  private int iRows, iCols;

  public MapDisplay(KMap km) {
    this.km = km;

    iRows = 4;
    iCols = 4;
    addMouseListener(this);
    setPreferredSize(new Dimension(256, 256));
    setBackground(Color.red);
  }

  public void mouseReleased(MouseEvent e) { }
  public void mousePressed(MouseEvent e) { }
  public void mouseEntered(MouseEvent e) { }
  public void mouseExited(MouseEvent e) { }

  public void mouseClicked(MouseEvent e) {
    int iRow, iCol;

    iRow = (e.getY() - GRID_Y_OFFSET) / GRID_ROW_SPACING;
    iCol = (e.getX() - GRID_X_OFFSET) / GRID_COL_SPACING;
    System.out.println("iRow: " + iRow + " iCol: " + iCol);

    if (km.getKMap()[iRow][iCol] == 1) {
      km.getKMap()[iRow][iCol] = 0;
    } else {
      km.getKMap()[iRow][iCol] = 1;
    }

    km.calculateValues();

  }



  public void paint(Graphics g) {
    update(g);
  }

  public void repaint(Graphics g) {
    update(g);
  }

  public void update(Graphics g) {
    highlightOnes(g);
  }

  public void highlightOnes(Graphics g) {
    int i;
    int j;
    int iKMap[][];

    iKMap = km.getKMap();

//    g.setColor(Color.blue);
//    g.fillRect(10, 10, 20, 20);


    for (i = 0; i < iRows; i++) {
      for (j = 0; j < iCols; j++) {


/*** For testing purposes ***/
	if (iKMap[i][j] == 1) {
          g.setColor(Color.red);
          g.fillRect(16 + (j * 32), 16 + (i * 32), 32, 32);
        }
/****************************/


/*** Draw circles ***/

        if ((km.getSelectedCircle() >= 0) && (km.getSelectedCircle() < km.getMapCircles().size())) {
        if ( ((int [][]) km.getMapCircles().elementAt(km.getSelectedCircle()))[i][j] == 1) {
          System.out.println("Drawing Circles\n");
          g.setColor(Color.blue);
          g.fillRect(16 + (j * 32), 16 + (i * 32), 32, 32);
        }
        }
/********************/



        g.setColor(Color.black);
        g.drawString(iKMap[i][j] + "", 
                     (GRID_X_OFFSET + (j * GRID_COL_SPACING) + 8), 
		     (GRID_Y_OFFSET + (i * GRID_ROW_SPACING) + 16)
		     );

      }
    }

    drawBoard(g);


  }


  private void drawBoard(Graphics g) {
    int i;
    g.setColor(Color.black);

    for (i = 0; i < iRows + 1; i++) {
        g.drawLine(GRID_X_OFFSET, 
                   GRID_Y_OFFSET + (i * GRID_ROW_SPACING), 
		   GRID_X_OFFSET + (iCols * GRID_COL_SPACING), 
		   GRID_Y_OFFSET + (i * GRID_ROW_SPACING));
    }

    for (i = 0; i < iCols + 1; i++) {
        g.drawLine(GRID_X_OFFSET + (i * GRID_COL_SPACING), 
                   GRID_Y_OFFSET, 
		   GRID_X_OFFSET + (i * GRID_COL_SPACING), 
		   GRID_Y_OFFSET + (iRows * GRID_ROW_SPACING));
    }

    g.drawString("00", GRID_X_OFFSET + (0 * GRID_COL_SPACING), GRID_Y_OFFSET - 2);
    g.drawString("01", GRID_X_OFFSET + (1 * GRID_COL_SPACING), GRID_Y_OFFSET - 2);
    g.drawString("11", GRID_X_OFFSET + (2 * GRID_COL_SPACING), GRID_Y_OFFSET - 2);
    g.drawString("10", GRID_X_OFFSET + (3 * GRID_COL_SPACING), GRID_Y_OFFSET - 2);

    g.drawString("00", GRID_X_OFFSET - 16, 12 + GRID_Y_OFFSET + (0 * GRID_ROW_SPACING));
    g.drawString("01", GRID_X_OFFSET - 16, 12 + GRID_Y_OFFSET + (1 * GRID_ROW_SPACING));
    g.drawString("10", GRID_X_OFFSET - 16, 12 + GRID_Y_OFFSET + (2 * GRID_ROW_SPACING));
    g.drawString("11", GRID_X_OFFSET - 16, 12 + GRID_Y_OFFSET + (3 * GRID_ROW_SPACING));


  }
}
