export const getTimeLeft = (targetTime: string) => {
    const targetDate = new Date(targetTime).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;
  
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isFinished: true };
    }
  
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
  
    return { hours, minutes, seconds, isFinished: false };
  };
  
export  const getAgeDetails = (dob: string): string => {
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
  
    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  
    return `${years} years, ${months} months, ${days} days`;
  };

  export  const getAge = (dob: string): string => {
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return `${years} yrs`;
  };