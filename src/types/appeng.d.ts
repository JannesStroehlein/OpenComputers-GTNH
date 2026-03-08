/**
 * Applied Energistics 2 (AE2) OpenComputers component type declarations.
 *
 * Components exposed via the OC–AE2 integration:
 *   - me_controller    (DriverController)
 *   - me_interface     (DriverBlockInterface / DriverPartInterface)
 *   - me_exportbus     (DriverExportBus)
 *   - me_importbus     (DriverImportBus)
 *   - upgrade_me       (UpgradeAE — robot / drone wireless ME upgrade)
 *
 * @see https://github.com/GTNewHorizons/OpenComputers/tree/master/src/main/scala/li/cil/oc/integration/appeng
 */

// ---------------------------------------------------------------------------
// Shared item / fluid stack descriptors
// ---------------------------------------------------------------------------

/** An item stack as returned by the AE2 network storage queries. */
export interface MeItemStack {
    /** Unlocalized registry name, e.g. "minecraft:iron_ingot". */
    name: string;
    /** Human-readable display name. */
    label: string;
    /** Numeric item ID (legacy). */
    id: number;
    /** Item damage / metadata value. */
    damage: number;
    /** Maximum damage the item can have. */
    maxDamage: number;
    /** Maximum stack size. */
    maxSize: number;
    /** Whether the item has an NBT tag. */
    hasTag: boolean;
    /** Number of items stored in the network for this stack entry. */
    size: number;
    /** Whether this item can be crafted via an AE2 pattern. */
    isCraftable: boolean;
}

/** A fluid stack as returned by the AE2 network fluid queries. */
export interface MeFluidStack {
    /** Unlocalized fluid name, e.g. "water". */
    name: string;
    /** Human-readable display name. */
    label: string;
    /** Amount of fluid stored in the network (in mB). */
    amount: number;
    /** Whether this fluid can be crafted via an AE2 pattern. */
    isCraftable: boolean;
}

/** Filter table accepted by item-query methods. All fields are optional. */
export type MeItemFilter = Partial<Pick<MeItemStack, "name" | "label" | "id" | "damage" | "size" | "isCraftable">>;

// ---------------------------------------------------------------------------
// Crafting userdata objects
// ---------------------------------------------------------------------------

/**
 * Tracks the state of a crafting request submitted via `Craftable.request()`.
 * Returned by `MeCraftable.request()`.
 */
export interface MeCraftingStatus {
    /** Returns true while the crafting calculation is still running. */
    isComputing(): boolean;
    /**
     * Returns whether the request failed.
     * Second return value is the failure reason string.
     */
    hasFailed(): LuaMultiReturn<[boolean, string]>;
    /**
     * Returns whether the request was canceled.
     * May also return a status string as second value when still computing.
     */
    isCanceled(): LuaMultiReturn<[boolean] | [boolean, string]>;
    /**
     * Returns whether the crafting job is done.
     * May also return a reason string as second value on failure/computing.
     */
    isDone(): LuaMultiReturn<[boolean] | [boolean, string]>;
}

/**
 * Represents a craftable item pattern in the AE2 network.
 * Returned as entries in the `getCraftables()` list.
 */
export interface MeCraftable {
    /** Returns the item stack that this pattern produces. */
    getItemStack(): MeItemStack;
    /**
     * Request the item to be crafted.
     * @param amount Number of items to craft (default 1).
     * @param prioritizePower Whether to prioritize power (default true).
     * @param cpuName Name of the crafting CPU to use (default any).
     * @returns A CraftingStatus object for tracking the job.
     */
    request(amount?: number, prioritizePower?: boolean, cpuName?: string): MeCraftingStatus;
}

