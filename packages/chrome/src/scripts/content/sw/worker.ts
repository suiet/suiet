/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

self.addEventListener('message', (event) => {
  const requestData = event.data;
  // Process the request data and perform the required functionality
  // Send the response back to the React component
  const responseData = 'Processed data';
  self.postMessage(responseData);
});

export {};
