import { useCallback, useMemo, useState } from 'react';

export function Hooks() {
  const initialMessage = useMemo(() => 'memorized message', []);

  const [message, setMessage] = useState(initialMessage);

  const clickHandler = useCallback(() => {
    setMessage(`${message}!`);
  }, [message]);

  return (
    <div onClick={clickHandler} style={{ border: '1px solid black', padding: '10px' }}>
      <p>click me!</p>
      <p>{message}</p>
    </div>
  );
}
