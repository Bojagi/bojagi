import { useCallback, useMemo, useState } from 'react';

export function Hooks() {
  const initialMessage = useMemo(() => 'memorized message', []);

  const [message, setMessage] = useState(initialMessage);

  const clickHandler = useCallback(() => {
    setMessage(`${message}!`);
  }, [message]);

  return (
    <div>
      {/* onClick={clickHandler}> */}
      <p>click me!</p>
      <p>{message}</p>
    </div>
  );
}
