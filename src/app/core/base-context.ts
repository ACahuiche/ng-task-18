export class BaseContext {
  getContext(error?: Error): { className: string } {

    const err = error || new Error();
    const stackTrace = err.stack?.split('\n') || [];

    const className = stackTrace[1].trim() || 'unknown';

    return { className };
  }
}