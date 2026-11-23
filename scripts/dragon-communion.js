/* -------------------------------------------- */
/*  Dragon Communion Background - Sanity System */
/* -------------------------------------------- */

/**
 * Dragon Communion Sanity Thresholds and Effects
 * This module provides automatic application of sanity-based benefits
 */

const DRAGON_COMMUNION = {
  id: "dragonCommunionBackground",
  sanityThresholds: [
    { threshold: 9, min: 8, max: 9, effect: "dragonTracking" },
    { threshold: 7, min: 6, max: 7, effect: "dragonSaves" },
    { threshold: 5, min: 4, max: 5, effect: "fireResistance" },
    { threshold: 3, min: 2, max: 3, effect: "spellDCBonus" },
    { threshold: 1, min: 1, max: 1, effect: "dragonDamageBonus" },
    { threshold: 0, min: 0, max: 0, effect: "magmaWyrmTransformation" }
  ],

  effects: {
    dragonTracking: {
      name: "Dragon Communion: Dragon Tracking",
      icon: "icons/skills/wilderness/tracking-footprints-webbed-green.webp",
      changes: [
        { key: "system.attributes.survival.check.mod", mode: 2, value: "advantage", predicate: ["action:track", "target:dragon"] },
        { key: "system.attributes.int.check.mod", mode: 2, value: "advantage", predicate: ["action:recall", "target:dragon"] }
      ],
      flags: { dnd5e: { dragonCommunion: { sanityThreshold: 8 } } }
    },

    dragonSaves: {
      name: "Dragon Communion: Dragon Save Advantage",
      icon: "icons/magic/defensive/shield-barrier-glow-teal.webp",
      changes: [
        { key: "system.attributes.save.mod", mode: 2, value: "advantage", predicate: ["source:dragon"] }
      ],
      flags: { dnd5e: { dragonCommunion: { sanityThreshold: 6 } } }
    },

    fireResistance: {
      name: "Dragon Communion: Fire Resistance",
      icon: "icons/magic/fire/flame-burning-resistance-red.webp",
      changes: [
        { key: "system.traits.dr.value", mode: 2, value: "fire", predicate: [] }
      ],
      flags: { dnd5e: { dragonCommunion: { sanityThreshold: 4 } } }
    },

    spellDCBonus: {
      name: "Dragon Communion: Incantation Potency",
      icon: "icons/magic/control/silence-gag-bound.webp",
      changes: [
        { key: "system.attributes.spelldc.bonus", mode: 2, value: 1, predicate: ["spell:dragonCommunion"] }
      ],
      flags: { dnd5e: { dragonCommunion: { sanityThreshold: 2 } } }
    },

    dragonDamageBonus: {
      name: "Dragon Communion: Dragon Slayer",
      icon: "icons/weapons/swords/sword-curved-heavy.webp",
      changes: [
        { key: "system.attributes.damage.bonus", mode: 2, value: "3d6", predicate: ["target:dragon"] }
      ],
      flags: { dnd5e: { dragonCommunion: { sanityThreshold: 1 } } }
    },

    magmaWyrmTransformation: {
      name: "Dragon Communion: Magma Wyrm Transformation",
      icon: "icons/creatures/reptiles/dragon-winged-fire.webp",
      changes: [
        { key: "system.attributes.npc", mode: 0, value: true, predicate: [] }
      ],
      flags: { dnd5e: { dragonCommunion: { sanityThreshold: 0, transformation: true } } },
      disabled: true // Requires DM intervention
    }
  }
};

/**
 * Initialize the Dragon Communion sanity system
 */
export function initDragonCommunion() {
  Hooks.on("init", () => {
    registerCustomSettings();
  });

  Hooks.on("ready", () => {
    setupSanityTracking();
  });

  Hooks.on("updateActor", (actor, diff) => {
    if (actor.type === "character") {
      checkSanityChanges(actor, diff);
    }
  });
}

/**
 * Register module settings
 */
