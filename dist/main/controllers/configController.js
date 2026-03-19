"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.updateDefaultConfig = updateDefaultConfig;
exports.setKeyConfig = setKeyConfig;
exports.setPatternConfig = setPatternConfig;
exports.removeKeyConfig = removeKeyConfig;
exports.removePatternConfig = removePatternConfig;
exports.reloadConfig = reloadConfig;
exports.getConfigStats = getConfigStats;
const constants_1 = require("../utils/constants");
const configurationService_1 = require("../services/configurationService");
async function getConfig(req, res) {
    const defaults = configurationService_1.configurationService.getDefaultConfig();
    // Construct a structure matching the API Reference docs
    const config = {
        capacity: defaults.defaultLimit,
        refillRate: Math.max(1, Math.floor(defaults.defaultLimit / (defaults.defaultWindowMs / 1000))),
        cleanupIntervalMs: defaults.defaultWindowMs,
        algorithm: defaults.defaultAlgorithm.toUpperCase(),
        keys: Object.fromEntries(configurationService_1.configurationService.listOverrides().map(override => [
            override.key,
            {
                capacity: override.config.limit,
                refillRate: override.config.limit ? Math.max(1, Math.floor(override.config.limit / ((override.config.windowMs || 60000) / 1000))) : undefined,
                algorithm: override.config.algorithm?.toUpperCase(),
            }
        ])),
        patterns: Object.fromEntries(configurationService_1.configurationService.listPatternOverrides().map(override => [
            override.key, // Property tracks wildcard value
            {
                capacity: override.config.limit,
                refillRate: override.config.limit ? Math.max(1, Math.floor(override.config.limit / ((override.config.windowMs || 60000) / 1000))) : undefined,
                algorithm: override.config.algorithm?.toUpperCase(),
            }
        ])),
    };
    res.status(constants_1.HTTP_STATUS.OK).json(config);
}
async function updateDefaultConfig(req, res) {
    const config = req.body;
    if (config.capacity)
        configurationService_1.configurationService.updateDefaultConfig({ defaultLimit: config.capacity });
    if (config.cleanupIntervalMs)
        configurationService_1.configurationService.updateDefaultConfig({ defaultWindowMs: config.cleanupIntervalMs });
    if (config.algorithm)
        configurationService_1.configurationService.updateDefaultConfig({ defaultAlgorithm: config.algorithm.toLowerCase() });
    res.status(constants_1.HTTP_STATUS.OK).json(req.body);
}
async function setKeyConfig(req, res) {
    const { key } = req.params;
    const config = req.body;
    configurationService_1.configurationService.setOverride(key, {
        limit: config.capacity,
        windowMs: config.cleanupIntervalMs,
        algorithm: config.algorithm?.toLowerCase(),
    });
    res.status(constants_1.HTTP_STATUS.OK).json(config);
}
async function setPatternConfig(req, res) {
    const { pattern } = req.params;
    const config = req.body;
    configurationService_1.configurationService.setPatternOverride(pattern, {
        limit: config.capacity,
        windowMs: config.cleanupIntervalMs,
        algorithm: config.algorithm?.toLowerCase(),
    });
    res.status(constants_1.HTTP_STATUS.OK).json(config);
}
async function removeKeyConfig(req, res) {
    const { key } = req.params;
    configurationService_1.configurationService.removeOverride(key);
    res.status(constants_1.HTTP_STATUS.NO_CONTENT).send();
}
async function removePatternConfig(req, res) {
    const { pattern } = req.params;
    configurationService_1.configurationService.removePatternOverride(pattern);
    res.status(constants_1.HTTP_STATUS.NO_CONTENT).send();
}
async function reloadConfig(req, res) {
    const defaults = configurationService_1.configurationService.reload();
    res.status(constants_1.HTTP_STATUS.OK).json({ message: 'Configuration reloaded successfully', defaults });
}
async function getConfigStats(req, res) {
    const keyConfigs = configurationService_1.configurationService.listOverrides().length;
    const patternConfigs = configurationService_1.configurationService.listPatternOverrides().length;
    res.status(constants_1.HTTP_STATUS.OK).json({
        cacheSize: keyConfigs + patternConfigs,
        bucketCount: keyConfigs, // Estimate backing capacity strictly
        keyConfigCount: keyConfigs,
        patternConfigCount: patternConfigs,
    });
}
//# sourceMappingURL=configController.js.map