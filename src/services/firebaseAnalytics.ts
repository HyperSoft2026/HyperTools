/**
 * Privacy-safe Firebase Analytics helper for HyperTools.
 * STRICT PRIVACY RULES:
 * - NEVER log user inputs, text contents, passwords, JWT tokens, IP addresses, or secrets.
 * - Only logs generic lifecycle and high-level interaction events (e.g. tool opened).
 */
export const logToolOpened = (toolId: string, toolName: string): void => {
  try {
    // If native Android bridge is available
    // @ts-ignore
    if (typeof window !== 'undefined' && window.AndroidFirebase?.logEvent) {
      // @ts-ignore
      window.AndroidFirebase.logEvent('tool_opened', JSON.stringify({
        tool_id: toolId,
        tool_name: toolName,
      }));
    }
  } catch (err) {
    // Fail silently to never disrupt the user experience
  }
};
