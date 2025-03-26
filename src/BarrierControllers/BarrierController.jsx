import axios from 'axios';

/**
 * Opens a barrier and optionally closes it automatically after a specified time.
 *
 * @param {Object} params - The parameters for the barrier operation.
 * @param {Function} [params.onStartOpen] - Callback function triggered when the barrier opening process starts.
 * @param {Function} [params.onOpening] - Callback function triggered when the barrier is opening.
 * @param {Function} [params.onOpenCompleted] - Callback function triggered when the barrier has been successfully opened.
 * @param {Function} [params.onClosing] - Callback function triggered when the barrier is closing.
 * @param {Function} [params.onClosingCompleted] - Callback function triggered when the barrier has been successfully closed.
 * @param {boolean} [params.isAutoClose=true] - Whether the barrier should close automatically after being opened.
 * @param {number} [params.waittingTime=10] - The time (in seconds) to wait before automatically closing the barrier.
 *
 * @returns {void}
 */
export function OpenBarrier({
  onStartOpen,
  onOpening,
  onOpenCompleted,
  onClosing,
  onClosingCompleted,
  onOpeningError,
  isAutoClose = true,
  waittingTime = 10,
}) {
  // Notify that the barrier opening process has started
  if (onStartOpen) onStartOpen();

  // Create a thread to handle the barrier operation
  const thread = async () => {
    try {
      // Notify that the barrier is opening
      if (onOpening) onOpening();
      console.log("Sending request...");
      // Call the API to open the barrier
      await axios.get("http://192.168.1.100/relay_cgi.cgi?type=0&relay=2&on=1&time=0&pwd=");

      // Notify that the barrier has been opened
      if (onOpenCompleted) onOpenCompleted();

      // If auto-close is enabled, wait for the specified time and then close the barrier
      if (isAutoClose) {
        await new Promise((resolve) => setTimeout(resolve, waittingTime * 1000));

        // Notify that the barrier is closing
        if (onClosing) onClosing();

        // Call the API to close the barrier
        await axios.get("http://192.168.1.100/relay_cgi.cgi?type=0&relay=2&on=0&time=0&pwd=");

        // Notify that the barrier has been closed
        if (onClosingCompleted) onClosingCompleted();
      }
    } catch (error) {
       if (onOpeningError) onOpeningError(error);
      console.error("Error during barrier operation:", error);
    }
  };

  // Start the thread
  thread();
}
