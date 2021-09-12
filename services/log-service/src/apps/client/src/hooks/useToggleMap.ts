import { useState } from 'react';

export const useToggleMap = (defaultMap: Record<string, any> = {}): [Record<string, any>, (key: string | number) => void] => {
  const [map, setMap] = useState(defaultMap);

  const toggleMap = (key: string | number) => {
    setMap(map => {
      return {
        ...map,
        [key]: !map[key],
      };
    });
  }

  return [map, toggleMap];
}
