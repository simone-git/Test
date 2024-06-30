const fixedWidth = 160, fixedHeight = 90;

// ----- IMAGES AND BOXES ----- //
const imgPaths = [
    // Common
    "data/images/common/background.png",

    // Home
    "data/images/home/title.png",
    "data/images/home/play.png",
    "data/images/home/play-over.png",
    "data/images/home/settings.png",
    "data/images/home/settings-over.png",
    "data/images/home/inventory.png",
    "data/images/home/inventory-over.png",

    // Levels
    "data/images/levels/title.png",
    "data/images/levels/back.png",
    "data/images/levels/back-over.png",
    "data/images/levels/level.png",
    "data/images/levels/level-over.png",
    "data/images/levels/padlock.png",
    "data/images/levels/padlock-over.png"
];
const imgAliases = [
    //Common
    "common_bg",

    // Home
    "home_title",
    "home_play",
    "home_play_over",
    "home_set",
    "home_set_over",
    "home_inv",
    "home_inv_over",

    // Levels
    "levels_title",
    "levels_back",
    "levels_back_over",
    "levels_level",
    "levels_level_over",
    "levels_padlock",
    "levels_padlock_over"
];
let images = [];  // Container of only images
const d = 13;
const boxSpecs = [  // Syntax: boxAlias (id), imgAlias (source1), imgAlias_over (source2), specs: (CORNERS: left, top, right, bottom; CENTER: x, y, w / h); Values: W[0, fixedWidth] / H[0, fixedHeight]
    // Common
    ["common_bg",               "common_bg",            "common_bg",                "CORNERS",  0,      0,      fixedWidth,    fixedHeight],

    // Home
    ["home_title",              "home_title",           "home_title",               "CENTER",   80,     18,     "H",    30],
    ["home_play",               "home_play",            "home_play_over",           "CENTER",   80,     45,     "W",    32],
    ["home_set",                "home_set",             "home_set_over",            "CENTER",   32,     72,     "W",    32],
    ["home_inv",                "home_inv",             "home_inv_over",            "CENTER",   80,     63,     "W",    32],

    // Levels
    ["levels_title",            "levels_title",         "levels_title",             "CENTER",   80,     11,     "H",    20],
    ["levels_back",             "levels_back",          "levels_back_over",         "CENTER",   16,     81,     "W",    24],
    
    ["levels_level_1",          "levels_level",         "levels_level_over",        "CENTER",   53,     27,     "W",    d],
    ["levels_padlock_1",        "levels_padlock",       "levels_padlock_over",      "CENTER",   53,     27,     "W",    d],
    ["levels_level_2",          "levels_level",         "levels_level_over",        "CENTER",   71,     27,     "W",    d],
    ["levels_padlock_2",        "levels_padlock",       "levels_padlock_over",      "CENTER",   71,     27,     "W",    d],
    ["levels_level_3",          "levels_level",         "levels_level_over",        "CENTER",   89,     27,     "W",    d],
    ["levels_padlock_3",        "levels_padlock",       "levels_padlock_over",      "CENTER",   89,     27,     "W",    d],
    ["levels_level_4",          "levels_level",         "levels_level_over",        "CENTER",   107,    27,     "W",    d],
    ["levels_padlock_4",        "levels_padlock",       "levels_padlock_over",      "CENTER",   107,    27,     "W",    d],
    ["levels_level_5",          "levels_level",         "levels_level_over",        "CENTER",   53,     45,     "W",    d],
    ["levels_padlock_5",        "levels_padlock",       "levels_padlock_over",      "CENTER",   53,     45,     "W",    d],
    ["levels_level_6",          "levels_level",         "levels_level_over",        "CENTER",   71,     45,     "W",    d],
    ["levels_padlock_6",        "levels_padlock",       "levels_padlock_over",      "CENTER",   71,     45,     "W",    d],
    ["levels_level_7",          "levels_level",         "levels_level_over",        "CENTER",   89,     45,     "W",    d],
    ["levels_padlock_7",        "levels_padlock",       "levels_padlock_over",      "CENTER",   89,     45,     "W",    d],
    ["levels_level_8",          "levels_level",         "levels_level_over",        "CENTER",   107,    45,     "W",    d],
    ["levels_padlock_8",        "levels_padlock",       "levels_padlock_over",      "CENTER",   107,    45,     "W",    d],
    ["levels_level_9",          "levels_level",         "levels_level_over",        "CENTER",   53,     63,     "W",    d],
    ["levels_padlock_9",        "levels_padlock",       "levels_padlock_over",      "CENTER",   53,     63,     "W",    d],
    ["levels_level_10",         "levels_level",         "levels_level_over",        "CENTER",   71,     63,     "W",    d],
    ["levels_padlock_10",       "levels_padlock",       "levels_padlock_over",      "CENTER",   71,     63,     "W",    d],
    ["levels_level_11",         "levels_level",         "levels_level_over",        "CENTER",   89,     63,     "W",    d],
    ["levels_padlock_11",       "levels_padlock",       "levels_padlock_over",      "CENTER",   89,     63,     "W",    d],
    ["levels_level_12",         "levels_level",         "levels_level_over",        "CENTER",   107,    63,     "W",    d],
    ["levels_padlock_12",       "levels_padlock",       "levels_padlock_over",      "CENTER",   107,    63,     "W",    d],
    ["levels_level_13",         "levels_level",         "levels_level_over",        "CENTER",   53,     81,     "W",    d],
    ["levels_padlock_13",       "levels_padlock",       "levels_padlock_over",      "CENTER",   53,     81,     "W",    d],
    ["levels_level_14",         "levels_level",         "levels_level_over",        "CENTER",   71,     81,     "W",    d],
    ["levels_padlock_14",       "levels_padlock",       "levels_padlock_over",      "CENTER",   71,     81,     "W",    d],
    ["levels_level_15",         "levels_level",         "levels_level_over",        "CENTER",   89,     81,     "W",    d],
    ["levels_padlock_15",       "levels_padlock",       "levels_padlock_over",      "CENTER",   89,     81,     "W",    d],
    ["levels_level_16",         "levels_level",         "levels_level_over",        "CENTER",   107,    81,     "W",    d],
    ["levels_padlock_16",       "levels_padlock",       "levels_padlock_over",      "CENTER",   107,    81,     "W",    d]
];
let boxes = [];  // Container of boxes with refs to images
// ----- IMAGES AND BOXES ----- //