function registerCustomSettings() {
  game.settings.register("dnd5e-dragon-communion-bg", "autoApplyEffects", {
    name: "Auto-apply Sanity Effects",
    hint: "Automatically apply Active Effects based on Sanity score changes",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      ui.notifications.info("Dragon Communion: Auto-apply effects setting changed. Reload to take effect.");
    }
  });

  game.settings.register("dnd5e-dragon-communion-bg", "sanityAttributeName", {
    name: "Sanity Attribute Name",
    hint: "The name of the attribute used to track Sanity",
    scope: "world",
    config: true,
    type: String,
    default: "sanity",
    choices: {
      sanity: "Sanity",
      corruption: "Corruption",
      dragonBlood: "Dragon Blood"
    }
  });
}

/**
 * Set up sanity tracking for characters with Dragon Communion background
 */
function setupSanityTracking() {
  // Find all characters with Dragon Communion background
  const characters = game.actors.filter(a => a.type === "character");

  characters.forEach(actor => {
    const background = actor.items.find(i => i.type === "background" && i.name === "Dragon Communion");
    if (background) {
      ensureSanityAttribute(actor);
      applySanityEffects(actor);
    }
  });
}

/**
 * Ensure the character has a Sanity attribute
 */
function ensureSanityAttribute(actor) {
  const sanityAttr = actor.system.attributes.find(a => a.id === "sanity");

  if (!sanityAttr) {
    // Add sanity as a custom attribute
    const updates = {
      "system.attributes": [
        ...actor.system.attributes,
        {
          id: "sanity",
          label: "Sanity",
          value: 10,
          max: 10,
          type: "resource"
        }
      ]
    };
    actor.update(updates);
  }
}

/**
 * Check for sanity changes and apply/remove effects
 */
async function checkSanityChanges(actor, diff) {
  const sanitySetting = game.settings.get("dnd5e-dragon-communion-bg", "autoApplyEffects");
  if (!sanitySetting) return;

  const oldSanity = foundry.utils.getProperty(diff, "system.attributes.sanity.value");
  const newSanity = actor.system.attributes.sanity?.value;

  if (oldSanity !== undefined && newSanity !== undefined && oldSanity !== newSanity) {
    await applySanityEffects(actor);
    notifySanityChange(actor, oldSanity, newSanity);
  }
}

/**
 * Apply sanity-based active effects to the actor
 */
async function applySanityEffects(actor) {
  const sanity = actor.system.attributes.sanity?.value ?? 10;
  const background = actor.items.find(i => i.type === "background" && i.name === "Dragon Communion");

  if (!background) return;

  // Remove existing dragon communion effects
  const existingEffects = actor.activeEffects.filter(e =>
    e.flags.dnd5e?.dragonCommunion?.sanityThreshold !== undefined
  );

  for (const effect of existingEffects) {
    await effect.delete();
  }

  // Apply new effects based on current sanity
  if (sanity < 10) {
    const applicableThresholds = DRAGON_COMMUNION.sanityThresholds.filter(t => sanity <= t.max && sanity >= t.min);

    for (const threshold of applicableThresholds) {
      const effectData = DRAGON_COMMUNION.effects[threshold.effect];
      if (effectData && !effectData.disabled) {
        await ActiveEffect.create({
          ...effectData,
          origin: background.uuid,
          duration: { seconds: -1 },
          disabled: false
        }, { parent: actor });
      }
    }
  }

  // Handle transformation at 0 sanity (requires DM confirmation)
  if (sanity <= 0) {
    const transformEffect = DRAGON_COMMUNION.effects.magmaWyrmTransformation;
    const existing = actor.activeEffects.find(e => e.name === transformEffect.name);

    if (!existing) {
      const confirm = await Dialog.confirm({
        title: "Dragon Communion: Magma Wyrm Transformation",
        content: `<p>${actor.name} has reached 0 Sanity!</p><p>The dragon blood consumes them, transforming them into a <strong>Magma Wyrm</strong>.</p><p>This will make the character an NPC under DM control. Continue?</p>`,
        yes: () => true,
        no: () => false,
        defaultYes: false
      });

      if (confirm) {
        await ActiveEffect.create({
          ...transformEffect,
          origin: background.uuid,
          duration: { seconds: -1 },
          disabled: false
        }, { parent: actor });

        ui.notifications.warn(`${actor.name} has transformed into a Magma Wyrm!`);
      }
    }
  }
}

/**
 * Notify player of sanity change and new effects
 */
