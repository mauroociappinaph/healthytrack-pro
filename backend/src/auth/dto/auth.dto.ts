export class RegisterDto {
  email: string;
  password: string;
  name: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    bio?: string;
    avatar?: string;
  };
}

export class UpdateProfileDto {
  name?: string;
  bio?: string;
  avatar?: string;
  preferences?: string;
}

export class ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