/** Represents an individual AE2 crafting CPU cluster. */
export interface MeCraftingCpu {
    /**
     * Cancel the current crafting job on this CPU.
     * Returns false if the CPU is not busy.
     */
    cancel(): boolean;
    /** Returns true if this CPU is powered and online. */
    isActive(): boolean;
    /** Returns true if this CPU currently has an active crafting job. */
    isBusy(): boolean;
    /** Returns the list of items currently being crafted (in-progress). */
    activeItems(): MeItemStack[];
    /** Returns the list of items pending crafting (queued sub-jobs). */
    pendingItems(): MeItemStack[];
    /** Returns the list of items stored inside this CPU cluster. */
    storedItems(): MeItemStack[];
    /**
     * Returns the final output item of the crafting job, or null if unavailable.
     * Second return value is an error string when null.
     */
    finalOutput(): LuaMultiReturn<[MeItemStack | null] | [null, string]>;
}

/** Info table for a crafting CPU, as returned by `getCpus()`. */
export interface MeCraftingCpuInfo {
    /** CPU name (empty string if unnamed). */
    name: string;
    /** Available crafting storage in bytes. */
    storage: number;
    /** Number of co-processors in this CPU cluster. */
    coprocessors: number;
    /** Whether the CPU is currently running a job. */
    busy: boolean;
    /** Userdata handle for interacting with this CPU. */
    cpu: MeCraftingCpu;
}

/**
 * Lazy iterator object returned by `allItems()`.
 * Call it like a function repeatedly; returns `null` when exhausted.
 *
 * @example
 * ```ts
 * const iter = controller.allItems();
 * let item: MeItemStack | null;
 * while ((item = iter()) !== null) { ... }
 * ```
 */
export type MeNetworkContents = () => MeItemStack | null;

// ---------------------------------------------------------------------------
// Shared NetworkControl mixin (me_controller, me_interface, upgrade_me)
// ---------------------------------------------------------------------------

/**
 * Methods available on any component that mixes in the `NetworkControl` trait:
 * `me_controller`, `me_interface`, and `upgrade_me`.
 */
export interface MeNetworkControl {
    /** Returns a list of all crafting CPUs in the network. */
    getCpus(): MeCraftingCpuInfo[];

    /**
     * Returns a list of craftable item patterns, optionally filtered.
     * @param filter Optional filter table to narrow results.
     */
    getCraftables(filter?: MeItemFilter): MeCraftable[];

    /**
     * Returns all items stored in the network, optionally filtered.
     * @param filter Optional filter table to narrow results.
     */
    getItemsInNetwork(filter?: MeItemFilter): MeItemStack[];

    /**
     * Returns items in the network matching any of the given item IDs.
     * @param filter Array of item IDs (numbers or unlocalized name strings).
     */
    getItemsInNetworkById(filter: Array<number | string>): MeItemStack[];

    /**
     * Returns the stored item matching the given unlocalized name, or null.
     * @param name Unlocalized registry name, e.g. "minecraft:iron_ingot".
     * @param damage Optional item damage / metadata (default 0).
     * @param nbt Optional NBT data as a JSON string (default "{}").
     */
    getItemInNetwork(name: string, damage?: number, nbt?: string): MeItemStack | null;

    /**
     * Returns a lazy iterator over all items in the network.
     * More efficient than `getItemsInNetwork()` for large networks.
     */
    allItems(): MeNetworkContents;

    /**
     * Store items from the network matching the filter into the specified database.
     * @param filter Filter table describing the items to store.
     * @param dbAddress Address of the database component.
     * @param startSlot First database slot to write into (1-based, default 1).
     * @param count Maximum number of items to store (default unlimited).
     */
    store(filter: MeItemFilter, dbAddress: string, startSlot?: number, count?: number): boolean;

    /** Returns all fluids currently stored in the network. */
    getFluidsInNetwork(): MeFluidStack[];

    /** Returns the average power injection rate into the network (AE/t). */
    getAvgPowerInjection(): number;

    /** Returns the average power consumption of the network (AE/t). */
    getAvgPowerUsage(): number;

