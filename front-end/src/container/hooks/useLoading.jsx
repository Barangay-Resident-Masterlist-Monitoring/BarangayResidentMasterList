import { useState, useEffect } from 'react';

const Loading = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex flex-column justify-content-center align-items-center bg-light bg-opacity-75">
      <div className="text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3">{percent}%</p>
      </div>
    </div>
  );
};

export default Loading;
