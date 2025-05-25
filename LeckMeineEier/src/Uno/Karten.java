package Uno;

public class Karten {
    String wert;
    String farbe;

    public Karten(String wert, String farbe){
        this.wert = wert;
        this.farbe = farbe;
    }
    @Override
    public String toString(){
        return farbe + " - "+ wert;
    }
}
