import React, { useCallback, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

function Popup() {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('enabled', (data) => {
      setIsToggled(data.enabled);
    });
  }, []);

  const handleToggle = useCallback(() => {
    setIsToggled((prevIsToggled) => {
      const nextStatus = !prevIsToggled;
      chrome.storage.local.set({ enabled: nextStatus });
      return nextStatus;
    });
  }, []);

  return (
    <button type="button" onClick={handleToggle}>
      {isToggled ? 'Turn off' : 'Turn on'}
    </button>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root'),
);
