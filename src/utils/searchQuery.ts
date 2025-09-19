// 한글/영문/숫자 판별
export const isKoreanStart = (s: string) => !!s && /^[ㄱ-ㅎ가-힣]/.test(s[0]);
export const isEnglishStart = (s: string) => !!s && /^[A-Za-z]/.test(s[0]);
export const isDigitStart = (s: string) => !!s && /^[0-9]/.test(s[0]);
export const onlyDigits = (s: string) => s?.replace(/\D/g, "");
