// Color mapping for different moods/emotions
export const MOOD_COLORS = {
  // Positive emotions - vibrant and energetic colors
  happy: {
    primary: "#FFD700", // Bright gold
    secondary: "#FF8C00", // Dark orange
    gradient: "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
    emoji: "😊",
  },
  excited: {
    primary: "#FF4500", // Orange red
    secondary: "#DC143C", // Crimson
    gradient: "linear-gradient(135deg, #FF4500 0%, #DC143C 100%)",
    emoji: "🤩",
  },
  grateful: {
    primary: "#FFA500", // Orange
    secondary: "#FF6347", // Tomato
    gradient: "linear-gradient(135deg, #FFA500 0%, #FF6347 100%)",
    emoji: "🙏",
  },
  hopeful: {
    primary: "#00CED1", // Dark turquoise
    secondary: "#20B2AA", // Light sea green
    gradient: "linear-gradient(135deg, #00CED1 0%, #20B2AA 100%)",
    emoji: "✨",
  },
  "in love": {
    primary: "#FF69B4", // Hot pink
    secondary: "#FF1493", // Deep pink
    gradient: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
    emoji: "💕",
  },

  // Calm emotions - cool and soothing colors
  calm: {
    primary: "#4682B4", // Steel blue
    secondary: "#5F9EA0", // Cadet blue
    gradient: "linear-gradient(135deg, #4682B4 0%, #5F9EA0 100%)",
    emoji: "😌",
  },
  neutral: {
    primary: "#808080", // Gray
    secondary: "#A9A9A9", // Dark gray
    gradient: "linear-gradient(135deg, #808080 0%, #A9A9A9 100%)",
    emoji: "😐",
  },

  // Negative emotions - deep and intense colors
  sad: {
    primary: "#2F4F4F", // Dark slate gray
    secondary: "#483D8B", // Dark slate blue
    gradient: "linear-gradient(135deg, #2F4F4F 0%, #483D8B 100%)",
    emoji: "😢",
  },
  angry: {
    primary: "#8B0000", // Dark red
    secondary: "#B22222", // Fire brick
    gradient: "linear-gradient(135deg, #8B0000 0%, #B22222 100%)",
    emoji: "😠",
  },
  anxious: {
    primary: "#4B0082", // Indigo
    secondary: "#800080", // Purple
    gradient: "linear-gradient(135deg, #4B0082 0%, #800080 100%)",
    emoji: "😰",
  },
  confused: {
    primary: "#708090", // Slate gray
    secondary: "#778899", // Light slate gray
    gradient: "linear-gradient(135deg, #708090 0%, #778899 100%)",
    emoji: "😕",
  },
};

// Helper function to parse comma-separated moods
export const parseMoods = (moodString) => {
  if (!moodString) return ["neutral"];
  return moodString.split(",").map((mood) => mood.trim().toLowerCase());
};

// Function to blend multiple colors
export const blendColors = (colors, weights = null) => {
  if (!colors || colors.length === 0) return MOOD_COLORS.neutral;

  // If only one color, return it directly
  if (colors.length === 1) return MOOD_COLORS[colors[0]] || MOOD_COLORS.neutral;

  // Default equal weights if not provided
  if (!weights) {
    weights = new Array(colors.length).fill(1 / colors.length);
  }

  // Blend the primary colors
  const blendedPrimary = blendHexColors(
    colors.map((color) => MOOD_COLORS[color]?.primary || "#E0E0E0"),
    weights
  );

  // Blend the secondary colors
  const blendedSecondary = blendHexColors(
    colors.map((color) => MOOD_COLORS[color]?.secondary || "#F5F5F5"),
    weights
  );

  // Create a gradient from blended colors
  const blendedGradient = `linear-gradient(135deg, ${blendedPrimary} 0%, ${blendedSecondary} 100%)`;

  return {
    primary: blendedPrimary,
    secondary: blendedSecondary,
    gradient: blendedGradient,
    emoji: getDominantEmoji(colors),
  };
};

// Function to create a seamless gradient between two entries
export const createSeamlessGradient = (
  currentEntry,
  nextEntry,
  height = 100
) => {
  const currentColors = getMoodColors(currentEntry);
  const nextColors = getMoodColors(nextEntry);

  // Create a gradient that transitions from current entry's secondary color to next entry's primary color
  return `linear-gradient(to bottom, 
    ${currentColors.secondary} 0%, 
    ${blendHexColors(
      [currentColors.secondary, nextColors.primary],
      [0.7, 0.3]
    )} 50%, 
    ${nextColors.primary} 100%)`;
};

