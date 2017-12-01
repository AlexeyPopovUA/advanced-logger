export default interface IDestructable {
    /**
     * Clean all timeouts, intervals and links to other objects in this method
     */
    destroy(): void;
}
