import { PredictionCard } from '../components/common/PredictionModal';

// ── Tipos exportados ──────────────────────────────────────────────────────────
export interface PredictionResult {
  card:      PredictionCard;
  score:     number;
  hit:       boolean;   // ¿acertó la predicción?
  bonus:     number;    // puntos extra por acertar
  finalScore: number;  // score + bonus
}

// ── Constantes ────────────────────────────────────────────────────────────────
const ZERO_BONUS = 40;

// ── Función principal ─────────────────────────────────────────────────────────
/**
 * Evalúa si la predicción del jugador fue correcta y calcula el puntaje final.
 *
 * @param card   - Tarjeta elegida por el jugador
 * @param score  - Puntaje real obtenido al final de la ronda
 * @returns      - Objeto con resultado, bonus y puntaje final
 */
export function evaluatePrediction(
  card: PredictionCard,
  score: number
): PredictionResult {
  let hit = false;

  switch (card) {
    case 'ZERO':
      hit = score === 0;
      break;
    case 'MIN':
      hit = score > 0 && score < 7;
      break;
    case 'MORE':
      hit = score >= 7 && score <= 10;
      break;
    case 'MAX':
      hit = score > 10;
      break;
  }

  // Bonus:
  // - ZERO acertado → 40 puntos fijos
  // - Cualquier otro acertado → doble del puntaje
  let bonus = 0;
  if (hit) {
    if (card === 'ZERO') {
      bonus = ZERO_BONUS;
    } else {
      bonus = score; // doble = score + score (el score original ya se suma)
    }
  }

  return {
    card,
    score,
    hit,
    bonus,
    finalScore: score + bonus,
  };
}

// ── Utilidad: texto descriptivo del resultado ─────────────────────────────────
export function predictionResultMessage(result: PredictionResult): string {
  if (!result.hit) {
    return `❌ Predicción fallida. Puntaje: ${result.score} pts.`;
  }

  if (result.card === 'ZERO') {
    return `✅ ¡ZERO acertado! +${result.bonus} puntos de bonus. Total: ${result.finalScore} pts.`;
  }

  return `✅ ¡Predicción acertada! Puntaje duplicado: ${result.finalScore} pts.`;
}

// ── Utilidad: label legible de la carta ───────────────────────────────────────
export function cardLabel(card: PredictionCard): string {
  switch (card) {
    case 'ZERO': return 'ZERO (exactamente 0)';
    case 'MIN':  return 'MIN (entre 1 y 6)';
    case 'MORE': return 'MORE (entre 7 y 10)';
    case 'MAX':  return 'MAX (más de 10)';
  }
}