export const tips = [
  'Stay hydrated! Drinking water helps your brain function better.',
  'Take breaks! Resting your mind can boost productivity.',
  'Stay organized! Keep track of your tasks to reduce stress.',
  'Get enough sleep! Your brain needs rest to perform at its best.',
  'Exercise regularly! Physical activity is good for your mental health.',
  'Practice mindfulness! Being present can reduce anxiety and improve focus.',
  'Set realistic goals! Break big tasks into smaller, manageable ones.',
  'Limit distractions! Find a quiet place to work when you need to concentrate.',
  'Learn something new every day! Continuous learning keeps your mind sharp.',
  'Stay positive! A positive mindset can improve problem-solving skills.',
  'Socialize! Spending time with friends and family boosts mood and reduces stress.',
  'Listen to music! Music can enhance creativity and elevate mood.',
  "Prioritize tasks! Focus on what's important and tackle it first.",
  'Use a planner! Writing down tasks helps you stay organized and motivated.',
  'Practice deep breathing! Deep breaths can calm your mind and reduce tension.',
];

export const getRandomTip = (currentIndex?: number) => {
  const randomIndex = Math.floor(Math.random() * tips.length + 1);

  if (currentIndex && randomIndex === currentIndex) {
    return randomIndex === tips.length - 1 ? tips[randomIndex - 1] : tips[randomIndex + 1];
  }

  return tips[randomIndex];
};
