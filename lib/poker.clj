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

(defn validate-min-players [table]
  (if (< (table :min-players) 2)
    [nil "Parameter min-players must be a positive integer of a minimum value of 2"]
    [table nil]))

(defn validate-max-players [table]
  (if (> (table :max-players) 10)
    [nil "Parameter max-players must be a positive integer less than or equal to 10"]
    [table nil]))

(defn validate-min-max-players [table]
  (if (> (table :min-players) (table :max-players))
    [nil "Parameter min-players must be a positive integer less than or equal to max-players"]
    [table nil]))

(defn bind-error [f [val err]]
  (if (nil? err)
    (f val)
    [nil err]))

(defmacro err->> [val & fns]
  (let [fns (for [f fns] `(bind-error ~f))]
    `(->> [~val nil]
          ~@fns)))

(defn validate [table]
  (err->> table
          validate-min-players
          validate-max-players
          validate-min-max-players))

(defn table
  "Returns a map representing a new poker table"
  [sb bb min-players max-players min-buyin max-buyin]
  (let [t {:small-blind sb,
           :big-blind bb,
           :min-players min-players,
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
           :game-losers []}

        ]
    (validate t)))

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

(defn rank-hands [hands]
  "Return a vector of sorted poker hands, index 0 contains winner(s)")