// Function to create a gradient for a specific entry with transition zones
export const createEntryGradient = (entry, index, totalEntries, allEntries) => {
  const currentColors = getMoodColors(entry);

  if (totalEntries === 1) {
    return currentColors.gradient;
  }

  // Shorter transition zones for subtle blending
  const transitionZone = 0.15; // 15% of the entry height for transitions
  const mainZone = 1 - 2 * transitionZone; // 70% for the main color

  if (index === 0) {
    // First entry: starts with its own color, transitions to next entry's color
    const nextEntry = allEntries[index + 1];
    const nextColors = getMoodColors(nextEntry.mood);

    return `linear-gradient(to bottom, 
      ${currentColors.primary} 0%, 
      ${currentColors.secondary} 50%, 
      ${blendHexColors(
        [currentColors.secondary, nextColors.primary],
        [0.7, 0.3]
      )} 75%, 
      ${blendHexColors(
        [currentColors.secondary, nextColors.primary],
        [0.3, 0.7]
      )} 100%)`;
  } else if (index === totalEntries - 1) {
    // Last entry: starts with previous entry's color, transitions to its own color
    const prevEntry = allEntries[index - 1];
    const prevColors = getMoodColors(prevEntry.mood);

    return `linear-gradient(to bottom, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.7, 0.3]
      )} 0%, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.3, 0.7]
      )} 25%, 
      ${currentColors.primary} 50%, 
      ${currentColors.secondary} 100%)`;
  } else {
    // Middle entries: starts with previous entry's color, transitions to current color, then to next entry's color
    const prevEntry = allEntries[index - 1];
    const nextEntry = allEntries[index + 1];
    const prevColors = getMoodColors(prevEntry.mood);
    const nextColors = getMoodColors(nextEntry.mood);

    return `linear-gradient(to bottom, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.7, 0.3]
      )} 0%, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.3, 0.7]
      )} 25%, 
      ${currentColors.primary} 50%, 
      ${currentColors.secondary} 75%, 
      ${blendHexColors(
        [currentColors.secondary, nextColors.primary],
        [0.7, 0.3]
      )} 100%)`;
  }
};

// Function to get transition colors for seamless blending
export const getTransitionColors = (currentEntry, nextEntry) => {
  const currentColors = getMoodColors(currentEntry);
  const nextColors = getMoodColors(nextEntry);

  return {
    current: currentColors,
    next: nextColors,
    blend: blendHexColors(
      [currentColors.secondary, nextColors.primary],
      [0.5, 0.5]
    ),
  };
};

// Helper function to blend hex colors
const blendHexColors = (hexColors, weights) => {
  const colors = hexColors.map((hex) => hexToRgb(hex));
  const blended = colors.reduce(
    (acc, color, index) => {
      return {
        r: acc.r + color.r * weights[index],
        g: acc.g + color.g * weights[index],
        b: acc.b + color.b * weights[index],
      };
    },
    { r: 0, g: 0, b: 0 }
  );

  return rgbToHex(
    Math.round(blended.r),
    Math.round(blended.g),
    Math.round(blended.b)
  );
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Helper function to convert RGB to hex
const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Function to get the dominant emoji from multiple moods
const getDominantEmoji = (moods) => {
  // Priority order for emojis when multiple moods are present
  const priorityOrder = [
    "excited",
    "happy",
    "grateful",
    "hopeful",
    "calm",
    "neutral",
    "sad",
    "anxious",
    "angry",
    "confused",
  ];

  for (const priorityMood of priorityOrder) {
    if (moods.includes(priorityMood)) {
      return MOOD_COLORS[priorityMood].emoji;
    }
  }

  return "😐"; // Default emoji
};

// Main function to get mood colors
export const getMoodColors = (moodString) => {
  const moods = parseMoods(moodString);

  // If only one mood, return it directly
  if (moods.length === 1) {
    return MOOD_COLORS[moods[0]] || MOOD_COLORS.neutral;
  }

  // For multiple moods, use the dominant mood's colors
  const dominantMood = getDominantMood(moods);
  return MOOD_COLORS[dominantMood] || MOOD_COLORS.neutral;
};

// Function to get the dominant mood from multiple moods
const getDominantMood = (moods) => {
  // Priority order for moods when multiple are present
  const priorityOrder = [
    "excited",
    "happy",
    "grateful",
    "hopeful",
    "in love",
    "calm",
    "neutral",
    "sad",
    "anxious",
    "angry",
    "confused",
  ];

  for (const priorityMood of priorityOrder) {
    if (moods.includes(priorityMood)) {
      return priorityMood;
    }
  }

  return "neutral"; // Default mood
};

// Function to determine if text should be dark or light based on background color
export const getTextColor = (moodString) => {
  // Always use dark text for better readability
  return "#2c3e50";
};

// Function to get enhanced text shadow for better readability
export const getTextShadow = (moodString) => {
  // Dark text needs light shadow for better readability on colored backgrounds
  return "0 2px 4px rgba(255,255,255,0.4), 0 1px 2px rgba(255,255,255,0.3)";
};

// Function to get a simple color for single moods
export const getSimpleMoodColor = (moodString) => {
  const moods = parseMoods(moodString);
  if (moods.length === 1) {
    return MOOD_COLORS[moods[0]]?.primary || MOOD_COLORS.neutral.primary;
  }
  return getMoodColors(moodString).primary;
};

// Function to get mood emoji
export const getMoodEmoji = (moodString) => {
  const moods = parseMoods(moodString);
  return getDominantEmoji(moods);
};
