export interface LoginDto {
  email: string;
  password: string;
}
export interface LoginResponseDto {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}
