import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
    if (!password) return null;
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
    if (!password || !hashedPassword) return false;
    return await bcrypt.compare(password, hashedPassword);
};

// Backwards compatibility stubs (should not be used for new code)
export const encrypt = async (text) => hashPassword(text);
export const decrypt = () => null; 