function notifySanityChange(actor, oldSanity, newSanity) {
  const direction = newSanity > oldSanity ? "increased" : "decreased";
  const message = `${actor.name}'s Sanity ${direction} from ${oldSanity} to ${newSanity}.`;

  if (newSanity < oldSanity) {
    ui.notifications.warn(message);
    // Check for new threshold benefits
    const newThresholds = DRAGON_COMMUNION.sanityThresholds.filter(t =>
      newSanity <= t.max && newSanity >= t.min && oldSanity > t.max
    );

    if (newThresholds.length > 0) {
      const benefits = newThresholds.map(t => getThresholdBenefitText(t)).join("\n");
      setTimeout(() => {
        ui.notifications.info(`New Dragon Communion benefits gained:\n${benefits}`, { permanent: true });
      }, 500);
    }
  } else {
    ui.notifications.info(message);
  }
}

/**
 * Get human-readable benefit text for a threshold
 */
function getThresholdBenefitText(threshold) {
  const benefits = {
    dragonTracking: "Advantage on tracking/recall vs dragons",
    dragonSaves: "Advantage on saves vs dragon abilities",
    fireResistance: "Resistance to fire damage",
    spellDCBonus: "+1 Spell Save DC for Dragon Communion spells",
    dragonDamageBonus: "+3d6 damage vs dragons",
    magmaWyrmTransformation: "TRANSFORMATION: Become Magma Wyrm (NPC)"
  };
  return benefits[threshold.effect] || threshold.effect;
}

/**
 * Helper: Add sanity to character (call when dragon is slain)
 */
export async function addSanity(actor, amount = 1) {
  const current = actor.system.attributes.sanity?.value ?? 10;
  const max = actor.system.attributes.sanity?.max ?? 10;
  const newValue = Math.min(current + amount, max);

  await actor.update({ "system.attributes.sanity.value": newValue });
  ui.notifications.info(`${actor.name} consumed a dragon heart. Sanity: ${current} → ${newValue}`);

  if (newValue > current) {
    await applySanityEffects(actor);
  }
}

/**
 * Helper: Reduce sanity (call for corruption, failed saves, etc.)
 */
export async function reduceSanity(actor, amount = 1) {
  const current = actor.system.attributes.sanity?.value ?? 10;
  const newValue = Math.max(current - amount, 0);

  await actor.update({ "system.attributes.sanity.value": newValue });
  ui.notifications.warn(`${actor.name} feels the dragon blood corruption. Sanity: ${current} → ${newValue}`);

  await applySanityEffects(actor);
}

/**
 * Register macro helpers for easy sanity management
 */
Hooks.on("ready", () => {
  if (game.user.isGM) {
    // Add macro for "Slay Dragon" action
    Macro.create({
      name: "Dragon Communion: Slay Dragon",
      type: "script",
      command: `
        const token = canvas.tokens.controlled[0];
        if (!token) return ui.notifications.error("Select a token first");
        const actor = token.actor;
        if (!actor) return ui.notifications.error("Token has no actor");

        const bg = actor.items.find(i => i.type === "background" && i.name === "Dragon Communion");
        if (!bg) return ui.notifications.error("Actor does not have Dragon Communion background");

        await addSanity(actor, 1);
      `,
      img: "icons/creatures/reptiles/dragon-winged-fire.webp",
      folder: game.folders.getName("Dragon Communion")?.id
    });

    // Add macro for "Corruption" action
    Macro.create({
      name: "Dragon Communion: Corruption",
      type: "script",
      command: `
        const token = canvas.tokens.controlled[0];
        if (!token) return ui.notifications.error("Select a token first");
        const actor = token.actor;
        if (!actor) return ui.notifications.error("Token has no actor");

        const bg = actor.items.find(i => i.type === "background" && i.name === "Dragon Communion");
        if (!bg) return ui.notifications.error("Actor does not have Dragon Communion background");

        await reduceSanity(actor, 1);
      `,
      img: "icons/magic/death/skull-horned-glowing-red.webp",
      folder: game.folders.getName("Dragon Communion")?.id
    });
  }
});

// Export for use in other scripts/macros
export { DRAGON_COMMUNION, addSanity, reduceSanity, applySanityEffects };