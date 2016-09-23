(ns poker)

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
    [n nil]))

(defn table [sb bb min-players max-players min-buyin max-buyin]
  "Returns a map representing a new poker table"
  {:small-blind sb,
   :big-blind bb,
   :max-players max-players,
   :players [],
   :dealer 0,
   :min-buyin min-buyin,
   :max-buyin max-buyin,
   :players-to-remove []
   :players-to-add []
   :turn-bet {}
   :game-winners []
   :game-losers []})
