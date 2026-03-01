import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import type { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../types/auth.dto';
import type { IUserDocument } from '../models/User';

export class AuthService {
  async register(dto: RegisterDTO): Promise<{ user: Partial<IUserDocument>; token: string }> {
    const existingUser = await User.findOne({ email: dto.email });
    if (existingUser) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 400 });
    }

    const user = await User.create(dto);

    const token = generateToken({
      userId: (user._id as string).toString(),
      role: user.role,
      email: user.email,
    });

    const userObj = user.toObject() as Record<string, unknown>;
    delete userObj['password'];

    return { user: userObj as Partial<IUserDocument>, token };
  }

  async login(dto: LoginDTO): Promise<{ user: Partial<IUserDocument>; token: string }> {
    const user = await User.findOne({ email: dto.email }).select('+password');
    if (!user) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    const isMatch = await user.comparePassword(dto.password);
    if (!isMatch) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    if (user.role === 'company' && !user.isApproved) {
      throw Object.assign(new Error('Your company account is pending approval'), { statusCode: 403 });
    }

    const token = generateToken({
      userId: (user._id as string).toString(),
      role: user.role,
      email: user.email,
    });

    const userObj = user.toObject() as Record<string, unknown>;
    delete userObj['password'];

    return { user: userObj as Partial<IUserDocument>, token };
  }

  async getProfile(userId: string): Promise<IUserDocument> {
    const user = await User.findById(userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<IUserDocument> {
    const user = await User.findByIdAndUpdate(userId, dto, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return user;
  }

  async uploadResume(userId: string, filename: string): Promise<IUserDocument> {
    const user = await User.findByIdAndUpdate(
      userId,
      { resume: filename },
      { new: true }
    );
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return user;
  }
}

export const authService = new AuthService();