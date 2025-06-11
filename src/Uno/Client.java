package Uno;

import java.util.*;

public class Client {
    public static ArrayList<Karten> ablage = new ArrayList<>();
    public static ArrayList<Karten> deck = new ArrayList<>();
    public static int spielerCounter = 0;
    public static boolean richtung = true;
    //bei Richtungswechselkarte muss es switchen
    public static void main(String[] args) {

        initializeDeck();

//        for (int i = 0; i < 4; i++) {
//            for (int j = 0; j < 12; j++) {
//                deck.add(new Karten(werte[j], farbe[i]));
//                deck.add(new Karten(werte[j], farbe[i]));
//            }
//        }
//        for (int i = 0; i < 4; i++) {
//            deck.add(new Karten("+4", null));
//            deck.add(new Karten("Farbwechsel", null));
//        }
//        for (int i = 0; i < 4; i++) {
//            deck.add(new Karten("0", farbe[i]));
//        }
        Collections.shuffle(deck);
        //1. Erstellung aller Spieler die teilnehmen:
        Spieler.erstelleSpieler("Fabio", 1);
        Spieler.erstelleSpieler("Jansen", 2);
        Spieler.erstelleSpieler("Karl-Heinz", 3);
        Spieler.erstelleSpieler("Tim", 4);
        //2. Kartenausteilen
        Spieler.austeilen(deck, 7);
        Spieler.HandPrinter();


    }

    private static void initializeDeck() {
        String[] farbe = {"Blau", "Gelb", "Rot", "Grün"};
        String[] werte = {"1", "2", "3", "4", "5", "6", "7", "8", "9", "+2", "Aussetzen", "Richtungswechsel"};
        String[] wildCards = {"+4", "Farbwechsel"};

        // here I extracted your for loop to be more readable and extensible, if you want to add a color or number or whatever you don't need to refactor this part.
        for (String color : farbe) {
            for (String value : werte) {
                deck.add(new Karten(value, color));
            }
        }

        // Add zero cards (1 per color)
        for (String color : farbe) {
            deck.add(new Karten("0", color));
        }

        // Add special wild cards (4 of each type)
        for (String wildCard : wildCards) {
            for (int i = 0; i < 4; i++) {
                deck.add(new Karten(wildCard, null));
            }
        }

    }

}
