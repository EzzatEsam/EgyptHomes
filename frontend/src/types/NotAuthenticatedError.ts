export class NotAuthenticatedError extends Error {
  public constructor() {
    super("Not authenticated");
  }
}
