export const wait = (delay: number) => new Promise<void>(res => setTimeout(() => res(), delay));
