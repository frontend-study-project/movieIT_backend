export const generateBookingId = () => {
  let pattern = '';

  for (let i = 0; i < 3; i++) {
    pattern += Math.floor(Math.random() * 10); // 랜덤한 0부터 9까지의 숫자를 추가
  }

  pattern += '-';

  for (let j = 0; j < 4; j++) {
    pattern += Math.floor(Math.random() * 10); // 랜덤한 0부터 9까지의 숫자를 추가
  }

  return pattern;
}