// Color mapping for different moods/emotions
export const MOOD_COLORS = {
  // Positive emotions - warm and bright colors
  happy: {
    primary: "#FFD700", // Bright gold
    secondary: "#FFA500", // Orange
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    emoji: "😊",
  },
  excited: {
    primary: "#FF6B6B", // Vibrant red-orange
    secondary: "#FF8E53", // Coral
    gradient: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",
    emoji: "🤩",
  },
  grateful: {
    primary: "#FFB347", // Warm orange
    secondary: "#FFD700", // Gold
    gradient: "linear-gradient(135deg, #FFB347 0%, #FFD700 100%)",
    emoji: "🙏",
  },
  hopeful: {
    primary: "#87CEEB", // Sky blue
    secondary: "#98FB98", // Pale green
    gradient: "linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)",
    emoji: "✨",
  },

  // Calm emotions - cool and soothing colors
  calm: {
    primary: "#98D8C8", // Soft teal
    secondary: "#B8E6B8", // Mint green
    gradient: "linear-gradient(135deg, #98D8C8 0%, #B8E6B8 100%)",
    emoji: "😌",
  },
  neutral: {
    primary: "#E0E0E0", // Light gray
    secondary: "#F5F5F5", // Off white
    gradient: "linear-gradient(135deg, #E0E0E0 0%, #F5F5F5 100%)",
    emoji: "😐",
  },

  // Negative emotions - darker and cooler colors
  sad: {
    primary: "#6B7A8F", // Muted blue-gray
    secondary: "#8B9DC3", // Periwinkle
    gradient: "linear-gradient(135deg, #6B7A8F 0%, #8B9DC3 100%)",
    emoji: "😢",
  },
  angry: {
    primary: "#DC143C", // Crimson red
    secondary: "#8B0000", // Dark red
    gradient: "linear-gradient(135deg, #DC143C 0%, #8B0000 100%)",
    emoji: "😠",
  },
  anxious: {
    primary: "#9370DB", // Medium purple
    secondary: "#8A2BE2", // Blue violet
    gradient: "linear-gradient(135deg, #9370DB 0%, #8A2BE2 100%)",
    emoji: "😰",
  },
  confused: {
    primary: "#DDA0DD", // Plum
    secondary: "#E6E6FA", // Lavender
    gradient: "linear-gradient(135deg, #DDA0DD 0%, #E6E6FA 100%)",
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

  // Much larger transition zones for seamless blending
  const transitionZone = 0.5; // 50% of the entry height for transitions
  const mainZone = 1 - 2 * transitionZone; // 0% for the main color (all transitions)

  if (index === 0) {
    // First entry: blend at bottom with next entry
    const nextEntry = allEntries[index + 1];
    const nextColors = getMoodColors(nextEntry.mood);

    return `linear-gradient(to bottom, 
      ${currentColors.primary} 0%, 
      ${currentColors.secondary} 25%, 
      ${blendHexColors(
        [currentColors.secondary, nextColors.primary],
        [0.8, 0.2]
      )} 50%, 
      ${blendHexColors(
        [currentColors.secondary, nextColors.primary],
        [0.6, 0.4]
      )} 75%, 
      ${blendHexColors(
        [currentColors.secondary, nextColors.primary],
        [0.4, 0.6]
      )} 100%)`;
  } else if (index === totalEntries - 1) {
    // Last entry: blend at top with previous entry
    const prevEntry = allEntries[index - 1];
    const prevColors = getMoodColors(prevEntry.mood);

    return `linear-gradient(to bottom, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.4, 0.6]
      )} 0%, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.6, 0.4]
      )} 25%, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.8, 0.2]
      )} 50%, 
      ${currentColors.secondary} 75%, 
      ${currentColors.primary} 100%)`;
  } else {
    // Middle entries: blend with both previous and next entries
    const prevEntry = allEntries[index - 1];
    const nextEntry = allEntries[index + 1];
    const prevColors = getMoodColors(prevEntry.mood);
    const nextColors = getMoodColors(nextEntry.mood);

    return `linear-gradient(to bottom, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.4, 0.6]
      )} 0%, 
      ${blendHexColors(
        [prevColors.secondary, currentColors.primary],
        [0.6, 0.4]
      )} 25%, 
      ${currentColors.secondary} 50%, 
      ${blendHexColors(
        [currentColors.secondary, nextColors.primary],
        [0.6, 0.4]
      )} 75%, 
      ${blendHexColors(
        [currentColors.secondary, nextColors.primary],
        [0.4, 0.6]
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
  return blendColors(moods);
};

// Function to determine if text should be dark or light based on background color
export const getTextColor = (moodString) => {
  const moodColors = getMoodColors(moodString);
  const primaryColor = moodColors.primary;

  // Convert hex to RGB to calculate brightness
  const hex = primaryColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance (brightness)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Use dark text for light backgrounds, light text for dark backgrounds
  return brightness > 128 ? "#2c3e50" : "#ffffff";
};

// Function to get enhanced text shadow for better readability
export const getTextShadow = (moodString) => {
  const textColor = getTextColor(moodString);

  if (textColor === "#ffffff") {
    // White text needs dark shadow
    return "0 2px 4px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)";
  } else {
    // Dark text needs light shadow
    return "0 2px 4px rgba(255,255,255,0.4), 0 1px 2px rgba(255,255,255,0.3)";
  }
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
