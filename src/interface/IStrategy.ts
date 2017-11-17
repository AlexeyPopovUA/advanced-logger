export default interface IStrategy {
    onAdd(): void;

    onClear(): void;

    sendAll(): void;
}
