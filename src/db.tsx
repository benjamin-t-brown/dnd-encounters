import { EncounterDatabase } from 'data/storage';
import React from 'react';

let DataContext: React.Context<EncounterDatabase>;

export const createDataContext = (data: EncounterDatabase) => {
  (window as any).data = data;
  DataContext = React.createContext<EncounterDatabase>(data);
};

export const getDataContext = () => {
  return DataContext;
};
