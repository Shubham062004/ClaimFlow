import { User } from '../models/user.model.js';
import { LoginDTO, RegisterDTO, AuthResponseDTO, UserRole } from '../types/user.types.js';
import { ApiError } from '../utils/apiError.js';
import { generateToken } from '../utils/jwtUtils.js';

export class AuthService {
  static async login(dto: LoginDTO): Promise<AuthResponseDTO> {
    const { email, password } = dto;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password credentials.');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password credentials.');
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const { name, email, password, role } = dto;

    // Security Rule: Public sign up is strictly restricted to Patients only.
    if (role && role !== UserRole.PATIENT) {
      throw ApiError.forbidden('Public registration is restricted to Patients only. Insurer accounts are administrative.');
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw ApiError.badRequest('A user with this email address already exists.');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: UserRole.PATIENT,
    });

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  static async getUserProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }
    return user;
  }
}
