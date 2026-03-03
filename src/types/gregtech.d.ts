export interface GtMachine extends IComponent {
  /**
   * Returns the machine's name
   */
  getName(): string;
}

export interface LapotronicSupercapacitor extends GtMachine {
  slot: -1;

  /**
   * Returns the machine's name
   */
  getName(): string;

  /**
   * Gets the maximum Input in EU/p
   */
  getInputVoltage(): number;
  /**
   * Returns the amount of electricity contained in this Block, in EU units! (As a string for HUGE amounts.)
   */
  getStoredEUString(): string;

  /**
   *  Returns machine coordinates
   */
  getCoordinates(): { x: number; y: number; z: number };

  /**
   * Returns the max EU that can be stored in this block
   */
  getEUMaxStored(): number;

  /**
   * Returns the amount of electricity containable in this Block, in EU units!
   */
  getEUCapacity(): number;

  /**
   * Returns the amount of Steam containable in this Block, in EU units!
   */
  getSteamCapacity(): number;

  /**
   *  Gets the Output in EU/p.
   */
  getOutputVoltage(): number;

  /**
   * Returns sensor information about this block
   */
  getSensorInformation(): Record<string, any>;

  /**
   * Returns the amount of Steam contained in this Block, in EU units!
   */
  getStoredSteam(): number;

  /**
   * Returns the average EU output of this block
   */
  getEUOutputAverage(): number;

  /**
   * Returns the name of this block's owner
   */
  getOwnerName(): string;

  /**
   * Returns the amount of electricity containable in this Block, in EU units! (As a string for HUGE amounts.)
   */
  getEUCapacityString(): string;

  /**
   * Returns the amount of Electricity, outputted by this Block the last 5 ticks as Average.
   */
  getAverageElectricOutput(): number;

  /**
   * Gets the amount of Energy Packets per tick.
   */
  getOutputAmperage(): number;

  /**
   * Returns whether the machine is currently active
   */
  isMachineActive(): boolean;

  /**
   * Returns the amount of Electricity, accepted by this Block the last 5 ticks as Average.
   */
  getAverageElectricInput(): number;

  /**
   * Returns the amount of electricity contained in this Block, in EU units!
   */
  getStoredEU(): number;

  /**
   * Returns the EU stored in this block
   */
  getEUStored(): number;

  /**
   * Returns the steam stored in this block
   */
  getSteamStored(): number;

  /**
   * Returns true if the machine currently has work to do
   */
  hasWork(): boolean;

  /**
   * Returns the max steam that can be stored in this block
   */
  getSteamMaxStored(): number;

  /**
   * Returns whether this block is currently allowed to work
   */
  isWorkAllowed(): boolean;

  /**
   * Returns the max progress of this block
   */
  getWorkMaxProgress(): number;

  /**
   * Sets whether this block is currently allowed to work
   */
  setWorkAllowed(work: boolean): void;

  /**
   * Returns the average EU input of this block
   */
  getEUInputAverage(): number;
}
