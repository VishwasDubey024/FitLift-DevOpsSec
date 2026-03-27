export const calculateStats = (user) => {
  if (!user) return null;

  const heightInMeters = user.height / 100;
  const bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
  
  let bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age);
  bmr = user.gender === 'Male' ? bmr + 5 : bmr - 161;

  let targetCalories = bmr;
  if (user.goal === 'gain') targetCalories += 500;
  if (user.goal === 'loss') targetCalories -= 500;

  return { bmi, bmr, targetCalories };
};