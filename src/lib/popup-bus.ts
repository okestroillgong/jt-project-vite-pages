// lib/popup-bus.ts

const CHANNEL_NAME = "jt-popup-channel";

// Ensure BroadcastChannel is available (it's not in very old browsers or SSR)
const channel = typeof BroadcastChannel !== 'undefined' 
  ? new BroadcastChannel(CHANNEL_NAME) 
  : null;

export interface PopupMessage {
  targetTabId: string;
  source: 'customer-search' | 'branch-management' | string; // Which popup sent this
  payload: any;
}

/**
 * Posts a message to all listening browser contexts.
 * @param message The message object to send.
 */
export function postPopupMessage(message: PopupMessage) {
  if (channel) {
    channel.postMessage(message);
  } else {
    console.warn("BroadcastChannel is not supported in this environment.");
  }
}

/**
 * Listens for messages on the popup channel.
 * @param handler The function to execute when a message is received.
 * @returns A function to remove the event listener.
 */
export function listenForPopupMessages(handler: (message: PopupMessage) => void) {
  const messageHandler = (event: MessageEvent<PopupMessage>) => {
    handler(event.data);
  };

  if (channel) {
    channel.addEventListener('message', messageHandler);
    
    // Return a cleanup function
    return () => {
      channel.removeEventListener('message', messageHandler);
    };
  }
  
  // Return a no-op cleanup function if channel is not supported
  return () => {};
}
