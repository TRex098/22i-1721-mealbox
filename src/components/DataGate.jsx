// Shows loading / error (with retry) states, otherwise renders its children.
export default function DataGate({ status, errorMessage, onRetry, children }) {
  if (status === 'loading') {
    return (
      <p role="status" className="state-box">
        Loading today&rsquo;s menu&hellip;
      </p>
    );
  }
  if (status === 'error') {
    return (
      <div role="alert" className="state-box state-error">
        <h2>The menu could not be loaded</h2>
        <p>{errorMessage}</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }
  return children;
}
