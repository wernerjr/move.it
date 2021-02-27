import { createContext, useState, ReactNode, useEffect } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: number;
}

interface ChallengeContextData {
  activeChallenge: Challenge;
  challengeCompleted: number;
  currentExperience: number;
  experienceToNextLevel: number;
  level: number;
  percentToNextLevel: number;
  completeChallenge: () => void;
  levelUp: () => void;
  resetChallenge: () => void;
  startNewChallenge: () => void;
}

interface ChallengeProviderProps {
  children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ children } : ChallengeProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(0);

  const [activeChallenge, setActiveChallenge] = useState(null);

  function levelUp(){
    setLevel(level + 1);
  }

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

  const percentToNextLevel = Math.round((currentExperience * 100) / experienceToNextLevel);

  function startNewChallenge(){
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    
    if(Notification.permission === 'granted'){
      new Audio('/notification.mp3').play();
      new Notification('Novo desafio 🎉', {
        body: `Valendo ${challenge.amount}xp!`
      })
    }
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completeChallenge(){
    if(!activeChallenge){
      return;
    }

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if(finalExperience >= experienceToNextLevel){
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengeCompleted(challengeCompleted + 1);

  }

  useEffect(() => {
    Notification.requestPermission();
  }, [])

  return (
    <ChallengesContext.Provider 
    value={
      {
        activeChallenge,
        challengeCompleted,
        currentExperience, 
        experienceToNextLevel,
        level, 
        percentToNextLevel,
        completeChallenge,
        levelUp,
        resetChallenge,
        startNewChallenge
      }
    }
    >
      {children}
    </ChallengesContext.Provider>
  )
}