import { createContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie'
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

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
  closeLevelUpModal: () => void;
}

interface ChallengeProviderProps {
  children: ReactNode;
  level: number; 
  currentExperience: number;
  challengesCompleted: number;
}

export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider({ children, ...rest } : ChallengeProviderProps) {
  const [level, setLevel] = useState(rest.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
  const [challengeCompleted, setChallengeCompleted] = useState(rest.challengesCompleted ?? 0);

  const [activeChallenge, setActiveChallenge] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  function levelUp(){
    setLevel(level + 1);
    setIsLevelUpModalOpen(true);
  }

  function closeLevelUpModal(){
    setIsLevelUpModalOpen(false);
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

  useEffect(() => {
    Cookies.set('level', String(level));
    Cookies.set('currentExperience', String(currentExperience));
    Cookies.set('challengeCompleted', String(challengeCompleted));
  }, [level, currentExperience, challengeCompleted])

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
        closeLevelUpModal,
        completeChallenge,
        levelUp,
        resetChallenge,
        startNewChallenge
      }
    }
    >
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}      
    </ChallengesContext.Provider>
  )
}