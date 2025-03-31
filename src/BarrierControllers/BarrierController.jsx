import axios from "axios";

/**
 * Opens a barrier by sending a request to a specified API endpoint.
 * This function notifies the caller about the different stages of the operation
 * through the provided callback functions.
 *
 * @param {Object} params - The parameters for the barrier operation.
 * @param {Function} [params.onStartOpen] - Callback invoked when the barrier opening process starts.
 * @param {Function} [params.onOpening] - Callback invoked when the barrier is in the process of opening.
 * @param {Function} [params.onOpenCompleted] - Callback invoked when the barrier has been successfully opened.
 * @param {Function} [params.onOpeningError] - Callback invoked when an error occurs during the barrier opening process.
 *
 * @example
 * OpenBarrier({
 *   onStartOpen: () => console.log("Opening started"),
 *   onOpening: () => console.log("Opening in progress"),
 *   onOpenCompleted: () => console.log("Opening completed"),
 *   onOpeningError: (error) => console.error("Opening error:", error),
 * });
 */
export function OpenBarrier({
  onStartOpen,
  onOpening,
  onOpenCompleted,
  onOpeningError,
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
      await axios.get(
        "http://192.168.1.100/relay_cgi.cgi?type=0&relay=2&on=1&time=0&pwd="
      );
      // Wait for 2 seconds before sending the second API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await axios.get(
        "http://192.168.1.100/relay_cgi.cgi?type=0&relay=2&on=0&time=0&pwd="
      );
      // Notify that the barrier has been opened
      if (onOpenCompleted) onOpenCompleted();
    } catch (error) {
      if (onOpeningError) onOpeningError(error);
      console.error("Error during barrier operation:", error);
    }
  };

  // Start the thread
  thread();
}

/**
 * Function to handle the process of closing a barrier.
 *
 * @param {Object} props - The properties object.
 * @param {Function} [props.onStartClose] - Callback function invoked when the barrier closing process starts.
 * @param {Function} [props.onClosing] - Callback function invoked while the barrier is in the process of closing.
 * @param {Function} [props.onClosingCompleted] - Callback function invoked when the barrier has successfully closed.
 * @param {Function} [props.onClosingError] - Callback function invoked if an error occurs during the barrier closing process.
 *
 * @returns {void}
 */
export function CloseBarrier({
  onStartClose,
  onClosing,
  onClosingCompleted,
  onClosingError,
}) {
  // Notify that the barrier opening process has started
  if (onStartClose) onStartClose();

  // Create a thread to handle the barrier operation
  const thread = async () => {
    try {
      // Notify that the barrier is opening
      if (onClosing) onClosing();
      console.log("Sending request...");
      // Call the API to open the barrier
      await axios.get(
        "http://192.168.1.100/relay_cgi.cgi?type=0&relay=3&on=1&time=0&pwd="
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await axios.get(
        "http://192.168.1.100/relay_cgi.cgi?type=0&relay=3&on=0&time=0&pwd="
      );

      // Notify that the barrier has been opened
      if (onClosingCompleted) onClosingCompleted();
    } catch (error) {
      if (onClosingError) onClosingError(error);
      console.error("Error during barrier operation:", error);
    }
  };

  // Start the thread
  thread();
}
