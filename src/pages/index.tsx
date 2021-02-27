import { CompleteChallenges } from "../components/CompletedChallenge";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import styles from "../styles/pages/Home.module.css"

import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ChallengeBox } from "../components/ChallengeBox";
import { CountdownProvider } from "../contexts/CountdownContext";
import { ChallengesProvider } from "../contexts/ChallengesContext";

import { useSession } from 'next-auth/client'
import { useEffect, useState } from "react";
interface HomeProps {
  level: number; 
  currentExperience: number;
  challengesCompleted: number;
}
interface ProfileProps {
  name: string;
  image: string;
}

export default function Home(props: HomeProps) {
  const [ session, loading ] = useSession();
  const [profile, setProfile] = useState({} as ProfileProps);
  const router = useRouter();

  useEffect(() => {
    console.log(session);
     if(!loading && !session){
       router.push('/login');
     }else if(session){
      setProfile({
        image: session.user.image,
        name: session.user.name,
      })
     }
  }, [session, loading]);

  return (
    <ChallengesProvider 
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
      <Head>
        <title>Início move.it</title>
      </Head>

      <ExperienceBar />

      <CountdownProvider>
        <section>
          <div>
            <Profile name={profile.name} image={profile.image} />
            <CompleteChallenges />
            <Countdown />
          </div>
          <div>
            <ChallengeBox />

          </div>
        </section>
      </CountdownProvider>
    </div>
  </ChallengesProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {level, currentExperience, challengesCompleted} = ctx.req.cookies;

  return {
    props: {
      level: Number(level), 
      currentExperience: Number(currentExperience), 
      challengesCompleted: Number(challengesCompleted)
    }
  }
}
