export const createUser = (form) => ({ id: Date.now(), ...form })
export const canManageUsers = (user) => user.rol==="Admin"