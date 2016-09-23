(ns poker)

(def cards [
            "AS"
            "KS"
            "QS"
            "JS"
            "TS"
            "9S"
            "8S"
            "7S"
            "6S"
            "5S"
            "4S"
            "3S"
            "2S"
            "AH"
            "KH"
            "QH"
            "JH"
            "TH"
            "9H"
            "8H"
            "7H"
            "6H"
            "5H"
            "4H"
            "3H"
            "2H"
            "AD"
            "KD"
            "QD"
            "JD"
            "TD"
            "9D"
            "8D"
            "7D"
            "6D"
            "5D"
            "4D"
            "3D"
            "2D"
            "AC"
            "KC"
            "QC"
            "JC"
            "TC"
            "9C"
            "8C"
            "7C"
            "6C"
            "5C"
            "4C"
            "3C"
            "2C"
            ])

(defn validate-min-players [n]
  (if (< n 2)
    [nil "Parameter min-players must be a positive integer of a minimum value of 2"]
    [n nil]))

(defn validate-max-players [n]
  (if (> n 10)
    [nil "Parameter max-players must be a positive integer less than or equal to 10"]
    [n nil]))

(defn validate-min-max-players [min max]
  (if (> min max)
    [nil "Parameter min-players must be a positive integer less than or equal to max-players"]
    [[min max] nil]))

(defn table [sb bb min-players max-players min-buyin max-buyin]
  "Returns a map representing a new poker table"
  {:small-blind sb,
   :big-blind bb,
   :max-players max-players,
   :players [],
   :current-player {},
   :dealer {},
   :min-buyin min-buyin,
   :max-buyin max-buyin,
   :players-to-remove [],
   :players-to-add [],
   :turn-bet {},
   :game {},
   :game-winners [],
   :game-losers []})

(defn player [name chips]
  "Returns a map representing a player"
  {:name name,
   :chips chips,
   :folded false,
   :all-in false,
   :talked false,
   :cards [],
   :last-bet nil})

(defn player-to-talk? [player table]
  (and (not (player :folded)) (or (not (player :talked))
                                  (not= (player :last-bet) (max ((table :game) :bets))))
       (not (player :all-in))))

(defn set-current-player [table]
  (last (filter player-to-talk? (table :players))))

(defn end-of-round? [table]
  (some player-to-talk? (table :players)))

(defn all-in-players [table]
  (filter #(% :all-in) (table :players)))

(defn bankrupt-players [table]
  (filter #(= (% :chips) 0) (table :players)))
