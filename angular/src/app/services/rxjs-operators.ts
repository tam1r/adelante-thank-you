import { tap } from 'rxjs/operators';

export const tapWhen = <T extends unknown>(
  condition: (data: T) => boolean,
  whenTrue: ((data: T) => void) | null = null,
  whenFalse: ((data: T) => void) | null = null
) => tap<T>(x => {
  if (condition(x)) {
    if (whenTrue) {
      whenTrue(x);
    }
  } else {
    if (whenFalse) {
      whenFalse(x);
    }
  }
});
