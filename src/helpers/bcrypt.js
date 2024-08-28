const bcrypt = require('bcrypt');

/**
 * Hash password
 * 
 * @param password [password]
 * @param saltRounds [salt Rounds, default 10]
 * 
 * @return string
*/
const hash = (password, saltRounds = 10) =>  bcrypt.hash(password, saltRounds);

/**
 * Compare password hash
 * 
 * @param password [password]
 * @param passwordHash [password hash]
 * 
 * @return boolean
*/
const compare = (password, passwordHash) => bcrypt.compare(password, passwordHash);

exports.hash = hash
exports.compare = compare
