package Uno;

import java.util.*;

public class Spieler {
    String name;
    int nummer;
    public int ziehZaehler = 0;
    public int ablegenZaehler = 0;
    ArrayList<Karten> hand;
    public static ArrayList<Spieler> alleSpieler = new ArrayList<>();
    public Spieler aktuellSpieler = alleSpieler.getFirst();


    public Spieler(String name, int nummer) {
        this.name = name;
        this.nummer = nummer;
        this.hand = new ArrayList<>();
    }

    public static void austeilen(ArrayList<Karten> deck, int anzahl, int spieleranzahl) {
        for (int j = 0; j < spieleranzahl; j++) {
            for (int i = 0; i < anzahl; i++) {
                alleSpieler.get(j).hand.add(deck.removeFirst());
            }
        }
    }

    public static void erstelleSpieler(String name, int nummer) {
        if ((!alleSpieler.contains(name)) && (!alleSpieler.contains(nummer))) {
            alleSpieler.add(new Spieler(name, nummer));
        }
    }

    public void ablegen(Karten karte) {
        int index = aktuellSpieler.hand.indexOf(karte);
        if (index != -1) {
            Client.ablage.add(aktuellSpieler.hand.remove(index)); // Jetzt wird remove(int index) aufgerufen
        }
        ablegenZaehler++;
    }

    public void ziehen() {
        aktuellSpieler.hand.add(Client.deck.removeFirst());
        ziehZaehler++;

    }

    public void TurnOver() {
        if (ablegenZaehler == 1 || ziehZaehler == 1) {
            if (Client.richtung) {
                Vorwaerts();
            } else {
                Rueckwaerts();
            }
        }
        ablegenZaehler = 0;
        ziehZaehler = 0;
    }

    public void Vorwaerts() {
        if (Client.spielerCounter == alleSpieler.size() - 1) {
            Client.spielerCounter = 0;
        } else {
            Client.spielerCounter++;
        }
        aktuellSpieler = alleSpieler.get(Client.spielerCounter);
    }


    public void Rueckwaerts() {
        if (Client.spielerCounter == 0) {
            Client.spielerCounter = alleSpieler.size() - 1; // flexibler als "3"
        } else {
            Client.spielerCounter--;
        }
        aktuellSpieler = alleSpieler.get(Client.spielerCounter); // ✔ jetzt korrekt
    }

    public void HandPrinter() {
        System.out.println(aktuellSpieler.name + " hat folgende Karten: ");
        for (Karten karte : aktuellSpieler.hand) {
            System.out.println(karte);
        }
    }
    public boolean checkValidCard() {

    }

    //denke an removeSpieler Methode
}
