import { generateToken } from '../lib/utils.js';
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

export const singup = async (req, res) => {
    const {fullName, email, password} = req.body

    try{
        if (!fullName || !email || !password) return res.status(400).json({message: "Rellenar todos los campos"});

        if (password.length < 6) return res.status(400).json({message: "La contraseña debe tener al menos 6 caracteres"});

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) return res.status(400).json({message: "Formato de email invalido"});

        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Este correo ya esta en uso"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });

        } else {
            res.status(400).json({message: "Datos de usuario Invalidos"});
        }

    }catch (error) {
        console.log("Error in signup controller: ", error);
        res.status(500).json({message: "Internal server error"});
    }
}