    /** Returns the idle power draw of the network (AE/t). */
    getIdlePowerUsage(): number;

    /** Returns the maximum power the network can store (AE). */
    getMaxStoredPower(): number;

    /** Returns the amount of power currently stored in the network (AE). */
    getStoredPower(): number;
}

// ---------------------------------------------------------------------------
// Component: me_controller
// ---------------------------------------------------------------------------

/**
 * The AE2 ME Controller component (`me_controller`).
 * Provides full `NetworkControl` access to the AE2 network.
 */
export interface MeController extends MeNetworkControl, IComponent { }

// ---------------------------------------------------------------------------
// Component: me_interface
// ---------------------------------------------------------------------------

/**
 * The AE2 ME Interface block component (`me_interface`).
 * Provides `NetworkControl` plus pattern/configuration management.
 */
export interface MeInterface extends MeNetworkControl, IComponent {
    /**
     * Returns the item stack currently configured in the given interface slot.
     * @param slot Slot index (0-based, default 0).
     */
    getInterfaceConfiguration(slot?: number): MeItemStack | null;

    /**
     * Configure an interface slot.
     * When no database arguments are given, clears the slot.
     * @param slot Slot index (0-based, default 0).
     * @param dbAddress Address of the database component.
     * @param entry Database entry index (1-based).
     * @param size Stack size to request (default 1).
     */
    setInterfaceConfiguration(slot?: number, dbAddress?: string, entry?: number, size?: number): boolean;

    /**
     * Returns the pattern item stack in the given pattern slot, or null.
     * @param slot Slot index (0-based, default 0).
     */
    getInterfacePattern(slot?: number): MeItemStack | null;

    /**
     * Set the input item at the given index within a pattern slot.
     * @param slot Pattern slot index (0-based).
     * @param dbAddress Address of the database component.
     * @param entry Database entry index (1-based).
     * @param size Stack size.
     * @param index Input ingredient index (1-based).
     */
    setInterfacePatternInput(slot: number, dbAddress: string, entry: number, size: number, index: number): boolean;

    /**
     * Set the output item at the given index within a pattern slot.
     * @param slot Pattern slot index (0-based).
     * @param dbAddress Address of the database component.
     * @param entry Database entry index (1-based).
     * @param size Stack size.
     * @param index Output index (1-based).
     */
    setInterfacePatternOutput(slot: number, dbAddress: string, entry: number, size: number, index: number): boolean;

    /**
     * Copy the input item at the given index of a pattern into a database slot.
     * @param slot Pattern slot index (0-based).
     * @param index Ingredient index within the pattern (1-based).
     * @param dbAddress Address of the database component.
     * @param entry Database entry index to write to (1-based, default 1).
     */
    storeInterfacePatternInput(slot: number, index: number, dbAddress: string, entry?: number): boolean;

    /**
     * Copy the output item at the given index of a pattern into a database slot.
     * @param slot Pattern slot index (0-based).
     * @param index Output index within the pattern (1-based).
     * @param dbAddress Address of the database component.
     * @param entry Database entry index to write to (1-based, default 1).
     */
    storeInterfacePatternOutput(slot: number, index: number, dbAddress: string, entry?: number): boolean;

    /**
     * Clear the input item at the given index within a pattern slot.
     * @param slot Pattern slot index (0-based).
     * @param index Ingredient index within the pattern (1-based).
     */
    clearInterfacePatternInput(slot: number, index: number): boolean;

    /**
     * Clear the output item at the given index within a pattern slot.
     * @param slot Pattern slot index (0-based).
     * @param index Output index within the pattern (1-based).
     */
    clearInterfacePatternOutput(slot: number, index: number): boolean;
}

// ---------------------------------------------------------------------------
// Component: me_exportbus
// ---------------------------------------------------------------------------

/**
 * The AE2 ME Export Bus component (`me_exportbus`).
 * Reads/writes export filter configuration and can trigger single export operations.
 */
