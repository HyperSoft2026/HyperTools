/**
 * Privacy-safe Firebase Analytics helper for HyperTools.
 * STRICT PRIVACY RULES:
 * - NEVER log user inputs, text contents, passwords, JWT tokens, IP addresses, or secrets.
 * - Only logs generic lifecycle and high-level interaction events.
 */

// Helper to safely send events to native Android Firebase bridge
const sendNativeEvent = (eventName: string, params: Record<string, string | number | boolean> = {}) => {
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.AndroidFirebase?.logEvent) {
      // @ts-ignore
      window.AndroidFirebase.logEvent(eventName, JSON.stringify(params));
    }
  } catch (err) {
    // Fail silently to never disrupt the user experience
  }
};

/** Log app launch */
export const logAppOpen = (): void => {
  sendNativeEvent('app_open', { platform: 'android' });
};

/** Log tool opened (only tool ID and safe title) */
export const logToolOpened = (toolId: string, toolName: string): void => {
  sendNativeEvent('tool_opened', {
    tool_id: toolId,
    tool_name: toolName,
  });
};

/** Log tool added to favorites */
export const logFavoriteAdded = (toolId: string): void => {
  sendNativeEvent('favorite_added', { tool_id: toolId });
};

/** Log tool removed from favorites */
export const logFavoriteRemoved = (toolId: string): void => {
  sendNativeEvent('favorite_removed', { tool_id: toolId });
};

/** Log search usage (sanitized keyword or length only, NEVER sensitive input) */
export const logSearchUsed = (queryLength: number): void => {
  if (queryLength <= 0) return;
  sendNativeEvent('search_used', { query_length: queryLength });
};

/** Log category filter selection */
export const logCategorySelected = (categoryId: string): void => {
  sendNativeEvent('category_selected', { category_id: categoryId });
};

/** Log copy result action (only destination tool context, NEVER the copied content) */
export const logCopyResult = (context: string = 'general'): void => {
  sendNativeEvent('copy_result', { context });
};
