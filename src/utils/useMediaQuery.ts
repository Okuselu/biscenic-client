import { useState, useEffect } from 'react';

/**
 * A hook that returns true if the screen width is less than or equal to the specified breakpoint
 * @param breakpoint The maximum width in pixels to consider as a mobile device
 * @returns boolean indicating if the current viewport matches the query
 */
const useMediaQuery = (breakpoint: number = 768): boolean => {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Initial check
    const checkMediaQuery = () => {
      setMatches(window.innerWidth <= breakpoint);
    };
    
    // Check on mount
    checkMediaQuery();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMediaQuery);
    
    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', checkMediaQuery);
  }, [breakpoint]);

  return matches;
};

export default useMediaQuery;