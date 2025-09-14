export function createAppId() {
  // in ruby the same method is used:
  /*
      timestamp_part = Time.now.to_i % 100_000 
      random_part = rand(100..999) 

      self.app_id = timestamp_part * 1000 + random_part
 */
  const timestampPart = Math.floor(Date.now() / 1000) % 100000; // last 5 digits
  const randomPart = Math.floor(Math.random() * 900) + 100;     // 3-digit
  return `${timestampPart * 1000 + randomPart}`;
}

