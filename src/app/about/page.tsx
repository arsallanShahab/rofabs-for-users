// pages/about.tsx
import type { NextPage } from 'next';
import Image from 'next/image';
import { Person } from '../about/type'; // Adjust the import path based on where you defined your type
import styles from '../about/About.module.css'; // Adjust the import path based on your file structure

const About: NextPage = () => {
  const people: Person[] = [
    {
      id: 1,
      name: 'John Doe',
      role:'hh',
      description: 'John is a dedicated software developer with a passion for creating innovative solutions.',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'John Doe',
      role:'hh',
      description: 'John is a dedicated software developer with a passion for creating innovative solutions.',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      name: 'John Doe',
      role:'ro',
      description: 'John is a dedicated software developer with a passion for creating innovative solutions.',
      imageUrl: 'https://via.placeholder.com/150',
    },
    // Add more people as needed
  ];
  return (
    <div className={styles.container}>
     
      <h1 className={styles.header}>Meet Our Team</h1>
      <div className={styles.grid}>
        {people.map((person) => (
          <div key={person.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image src={person.imageUrl} alt={person.name} layout="fill" objectFit="cover" />
            </div>
            <div className={styles.info}>
              <h2 className={styles.name}>{person.name}</h2>
              <p className={styles.role}>{person.role}</p>
              <p className={styles.description}>{person.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;











