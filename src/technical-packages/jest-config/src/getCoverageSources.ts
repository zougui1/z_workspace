const baseCoverageSources = [
  '!**/types/**/*.ts',
  '!**/*.mock.ts',
  '!**/node_modules/**',
  '!**/experiments/**',
];

export const getCoverageSources = (): string[] => {
  const collectCoverageOptionIndex = process.argv.indexOf('--collectCoverage');
  const targetCoveragePattern = process.argv[collectCoverageOptionIndex + 1];
  const collectCoverageFrom = [];

  if (collectCoverageOptionIndex !== -1 && targetCoveragePattern) {
    // collect coverage for a file matching this pattern
    const targetFileCoverage = `**/*${targetCoveragePattern}*`;
    // collect coverage for all files inside the directory matching this pattern
    const targetDirCoverage = `${targetFileCoverage}/**`;

    collectCoverageFrom.push(targetFileCoverage, targetDirCoverage);
  } else {
    const globalCoverage = [
      '**/*.ts',
    ];
    collectCoverageFrom.push(...globalCoverage);
  }

  return [
    ...collectCoverageFrom,
    ...baseCoverageSources,
  ];
}
