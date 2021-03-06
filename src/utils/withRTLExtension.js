export const LTR_SELECTOR = '_ltr';
export const RTL_SELECTOR = '_rtl';

const styleDefRegex = /(\.[^{}]+\{[^{}]+\})/g;

/*
 * When automatically flipping CSS styles in our interface, instead of determining RTL/LTR context
 * at the time of the create or resolve call (which is hard to do without either setting the
 * direction in the global cache or ignoring inline styles entirely), we simply add a new style
 * definition for the generated class name that is only applied in a [dir="rtl"] context. This
 * handler adds that extra style definition to the <style /> tag created by Aphrodite.
 */
function directionSelectorHandler(selector, baseSelector, generateSubtreeStyles) {
  if (selector !== RTL_SELECTOR && selector !== LTR_SELECTOR) {
    return null;
  }

  const generated = generateSubtreeStyles(baseSelector);

  // We prefix ALL flippable styles with a direction selector for a number of reasons.
  // If we only prefixed RTL styles, we would need to figure out a reasonable reset value for
  // each style attribute which is a challenge to do so in a robust and cross platform way.
  // Only prefixing RTL styles also causes issues when dealing with single direction and all 4
  // direction style definitions together (ie borderRadius: '8px 0 0 8px' and
  // borderTopRightRadius: 8 together gets overriden in an unexpected way). Prefixing with both
  // dir attributes fixes both of these issues.
  const prefix = selector === RTL_SELECTOR ? '[dir="rtl"]' : '[dir="ltr"]';

  // generated may include more than one style definition (pseudoselectors, matchmedia, etc.).
  // We want to prefix each one individually.
  return generated.replace(styleDefRegex, `${prefix} $1`);
}

export default function withRTLExtension({ StyleSheet } /* aphrodite */) {
  return StyleSheet.extend([{ selectorHandler: directionSelectorHandler }]);
}
