const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// zustand's ESM build references import.meta.env (Vite-style), which Metro
// doesn't transform for a classic (non-module) script — it crashes the web
// export entirely. Its "react-native" export condition points to a plain
// CJS build with no import.meta, which Metro already resolves correctly for
// iOS/Android; prioritizing that condition on every platform (including web)
// sidesteps the ESM file altogether.
config.resolver.unstable_conditionNames = ["require", "react-native", "browser"];

module.exports = config;
