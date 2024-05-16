export type NotLabelsMatchConfig = {
  ['not-labels']?: string[];
};

export function toNotLabelsMatchConfig(config: any): NotLabelsMatchConfig {
  if (!config['not-labels']) {
    return {};
  }

  return {
    ['not-labels']: config['not-labels']
  };
}

/**
 * Check whether the `not-labels` defined in the configuration file completely match the existing labels on the PR, returning `true` if they do, `false` otherwise.
 */
export function shouldSkipLabel(
  config: NotLabelsMatchConfig,
  existingLabels: string[]
): boolean {
  // Return true if all the labels in the `not-labels` array are present in the existing labels
  return (
    config['not-labels']?.every(label => existingLabels.includes(label)) ??
    false
  );
}
