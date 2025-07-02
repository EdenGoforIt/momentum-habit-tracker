export interface UserDto {
  id: string;
  email: string;
  userName?: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string; // ISO 8601 date string
}
