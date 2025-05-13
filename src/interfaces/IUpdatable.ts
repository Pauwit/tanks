
export interface IUpdatable {
    /**
     * Updates the object
     * @param deltaTime
     * @return Whenever the object survives or not
     */
    update(deltaTime: number): boolean;
}