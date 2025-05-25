package Uno;

import java.util.*;

public class Client {
    public static ArrayList<Karten> ablage = new ArrayList<>();
    public static ArrayList<Karten> deck = new ArrayList<>();
    public static int spielerCounter = 0;
    public static boolean richtung = true;
    //bei Richtungswechselkarte muss es switchen
    public static void main(String[] args) {
        String[] farbe = {"Blau", "Gelb", "Rot", "Grün"};
        String[] werte = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "+2", "Aussetzen", "Richtungswechsel"};
        for (int i = 0; i < 4; i++) {
            for (int j = 0; j < 12; j++) {
                deck.add(new Karten(werte[j], farbe[i]));
                deck.add(new Karten(werte[j], farbe[i]));
            }
        }
        for (int i = 0; i < 4; i++) {
            deck.add(new Karten("+4", null));
            deck.add(new Karten("Farbwechsel", null));
        }
        for (int i = 0; i < 4; i++) {
            deck.add(new Karten("0", farbe[i]));
        }
        //1. Erstellung aller Spieler die teilnehmen:
        Spieler.erstelleSpieler("Fabio", 1);
        Spieler.erstelleSpieler("Jansen", 2);
        Spieler.erstelleSpieler("Karl-Heinz", 3);
        Spieler.erstelleSpieler("Tim", 4);
        //2. Kartenausteilen
        Spieler.austeilen(deck, 7, 4);


    }

}
