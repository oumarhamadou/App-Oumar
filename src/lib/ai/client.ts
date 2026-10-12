import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-opus-5-5";
/** Server-side refusal fallback: routes a declined request to Anthropic's recommended model. */
export const FALLBACK_BETA = "server-side-fallback-2026-07-01";

let client: Anthropic | null = null;

export function hasAnthropicCredentials(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

export function getAnthropic(): Anthropic | null {
  if (!hasAnthropicCredentials()) return null;
  client ??= new Anthropic({ maxRetries: 2 });
  return client;
}

/** User-facing (French) message for an API failure. */
export function describeApiError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) return "La clé API configurée est invalide.";
  if (error instanceof Anthropic.PermissionDeniedError) return "La clé API n'a pas accès à ce modèle.";
  if (error instanceof Anthropic.RateLimitError) return "Trop de demandes en ce moment. Réessayez dans quelques instants.";
  if (error instanceof Anthropic.BadRequestError) return "La demande n'a pas pu être traitée.";
  if (error instanceof Anthropic.APIConnectionError) return "Impossible de joindre le service d'IA. Vérifiez la connexion réseau du serveur.";
  if (error instanceof Anthropic.APIError) return `Le service d'IA a renvoyé une erreur (${error.status ?? "inconnue"}).`;
  if (error instanceof Error && error.name === "AbortError") return "Demande annulée.";
  return "Une erreur inattendue est survenue.";
}
