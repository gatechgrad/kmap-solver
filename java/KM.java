import java.awt.*;
import java.applet.*;


public class KM extends Applet {


  public void init() {
    KMap km = new KMap();
    this.add(km);

  }

  public static void main(String args[]) {
    Frame theFrame = new Frame();
    KMap km = new KMap();
    theFrame.add(km);
    theFrame.pack();
    theFrame.show();
    
  }

}
