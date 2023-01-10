import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';

function Popup() {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = useCallback(() => {
    setIsToggled((prevIsToggled) => !prevIsToggled);
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