export interface MeExportBus extends IComponent {
    /**
     * Returns the item stack configured in the given slot of the export bus
     * on the specified side, or null if unconfigured.
     * @param side Forge direction number (0–5).
     * @param slot Config slot index (0-based, default 0).
     */
    getExportConfiguration(side: number, slot?: number): MeItemStack | null;

    /**
     * Configure an export bus filter slot on the given side.
     * When no database arguments are given, clears the slot.
     * @param side Forge direction number (0–5).
     * @param slot Config slot index (0-based, default 0).
     * @param dbAddress Address of the database component.
     * @param entry Database entry index (1-based).
     */
    setExportConfiguration(side: number, slot?: number, dbAddress?: string, entry?: number): boolean;

    /**
     * Trigger a single export operation from the export bus on the given side
     * into the specified inventory slot.
     * @param side Forge direction number (0–5).
     * @param slot Destination inventory slot index (0-based).
     * @returns True if at least one item was exported.
     */
    exportIntoSlot(side: number, slot: number): boolean;
}

// ---------------------------------------------------------------------------
// Component: me_importbus
// ---------------------------------------------------------------------------

/**
 * The AE2 ME Import Bus component (`me_importbus`).
 * Reads/writes import filter configuration.
 */
export interface MeImportBus extends IComponent {
    /**
     * Returns the item stack configured in the given slot of the import bus
     * on the specified side, or null if unconfigured.
     * @param side Forge direction number (0–5).
     * @param slot Config slot index (0-based, default 0).
     */
    getImportConfiguration(side: number, slot?: number): MeItemStack | null;

    /**
     * Configure an import bus filter slot on the given side.
     * When no database arguments are given, clears the slot.
     * @param side Forge direction number (0–5).
     * @param slot Config slot index (0-based, default 0).
     * @param dbAddress Address of the database component.
     * @param entry Database entry index (1-based).
     */
    setImportConfiguration(side: number, slot?: number, dbAddress?: string, entry?: number): boolean;
}

// ---------------------------------------------------------------------------
// Component: upgrade_me (robot / drone wireless ME upgrade card)
// ---------------------------------------------------------------------------

/**
 * The AE2 Wireless ME Upgrade card component (`upgrade_me`).
 * Gives a robot or drone wireless access to an AE2 network.
 * Inherits all `NetworkControl` methods plus robot-specific item/fluid transfer.
 */
export interface MeUpgrade extends MeNetworkControl, IComponent {
    /**
     * Transfer items from the robot's selected inventory slot into the ME network.
     * @param amount Maximum number of items to send (default 64).
     * @returns The number of items actually sent.
     */
    sendItems(amount?: number): number;

    /**
     * Retrieve items from the ME network into the robot's selected inventory slot.
     * The item to retrieve is specified by a database entry.
     * @param dbAddress Address of the database component describing the item.
     * @param entry Database entry index (1-based).
     * @param amount Maximum number of items to request (default 64).
     * @returns The number of items actually received.
     */
    requestItems(dbAddress: string, entry: number, amount?: number): number;

    /**
     * Transfer fluid from the robot's selected tank into the ME network.
     * @param amount Maximum amount of fluid to send in mB (default tank capacity).
     * @returns The amount of fluid actually sent in mB.
     */
    sendFluids(amount?: number): number;

    /**
     * Retrieve fluid from the ME network into the robot's selected tank.
     * The fluid to retrieve is specified by a database entry (filled fluid container).
     * @param dbAddress Address of the database component describing the fluid.
     * @param entry Database entry index (1-based).
     * @param amount Maximum amount in mB to request (default 1000 mB).
     * @returns The amount of fluid actually received in mB.
     */
    requestFluids(dbAddress: string, entry: number, amount?: number): number;

    /**
     * Returns true if the upgrade card is currently linked to an AE2 network.
     */
    isLinked(): boolean;
}
