import * as core from '@actions/core';
import * as github from '@actions/github';

export type EventMatchConfig = {
  event?: string[];
};

export function getEventDetail(): {action?: string; event: string} {
  const action = github.context.payload.action;
  const event = github.context.eventName;
  return {action, event};
}

export function toEventMatchConfig(config: any): EventMatchConfig {
  if (!config.event) {
    return {};
  }

  return {
    event: config.event
  };
}

export function checkAnyEvent(regexps: string[]): boolean {
  const {action, event} = getEventDetail();
  if (!event) {
    core.debug(`   no event name`);
    return false;
  }

  const eventName = action ? `${event}.${action}` : event;

  core.debug(`   checking "event" pattern against ${eventName}`);
  const matchers = regexps.map(regexp => new RegExp(regexp));
  for (const matcher of matchers) {
    // If any event patterns match, return early with true
    if (matchEventPattern(matcher, eventName)) {
      core.debug(`   "event" patterns matched against ${eventName}`);

      return true;
    }
  }

  // Otherwise, return false
  core.debug(`   "event" patterns did not match against ${eventName}`);
  return false;
}

export function checkAllEvent(regexps: string[]): boolean {
  const {action, event} = getEventDetail();
  if (!event) {
    core.debug(`   no event name`);
    return false;
  }

  const eventName = action ? `${event}.${action}` : event;

  core.debug(`   checking "event" pattern against ${eventName}`);
  const matchers = regexps.map(regexp => new RegExp(regexp));
  for (const matcher of matchers) {
    // If any event patterns do not match, return early with false
    if (!matchEventPattern(matcher, eventName)) {
      core.debug(`   "event" patterns did not match against ${eventName}`);
      return false;
    }
  }

  // Otherwise, return true
  core.debug(`   "event" patterns matched against ${eventName}`);
  return true;
}

function matchEventPattern(matcher: RegExp, eventName: string): boolean {
  core.debug(`    - ${matcher}`);
  if (matcher.test(eventName)) {
    core.debug(`    "event" pattern matched`);
    return true;
  }

  core.debug(`    ${matcher} did not match`);
  return false;
}
