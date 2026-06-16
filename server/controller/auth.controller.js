import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import dotenv from 'dotenv'
dotenv.config()

const register = async (req, resp) => {
    try {
        const { name, email, password } = req.body;

        // FIXED: Changed comma to standard logical || operators
        if (!name || !email || !password) {
            return resp.status(400).json({ success: false, message: 'All fields are required...' })
        }

        if (password.length < 8) {
            return resp.status(400).json({ success: false, message: 'Password must be atleast 8 characters...' })
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            // FIXED: Changed 'res' to 'resp' to prevent reference crash
            return resp.status(400).json({ success: false, message: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            name,
            email,
            password: hassedPassword,
        })

        const token = generateToken(user._id);

        return resp.status(201).json({
            success: true, message: 'Register successful', data: {
                token, user: { id: user._id, name: user.name, email: user.email, role: user.role, }
            }
        })

    } catch (error) {
        return resp.status(500).json({ success: false, message: error.message })
    }
}


const login = async (req, resp) => { // FIXED: Changed 'res' to 'resp'
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return resp.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await userModel.findOne({ email }).select('+password');
    if (!user)
      return resp.status(401).json({ success: false, message: 'Invalid email or password.' });

    if (user.isBanned)
      return resp.status(403).json({ success: false, message: 'Your account has been banned.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return resp.status(401).json({ success: false, message: 'Invalid email or password.' });

    const token = generateToken(user._id);

    return resp.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};


const getMe = async (req, resp) => { // FIXED: Changed 'res' to 'resp'
  try {
    const user = await userModel.findById(req.user._id);
    return resp.status(200).json({ success: true, data: { user } });
  } catch (err) {
    return resp.status(500).json({ success: false, message: err.message });
  }
};


const adminLogin = async (req, resp) => {
  try {
    const { email, password } = req.body

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return resp.status(401).json({ success: false, message: 'Invalid admin credentials.' })
    }

    let admin = await userModel.findOne({ email: process.env.ADMIN_EMAIL })

    if (!admin) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      admin = await userModel.create({
        name: 'Super Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      })
    } else {
      if (admin.role !== 'admin') {
        admin.role = 'admin'
        await admin.save()
      }
    }

    const token = generateToken(admin._id)

    return resp.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      },
    })
  } catch (err) {
    console.log('Error:', err.message)
    return resp.status(500).json({ success: false, message: err.message })
  }
}

export { register, login, getMe, adminLogin }