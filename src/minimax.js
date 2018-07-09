/*
 * MINIMAX.JS
 *
 * This is the only file you need
 * to modify to pass the tests.
 *
 * Note that you should read
 * the pre-written functions.
 *
 * Contents:
 * 1. minimaxWrapper:   Pre-written
 * 2. heuristic:        Pre-written
 * 3. baseCase:         Must complete
 * 4. minimax:          Must complete
 * 5. minimaxAlphaBeta: Must complete
 */

/*
 * minimaxWrapper
 *
 * This is the only function called when
 * playing against your algorithm.
 *
 * To switch from playing against the
 * 'minimax' to 'minimaxAlphaBeta'
 * algorithm, swap the function
 * called below.
 */
const DEPTH = 3
const minimaxWrapper = (state, maximizingPlayer) =>
  minimaxAlphaBeta(state, DEPTH, maximizingPlayer)

/*
 * heuristic
 *
 * The 'heuristic' function returns a number
 * evaluating how good a state is, from the
 * perspective of the maximizing player.
 * You will need to invoke it in minimax.
 * Spend a little time trying to understand
 * it.
 *
 * Input:
 *  state: Object representing state.
 *  maximizingPlayer: 'x' or 'o'.
 * Output:
 *  Number evaluating how good state is,
 *  from perspective of maximizing
 *  player. Positive, if to the advantage
 *  of the maximizing player; negative,
 *  if to their disadvantage.
 */
const heuristic = (state, maximizingPlayer) => {
  //This is how you can retrieve the minimizing player.
  const minimizingPlayer = maximizingPlayer == 'x' ? 'o' : 'x'

  // state.numLines(number, player) gives you the number
  // of lines of length "number" for that player.
  //
  // So for instance, for a state like this
  // _ _ _ _ _ _ _
  // _ _ _ _ _ _ _
  // _ _ _ _ x _ o
  // _ _ _ x o _ x
  // _ _ o x o _ x
  //
  // state.numLines(2,'o') would return 1
  // state.numLines(2,'x') would return 3
  //
  // The following function, sums up the number of lines
  // of lengths 2, 3, and 4, weighted very strongly according
  // to their length.
  const advantageFunction = player =>
    [2, 3, 4].reduce(
      (total, numLines) =>
        total + state.numLines(numLines, player) * Math.pow(100, numLines),
      0
    )

  // Then for the heuristic, we just return the advantage
  // of the maximizing player, less the advantage of the
  // minimizing player.
  return (
    advantageFunction(maximizingPlayer) - advantageFunction(minimizingPlayer)
  )
}

/*
 * isBaseCase
 *
 * Should return true if we should no
 * longer recurse through minimax. So
 * if you have reached a depth of zero or
 * there are no possible successor states,
 * it should return true.
 *
 * ANY INFORMATION YOU NEED from
 * the "state" object is already pulled
 * from it.
 *
 */
const isBaseCase = (state, depth) => {
  const possibleSuccessorStates = state.nextStates()
  const numberPossibleSuccessorStates = possibleSuccessorStates.length
  return numberPossibleSuccessorStates === 0 || depth === 0
}

/*
 * minimax
 *
 * Input:
 *   state: Object representing state
 *   depth: How much deeper one should recurse
 *   maximizingPlayer: 'x' or 'o'
 * Output:
 *   Number evaluating state, just like
 *   heuristic does.
 */
const minimax = (state, depth, maximizingPlayer) => {
  if (isBaseCase(state, depth)) {
    // Invoke heuristic
    return heuristic(state, maximizingPlayer)
  } else {
    // Possible states is an array of future states, of
    // the same kind that gets passed into the "state"
    // paramter in minimax.
    //
    // ANY INFORMATION YOU NEED from
    // the "state" object is already
    // pulled from it.
    const possibleStates = state.nextStates()
    const minimizingPlayer = maximizingPlayer === 'x' ? 'o' : 'x'
    const currentPlayer = state.nextMovePlayer
    // Reduce to further
    // invocations of minimax.
    // map over the possible states and recursively call
    // minimax with each state at  a lower depth
    const nextValues = possibleStates.map(s =>
      minimax(s, depth - 1, maximizingPlayer))

    // maximize for max player and minimize for min player
    if (currentPlayer === maximizingPlayer) {
      return Math.max.apply(null, nextValues)
    } else {
      return Math.min.apply(null, nextValues)
    }
  }
}

/*
 * minimaxAlphaBeta
 *
 * Input and output are same as for minimax.
 */
const minimaxAlphaBeta = (state, depth, maximizingPlayer) => {
  const minimaxAlphaBetaInner = (state, depth, alpha, beta) => {
    if (isBaseCase(state, depth)) {
      // Invoke heuristic
      return heuristic(state, maximizingPlayer)
    } else {
      const possibleStates = state.nextStates()
      const minimizingPlayer = maximizingPlayer === 'x' ? 'o' : 'x'
      const currentPlayer = state.nextMovePlayer
      if (currentPlayer === maximizingPlayer) {
        let currentBest = alpha
        for (let x = 0; x < possibleStates.length; x++) {
          const futureState = possibleStates[x]
          const value = minimaxAlphaBetaInner(
            futureState,
            depth - 1,
            alpha,
            beta
          )
          currentBest = Math.max(value, currentBest)
          alpha = Math.max(value, alpha)
          if (alpha > beta) {
            return currentBest
          }
        }
        return currentBest
      } else {
        let currentBest = beta
        for (let x = 0; x < possibleStates.length; x++) {
          const futureState = possibleStates[x]
          const value = minimaxAlphaBetaInner(
            futureState,
            depth - 1,
            alpha,
            beta
          )
          currentBest = Math.min(value, currentBest)
          beta = Math.min(value, beta)
          if (alpha > beta) {
            return currentBest
          }
        }
        return currentBest
      }
    }
  }

  return minimaxAlphaBetaInner(state, depth, -1000000000, 1000000000)
}

module.exports = {
  minimaxWrapper,
  minimax,
  minimaxAlphaBeta,
  isBaseCase,
  heuristic,
}
